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
