import assert from 'node:assert/strict';
import test from 'node:test';
import handler from '../../../api/julia-embed.js';

function responseRecorder() {
  return {
    headers: {},
    statusCode: 200,
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.payload = payload; return this; },
    send(payload) { this.payload = payload; return this; },
    end() { this.ended = true; return this; },
  };
}

test('serves the runtime with exact AMLAZR LAN and production CORS origins', async () => {
  for (const origin of ['http://192.168.1.80:3000', 'https://amlazr.com']) {
    const res = responseRecorder();
    await handler({ method: 'GET', headers: { origin } }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['Access-Control-Allow-Origin'], origin);
    assert.equal(res.headers.Vary, 'Origin');
    assert.match(res.headers['Content-Type'], /javascript/);
    assert.ok(Buffer.isBuffer(res.payload));
    assert.ok(res.payload.length > 0);
  }
});

test('rejects unknown embed origins without wildcard CORS', async () => {
  const res = responseRecorder();
  await handler({ method: 'GET', headers: { origin: 'https://attacker.example' } }, res);
  assert.equal(res.statusCode, 403);
  assert.equal(res.headers['Access-Control-Allow-Origin'], undefined);
});

test('answers embed preflight for an allowed origin', async () => {
  const res = responseRecorder();
  await handler({ method: 'OPTIONS', headers: { origin: 'https://amlazr.com' } }, res);
  assert.equal(res.statusCode, 204);
  assert.equal(res.headers['Access-Control-Allow-Origin'], 'https://amlazr.com');
});
