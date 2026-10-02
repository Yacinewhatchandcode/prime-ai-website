import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { mkdir, writeFile, mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createPreview } from './local-preview.mjs';

const listen = server => new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(`http://127.0.0.1:${server.address().port}`)));
const close = server => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); });

test('native static preview and bounded token-injecting local proxy', async t => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'prime-proxy-'));
  await mkdir(path.join(directory, 'dist'));
  await writeFile(path.join(directory, 'dist/index.html'), '<main>Local website</main>');
  await writeFile(path.join(directory, 'dist/video.mp4'), '0123456789');
  await writeFile(path.join(directory, 'token'), 'test-server-only-token');
  const requests = [];
  let responseMode = 'normal';
  const backend = http.createServer(async (req, res) => {
    let body = '';
    for await (const chunk of req) body += chunk;
    requests.push({ path: req.url, token: req.headers.authorization, body });
    if (responseMode === 'delay') {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    if (responseMode === 'html') { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end('<html>Not an API</html>'); }
    if (responseMode === 'invalid') { res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end('{"unexpected":true}'); }
    if (req.url === '/api/memory') { res.writeHead(302, { Location: 'https://example.com' }); return res.end(); }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ data: req.url === '/api/health' ? { ready: true } : { id: 'e67a1c5a-b48d-4dd4-a5e2-a5f01b0b2b1a', status: 'queued' } }));
  });
  const upstream = await listen(backend);
  const proxy = await createPreview({ directory: path.join(directory, 'dist'), backend: upstream, tokenFile: path.join(directory, 'token') });
  const base = await listen(proxy);
  t.after(async () => { await close(proxy); await close(backend); await rm(directory, { recursive: true }); });
  await t.test('static SPA and media ranges remain local', async () => {
    assert.equal(await (await fetch(`${base}/route`)).text(), '<main>Local website</main>');
    const range = await fetch(`${base}/video.mp4`, { headers: { Range: 'bytes=2-5' } });
    assert.equal(range.status, 206);
    assert.equal(range.headers.get('content-range'), 'bytes 2-5/10');
    assert.equal(await range.text(), '2345');
    assert.equal((await fetch(`${base}/missing.mp4`)).status, 404);
    assert.equal((await fetch(`${base}/video.mp4`, { headers: { Range: 'bytes=99-' } })).status, 416);
    assert.equal((await fetch(`${base}/.env`)).status, 404);
  });
  await t.test('GET allowlist and server-side token injection', async () => {
    assert.equal((await fetch(`${base}/api/local-fleet/health`)).status, 200);
    assert.equal(requests.at(-1).token, undefined);
    const response = await fetch(`${base}/api/local-fleet/status`, { headers: { Authorization: 'Bearer hostile-browser-value' } });
    assert.equal(response.status, 200);
    assert.equal(requests.at(-1).token, 'Bearer test-server-only-token');
    assert.ok(!(await response.text()).includes('test-server-only-token'));
    for (const endpoint of ['/api/state', '/api/local-fleet/dispatch', '/api/local-fleet/missions/not-a-uuid', '/api/local-fleet/status?url=https://example.com']) {
      assert.equal((await fetch(`${base}${endpoint}`)).status, 404);
    }
  });
  await t.test('mutations require same-origin JSON and validate bounded goal', async () => {
    const submit = (body, origin = base) => fetch(`${base}/api/local-fleet/missions`, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body });
    assert.equal((await submit('{"goal":"review local design"}')).status, 200);
    assert.equal(requests.at(-1).body, '{"goal":"review local design"}');
    assert.equal((await submit('{"goal":"x"}', 'http://localhost:1')).status, 403);
    assert.equal((await submit('{"goal":"x"}', '')).status, 403);
    assert.equal((await submit('{"goal":""}')).status, 400);
    assert.equal((await submit('{')).status, 400);
    assert.equal((await submit(JSON.stringify({ goal: 'x'.repeat(9000) }))).status, 413);
    assert.equal((await fetch(`${base}/api/local-fleet/missions`, { method: 'DELETE' })).status, 404);
  });
  await t.test('redirects never leave loopback', async () => {
    assert.equal((await fetch(`${base}/api/local-fleet/memory`)).status, 502);
    assert.equal(requests.at(-1).path, '/api/memory');
  });
  await t.test('public upstream configuration rejected', async () => {
    await assert.rejects(createPreview({ directory, backend: 'https://example.com', tokenFile: path.join(directory, 'token') }), /loopback/);
  });
  await t.test('invalid backend formats and envelopes are explicit errors', async () => {
    responseMode = 'html';
    assert.equal((await fetch(`${base}/api/local-fleet/status`)).status, 502);
    responseMode = 'invalid';
    assert.equal((await fetch(`${base}/api/local-fleet/status`)).status, 502);
    responseMode = 'normal';
  });
  await t.test('upstream request has a bounded timeout', async () => {
    const bounded = await createPreview({ directory: path.join(directory, 'dist'), backend: upstream, tokenFile: path.join(directory, 'token'), timeout: 50 });
    const origin = await listen(bounded);
    responseMode = 'delay';
    try {
      const response = await fetch(`${origin}/api/local-fleet/status`);
      assert.equal(response.status, 502);
      assert.match((await response.json()).error.message, /timed out/);
    } finally {
      responseMode = 'normal';
      await close(bounded);
    }
  });
});
