// Server module: node imports prohibit use in a browser bundle. The route also
// uses Next's server-only guard. Do not log requests, provider bodies or intake.
import { createHmac } from 'node:crypto';
import { isIP } from 'node:net';
import { CONTACT_LIMITS, PRACTICE_AREAS, type Inquiry } from './contact-fields.ts';
import { createBlobIntakeStore, IntakeConflictError, type IntakeStore } from './contact-storage.ts';

export const MAX_BODY_BYTES = 24_576;
const GENERIC_ERROR = 'We could not confirm your inquiry was submitted. Please retry or call our office.';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SINGLE_LINE_CONTROLS = /[\p{Cc}\p{Cf}]/u;
const MESSAGE_CONTROLS = /[\p{Cc}\p{Cf}]/u;
const KEYS = ['name', 'email', 'phone', 'practiceArea', 'message', 'website', 'submissionId'];

type Env = Record<string, string | undefined>;
type Config = {
  apiKey: string; from: string; to: string; origin: string;
  redisUrl: string; redisToken: string; secret: string;
};
type Dependencies = {
  env?: Env;
  fetch?: typeof fetch;
  timeoutMs?: number;
  store?: IntakeStore;
  now?: () => Date;
};

class IntakeError extends Error {
  status: number;
  constructor(status: number) { super('Contact request rejected'); this.status = status; }
}

export function validEmail(value: string): boolean {
  if (value.length > 254 || SINGLE_LINE_CONTROLS.test(value)) return false;
  const parts = value.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  return local.length > 0 && local.length <= 64 &&
    /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/.test(local) &&
    domain.includes('.') && domain.split('.').every((label) =>
      label.length > 0 && label.length <= 63 && /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(label));
}

export function validateInquiry(input: unknown): { inquiry: Inquiry; website: string; submissionId: string } {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new IntakeError(400);
  const value = input as Record<string, unknown>;
  if (Object.keys(value).some((key) => !KEYS.includes(key)) ||
      KEYS.some((key) => typeof value[key] !== 'string')) throw new IntakeError(400);
  const strings = value as Record<string, string>;
  const normalized: Record<string, string> = {};
  for (const key of KEYS) {
    const field = strings[key];
    const limit = CONTACT_LIMITS[key as keyof typeof CONTACT_LIMITS] ?? (key === 'website' ? 200 : 64);
    if (field.length > limit) throw new IntakeError(400);
    const controls = key === 'message' ? MESSAGE_CONTROLS.test(field.replace(/[\t\r\n]/g, '')) : SINGLE_LINE_CONTROLS.test(field);
    if (controls) throw new IntakeError(400);
    normalized[key] = field.replace(/\r\n?/g, '\n').trim();
  }
  if (!normalized.name || !normalized.message || !validEmail(normalized.email) ||
      !Object.hasOwn(PRACTICE_AREAS, normalized.practiceArea) || !UUID.test(normalized.submissionId)) throw new IntakeError(400);
  return {
    inquiry: {
      name: normalized.name, email: normalized.email, phone: normalized.phone,
      practiceArea: normalized.practiceArea as Inquiry['practiceArea'], message: normalized.message,
    },
    website: normalized.website,
    submissionId: normalized.submissionId.toLowerCase(),
  };
}

function getConfig(env: Env): Config {
  const read = (name: string) => (env[name] ?? '').trim();
  const config = {
    apiKey: read('RESEND_API_KEY'), from: read('CONTACT_FROM_EMAIL'), to: read('CONTACT_TO_EMAIL'),
    origin: read('CONTACT_SITE_ORIGIN'), redisUrl: read('UPSTASH_REDIS_REST_URL'),
    redisToken: read('UPSTASH_REDIS_REST_TOKEN'), secret: read('CONTACT_RATE_LIMIT_SECRET'),
  };
  // No fallback inbox, sender, origin, or in-memory limiter in production.
  if (env.CONTACT_FORM_ENABLED !== 'true' || env.VERCEL !== '1' ||
      !config.apiKey || !config.redisToken || config.secret.length < 32 ||
      !validEmail(config.from) || !validEmail(config.to) ||
      SINGLE_LINE_CONTROLS.test(config.apiKey + config.redisToken + config.secret)) throw new IntakeError(503);
  try {
    const origin = new URL(config.origin);
    const redis = new URL(config.redisUrl);
    if (origin.protocol !== 'https:' || origin.origin !== config.origin ||
        redis.protocol !== 'https:' || !redis.hostname.endsWith('.upstash.io') ||
        redis.username || redis.password || redis.port || redis.pathname !== '/' || redis.search || redis.hash) throw new Error();
    config.redisUrl = redis.origin;
  } catch { throw new IntakeError(503); }
  return config;
}

async function boundedJson(body: Request | Response, limit: number, timeoutMs: number): Promise<unknown> {
  const reader = body.body?.getReader();
  if (!reader) throw new IntakeError(400);
  let expired = false;
  const timer = setTimeout(() => { expired = true; void reader.cancel().catch(() => {}); }, timeoutMs);
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (expired) throw new IntakeError(408);
      if (done) break;
      bytes += value.byteLength;
      if (bytes > limit) { void reader.cancel().catch(() => {}); throw new IntakeError(413); }
      chunks.push(value);
    }
    const joined = Buffer.concat(chunks);
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(joined));
  } catch (error) {
    if (error instanceof IntakeError) throw error;
    throw new IntakeError(400);
  } finally { clearTimeout(timer); reader.releaseLock(); }
}

function digest(secret: string, input: string): string {
  return createHmac('sha256', secret).update(input).digest('hex');
}

// Atomic fixed windows anchored to the first attempt, shared across instances.
// Only HMAC(IP) counters and TTLs go to Redis; no raw IP or inquiry content.
export const RATE_LIMIT_SCRIPT = `
local function take(key, maximum)
  local current = redis.call('INCR', key)
  if current == 1 then redis.call('EXPIRE', key, 600) end
  return current <= maximum
end
local site = take(KEYS[1], 100)
local visitor = take(KEYS[2], 5)
if site and visitor then return 1 end
return 0`;

async function upstream(url: string, init: RequestInit, fetcher: typeof fetch, timeoutMs: number): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetcher(url, { ...init, signal: controller.signal, redirect: 'error', cache: 'no-store' });
    if (!response.ok) { void response.body?.cancel().catch(() => {}); throw new Error('Upstream rejected request'); }
    return await boundedJson(response, 8192, timeoutMs);
  } catch {
    // A provider parse/size/timeout failure is never a visitor validation error.
    throw new Error('Upstream unavailable');
  } finally { clearTimeout(timer); }
}

async function enforceRateLimit(request: Request, config: Config, fetcher: typeof fetch, timeoutMs: number) {
  // This implementation supports only Vercel's trusted ingress header.
  // Do not trust arbitrary X-Forwarded-For or run behind an unreviewed proxy.
  const ip = request.headers.get('x-vercel-forwarded-for')?.trim() ?? '';
  if (!isIP(ip)) throw new IntakeError(503);
  const namespace = digest(config.secret, config.origin).slice(0, 16);
  const prefix = `rachal-contact:{${namespace}}:`;
  const result = await upstream(config.redisUrl, {
    method: 'POST', headers: { Authorization: `Bearer ${config.redisToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(['EVAL', RATE_LIMIT_SCRIPT, '2', `${prefix}global`, `${prefix}${digest(config.secret, ip)}`]),
  }, fetcher, timeoutMs) as { result?: unknown; error?: unknown } | null;
  if (!result || result.error || (result.result !== 0 && result.result !== 1)) throw new Error('Rate limit unavailable');
  if (result.result === 0) throw new IntakeError(429);
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
}

export function renderInquiryEmail(inquiry: Pick<Inquiry, 'name' | 'email' | 'phone'>, reference: string) {
  const rows: [string, string][] = [
    ['Submission reference', reference], ['Full name', inquiry.name], ['Email address', inquiry.email],
    ['Phone number', inquiry.phone || 'Not provided'],
  ];
  const htmlRows = rows.map(([label, value]) => `<tr><td style="padding:0 0 24px"><div style="font:700 11px/1.5 Arial,sans-serif;letter-spacing:1.4px;text-transform:uppercase;color:#66717b;margin-bottom:7px">${label}</div><div style="font:16px/1.65 Arial,sans-serif;color:#172434;overflow-wrap:anywhere;word-break:break-word">${escapeHtml(value)}</div></td></tr>`).join('');
  return {
    subject: 'New Rachal Law Firm APC Website Inquiry',
    text: `RACHAL LAW FIRM APC\nNew website inquiry\n\n${rows.map(([label, value]) => `${label}: ${value}`).join('\n\n')}\n\nINQUIRY DETAILS\nSaved in private intake storage. Review the details through the approved intake workflow.\n\nReply to this email to contact the sender.\n\nWebsite intake notification. Treat the information with care. An inquiry does not establish an attorney-client relationship.`,
    html: `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>New website inquiry</title></head><body style="margin:0;padding:0;background:#f1efeb"><div style="display:none;max-height:0;overflow:hidden;opacity:0">A new inquiry is ready for your review.</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1efeb"><tr><td align="center" style="padding:40px 16px"><table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid #e5dfd5;border-radius:12px;overflow:hidden"><tr><td style="background:#132238;padding:36px 32px;border-bottom:4px solid #c8a96b"><div style="font:700 11px/1.5 Arial,sans-serif;letter-spacing:2.2px;color:#e1c795;margin-bottom:14px">RACHAL LAW FIRM APC</div><h1 style="font:normal 32px/1.2 Georgia,serif;color:#fafaf8;margin:0 0 12px">New website inquiry</h1><p style="font:15px/1.7 Arial,sans-serif;color:#d2d9e0;margin:0">Contact details and message, ready for review.</p></td></tr><tr><td style="padding:32px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0">${htmlRows}</table><div style="border-top:1px solid #e5dfd5;padding-top:28px"><h2 style="font:700 11px/1.5 Arial,sans-serif;letter-spacing:1.4px;text-transform:uppercase;color:#66717b;margin:0 0 12px">Inquiry details</h2><div style="font:16px/1.85 Arial,sans-serif;color:#172434;overflow-wrap:anywhere;word-break:break-word">Saved in private intake storage. Review the details through the approved intake workflow.</div></div><p style="font:14px/1.7 Arial,sans-serif;color:#435466;margin:28px 0 0;padding-top:24px;border-top:1px solid #e5dfd5">Reply to this email to contact the sender.</p></td></tr><tr><td style="background:#f7f5f2;padding:24px 32px;font:12px/1.8 Arial,sans-serif;color:#66717b">Website intake notification. Treat the information with care. An inquiry does not establish an attorney-client relationship.</td></tr></table></td></tr></table></body></html>`,
  };
}

function reply(status: number, message: string, saved = false) {
  return Response.json({ ok: status === 200, message, ...(saved ? { saved: true } : {}) }, {
    status,
    headers: { 'Cache-Control': 'no-store', ...(status === 429 ? { 'Retry-After': '600' } : {}) },
  });
}

export async function handleContact(request: Request, dependencies: Dependencies = {}): Promise<Response> {
  if (request.method !== 'POST') return reply(405, 'Method not allowed.');
  const fetcher = dependencies.fetch ?? fetch;
  const timeoutMs = dependencies.timeoutMs ?? 5000;
  let durablySaved = false;
  try {
    const env = dependencies.env ?? process.env;
    const config = getConfig(env);
    const store = dependencies.store ?? createBlobIntakeStore(env);
    if (request.headers.get('origin') !== config.origin ||
        (request.headers.has('sec-fetch-site') && request.headers.get('sec-fetch-site') !== 'same-origin')) throw new IntakeError(403);
    if (!/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(request.headers.get('content-type') ?? '')) throw new IntakeError(415);
    const length = request.headers.get('content-length');
    if (length && (!/^\d+$/.test(length) || Number(length) > MAX_BODY_BYTES)) throw new IntakeError(413);
    await enforceRateLimit(request, config, fetcher, timeoutMs);
    const { inquiry, website, submissionId } = validateInquiry(await boundedJson(request, MAX_BODY_BYTES, timeoutMs));
    // Reject rather than falsely claiming delivery for an autofilled honeypot.
    if (website) throw new IntakeError(400);
    const message = renderInquiryEmail(inquiry, submissionId);
    const payload = { from: `Rachal Law Firm APC <${config.from}>`, to: [config.to], reply_to: inquiry.email, ...message };
    // Same ID + unchanged payload produces identical retries within Resend's 24h window.
    const key = `rachal-contact/${submissionId}/${digest(config.secret, JSON.stringify({ inquiry, payload }))}`;
    const saved = await store.save(inquiry, submissionId, payload, key);
    durablySaved = true;
    if (saved.record.notification.state === 'sent') return reply(200, 'Your inquiry has been submitted for delivery.');
    const notification = saved.record.notification;
    const currentTime = (dependencies.now?.() ?? new Date()).getTime();
    const age = currentTime - Date.parse(notification.firstAttemptAt);
    const retentionDueAt = Date.parse(saved.record.retentionDueAt);
    // Never blindly re-send an ambiguous attempt after provider dedupe can expire.
    // Stale records remain pending for the authorized operator to reconcile.
    if (!Number.isFinite(retentionDueAt) || retentionDueAt <= currentTime ||
        !Number.isFinite(age) || age < -60_000 || age >= 23 * 60 * 60 * 1000 ||
        notification.payload.from !== payload.from ||
        JSON.stringify(notification.payload.to) !== JSON.stringify(payload.to) ||
        notification.payload.reply_to !== inquiry.email) throw new Error('Outbox reconciliation required');
    const result = await upstream('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': notification.idempotencyKey },
      body: JSON.stringify(notification.payload),
    }, fetcher, timeoutMs) as { id?: unknown } | null;
    if (!result || typeof result.id !== 'string' || !result.id.trim()) throw new Error('Unconfirmed provider acceptance');
    await store.markSent(saved, result.id);
    return reply(200, 'Your inquiry has been submitted for delivery.');
  } catch (error) {
    // Never expose or log the error: providers may echo confidential intake data.
    const status = error instanceof IntakeError ? error.status : error instanceof IntakeConflictError ? 409 : 503;
    const message = durablySaved ? 'Your inquiry was saved, but we could not confirm that our office was notified. Please call our office.' :
      status === 429 ? 'Too many attempts. Please wait ten minutes or call our office.' :
      status === 400 ? 'Please check your entries and try again.' : GENERIC_ERROR;
    return reply(status, message, durablySaved);
  }
}
