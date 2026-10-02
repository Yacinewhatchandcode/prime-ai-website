const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function validateMission(mission) {
  if (!mission || !UUID.test(mission.id) || typeof mission.goal !== 'string' ||
      typeof mission.createdAt !== 'string' ||
      !['queued', 'running', 'completed', 'failed'].includes(mission.status) ||
      !Array.isArray(mission.steps) || mission.steps.some(step =>
        !['planner', 'analyst', 'reviewer'].includes(step.role) ||
        !['queued', 'running', 'completed', 'failed', 'blocked'].includes(step.status) ||
        (step.output !== null && typeof step.output !== 'string'))) {
    throw new Error('Local fleet returned an invalid mission record.');
  }
  return mission;
}

export async function localFleetRequest(endpoint, { signal, goal } = {}) {
  if (!['health', 'status', 'missions', 'memory'].includes(endpoint) && !new RegExp(`^missions/${UUID.source.slice(1, -1)}$`, 'i').test(endpoint)) {
    throw new Error('Unsupported local fleet endpoint');
  }
  const response = await fetch(`/api/local-fleet/${endpoint}`, {
    method: goal === undefined ? 'GET' : 'POST',
    signal: signal || AbortSignal.timeout(10000),
    headers: { Accept: 'application/json', ...(goal === undefined ? {} : { 'Content-Type': 'application/json' }) },
    ...(goal === undefined ? {} : { body: JSON.stringify({ goal }) }),
  });
  if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('Local fleet proxy unavailable: expected JSON.');
  const envelope = await response.json();
  if (!response.ok || envelope.error) throw new Error(envelope.error?.message || `Local fleet HTTP ${response.status}`);
  if (!Object.hasOwn(envelope, 'data')) throw new Error('Local fleet response is missing data.');
  return envelope.data;
}
