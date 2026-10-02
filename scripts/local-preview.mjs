import http from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.mp4': 'video/mp4', '.webm': 'video/webm', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };
const loopback = url => url.protocol === 'http:' && ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname) && !url.username && !url.password;
const json = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
};
const fail = (res, status, code, message) => json(res, status, { error: { code, message } });

export async function createPreview({ directory = new URL('../dist/', import.meta.url), backend = 'http://127.0.0.1:8767', tokenFile, timeout = 8000 } = {}) {
  const upstream = new URL(backend);
  if (!loopback(upstream) || upstream.pathname !== '/' || upstream.search || upstream.hash) throw new Error('Backend must be a plain HTTP loopback origin');
  if (!tokenFile) throw new Error('LOCAL_FLEET_TOKEN_FILE is required');
  const root = await realpath(directory instanceof URL ? fileURLToPath(directory) : directory);
  const token = (await readFile(tokenFile, 'utf8')).trim();
  if (!token || /[\r\n]/.test(token)) throw new Error('Invalid local fleet token file');

  const server = http.createServer(async (req, res) => {
    try {
      const host = req.headers.host;
      const origin = new URL(`http://${host}`);
      if (!loopback(origin) || Number(origin.port) !== server.address().port) return fail(res, 403, 'HOST_DENIED', 'Loopback Host required');
      if (req.headers.origin && req.headers.origin !== origin.origin) return fail(res, 403, 'ORIGIN_DENIED', 'Same-origin requests required');
      const url = new URL(req.url, origin);
      if (url.pathname.startsWith('/api/')) {
        const endpoint = url.pathname.replace(/^\/api\/local-fleet/, '');
        const readAllowed = /^\/(health|status|missions|memory)$/.test(endpoint) || /^\/missions\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(endpoint);
        const writeAllowed = req.method === 'POST' && endpoint === '/missions';
        if (!url.pathname.startsWith('/api/local-fleet/') || url.search || !(req.method === 'GET' && readAllowed || writeAllowed)) {
          return fail(res, 404, 'API_NOT_ALLOWED', 'Unsupported local API request');
        }
        if (writeAllowed && (req.headers.origin !== origin.origin || req.headers['content-type']?.split(';')[0] !== 'application/json')) {
          return fail(res, 403, 'WRITE_DENIED', 'Same-origin JSON submissions required');
        }
        let body;
        if (writeAllowed) {
          const chunks = [];
          let size = 0;
          for await (const chunk of req) {
            size += chunk.length;
            if (size > 8192) return fail(res, 413, 'BODY_TOO_LARGE', 'Mission request exceeds 8192 bytes');
            chunks.push(chunk);
          }
          try { body = JSON.parse(Buffer.concat(chunks).toString()); }
          catch { return fail(res, 400, 'INVALID_JSON', 'Mission request must be JSON'); }
          if (!body || typeof body.goal !== 'string' || !body.goal.trim() || body.goal.length > 4000 || Object.keys(body).some(key => key !== 'goal')) {
            return fail(res, 400, 'INVALID_GOAL', 'Provide only a nonempty goal up to 4000 characters');
          }
          body = JSON.stringify({ goal: body.goal.trim() });
        }
        const response = await fetch(new URL(`/api${endpoint}`, upstream), {
          method: req.method, redirect: 'manual', signal: AbortSignal.timeout(timeout),
          headers: { Accept: 'application/json', ...(endpoint !== '/health' ? { Authorization: `Bearer ${token}` } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}) },
          body,
        });
        if (response.status >= 300 && response.status < 400) return fail(res, 502, 'BACKEND_REDIRECT', 'Backend redirects are forbidden');
        if (!response.headers.get('content-type')?.includes('application/json')) return fail(res, 502, 'BACKEND_FORMAT', 'Backend did not return JSON');
        const reader = response.body.getReader();
        const chunks = [];
        let size = 0;
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            size += value.length;
            if (size > 2 * 1024 * 1024) {
              await reader.cancel();
              return fail(res, 502, 'BACKEND_SIZE', 'Backend response exceeds local limit');
            }
            chunks.push(Buffer.from(value));
          }
        } finally { reader.releaseLock(); }
        const data = JSON.parse(Buffer.concat(chunks).toString());
        if (!data || (!Object.hasOwn(data, 'data') && !data.error)) return fail(res, 502, 'BACKEND_ENVELOPE', 'Invalid backend envelope');
        return json(res, response.status, data);
      }
      if (!['GET', 'HEAD'].includes(req.method)) return fail(res, 405, 'METHOD_DENIED', 'Read-only static server');
      let pathname;
      try { pathname = decodeURIComponent(url.pathname); }
      catch { return fail(res, 400, 'INVALID_PATH', 'Malformed path'); }
      if (pathname.includes('\0') || pathname.split('/').some(part => part.startsWith('.'))) return fail(res, 404, 'NOT_FOUND', 'Not found');
      let filename = path.join(root, pathname === '/' ? 'index.html' : pathname);
      try { filename = await realpath(filename); }
      catch (error) {
        if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR') throw error;
        if (path.extname(pathname)) return fail(res, 404, 'NOT_FOUND', 'Asset not found');
        filename = path.join(root, 'index.html');
      }
      if (!filename.startsWith(`${root}${path.sep}`)) return fail(res, 403, 'PATH_DENIED', 'Path outside build');
      const info = await stat(filename);
      if (!info.isFile()) return fail(res, 404, 'NOT_FOUND', 'Not a file');
      const headers = { 'Content-Type': mime[path.extname(filename)] || 'application/octet-stream', 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
      let start = 0;
      let end = info.size - 1;
      if (req.headers.range) {
        const match = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range);
        if (!match || Number(match[1]) >= info.size || (match[2] && Number(match[2]) < Number(match[1]))) {
          res.writeHead(416, { 'Content-Range': `bytes */${info.size}` });
          return res.end();
        }
        start = Number(match[1]);
        end = match[2] ? Math.min(Number(match[2]), end) : end;
        headers['Content-Range'] = `bytes ${start}-${end}/${info.size}`;
      }
      headers['Content-Length'] = end - start + 1;
      res.writeHead(req.headers.range ? 206 : 200, headers);
      if (req.method === 'HEAD') return res.end();
      const stream = createReadStream(filename, { start, end });
      stream.on('error', () => res.destroy());
      res.on('close', () => stream.destroy());
      stream.pipe(res);
    } catch (error) {
      if (!res.headersSent) fail(res, 502, 'LOCAL_SERVICE_UNAVAILABLE', error.name === 'TimeoutError' ? 'Local backend timed out' : 'Local service unavailable; check server configuration');
      else res.destroy();
    }
  });
  server.requestTimeout = 10000;
  server.headersTimeout = 10000;
  return server;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4174);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid PORT');
  const server = await createPreview({ backend: process.env.LOCAL_FLEET_URL, tokenFile: process.env.LOCAL_FLEET_TOKEN_FILE });
  server.listen(port, '127.0.0.1', () => console.log(`Local website and fleet proxy: http://127.0.0.1:${port}`));
}
