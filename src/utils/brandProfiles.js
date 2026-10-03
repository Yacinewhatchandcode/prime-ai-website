export const brandProfiles = [
  {
    id: 'prime', name: 'PRIME-AI', color: 'Red', accent: '#c93347', domain: 'prime-ai.fr',
    url: 'https://prime-ai.fr', umbrella: 'https://prime-ai.com',
    meaning: 'Red is the PRIME-AI layer of your shared constellation. It connects the infrastructure and orchestration behind your vision.',
  },
  {
    id: 'yace19ai', name: 'YACE19AI', color: 'Blue', accent: '#1461cd', domain: 'yace19ai.com',
    url: 'https://yace19ai.com',
    meaning: 'Blue is the YACE19AI layer of your shared constellation. It opens a distinct space for the same personal identity and vision.',
  },
  {
    id: 'amlazr', name: 'AMLAZR', color: 'White', accent: '#53627d', domain: 'amlazr.com',
    url: 'https://amlazr.com',
    meaning: 'White is the AMLAZR layer of your shared constellation. Its visible outline preserves the identity on a white background.',
  },
];

export function resolveBrand(location) {
  const selected = new URLSearchParams(location.search).get('brand');
  const hostname = location.hostname.toLowerCase().replace(/^www\./, '');
  return brandProfiles.find(profile => profile.id === selected)
    || brandProfiles.find(profile => profile.domain === hostname || (profile.umbrella && new URL(profile.umbrella).hostname === hostname))
    || brandProfiles[0];
}

export const personalLogoStatement = 'This is my official logo. It represents me and definitely represents my vision.';
