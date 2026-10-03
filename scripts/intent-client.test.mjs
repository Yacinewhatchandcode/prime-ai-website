import { test } from 'node:test';
import assert from 'node:assert/strict';
import { intentRequest, readMissionEvents } from '../src/utils/intentClient.js';

test('rate limits display Retry-After and never retry approval or stream automatically', async () => {
  const original = globalThis.fetch;
  let requests = 0;
  globalThis.fetch = async () => {
    requests++;
    return new Response('{"error":{"code":"RATE_LIMITED"}}', { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '42' } });
  };
  try {
    await assert.rejects(intentRequest('/missions/one/approve', { body: {} }), /RATE_LIMITED.*42 seconds.*Nothing was retried/);
    await assert.rejects(readMissionEvents('one', new AbortController().signal, () => {}), /RATE_LIMITED.*42 seconds/);
    assert.equal(requests, 2);
  } finally { globalThis.fetch = original; }
});

test('SSE accepts split frames and completed inference without pretending token deltas', async () => {
  const original = globalThis.fetch;
  const encoder = new TextEncoder();
  const missionId = 'mission_test-123';
  const inference = { missionId, sequence: 1, type: 'inference.generated', data: { kind: 'generated_inference', text: 'Réponse locale' } };
  const completed = { missionId, sequence: 2, type: 'completed', state: 'completed' };
  const data = `data: ${JSON.stringify(inference)}\r\n\r\ndata: ${JSON.stringify(completed)}\r\n\r\n`;
  const bytes = encoder.encode(data);
  globalThis.fetch = async () => new Response(new ReadableStream({
    start(controller) {
      for (const value of bytes) controller.enqueue(new Uint8Array([value]));
      controller.close();
    },
  }), { headers: { 'Content-Type': 'text/event-stream' } });
  try {
    const events = [];
    await readMissionEvents(missionId, new AbortController().signal, event => events.push(event));
    assert.equal(events.length, 2);
    assert.equal(events[0].data.text, 'Réponse locale');
    assert.equal(events[1].type, 'completed');
  } finally { globalThis.fetch = original; }
});

test('SSE rejects premature closure and unrelated mission envelopes', async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response('data: {"missionId":"one","sequence":1,"type":"approved"}\n\n', { headers: { 'Content-Type': 'text/event-stream' } });
    await assert.rejects(readMissionEvents('one', new AbortController().signal, () => {}), /before a terminal/);
    await assert.rejects(readMissionEvents('two', new AbortController().signal, () => {}), /Invalid mission event/);
  } finally { globalThis.fetch = original; }
});
