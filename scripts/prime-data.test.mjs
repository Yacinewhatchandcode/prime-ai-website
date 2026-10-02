import { test } from 'node:test';
import assert from 'node:assert/strict';
import { attachMission, canonical, createData, MAX_FILE_BYTES, mergeData, parseData, sealData, sha256, validateData } from '../src/utils/primeData.js';
import { openPrimeStorage } from '../src/utils/primeStorage.js';

const now = '2026-10-02T18:00:00.000Z';
const later = '2026-10-02T19:00:00.000Z';
const goalId = 'e34f94ec-0e69-4d9f-ae7d-3041cb18c65c';
const fixture = async () => {
  const data = await createData();
  data.workspace.goals = [{ id: goalId, title: 'Plan locally', updatedAt: now }];
  return sealData(data);
};
const record = () => ({
  id: crypto.randomUUID(), goal: 'Plan locally', status: 'completed', createdAt: now, startedAt: now, endedAt: later,
  error: null, memoryId: crypto.randomUUID(), capability: 'local-multi-role-advisory', toolsExecuted: false, acceptanceVerified: false,
  steps: ['planner', 'analyst', 'reviewer'].map(role => ({ role, status: 'completed', model: 'qwen3:8b', output: `${role} advisory`, error: null, startedAt: now, endedAt: later })),
});

test('v1 canonical export validates and roundtrips', async () => {
  const data = await fixture();
  assert.deepEqual(await parseData(JSON.stringify(data)), data);
  assert.equal(canonical({ z: 1, a: { b: 2, a: 3 } }), '{"a":{"a":3,"b":2},"z":1}');
  assert.equal(await sha256({ a: 1, b: 2 }), await sha256({ b: 2, a: 1 }));
});
test('tampered checksum and unknown version rejected', async () => {
  const data = await fixture();
  await assert.rejects(validateData({ ...data, checksum: '0'.repeat(64) }), /checksum mismatch/);
  await assert.rejects(validateData({ ...data, version: 2 }), /version/);
});
test('unknown fields, duplicate IDs and orphan references rejected', async () => {
  const data = await fixture();
  await assert.rejects(sealData({ ...data, unexpected: 1 }), /fields/);
  const duplicate = structuredClone(data);
  duplicate.workspace.goals.push(duplicate.workspace.goals[0]);
  await assert.rejects(sealData(duplicate), /duplicate/);
  const orphan = structuredClone(data);
  orphan.workspace.tasks.push({ id: crypto.randomUUID(), goalId: crypto.randomUUID(), title: 'task', status: 'todo', updatedAt: now });
  await assert.rejects(sealData(orphan), /missing goal/);
});
test('malformed JSON, dates and field size bounds rejected', async () => {
  await assert.rejects(parseData('{bad'), /malformed JSON/);
  const data = await fixture();
  data.workspace.goals[0].updatedAt = 'tomorrow';
  await assert.rejects(sealData(data), /timestamps/);
  data.workspace.goals[0].updatedAt = now;
  data.workspace.notes.text = 'x'.repeat(64001);
  await assert.rejects(sealData(data), /notes/);
});
test('byte bound counts Unicode, not just characters', async () => {
  await assert.rejects(parseData('x'.repeat(MAX_FILE_BYTES + 1)), /2 MiB/);
  await assert.rejects(parseData('é'.repeat(MAX_FILE_BYTES / 2 + 1)), /2 MiB/);
});
test('collection limits never silently drop records', async () => {
  const data = await fixture();
  data.workspace.goals = Array.from({ length: 101 }, () => ({ id: crypto.randomUUID(), title: 'goal', updatedAt: now }));
  await assert.rejects(sealData(data), /record limit/);
});
test('merge is deterministic LWW and lists both conflicting versions', async () => {
  const local = await fixture();
  const imported = structuredClone(local);
  imported.workspace.goals[0] = { ...imported.workspace.goals[0], title: 'New title', updatedAt: later };
  const incoming = await sealData(imported);
  const merged = await mergeData(local, incoming);
  assert.equal(merged.data.workspace.goals[0].title, 'New title');
  assert.equal(merged.conflicts[0].winner, 'import');
  assert.equal(merged.conflicts[0].local.title, 'Plan locally');
  assert.deepEqual(merged.data.workspace, (await mergeData(incoming, local)).data.workspace);
});
test('equal timestamp tie-break is stable irrespective of import order', async () => {
  const local = await fixture();
  const changed = structuredClone(local);
  changed.workspace.goals[0].title = 'Alternative';
  const incoming = await sealData(changed);
  const a = await mergeData(local, incoming);
  const b = await mergeData(incoming, local);
  assert.deepEqual(a.data.workspace, b.data.workspace);
  assert.equal(a.conflicts[0].reason, 'equal-time canonical tie-break');
});
test('idempotent repeated import does not manufacture conflicts', async () => {
  const local = await fixture();
  const merged = await mergeData(local, local);
  assert.equal(merged.conflicts.length, 0);
  assert.deepEqual(merged.data, local);
});
test('real-shaped advisory snapshot is hashed and corruption rejected', async () => {
  const data = await fixture();
  const mission = record();
  const attached = await attachMission(data, goalId, mission);
  assert.equal(attached.missions[0].source, 'local-fleet');
  assert.equal(attached.missions[0].hash, await sha256(mission));
  const corrupted = structuredClone(attached);
  corrupted.missions[0].record.steps[0].output = 'tampered';
  await assert.rejects(sealData(corrupted), /snapshot hash/);
  mission.toolsExecuted = true;
  await assert.rejects(attachMission(data, goalId, mission), /capability/);
});
test('oversized combined snapshots are rejected without truncation', async () => {
  let data = await fixture();
  for (let index = 0; index < 2; index++) {
    const mission = record();
    mission.steps.forEach(step => { step.output = 'x'.repeat(256000); });
    data = await attachMission(data, goalId, mission);
  }
  const mission = record();
  mission.steps.forEach(step => { step.output = 'x'.repeat(256000); });
  await assert.rejects(attachMission(data, goalId, mission), /2 MiB/);
});
test('completed snapshots cannot omit role outputs or persisted memory', async () => {
  const data = await fixture();
  const mission = record();
  mission.steps[0].output = '';
  await assert.rejects(attachMission(data, goalId, mission), /completed mission/);
  mission.steps[0].output = 'advisory';
  mission.memoryId = null;
  await assert.rejects(attachMission(data, goalId, mission), /completed mission/);
});
test('extended-year timestamps rejected to preserve chronological LWW sorting', async () => {
  const data = await fixture();
  data.workspace.goals[0].updatedAt = '+010000-01-01T00:00:00.000Z';
  await assert.rejects(sealData(data), /timestamps/);
});
test('optional real retrieval metadata preserved, bounded and never executable', async () => {
  const data = await fixture();
  const mission = record();
  const retrieval = {
    scope: 'approved definitions only',
    coverage: { requestedRoots: 1, suppliedEntries: 1, inspectedFiles: 2, loadedSources: 1, uniqueSkills: 1, visitedEntries: 3, skipped: 0, unavailable: 1, truncated: false },
    unavailable: [{ rootId: 'missing-root', code: 'ENOENT', message: 'Unavailable' }, { source: 'missing/file', code: 'EACCES', message: 'Unreadable' }],
    executable: false,
    selected: [{ name: 'SKILL.md', sha256: 'a'.repeat(64), provenance: [
      { kind: 'approved-local-root', rootId: 'fleet', source: 'fleet/SKILL.md', verified: true },
      { kind: 'supplied-index', source: 'index/SKILL.md', verified: false },
    ] }],
  };
  mission.skillRetrieval = retrieval;
  assert.deepEqual((await attachMission(data, goalId, mission)).missions[0].record.skillRetrieval, retrieval);
  retrieval.executable = true;
  await assert.rejects(attachMission(data, goalId, mission), /executable/);
  retrieval.executable = false;
  retrieval.unexpected = true;
  await assert.rejects(attachMission(data, goalId, mission), /fields/);
  delete retrieval.unexpected;
  retrieval.unavailable = Array.from({ length: 3 }, () => ({ rootId: 'root', code: 'ERROR', message: 'x'.repeat(3000) }));
  await assert.rejects(attachMission(data, goalId, mission), /8 KiB/);
});
test('fallback persists atomically and refuses stale overwrite or quota failure', async t => {
  const savedStorage = globalThis.localStorage;
  const entries = new Map();
  let failWrites = false;
  globalThis.localStorage = {
    getItem: key => entries.get(key) || null,
    setItem: (key, value) => { if (failWrites) throw new Error('QuotaExceededError'); entries.set(key, value); },
    removeItem: key => entries.delete(key),
  };
  t.after(() => { globalThis.localStorage = savedStorage; });
  const storage = await openPrimeStorage();
  const data = await fixture();
  await storage.save(data, { lastImportAt: now, lastExportAt: null }, null);
  assert.deepEqual(await storage.read(), data);
  assert.equal((await storage.metadata()).lastImportAt, now);
  await assert.rejects(storage.save(data, undefined, 'stale-checksum'), /another tab/);
  failWrites = true;
  await assert.rejects(storage.save(data, undefined, data.checksum), /Quota/);
  assert.deepEqual(await storage.read(), data);
});
