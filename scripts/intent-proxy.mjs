import { readFile } from 'node:fs/promises';
import { Readable } from 'node:stream';

export function createIntentProxy({ backend = 'http://127.0.0.1:4191', tokenFile } = {}) {
  const upstream = new URL(backend);
  if (upstream.protocol !== 'http:' || !['127.0.0.1', 'localhost'].includes(upstream.hostname) || upstream.pathname !== '/' || upstream.search || upstream.hash || upstream.username || upstream.password) throw new Error('Intent backend must be a plain loopback HTTP origin.');
  return async function intentProxy(req, res, next) {
    if (!req.url?.startsWith('/api/intent/')) return next?.();
    const fail = (status, message) => {
      res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify({ error: { message } }));
    };
    const controller = new AbortController();
    const closed = () => controller.abort();
    res.on('close', closed);
    try {
      const origin = new URL(`http://${req.headers.host}`);
      if (!['127.0.0.1', 'localhost'].includes(origin.hostname) || origin.username || origin.password) return fail(403, 'Loopback Host required.');
      const url = new URL(req.url, origin);
      const endpoint = url.pathname.slice('/api/intent'.length);
      const read = req.method === 'GET' && (endpoint === '/health' || /^\/missions\/[a-zA-Z0-9_-]{1,80}\/events$/.test(endpoint));
      const write = req.method === 'POST' && (/^\/(retrieval|missions)$/.test(endpoint) || /^\/missions\/[a-zA-Z0-9_-]{1,80}\/(approve|cancel)$/.test(endpoint));
      if (url.search || !(read || write)) return fail(404, 'Unsupported intent endpoint.');
      if ((req.headers.origin && req.headers.origin !== origin.origin) || (write && (req.headers.origin !== origin.origin || req.headers['content-type']?.split(';')[0] !== 'application/json'))) return fail(403, 'Same-origin JSON requests required.');
      if (!tokenFile) return fail(503, 'Local intent backend is not configured. No message was sent.');
      const token = (await readFile(tokenFile, 'utf8')).trim();
      if (!token || /[\r\n]/.test(token)) return fail(503, 'Local intent authentication is unavailable.');
      let body;
      if (write) {
        const chunks = [];
        let size = 0;
        for await (const chunk of req) {
          size += chunk.length;
          if (size > 16384) return fail(413, 'Intent request exceeds 16 KiB.');
          chunks.push(chunk);
        }
        try { body = JSON.stringify(JSON.parse(Buffer.concat(chunks).toString())); }
        catch { return fail(400, 'Intent request must be valid JSON.'); }
      }
      const response = await fetch(new URL(`/api${endpoint}`, upstream), {
        method: req.method, body, redirect: 'manual',
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(endpoint.endsWith('/events') ? 300000 : 15000)]),
        headers: { Authorization: `Bearer ${token}`, Origin: origin.origin, Accept: endpoint.endsWith('/events') ? 'text/event-stream' : 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}) },
      });
      if (response.status >= 300 && response.status < 400) return fail(502, 'Intent backend redirects are forbidden.');
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json') && !(endpoint.endsWith('/events') && contentType.includes('text/event-stream'))) return fail(502, 'Intent backend returned an unsupported response format.');
      const retryAfter = response.headers.get('retry-after');
      res.writeHead(response.status, { 'Content-Type': contentType, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...(retryAfter && /^\d+$/.test(retryAfter) ? { 'Retry-After': retryAfter } : {}), ...(contentType.includes('text/event-stream') ? { 'X-Accel-Buffering': 'no' } : {}) });
      const stream = Readable.fromWeb(response.body);
      stream.on('error', () => res.destroy());
      stream.pipe(res);
    } catch (error) {
      if (!controller.signal.aborted && !res.headersSent) fail(503, error.name === 'TimeoutError' ? 'Local intent backend timed out.' : 'Local intent backend is unavailable.');
      else if (!res.writableEnded) res.destroy();
    }
  };
}
