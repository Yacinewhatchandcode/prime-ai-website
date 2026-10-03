function rateLimitError(response) {
  const retryAfter = response.headers.get('retry-after');
  const seconds = retryAfter && /^\d+$/.test(retryAfter) ? Number(retryAfter) : null;
  return new Error(`RATE_LIMITED: Too many local intent requests.${seconds !== null ? ` Try again in ${seconds} seconds.` : ' Try again later.'} Nothing was retried automatically.`);
}

export async function intentRequest(endpoint, { body, signal } = {}) {
  const response = await fetch(`/api/intent${endpoint}`, {
    method: body ? 'POST' : 'GET', signal,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  if (response.status === 429) throw rateLimitError(response);
  if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('Local intent service did not return JSON.');
  const value = await response.json();
  if (!response.ok || value.error) throw new Error(value.error?.message || value.error?.code || `Local intent service returned HTTP ${response.status}.`);
  return value;
}

export async function readMissionEvents(missionId, signal, onEvent) {
  if (!/^[a-zA-Z0-9_-]{1,80}$/.test(missionId)) throw new Error('Invalid mission identifier.');
  const response = await fetch(`/api/intent/missions/${missionId}/events`, { signal, headers: { Accept: 'text/event-stream' } });
  if (response.status === 429) throw rateLimitError(response);
  if (!response.ok || !response.headers.get('content-type')?.includes('text/event-stream')) throw new Error(`Mission stream unavailable (HTTP ${response.status}).`);
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let sequence = -1;
  let terminal = false;
  const terminalTypes = ['completed', 'failed', 'blocked', 'cancelled', 'interrupted'];
  try {
    while (true) {
      const { done, value } = await reader.read();
      buffer = (buffer + decoder.decode(value, { stream: !done })).replace(/\r\n/g, '\n');
      if (buffer.length > 2 * 1024 * 1024) throw new Error('Mission event exceeds the local display limit.');
      let boundary;
      while ((boundary = buffer.indexOf('\n\n')) >= 0) {
        const frame = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        const data = frame.split('\n').filter(line => line.startsWith('data:')).map(line => line.slice(5).trimStart()).join('\n');
        if (!data) continue;
        const event = JSON.parse(data);
        if (event.missionId !== missionId || !Number.isInteger(event.sequence) || typeof event.type !== 'string') throw new Error('Invalid mission event envelope.');
        if (event.sequence <= sequence) continue;
        sequence = event.sequence;
        terminal = terminalTypes.includes(event.type);
        onEvent(event);
      }
      if (done) break;
    }
    if (!terminal) throw new Error('Mission stream closed before a terminal status.');
  } finally {
    reader.releaseLock();
  }
}
