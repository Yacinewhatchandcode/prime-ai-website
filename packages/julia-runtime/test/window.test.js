import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import test, { before } from 'node:test';
import handler from '../../../api/julia-window.js';

const secret = 'test-only-julia-window-signing-secret-long-enough';
let ipCounter = 1;

before(() => {
  process.env.NODE_ENV = 'test';
  process.env.JULIA_WINDOW_SECRET = secret;
  process.env.JULIA_WINDOW_TTL_SECONDS = '3';
});

function responseRecorder() {
  return {
    headers: {},
    statusCode: 200,
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.payload = payload; return this; },
    end() { this.ended = true; return this; },
  };
}

async function issue({ site = 'prime-ai', origin = 'http://192.168.1.80:5174', ip } = {}) {
  const res = responseRecorder();
  await handler({
    method: 'POST',
    headers: { origin, 'x-forwarded-for': ip || `192.0.2.${ipCounter++}` },
    body: { site },
  }, res);
  return res;
}

test('issues a short-lived, HMAC-signed token for an allowed site and origin', async () => {
  const response = await issue({ site: 'yace19ai' });
  assert.equal(response.statusCode, 200);
  assert.equal(response.headers['Access-Control-Allow-Origin'], 'http://192.168.1.80:5174');
  const [header, payload, signature] = response.payload.token.split('.');
  const expected = createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url');
  assert.equal(signature, expected);
  const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  assert.equal(claims.site, 'yace19ai');
  assert.equal(claims.aud, 'prime-ai-constellation');
  assert.equal(claims.exp - claims.iat, 3);
  assert.equal(response.payload.exp, claims.exp);
});

test('allows the AMLAZR LAN origin for issuer preflight with an exact ACAO value', async () => {
  const res = responseRecorder();
  await handler({
    method: 'OPTIONS',
    headers: {
      origin: 'http://192.168.1.80:3000',
      'access-control-request-method': 'POST',
    },
  }, res);
  assert.equal(res.statusCode, 204);
  assert.equal(res.headers['Access-Control-Allow-Origin'], 'http://192.168.1.80:3000');
  assert.equal(res.headers['Access-Control-Allow-Methods'], 'POST, OPTIONS');
  assert.notEqual(res.headers['Access-Control-Allow-Origin'], '*');

  const production = await issue({ origin: 'https://amlazr.com', site: 'amlazr' });
  assert.equal(production.headers['Access-Control-Allow-Origin'], 'https://amlazr.com');
});

test('allows only one free window per client address in the 24-hour claim store', async () => {
  const ip = '192.0.2.220';
  assert.equal((await issue({ ip, site: 'prime-ai' })).statusCode, 200);
  const repeat = await issue({ ip, site: 'amlazr' });
  assert.equal(repeat.statusCode, 429);
});

test('rejects unknown origins, sites, and methods', async () => {
  assert.equal((await issue({ origin: 'https://attacker.example' })).statusCode, 403);
  assert.equal((await issue({ site: 'other-site' })).statusCode, 400);
  const res = responseRecorder();
  await handler({ method: 'GET', headers: { origin: 'https://prime-ai.fr' } }, res);
  assert.equal(res.statusCode, 405);
});

test('returns an explicit configuration error when no signing key is configured', async () => {
  delete process.env.JULIA_WINDOW_SECRET;
  const response = await issue();
  assert.equal(response.statusCode, 503);
  assert.match(response.payload.error, /not configured/i);
  process.env.JULIA_WINDOW_SECRET = secret;
});
