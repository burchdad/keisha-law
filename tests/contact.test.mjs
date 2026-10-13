import test from 'node:test';
import assert from 'node:assert/strict';
import { memoryStore } from './contact-fixtures.mjs';
import { createContactRequest, contactWasAccepted } from '../lib/contact-client.ts';
import { handleContact, validateInquiry, renderInquiryEmail, validEmail, MAX_BODY_BYTES, RATE_LIMIT_SCRIPT } from '../lib/contact-server.ts';

// Reserved example domains and documentation IPs only. No real inquiry or provider calls.
const env = {
  CONTACT_FORM_ENABLED: 'true', VERCEL: '1', RESEND_API_KEY: 're_mock_only',
  CONTACT_FROM_EMAIL: 'website@example.com', CONTACT_TO_EMAIL: 'intake@example.com',
  CONTACT_SITE_ORIGIN: 'https://www.example.com',
  UPSTASH_REDIS_REST_URL: 'https://mock.upstash.io', UPSTASH_REDIS_REST_TOKEN: 'mock_only',
  CONTACT_RATE_LIMIT_SECRET: 'synthetic-test-only-secret-at-least-32-chars',
};
const payload = {
  name: 'Synthetic Test', email: 'synthetic@example.com', phone: '+1 (202) 555-0123',
  practiceArea: 'notarial-services', message: 'SYNTHETIC LOCAL TEST\nNo real matter or case details.',
  website: '', submissionId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
};
function request(data = payload, headers = {}, body) {
  return new Request('https://www.example.com/api/contact', {
    method: 'POST', headers: { origin: env.CONTACT_SITE_ORIGIN, 'content-type': 'application/json',
      'sec-fetch-site': 'same-origin', 'x-vercel-forwarded-for': '192.0.2.1', ...headers },
    body: body ?? JSON.stringify(data),
  });
}
function mock(options = {}) {
  const calls = [];
  const fetch = async (url, init) => {
    calls.push({ url, ...init });
    if (url === 'https://mock.upstash.io') {
      if (options.limiterError) throw new Error('limiter down');
      return Response.json(options.limiter ?? { result: 1 }, { status: options.limiterStatus ?? 200 });
    }
    assert.equal(url, 'https://api.resend.com/emails');
    if (options.emailError) throw new Error('provider returned intake secrets');
    if (options.timeout) return new Promise((resolve, reject) => {
      init.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
    });
    return Response.json(options.email ?? { id: 'mock-email-id' }, { status: options.emailStatus ?? 200 });
  };
  return { calls, fetch };
}
// Mock URI normalization is explicit; all requests pass an injected fetch.
const dependencies = (m, extra = {}) => ({ env, fetch: m.fetch, store: memoryStore(), ...extra });

test('accepted request sends exactly one HTML+text email to configured recipient', async () => {
  const m = mock();
  const result = await handleContact(request(), dependencies(m));
  assert.equal(result.status, 200);
  assert.deepEqual(await result.json(), { ok: true, message: 'Your inquiry has been submitted for delivery.' });
  assert.equal(m.calls.length, 2);
  const mail = JSON.parse(m.calls[1].body);
  assert.equal(mail.from, 'Rachal Law Firm APC <website@example.com>');
  assert.deepEqual(mail.to, ['intake@example.com']);
  assert.equal(mail.reply_to, payload.email);
  assert.ok(mail.html.includes(payload.submissionId));
  assert.ok(!mail.html.includes('Notarial Services'));
  assert.ok(!mail.text.includes(payload.message));
  assert.ok(mail.text.includes('Saved in private intake storage'));
  assert.equal(mail.subject, 'New Rachal Law Firm APC Website Inquiry');
  assert.equal(result.headers.get('Cache-Control'), 'no-store');
  assert.ok(!JSON.stringify(mail).includes('website":"'));
});

test('HTML escapes contact content and both parts exclude sensitive narrative', () => {
  const { inquiry } = validateInquiry({ ...payload, name: '<script>alert("x")</script>&\'', message: '<img src=x onerror=alert(1)>\r\nSecond line & <b>literal</b>' });
  const rendered = renderInquiryEmail(inquiry, payload.submissionId);
  assert.ok(!rendered.html.includes('<script>'));
  assert.ok(!rendered.html.includes('<img'));
  assert.ok(rendered.html.includes('&lt;script&gt;alert(&quot;x&quot;)'));
  assert.ok(!rendered.html.includes('Second line'));
  assert.ok(!rendered.text.includes('Second line'));
  assert.ok(rendered.text.includes(inquiry.name));
  assert.ok(!rendered.html.includes('href='));
});

test('valid email handles plus addressing and rejects header injection / lists', () => {
  assert.equal(validEmail("o'connor+tag@example.com"), true);
  for (const email of ['a@example.com\r\nBcc:evil@example.com', 'x@example.com,y@example.com', 'A <a@example.com>', '.a@example.com', 'a..b@example.com', 'a@-example.com', 'a@example', 'a@ex ample.com']) assert.equal(validEmail(email), false);
});

test('schema allowlist, required/optional fields, types and size limits', () => {
  for (const data of [null, [], 'text', { ...payload, name: '   ' }, { ...payload, email: 'bad' },
    { ...payload, message: '' }, { ...payload, name: 'a'.repeat(121) }, { ...payload, email: `${'a'.repeat(65)}@example.com` },
    { ...payload, phone: '1'.repeat(51) }, { ...payload, message: 'a'.repeat(5001) },
    { ...payload, practiceArea: 'arbitrary' }, { ...payload, practiceArea: '__proto__' },
    { ...payload, phone: {} }, { ...payload, website: 0 }, { ...payload, submissionId: 'not-a-uuid' },
    { ...payload, _subject: 'injected' }, { ...payload, to: 'other@example.com' },
    { ...payload, from: 'other@example.com' }, { ...payload, cc: 'other@example.com' },
    { ...payload, message: 'test\u0000' }, { ...payload, name: 'test\nline' }]) assert.throws(() => validateInquiry(data));
  assert.equal(validateInquiry({ ...payload, phone: '', practiceArea: '' }).inquiry.phone, '');
});

test('safe missing optional fields become empty only when explicitly sent by the form', () => {
  const data = { ...payload }; delete data.phone;
  assert.throws(() => validateInquiry(data));
});

test('invalid/honeypot input never sends mail', async () => {
  for (const data of [{ ...payload, website: 'https://bot.example.com' }, { ...payload, email: 'bad\r\nBcc:x@example.com' }, { ...payload, to: 'other@example.com' }]) {
    const m = mock(); const response = await handleContact(request(data), dependencies(m));
    assert.equal(response.status, 400); assert.equal(m.calls.length, 1);
  }
});

test('missing or invalid configuration fails closed before any external call', async () => {
  for (const changed of [
    { CONTACT_FORM_ENABLED: undefined }, { VERCEL: undefined }, { RESEND_API_KEY: '' },
    { CONTACT_FROM_EMAIL: '' }, { CONTACT_TO_EMAIL: '' }, { CONTACT_TO_EMAIL: 'a@example.com,b@example.com' },
    { CONTACT_RATE_LIMIT_SECRET: 'short' }, { UPSTASH_REDIS_REST_TOKEN: '' },
    { CONTACT_SITE_ORIGIN: 'http://www.example.com' }, { CONTACT_SITE_ORIGIN: 'https://www.example.com/' },
    { UPSTASH_REDIS_REST_URL: 'https://evil.example.com' }, { UPSTASH_REDIS_REST_URL: 'https://user:pass@mock.upstash.io' },
  ]) {
    const m = mock(); const response = await handleContact(request(), dependencies(m, { env: { ...env, ...changed } }));
    assert.equal(response.status, 503); assert.equal(m.calls.length, 0);
  }
});

test('origin, content type, fetch metadata, and trusted IP are enforced', async () => {
  for (const [headers, status] of [
    [{ origin: 'https://attacker.example.com' }, 403], [{ origin: 'null' }, 403],
    [{ 'content-type': 'text/plain' }, 415], [{ 'sec-fetch-site': 'cross-site' }, 403],
    [{ 'x-vercel-forwarded-for': '' }, 503], [{ 'x-vercel-forwarded-for': '192.0.2.1, 192.0.2.2' }, 503],
  ]) {
    const m = mock(); const response = await handleContact(request(payload, headers), dependencies(m));
    assert.equal(response.status, status); assert.equal(m.calls.length, 0);
  }
});

test('malformed, oversized and invalid UTF-8 request bodies never send mail', async () => {
  for (const [body, headers, status] of [
    ['{oops', {}, 400], ['x'.repeat(MAX_BODY_BYTES + 1), {}, 413],
    ['{}', { 'content-length': String(MAX_BODY_BYTES + 1) }, 413],
    [new Uint8Array([0xff, 0xfe]), {}, 400],
  ]) {
    const m = mock(); const response = await handleContact(request(payload, headers, body), dependencies(m));
    assert.equal(response.status, status); assert.ok(m.calls.length <= 1);
  }
});

test('distributed limiter blocks, fails closed, and stores no raw IP / intake', async () => {
  // A separate mock is used to exercise all limiter result variations.
  for (const result of [{ result: 0 }, { error: 'unavailable' }, {}, { result: '1' }]) {
    const calls = [];
    const response = await handleContact(request(), { env, store: memoryStore(), fetch: async (url, init) => {
      calls.push({ url, ...init }); return Response.json(result);
    } });
    assert.equal(response.status, result.result === 0 ? 429 : 503);
    assert.equal(calls.length, 1);
    const body = calls[0].body;
    assert.ok(!body.includes('192.0.2.1')); assert.ok(!body.includes(payload.email));
    assert.ok(!body.includes(payload.name)); assert.ok(body.includes('EVAL'));
    assert.equal(response.headers.get('Retry-After'), result.result === 0 ? '600' : null);
  }
  assert.ok(RATE_LIMIT_SCRIPT.includes("redis.call('EXPIRE', key, 600)"));
});

test('provider 4xx/5xx, exceptions and invalid acknowledgement do not report success', async () => {
  for (const options of [{ emailStatus: 401 }, { emailStatus: 429 }, { emailStatus: 500 }, { emailError: true }, { email: {} }, { email: { id: '' } }]) {
    const m = mock(options); const response = await handleContact(request(), dependencies(m));
    assert.equal(response.status, 503);
    const result = await response.json(); assert.equal(result.ok, false);
    assert.ok(!JSON.stringify(result).includes(payload.email));
  }
});

test('provider timeout aborts and keeps a retryable failure', async () => {
  const m = mock({ timeout: true });
  const response = await handleContact(request(), dependencies(m, { timeoutMs: 10 }));
  assert.equal(response.status, 503); assert.equal(m.calls[1].signal.aborted, true);
});

test('same unchanged inquiry and ID produces stable provider payload/key; changed inquiry differs', async () => {
  const a = mock(); const b = mock(); const c = mock();
  await handleContact(request(), dependencies(a)); await handleContact(request(), dependencies(b));
  await handleContact(request({ ...payload, message: 'Another synthetic test.' }), dependencies(c));
  assert.equal(a.calls[1].headers['Idempotency-Key'], b.calls[1].headers['Idempotency-Key']);
  assert.equal(a.calls[1].body, b.calls[1].body);
  assert.notEqual(a.calls[1].headers['Idempotency-Key'], c.calls[1].headers['Idempotency-Key']);
  assert.ok(!a.calls[1].headers['Idempotency-Key'].includes(payload.email));
});

test('non-POST never calls upstream', async () => {
  const m = mock(); const result = await handleContact(new Request('https://www.example.com/api/contact'), dependencies(m));
  assert.equal(result.status, 405); assert.equal(m.calls.length, 0);
});


test('invalid or oversized provider JSON maps to unavailable, without blaming input', async () => {
  for (const body of ['not json', 'x'.repeat(8193)]) {
    const response = await handleContact(request(), { env, store: memoryStore(), fetch: async (url) =>
      url.includes('upstash.io') ? Response.json({ result: 1 }) : new Response(body)
    });
    assert.equal(response.status, 503);
  }
});

test('slow incoming body times out without sending email', async () => {
  const m = mock();
  const stream = new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode('{')); } });
  const original = request();
  const slow = new Request(original.url, { method: 'POST', headers: original.headers, body: stream, duplex: 'half' });
  const response = await handleContact(slow, dependencies(m, { timeoutMs: 10 }));
  assert.equal(response.status, 408); assert.equal(m.calls.length, 1);
});

test('limiter network and HTTP failures stop delivery', async () => {
  for (const options of [{ limiterError: true }, { limiterStatus: 500 }]) {
    const m = mock(options); const response = await handleContact(request(), dependencies(m));
    assert.equal(response.status, 503); assert.equal(m.calls.length, 1);
  }
});


test('browser defaults to original Formspree URL and exact original payload', () => {
  const { submissionId, ...form } = payload;
  const request = createContactRequest(form, submissionId);
  assert.equal(request.url, 'https://formspree.io/f/xykqaaln');
  assert.deepEqual(request.payload, { name: payload.name, email: payload.email, phone: payload.phone,
    practiceArea: payload.practiceArea, message: payload.message,
    _subject: 'New Rachal Law Firm APC Website Inquiry' });
  assert.equal(Object.hasOwn(request.payload, 'website'), false);
  assert.equal(Object.hasOwn(request.payload, 'submissionId'), false);
  assert.equal(contactWasAccepted(true, {}, false), true);
  assert.equal(contactWasAccepted(false, {}, false), false);
});

test('explicit browser migration flag uses same-origin endpoint and strict success acknowledgement', () => {
  const { submissionId, ...form } = payload;
  const request = createContactRequest(form, submissionId, true);
  assert.equal(request.url, '/api/contact');
  assert.deepEqual(request.payload, payload);
  assert.equal(contactWasAccepted(true, { ok: true }, true), true);
  for (const result of [null, {}, { ok: false }, { ok: 'true' }]) assert.equal(contactWasAccepted(true, result, true), false);
  assert.equal(contactWasAccepted(false, { ok: true }, true), false);
});
