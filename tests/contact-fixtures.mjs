import { BlobPreconditionFailedError } from '@vercel/blob';

export function memoryStore() {
  const records = new Map();
  return {
    records,
    async save(inquiry, submissionId, payload, idempotencyKey) {
      const previous = records.get(submissionId);
      if (previous) return previous;
      const saved = { etag: '1', record: {
        schema: 1, siteId: 'rachal-law-firm-apc', submissionId, fingerprint: 'mock-fingerprint',
        createdAt: new Date().toISOString(), retentionDueAt: new Date(Date.now() + 86400_000).toISOString(),
        retentionPolicyId: 'synthetic-test-policy', inquiry, notification: { state: 'pending', payload, idempotencyKey, firstAttemptAt: new Date().toISOString() },
      } };
      records.set(submissionId, saved); return saved;
    },
    async markSent(saved, providerId) {
      records.set(saved.record.submissionId, { ...saved, record: { ...saved.record,
        notification: { ...saved.record.notification, state: 'sent', providerId } } });
    },
  };
}

export const storageEnv = {
  VERCEL: '1', VERCEL_ENV: 'preview', VERCEL_PROJECT_ID: 'prj_synthetic_rachal',
  VERCEL_OIDC_TOKEN: 'synthetic-oidc-test-only', BLOB_STORE_ID: 'store_syntheticrachal',
  CONTACT_BLOB_STORE_ID: 'store_syntheticrachal', CONTACT_BLOB_PROJECT_ID: 'prj_synthetic_rachal',
  CONTACT_STORAGE_ENABLED: 'true', CONTACT_SITE_ORIGIN: 'https://www.example.com',
  CONTACT_RATE_LIMIT_SECRET: 'synthetic-test-only-secret-at-least-32-chars',
  // Synthetic test fixture, not an adopted retention period for this client.
  CONTACT_RETENTION_DAYS: '30', CONTACT_RETENTION_POLICY_ID: 'synthetic-test-policy',
  CONTACT_RETENTION_WORKFLOW_CONFIRMED: 'true',
};
export const manifest = {
  schema: 1, siteId: 'rachal-law-firm-apc', storeId: storageEnv.CONTACT_BLOB_STORE_ID,
  projectId: storageEnv.VERCEL_PROJECT_ID, environment: 'preview', origin: storageEnv.CONTACT_SITE_ORIGIN,
  access: 'private', dedicated: true, retentionPolicyId: 'synthetic-test-policy', retentionDays: 30,
};
export function blobMock(options = {}) {
  const records = new Map();
  const calls = [];
  let revision = 0;
  const sdk = {
    async get(path, config) {
      calls.push({ method: 'get', path, config });
      if (options.readFailure) throw new Error('Synthetic read failure');
      const object = path === 'rachal-intake/ownership.json'
        ? { data: options.manifest ?? manifest, etag: 'manifest-etag' }
        : records.get(path);
      if (!object) return null;
      const json = JSON.stringify(object.data);
      return { statusCode: 200, stream: new Response(json).body, headers: new Headers(),
        blob: { etag: object.etag, size: Buffer.byteLength(json), pathname: path } };
    },
    async put(path, body, config) {
      calls.push({ method: 'put', path, config, body });
      if (options.writeFailure || (options.markFailure && config.allowOverwrite)) throw new Error('Synthetic write failure');
      const prior = records.get(path);
      if (prior && !config.allowOverwrite) throw new Error('Blob already exists');
      if (config.ifMatch && prior?.etag !== config.ifMatch) throw new BlobPreconditionFailedError();
      const etag = `etag-${++revision}`;
      records.set(path, { data: JSON.parse(body), etag });
      return { etag, pathname: path };
    },
  };
  return { records, calls, sdk, options };
}
