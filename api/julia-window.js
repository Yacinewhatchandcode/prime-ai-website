import { Buffer } from 'node:buffer';
import process from 'node:process';
import { createHash, createHmac, randomBytes, randomUUID } from 'node:crypto';
import { isAllowedOrigin } from '../packages/julia-runtime/src/origins.js';

const sites = new Set(['yace19ai', 'prime-ai', 'amlazr']);
const dailyClaims = globalThis.__primeJuliaDailyClaims ||= new Map();

function encode(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function makeToken({ secret, site, ip, ttl }) {
  const now = Math.floor(Date.now() / 1000);
  const subject = createHash('sha256').update(`${secret}:${ip}`).digest('hex');
  const header = encode({ alg: 'HS256', typ: 'JWT' });
  const payload = encode({
    iss: 'https://prime-ai.fr',
    aud: 'prime-ai-constellation',
    sub: subject,
    site,
    iat: now,
    exp: now + ttl,
    jti: randomUUID(),
  });
  const signingInput = `${header}.${payload}`;
  const signature = createHmac('sha256', secret).update(signingInput).digest('base64url');
  return { token: `${signingInput}.${signature}`, exp: now + ttl };
}

async function claimDailyWindow({ key, token, expiresAt }) {
  if (process.env.NODE_ENV !== 'production') {
    const existing = dailyClaims.get(key);
    if (existing && existing.expiresAt > Date.now()) return false;
    dailyClaims.set(key, { token, expiresAt });
    return true;
  }

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!redisUrl || !redisToken) throw new Error('Julia window storage is not configured');
  const response = await fetch(`${redisUrl.replace(/\/$/, '')}/set/${encodeURIComponent(key)}/${encodeURIComponent(token)}/EX/86400/NX`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${redisToken}` },
  });
  if (!response.ok) throw new Error(`Julia window storage returned ${response.status}`);
  const payload = await response.json();
  return payload.result === 'OK';
}

export default async function handler(req, res) {
  const origin = req.headers?.origin;
  if (origin && isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!origin && process.env.NODE_ENV === 'production') return res.status(403).json({ error: 'Origin is required' });
  if (origin && !isAllowedOrigin(origin)) return res.status(403).json({ error: 'Origin is not allowed' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const site = req.body?.site;
  if (!sites.has(site)) return res.status(400).json({ error: 'A supported site is required' });

  const secret = process.env.JULIA_WINDOW_SECRET ||
    (process.env.NODE_ENV === 'development' ? (globalThis.__primeJuliaDevSecret ||= randomBytes(32).toString('base64url')) : '');
  if (!secret || secret.length < 32) {
    return res.status(503).json({ error: 'Julia session issuer is not configured' });
  }
  const clientIp = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').toString().split(',')[0].trim();
  if (!clientIp) return res.status(400).json({ error: 'Client address could not be determined' });
  const useTestTtl = process.env.NODE_ENV === 'test' ||
    (process.env.NODE_ENV === 'development' && process.env.JULIA_WINDOW_ALLOW_TEST_TTL === 'true');
  const configuredTtl = Number.parseInt(process.env.JULIA_WINDOW_TTL_SECONDS || '300', 10);
  const ttl = useTestTtl
    ? Math.min(300, Math.max(1, Number.isFinite(configuredTtl) ? configuredTtl : 300))
    : 300;
  const { token, exp } = makeToken({ secret, site, ip: clientIp, ttl });
  const key = `julia-free-window:${createHash('sha256').update(`${secret}:${clientIp}`).digest('hex')}`;

  try {
    const claimed = await claimDailyWindow({ key, token, expiresAt: Date.now() + 24 * 60 * 60 * 1000 });
    if (!claimed) {
      return res.status(429).json({ error: 'This IP has already used its free Julia window within the last 24 hours' });
    }
    return res.status(200).json({ token, exp, ttl });
  } catch (error) {
    console.error('[Julia window issuer] Unable to issue a free window:', error.message);
    return res.status(503).json({ error: 'Julia session issuer is temporarily unavailable' });
  }
}
