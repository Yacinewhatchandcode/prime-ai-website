import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { isAllowedOrigin } from '../packages/julia-runtime/src/origins.js';

const embedPath = resolve(process.cwd(), 'public/julia/embed.js');
let embedAsset;

export default async function handler(req, res) {
  const origin = req.headers?.origin;
  res.setHeader('Vary', 'Origin');
  res.setHeader('Cache-Control', 'public, max-age=300, must-revalidate');
  if (origin && isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (origin && !isAllowedOrigin(origin)) return res.status(403).json({ error: 'Origin is not allowed' });
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!['GET', 'HEAD'].includes(req.method)) return res.status(405).json({ error: 'Method not allowed' });

  try {
    embedAsset ||= await readFile(embedPath);
    res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
    res.setHeader('Content-Length', embedAsset.length);
    return req.method === 'HEAD' ? res.status(200).end() : res.status(200).send(embedAsset);
  } catch (error) {
    console.error('[Julia embed] Failed to read the built runtime:', error.message);
    return res.status(500).json({ error: 'Julia runtime is unavailable' });
  }
}
