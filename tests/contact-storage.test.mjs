import test from 'node:test';
import assert from 'node:assert/strict';
import { createBlobIntakeStore } from '../lib/contact-storage.ts';
import { handleContact, renderInquiryEmail } from '../lib/contact-server.ts';
import { blobMock, storageEnv, manifest } from './contact-fixtures.mjs';

const env = { ...storageEnv, CONTACT_FORM_ENABLED: 'true', RESEND_API_KEY: 're_mock_only',
  CONTACT_FROM_EMAIL: 'website@example.com', CONTACT_TO_EMAIL: 'intake@example.com',
  UPSTASH_REDIS_REST_URL: 'https://mock.upstash.io', UPSTASH_REDIS_REST_TOKEN: 'mock_only' };
const id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const inquiry = { name: 'Synthetic Test', email: 'synthetic@example.com', phone: '+1 (202) 555-0123',
  practiceArea: 'notarial-services', message: 'SYNTHETIC LOCAL TEST. No real matter or case details.' };
const message = { from: 'Rachal Law Firm APC <website@example.com>', to: ['intake@example.com'],
  reply_to: inquiry.email, ...renderInquiryEmail(inquiry, id) };
const path = `rachal-intake/v1/${id}.json`;
function request(changes = {}) {
  return new Request('https://www.example.com/api/contact', { method: 'POST', headers: {
    origin: env.CONTACT_SITE_ORIGIN, 'content-type': 'application/json',
    'sec-fetch-site': 'same-origin', 'x-vercel-forwarded-for': '192.0.2.1',
  }, body: JSON.stringify({ ...inquiry, website: '', submissionId: id, ...changes }) });
}
function provider() {
  const calls = [];
  const accepted = new Map();
  const settings = { failure: false };
  return { calls, accepted, settings, fetch: async (url, init) => {
    if (url.includes('upstash.io')) return Response.json({ result: 1 });
    assert.equal(url, 'https://api.resend.com/emails');
    calls.push(init);
    if (settings.failure) return Response.json({ error: 'Synthetic provider failure' }, { status: 500 });
    const key = init.headers['Idempotency-Key'];
    if (!accepted.has(key)) accepted.set(key, `mock-id-${accepted.size + 1}`);
    return Response.json({ id: accepted.get(key) });
  } };
}

test('storage configuration rejects missing OIDC, wrong store/project, disabled state and unapproved retention', () => {
  for (const patch of [{ CONTACT_STORAGE_ENABLED: '' }, { VERCEL_OIDC_TOKEN: '' },
    { CONTACT_BLOB_STORE_ID: 'store_anotherclient' }, { BLOB_STORE_ID: 'store_anotherclient' },
    { CONTACT_BLOB_PROJECT_ID: 'prj_wrong' }, { VERCEL_ENV: 'development' },
    { CONTACT_RETENTION_DAYS: '' }, { CONTACT_RETENTION_DAYS: '0' }, { CONTACT_RETENTION_DAYS: 'NaN' },
    { CONTACT_RETENTION_POLICY_ID: '' }, { CONTACT_RETENTION_WORKFLOW_CONFIRMED: '' }]) {
    const mock = blobMock();
    assert.throws(() => createBlobIntakeStore({ ...env, ...patch }, mock.sdk));
    assert.equal(mock.calls.length, 0);
  }
});

test('ownership manifest rejects wrong client/environment/public/shared store before any sensitive write', async () => {
  for (const patch of [{ siteId: 'another-client' }, { storeId: 'store_anotherclient' }, { projectId: 'prj_wrong' },
    { environment: 'production' }, { origin: 'https://other.example.com' }, { access: 'public' },
    { dedicated: false }, { retentionPolicyId: 'unapproved' }, { retentionDays: 365 }]) {
    const mock = blobMock({ manifest: { ...manifest, ...patch } });
    const store = createBlobIntakeStore(env, mock.sdk);
    await assert.rejects(store.save(inquiry, id, message, 'mock-key'));
    assert.equal(mock.calls.length, 1); assert.equal(mock.calls[0].method, 'get');
    assert.equal(mock.calls[0].path, 'rachal-intake/ownership.json');
    assert.ok(!JSON.stringify(mock.calls).includes(inquiry.message));
  }
});

test('private save precedes mail; exact site scope, pending state and approved retention metadata are stored', async () => {
  const mock = blobMock(); const mail = provider();
  const store = createBlobIntakeStore(env, mock.sdk);
  const response = await handleContact(request(), { env, store, fetch: async (url, init) => {
    if (url.includes('resend.com')) {
      assert.equal(mock.records.get(path).data.notification.state, 'pending');
      assert.deepEqual(mock.records.get(path).data.inquiry, inquiry);
    }
    return mail.fetch(url, init);
  } });
  assert.equal(response.status, 200);
  const record = mock.records.get(path).data;
  assert.equal(record.notification.state, 'sent'); assert.equal(record.notification.providerId, 'mock-id-1');
  assert.equal(Date.parse(record.retentionDueAt) - Date.parse(record.createdAt), 30 * 86400_000);
  assert.equal(record.retentionPolicyId, 'synthetic-test-policy');
  assert.ok(!JSON.stringify(record.notification.payload).includes(inquiry.message));
  assert.ok(!JSON.stringify(record.notification.payload).includes('Notarial Services'));
  assert.ok(!JSON.stringify(record).includes('192.0.2.1'));
  for (const call of mock.calls) {
    assert.equal(call.config.access, 'private'); assert.equal(call.config.storeId, env.CONTACT_BLOB_STORE_ID);
    assert.equal(call.config.oidcToken, env.VERCEL_OIDC_TOKEN); assert.equal(call.config.token, undefined);
    if (call.method === 'get') assert.equal(call.config.useCache, false);
  }
  const puts = mock.calls.filter(call => call.method === 'put');
  assert.equal(puts[0].config.allowOverwrite, false); assert.equal(puts[0].config.addRandomSuffix, false);
  assert.equal(puts[1].config.allowOverwrite, true); assert.equal(puts[1].config.ifMatch, 'etag-1');
});

test('storage failure prevents email and never reports a saved inquiry', async () => {
  for (const options of [{ readFailure: true }, { writeFailure: true }]) {
    const mock = blobMock(options); const mail = provider();
    const response = await handleContact(request(), { env, store: createBlobIntakeStore(env, mock.sdk), fetch: mail.fetch });
    assert.equal(response.status, 503); assert.equal(mail.calls.length, 0);
    assert.equal((await response.json()).saved, undefined);
  }
});

test('unconfigured production storage is fail closed even when email configuration is complete', async () => {
  const mail = provider();
  const response = await handleContact(request(), { env: { ...env, CONTACT_STORAGE_ENABLED: '' }, fetch: mail.fetch });
  assert.equal(response.status, 503); assert.equal(mail.calls.length, 0);
});

test('failed notification stays pending; same submission safely retries and subsequent duplicate does not mail', async () => {
  const mock = blobMock(); const mail = provider(); const store = createBlobIntakeStore(env, mock.sdk);
  mail.settings.failure = true;
  const failed = await handleContact(request(), { env, store, fetch: mail.fetch });
  assert.equal(failed.status, 503); assert.equal((await failed.json()).saved, true);
  const first = structuredClone(mock.records.get(path).data);
  assert.equal(first.notification.state, 'pending'); assert.deepEqual(first.inquiry, inquiry);
  mail.settings.failure = false;
  assert.equal((await handleContact(request(), { env, store, fetch: mail.fetch })).status, 200);
  assert.equal(mock.records.get(path).data.notification.state, 'sent');
  assert.equal(mail.calls[0].headers['Idempotency-Key'], mail.calls[1].headers['Idempotency-Key']);
  assert.equal(mail.calls[0].body, mail.calls[1].body);
  assert.equal((await handleContact(request(), { env, store, fetch: mail.fetch })).status, 200);
  assert.equal(mail.calls.length, 2); assert.equal(mock.records.size, 1);
});

test('ambiguous sent-state write leaves pending and safely reconciles provider acceptance on retry', async () => {
  const mock = blobMock({ markFailure: true }); const mail = provider(); const store = createBlobIntakeStore(env, mock.sdk);
  const first = await handleContact(request(), { env, store, fetch: mail.fetch });
  assert.equal(first.status, 503); assert.equal((await first.json()).saved, true);
  assert.equal(mock.records.get(path).data.notification.state, 'pending'); assert.equal(mail.accepted.size, 1);
  mock.options.markFailure = false;
  assert.equal((await handleContact(request(), { env, store, fetch: mail.fetch })).status, 200);
  assert.equal(mail.accepted.size, 1); assert.equal(mail.calls.length, 2);
  assert.equal(mock.records.get(path).data.notification.state, 'sent');
});

test('concurrent identical requests share one durable record and one provider idempotency key', async () => {
  const mock = blobMock(); const mail = provider(); const store = createBlobIntakeStore(env, mock.sdk);
  const results = await Promise.all([handleContact(request(), { env, store, fetch: mail.fetch }), handleContact(request(), { env, store, fetch: mail.fetch })]);
  assert.ok(results.every(result => result.status === 200));
  assert.equal(mock.records.size, 1); assert.equal(mail.accepted.size, 1);
  assert.equal(mock.records.get(path).data.notification.state, 'sent');
});

test('reused ID with changed inquiry conflicts without another email or overwrite', async () => {
  const mock = blobMock(); const mail = provider(); const store = createBlobIntakeStore(env, mock.sdk);
  await handleContact(request(), { env, store, fetch: mail.fetch });
  const response = await handleContact(request({ message: 'Another synthetic test.' }), { env, store, fetch: mail.fetch });
  assert.equal(response.status, 409); assert.equal(mail.calls.length, 1);
  assert.deepEqual(mock.records.get(path).data.inquiry, inquiry);
});

test('stale ambiguous pending notification stops before idempotency expiry and stays available for operator recovery', async () => {
  const mock = blobMock(); const mail = provider(); const store = createBlobIntakeStore(env, mock.sdk);
  mail.settings.failure = true;
  await handleContact(request(), { env, store, fetch: mail.fetch });
  const timestamp = Date.parse(mock.records.get(path).data.notification.firstAttemptAt);
  mail.settings.failure = false;
  const response = await handleContact(request(), { env, store, fetch: mail.fetch, now: () => new Date(timestamp + 23 * 3600_000) });
  assert.equal(response.status, 503); assert.equal((await response.json()).saved, true);
  assert.equal(mail.calls.length, 1); assert.equal(mock.records.get(path).data.notification.state, 'pending');
});

test('queued email cannot silently move to a newly configured recipient', async () => {
  const mock = blobMock(); const mail = provider(); const store = createBlobIntakeStore(env, mock.sdk);
  mail.settings.failure = true;
  await handleContact(request(), { env, store, fetch: mail.fetch });
  mail.settings.failure = false;
  const response = await handleContact(request(), { env: { ...env, CONTACT_TO_EMAIL: 'different@example.com' }, store, fetch: mail.fetch });
  assert.equal(response.status, 503); assert.equal(mail.calls.length, 1);
  assert.equal(mock.records.get(path).data.notification.state, 'pending');
});

test('notification snapshot is stable across a later template edit', async () => {
  const mock = blobMock(); const store = createBlobIntakeStore(env, mock.sdk);
  const first = await store.save(inquiry, id, message, 'original-key');
  const next = await store.save(inquiry, id, { ...message, html: '<p>New template</p>' }, 'new-key');
  assert.deepEqual(next.record.notification, first.record.notification);
});


test('expired or invalid retention cutoff keeps pending record and never retries email', async () => {
  for (const retentionDueAt of [new Date(Date.now() - 1000).toISOString(), 'invalid-date']) {
    const mock = blobMock(); const mail = provider(); const store = createBlobIntakeStore(env, mock.sdk);
    mail.settings.failure = true;
    await handleContact(request(), { env, store, fetch: mail.fetch });
    mock.records.get(path).data.retentionDueAt = retentionDueAt;
    mail.settings.failure = false;
    const response = await handleContact(request(), { env, store, fetch: mail.fetch });
    assert.equal(response.status, 503); assert.equal((await response.json()).saved, true);
    assert.equal(mail.calls.length, 1); assert.equal(mock.records.get(path).data.notification.state, 'pending');
  }
});
