import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { mkdtemp, writeFile, rm, rmdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createIntentProxy } from './intent-proxy.mjs';

async function listen(server) {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return `http://127.0.0.1:${server.address().port}`;
}
async function close(server) {
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
}

test('intent bridge rejects unconfigured, cross-origin, disallowed and oversized requests', async () => {
  const server = http.createServer(createIntentProxy());
  const origin = await listen(server);
  try {
    assert.equal((await fetch(`${origin}/api/intent/health`)).status, 503);
    assert.equal((await fetch(`${origin}/api/intent/missions`, { method: 'POST', headers: { Origin: 'https://untrusted.example', 'Content-Type': 'application/json' }, body: '{}' })).status, 403);
    assert.equal((await fetch(`${origin}/api/intent/secret`)).status, 404);
    assert.equal((await fetch(`${origin}/api/intent/health?token=invalid`)).status, 404);
  } finally { await close(server); }
});

test('intent bridge injects a server-only token and forwards actual event streams', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'prime-intent-proxy-test-'));
  const tokenFile = path.join(directory, 'fixture-token');
  await writeFile(tokenFile, 'local-test-token');
  let authorization;
  let backendOrigin;
  const upstream = http.createServer((req, res) => {
    authorization = req.headers.authorization;
    backendOrigin = req.headers.origin;
    if (req.url === '/api/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ service: 'test-fixture', state: 'ready' }));
    } else if (req.url === '/api/missions/limited/events') {
      res.writeHead(429, { 'Content-Type': 'application/json', 'Retry-After': '42' });
      res.end('{"error":{"code":"RATE_LIMITED"}}');
    } else if (req.url === '/api/missions/mission_fixture/events') {
      res.writeHead(200, { 'Content-Type': 'text/event-stream' });
      res.end('data: {"missionId":"mission_fixture","sequence":1,"type":"completed"}\n\n');
    } else {
      res.writeHead(302, { Location: 'https://untrusted.example' });
      res.end();
    }
  });
  const backend = await listen(upstream);
  const server = http.createServer(createIntentProxy({ backend, tokenFile }));
  const origin = await listen(server);
  try {
    const health = await fetch(`${origin}/api/intent/health`);
    assert.equal(health.status, 200);
    assert.equal(authorization, 'Bearer local-test-token');
    assert.equal(backendOrigin, origin);
    assert(!(await health.text()).includes('local-test-token'));
    const stream = await fetch(`${origin}/api/intent/missions/mission_fixture/events`);
    assert.match(stream.headers.get('content-type'), /text\/event-stream/);
    assert.match(await stream.text(), /"type":"completed"/);
    const limited = await fetch(`${origin}/api/intent/missions/limited/events`);
    assert.equal(limited.status, 429);
    assert.equal(limited.headers.get('retry-after'), '42');
    assert.equal((await limited.json()).error.code, 'RATE_LIMITED');
    assert.equal((await fetch(`${origin}/api/intent/missions`, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: '{}' })).status, 502);
    assert.equal((await fetch(`${origin}/api/intent/missions`, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: 'x'.repeat(17000) })).status, 413);
  } finally { await close(server); await close(upstream); await rm(tokenFile); await rmdir(directory); }
});
