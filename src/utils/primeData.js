export const MAX_FILE_BYTES = 2 * 1024 * 1024;
const encoder = new TextEncoder();
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const hex = /^[0-9a-f]{64}$/;
const invalid = message => { throw new Error(`Invalid Prime-AI data: ${message}`); };
const object = (value, keys, required = keys) => {
  if (!value || typeof value !== 'object' || Array.isArray(value) ||
      Object.keys(value).some(key => !keys.includes(key)) || required.some(key => !Object.hasOwn(value, key))) {
    invalid('unexpected or missing fields');
  }
};
const text = (value, limit, label, nonempty = false) => {
  if (typeof value !== 'string' || value.length > limit || nonempty && !value.trim()) invalid(`${label} exceeds its limit or is not text`);
};
const date = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) ||
      !Number.isFinite(Date.parse(value)) || new Date(value).toISOString() !== value) invalid('timestamps must be canonical ISO dates');
};
const id = value => { if (typeof value !== 'string' || !uuid.test(value)) invalid('invalid UUID'); };
const list = (value, limit, label) => {
  if (!Array.isArray(value) || value.length > limit) invalid(`${label} exceeds its record limit`);
  const ids = new Set();
  for (const entry of value) {
    id(entry?.id);
    if (ids.has(entry.id)) invalid(`${label} has duplicate IDs`);
    ids.add(entry.id);
  }
};

export function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}

export async function sha256(value) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(canonical(value)));
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

function validateRetrieval(retrieval) {
  object(retrieval, ['scope', 'coverage', 'unavailable', 'executable', 'selected']);
  text(retrieval.scope, 1024, 'retrieval scope', true);
  if (retrieval.executable !== false) invalid('retrieved definitions must not be executable');
  const counts = ['requestedRoots', 'suppliedEntries', 'inspectedFiles', 'loadedSources', 'uniqueSkills', 'visitedEntries', 'skipped', 'unavailable'];
  object(retrieval.coverage, [...counts, 'truncated']);
  for (const field of counts) {
    if (!Number.isSafeInteger(retrieval.coverage[field]) || retrieval.coverage[field] < 0 || retrieval.coverage[field] > 1000) invalid('retrieval coverage count');
  }
  if (typeof retrieval.coverage.truncated !== 'boolean') invalid('retrieval coverage truncation');
  if (!Array.isArray(retrieval.unavailable) || retrieval.unavailable.length > 100) invalid('retrieval error count');
  for (const failure of retrieval.unavailable) {
    const location = Object.hasOwn(failure || {}, 'rootId') ? 'rootId' : 'source';
    object(failure, [location, 'code', 'message']);
    text(failure[location], 1024, 'retrieval error source', true);
    text(failure.code, 128, 'retrieval error code', true);
    text(failure.message, 4000, 'retrieval error message', true);
  }
  if (!Array.isArray(retrieval.selected) || retrieval.selected.length > 3) invalid('retrieval selection count');
  for (const skill of retrieval.selected) {
    object(skill, ['name', 'sha256', 'provenance']);
    text(skill.name, 256, 'skill name', true);
    if (typeof skill.sha256 !== 'string' || !hex.test(skill.sha256)) invalid('skill hash');
    if (!Array.isArray(skill.provenance) || !skill.provenance.length || skill.provenance.length > 20) invalid('skill provenance count');
    for (const source of skill.provenance) {
      object(source, ['kind', 'rootId', 'source', 'verified'], ['kind', 'source', 'verified']);
      if (source.kind === 'approved-local-root') {
        object(source, ['kind', 'rootId', 'source', 'verified']);
        text(source.rootId, 256, 'skill root', true);
        if (source.verified !== true) invalid('approved skill provenance');
      } else if (source.kind === 'supplied-index') {
        object(source, ['kind', 'source', 'verified']);
        if (source.verified !== false) invalid('supplied skill provenance is not verified');
      } else invalid('skill provenance kind');
      text(source.source, 1024, 'skill source', true);
    }
  }
  if (encoder.encode(JSON.stringify(retrieval)).length > 8192) invalid('retrieval metadata exceeds 8 KiB');
}

function validateRecord(record) {
  const required = ['id', 'goal', 'status', 'createdAt', 'startedAt', 'endedAt', 'error', 'memoryId', 'capability', 'acceptanceVerified', 'toolsExecuted', 'steps'];
  object(record, [...required, 'skillRetrieval'], required);
  if (Object.hasOwn(record, 'skillRetrieval')) validateRetrieval(record.skillRetrieval);
  id(record.id);
  text(record.goal, 4000, 'mission goal', true);
  date(record.createdAt);
  for (const value of [record.startedAt, record.endedAt]) if (value !== null) date(value);
  if (!['queued', 'running', 'completed', 'failed'].includes(record.status)) invalid('mission status');
  if (record.memoryId !== null) id(record.memoryId);
  if (record.capability !== 'local-multi-role-advisory' || record.acceptanceVerified !== false || record.toolsExecuted !== false) invalid('unsupported mission capability');
  const error = value => {
    if (value === null) return;
    object(value, ['code', 'message']);
    text(value.code, 128, 'error code', true);
    text(value.message, 4000, 'error message', true);
  };
  error(record.error);
  if (!Array.isArray(record.steps) || record.steps.length !== 3 || new Set(record.steps.map(step => step?.role)).size !== 3) invalid('three unique advisory roles required');
  for (const step of record.steps) {
    object(step, ['role', 'status', 'model', 'output', 'error', 'startedAt', 'endedAt', 'sha256'], ['role', 'status', 'output', 'error']);
    if (!['planner', 'analyst', 'reviewer'].includes(step.role) || !['queued', 'running', 'completed', 'failed', 'blocked'].includes(step.status)) invalid('role or status');
    if (step.model !== undefined && step.model !== null) text(step.model, 256, 'model');
    if (step.output !== null) text(step.output, 256000, 'role output');
    error(step.error);
    for (const key of ['startedAt', 'endedAt']) if (step[key] !== undefined && step[key] !== null) date(step[key]);
    if (step.sha256 !== undefined && step.sha256 !== null && !hex.test(step.sha256)) invalid('role hash');
  }
  if (record.status === 'completed' && (record.error !== null || record.memoryId === null ||
      record.startedAt === null || record.endedAt === null ||
      record.steps.some(step => step.status !== 'completed' || step.error !== null ||
        typeof step.output !== 'string' || !step.output.trim() ||
        typeof step.model !== 'string' || !step.model.trim()))) invalid('completed mission requires completed advisory outputs and memory');
}

export function validateShape(data) {
  object(data, ['format', 'version', 'createdAt', 'device', 'workspace', 'missions', 'checksum']);
  if (data.format !== 'prime-ai-data' || data.version !== 1) invalid('unsupported format or version');
  date(data.createdAt);
  object(data.device, ['id', 'name']);
  id(data.device.id);
  text(data.device.name, 120, 'device name', true);
  object(data.workspace, ['notes', 'goals', 'tasks', 'settings']);
  object(data.workspace.notes, ['id', 'text', 'updatedAt']);
  if (data.workspace.notes.id !== 'notes') invalid('notes ID');
  text(data.workspace.notes.text, 64000, 'notes');
  date(data.workspace.notes.updatedAt);
  object(data.workspace.settings, ['id', 'language', 'updatedAt']);
  if (data.workspace.settings.id !== 'settings' || !['en', 'fr'].includes(data.workspace.settings.language)) invalid('settings');
  date(data.workspace.settings.updatedAt);
  list(data.workspace.goals, 100, 'goals');
  for (const goal of data.workspace.goals) {
    object(goal, ['id', 'title', 'updatedAt']);
    text(goal.title, 4000, 'goal', true);
    date(goal.updatedAt);
  }
  list(data.workspace.tasks, 500, 'tasks');
  for (const task of data.workspace.tasks) {
    object(task, ['id', 'goalId', 'title', 'status', 'updatedAt']);
    id(task.goalId);
    if (!data.workspace.goals.some(goal => goal.id === task.goalId)) invalid('task references missing goal');
    text(task.title, 2000, 'task', true);
    if (!['todo', 'doing', 'done'].includes(task.status)) invalid('task status');
    date(task.updatedAt);
  }
  list(data.missions, 100, 'missions');
  for (const snapshot of data.missions) {
    object(snapshot, ['id', 'goalId', 'source', 'updatedAt', 'record', 'hash']);
    id(snapshot.goalId);
    if (!data.workspace.goals.some(goal => goal.id === snapshot.goalId)) invalid('mission references missing goal');
    if (snapshot.source !== 'local-fleet' || !hex.test(snapshot.hash)) invalid('mission source or hash');
    date(snapshot.updatedAt);
    validateRecord(snapshot.record);
    if (snapshot.id !== snapshot.record.id) invalid('mission ID mismatch');
  }
  if (!hex.test(data.checksum)) invalid('checksum must be SHA-256');
  if (encoder.encode(JSON.stringify(data)).length > MAX_FILE_BYTES) invalid('file exceeds 2 MiB');
  return data;
}

export async function validateData(data) {
  validateShape(data);
  const { checksum, ...payload } = data;
  if (await sha256(payload) !== checksum) invalid('checksum mismatch');
  for (const snapshot of data.missions) if (await sha256(snapshot.record) !== snapshot.hash) invalid('mission snapshot hash mismatch');
  return data;
}

export async function sealData(payload) {
  const { checksum: ignored, ...body } = payload;
  void ignored;
  const data = { ...body, checksum: await sha256(body) };
  return validateData(data);
}

export async function parseData(input) {
  if (typeof input !== 'string' || encoder.encode(input).length > MAX_FILE_BYTES) invalid('file exceeds 2 MiB');
  let data;
  try { data = JSON.parse(input); } catch { invalid('malformed JSON'); }
  return validateData(data);
}

export async function createData(language = 'en') {
  const now = new Date().toISOString();
  return sealData({
    format: 'prime-ai-data', version: 1, createdAt: now,
    device: { id: crypto.randomUUID(), name: 'This browser' },
    workspace: { notes: { id: 'notes', text: '', updatedAt: now }, goals: [], tasks: [], settings: { id: 'settings', language, updatedAt: now } },
    missions: [],
  });
}

export async function mergeData(local, incoming) {
  await validateData(local);
  await validateData(incoming);
  const conflicts = [];
  const choose = (a, b, collection) => {
    if (canonical(a) === canonical(b)) return a;
    const winner = a.updatedAt > b.updatedAt ? a : b.updatedAt > a.updatedAt ? b : canonical(a) > canonical(b) ? a : b;
    conflicts.push({ collection, id: a.id, winner: winner === a ? 'local' : 'import', local: a, incoming: b, reason: a.updatedAt === b.updatedAt ? 'equal-time canonical tie-break' : 'last-writer-wins' });
    return winner;
  };
  const merge = (a, b, collection) => {
    const records = new Map(a.map(entry => [entry.id, entry]));
    for (const entry of b) records.set(entry.id, records.has(entry.id) ? choose(records.get(entry.id), entry, collection) : entry);
    return [...records.values()].sort((a, b) => a.id.localeCompare(b.id, 'en'));
  };
  const workspace = {
    notes: choose(local.workspace.notes, incoming.workspace.notes, 'notes'),
    settings: choose(local.workspace.settings, incoming.workspace.settings, 'settings'),
    goals: merge(local.workspace.goals, incoming.workspace.goals, 'goals'),
    tasks: merge(local.workspace.tasks, incoming.workspace.tasks, 'tasks'),
  };
  const data = await sealData({ ...local, workspace, missions: merge(local.missions, incoming.missions, 'missions') });
  return { data, conflicts };
}

export async function attachMission(data, goalId, record) {
  validateRecord(record);
  const snapshot = { id: record.id, goalId, source: 'local-fleet', updatedAt: new Date().toISOString(), record, hash: await sha256(record) };
  return sealData({ ...data, missions: [...data.missions.filter(mission => mission.id !== record.id), snapshot] });
}
