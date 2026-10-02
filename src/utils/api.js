/**
 * PRIME-AI API Configuration
 * Auto-detects environment — works on prime-ai.fr AND localhost dev
 */

const isDev = import.meta.env.DEV || window.location.hostname === 'localhost';

/**
 * API base URL — points to local fleet in dev, same-origin API in prod.
 * Override via:  VITE_API_BASE=https://api.prime-ai.fr in .env
 */
export const API_BASE = import.meta.env.VITE_API_BASE
  || (isDev ? (import.meta.env.VITE_API_BASE || 'http://localhost:5000') : '');

export async function requestJSON(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    signal: options.signal || AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`Backend ${path}: HTTP ${response.status}`);
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error(`Backend ${path} did not return JSON. Configure VITE_API_BASE for the local backend.`);
  }
  return response.json();
}

/**
 * Safe fetch wrapper — never throws on network errors.
 */
export async function apiFetch(path, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default API_BASE;
