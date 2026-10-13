// Server-only durable outbox. No public read route, signed URLs, logs, or demo-admin access.
import { createHmac } from 'node:crypto';
import { get, put, BlobPreconditionFailedError } from '@vercel/blob';
import type { Inquiry } from './contact-fields.ts';

export type NotificationPayload = {
  from: string; to: string[]; reply_to: string; subject: string; html: string; text: string;
};
export type IntakeRecord = {
  schema: 1; siteId: 'rachal-law-firm-apc'; submissionId: string; fingerprint: string;
  createdAt: string; retentionDueAt: string; retentionPolicyId: string;
  inquiry: Inquiry;
  notification: {
    state: 'pending' | 'sent'; idempotencyKey: string; payload: NotificationPayload;
    firstAttemptAt: string; providerId?: string; acceptedAt?: string;
  };
};
export type SavedIntake = { record: IntakeRecord; etag: string };
export interface IntakeStore {
  save(inquiry: Inquiry, submissionId: string, payload: NotificationPayload, idempotencyKey: string): Promise<SavedIntake>;
  markSent(saved: SavedIntake, providerId: string): Promise<void>;
}
export class IntakeConflictError extends Error {}
export class IntakeStorageError extends Error {}

type Env = Record<string, string | undefined>;
type BlobSdk = { get: typeof get; put: typeof put };
const SITE = 'rachal-law-firm-apc';
const PREFIX = 'rachal-intake/v1/';
const MANIFEST = 'rachal-intake/ownership.json';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const unavailable = () => new IntakeStorageError('Private intake storage unavailable');

async function readJson(result: Awaited<ReturnType<typeof get>>) {
  if (!result) return null;
  if (result.statusCode !== 200 || !result.stream || !result.blob.etag ||
      result.blob.size === null || result.blob.size > 65_536) throw unavailable();
  const reader = result.stream.getReader();
  let expired = false;
  const timer = setTimeout(() => { expired = true; void reader.cancel().catch(() => {}); }, 4000);
  let bytes = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (expired) throw unavailable();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 65_536) { void reader.cancel().catch(() => {}); throw unavailable(); }
      chunks.push(value);
    }
    return { value: JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks))), etag: result.blob.etag };
  } catch { throw unavailable(); }
  finally { clearTimeout(timer); reader.releaseLock(); }
}

export function createBlobIntakeStore(env: Env, sdk: BlobSdk = { get, put }, now = () => new Date()): IntakeStore {
  const read = (key: string) => (env[key] ?? '').trim();
  const storeId = read('CONTACT_BLOB_STORE_ID');
  const projectId = read('VERCEL_PROJECT_ID');
  const environment = read('VERCEL_ENV');
  const origin = read('CONTACT_SITE_ORIGIN');
  const policy = read('CONTACT_RETENTION_POLICY_ID');
  const daysValue = read('CONTACT_RETENTION_DAYS');
  const retentionDays = Number(daysValue);
  const secret = read('CONTACT_RATE_LIMIT_SECRET');
  // No global token fallback and no implicit store discovery. Setup must approve
  // a dedicated private store for this one site AND this deployment environment.
  if (env.CONTACT_STORAGE_ENABLED !== 'true' || env.VERCEL !== '1' ||
      !/^store_[a-zA-Z0-9]+$/.test(storeId) || storeId !== read('BLOB_STORE_ID') ||
      !projectId || projectId !== read('CONTACT_BLOB_PROJECT_ID') ||
      !['preview', 'production'].includes(environment) || !read('VERCEL_OIDC_TOKEN') ||
      !/^[a-zA-Z0-9_-]{1,80}$/.test(policy) || !/^\d+$/.test(daysValue) ||
      !Number.isSafeInteger(retentionDays) || retentionDays < 1 || retentionDays > 36_500 ||
      env.CONTACT_RETENTION_WORKFLOW_CONFIRMED !== 'true' || secret.length < 32) throw unavailable();

  // Explicit short-lived token prevents a static BLOB_READ_WRITE_TOKEN fallback.
  // Called afresh per request; no token is cached or included in any record.
  const auth = () => ({ storeId, oidcToken: read('VERCEL_OIDC_TOKEN') });
  const options = () => ({ ...auth(), access: 'private' as const, abortSignal: AbortSignal.timeout(4000) });
  const path = (id: string) => {
    if (!UUID.test(id)) throw unavailable();
    return `${PREFIX}${id}.json`;
  };
  const fingerprint = (inquiry: Inquiry) => createHmac('sha256', secret).update(JSON.stringify(inquiry)).digest('hex');

  async function assertOwnership() {
    // This small non-PII manifest must be placed by an authorized operator, not
    // created by this endpoint. A wrong/uninitialized/shared site store fails BEFORE upload.
    const manifest = await readJson(await sdk.get(MANIFEST, { ...options(), useCache: false }));
    const value = manifest?.value;
    if (!value || value.schema !== 1 || value.siteId !== SITE || value.storeId !== storeId ||
        value.projectId !== projectId || value.environment !== environment || value.origin !== origin ||
        value.access !== 'private' || value.dedicated !== true ||
        value.retentionPolicyId !== policy || value.retentionDays !== retentionDays) throw unavailable();
  }

  async function load(id: string): Promise<SavedIntake | null> {
    const saved = await readJson(await sdk.get(path(id), { ...options(), useCache: false }));
    if (!saved) return null;
    const record = saved.value as IntakeRecord;
    if (record.schema !== 1 || record.siteId !== SITE || record.submissionId !== id ||
        typeof record.fingerprint !== 'string' || !record.inquiry || record.fingerprint !== fingerprint(record.inquiry) ||
        !record.notification || !['pending', 'sent'].includes(record.notification.state) ||
        typeof record.notification.idempotencyKey !== 'string' || !record.notification.payload ||
        !Number.isFinite(Date.parse(record.notification.firstAttemptAt))) throw unavailable();
    return { record, etag: saved.etag };
  }

  return {
    async save(inquiry, submissionId, payload, idempotencyKey) {
      await assertOwnership();
      const hash = fingerprint(inquiry);
      const previous = await load(submissionId);
      if (previous) {
        if (previous.record.fingerprint !== hash) throw new IntakeConflictError('Submission identifier already used');
        return previous;
      }
      const created = now();
      const record: IntakeRecord = {
        schema: 1, siteId: SITE, submissionId, fingerprint: hash, createdAt: created.toISOString(),
        retentionDueAt: new Date(created.getTime() + retentionDays * 86400_000).toISOString(),
        retentionPolicyId: policy, inquiry,
        // Exact notification snapshot is retained to keep provider retries byte-stable
        // across template changes. It deliberately excludes the legal narrative.
        notification: { state: 'pending', idempotencyKey, payload, firstAttemptAt: created.toISOString() },
      };
      try {
        const stored = await sdk.put(path(submissionId), JSON.stringify(record), {
          ...options(), contentType: 'application/json', addRandomSuffix: false,
          allowOverwrite: false, cacheControlMaxAge: 60,
        });
        if (!stored.etag) throw unavailable();
        return { record, etag: stored.etag };
      } catch {
        // Covers concurrent create and ambiguous network completion. Never email
        // unless a durable matching record can be confirmed with a fresh read.
        const winner = await load(submissionId);
        if (!winner) throw unavailable();
        if (winner.record.fingerprint !== hash) throw new IntakeConflictError('Submission identifier already used');
        return winner;
      }
    },
    async markSent(saved, providerId) {
      if (!providerId) throw unavailable();
      const record: IntakeRecord = { ...saved.record, notification: {
        ...saved.record.notification, state: 'sent', providerId, acceptedAt: now().toISOString(),
      } };
      try {
        await sdk.put(path(record.submissionId), JSON.stringify(record), {
          ...options(), contentType: 'application/json', addRandomSuffix: false,
          allowOverwrite: true, ifMatch: saved.etag, cacheControlMaxAge: 60,
        });
      } catch (error) {
        // A competing completion or ambiguous write may already have marked sent.
        // Never overwrite a newer state; re-read even after a non-CAS network failure.
        const current = await load(record.submissionId);
        if (current?.record.fingerprint === record.fingerprint &&
            current.record.notification.state === 'sent' && current.record.notification.providerId === providerId) return;
        if (error instanceof BlobPreconditionFailedError) throw unavailable();
        throw unavailable();
      }
    },
  };
}
