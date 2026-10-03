export const ALLOWED_ORIGINS = Object.freeze([
  'https://yace19ai.com',
  'https://www.yace19ai.com',
  'https://prime-ai.fr',
  'https://www.prime-ai.fr',
  'https://amlazr.com',
  'https://www.amlazr.com',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  'http://127.0.0.1:5176',
  'http://127.0.0.1:5177',
  'http://127.0.0.1:3000',
  'http://192.168.1.80:5173',
  'http://192.168.1.80:5174',
  'http://192.168.1.80:5175',
  'http://192.168.1.80:5176',
  'http://192.168.1.80:5177',
  'http://192.168.1.80:3000',
  'https://localhost:5175',
  'https://192.168.1.80:5175',
  'https://localhost:5176',
  'https://192.168.1.80:5176',
]);

const allowedOriginSet = new Set(ALLOWED_ORIGINS);

export function isAllowedOrigin(origin) {
  return allowedOriginSet.has(origin || '');
}
