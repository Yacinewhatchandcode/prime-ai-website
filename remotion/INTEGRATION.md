# PrimeAI Remotion — Integration Guide

## Video-to-Page Mapping

Each rendered video corresponds to a page on prime-ai.fr.  
Import the `<video>` element using the language context to select the correct file.

### How existing videos are integrated (reference: Vision.jsx)

```jsx
import { useLanguage } from '../context/LanguageContext';

// Inside your component:
const { language } = useLanguage();

<video
  src={language === 'fr' ? '/prime_macro_fr.mp4' : '/prime_macro_en.mp4'}
  controls
  autoPlay
  muted
  loop
  style={{ width: '100%', display: 'block', borderRadius: '24px' }}
/>
```

---

## Page Integration Snippets

### 1. `/ecosysteme` — Ecosysteme.jsx

```jsx
<video
  src={language === 'fr' ? '/prime_ecosysteme_fr.mp4' : '/prime_ecosysteme_en.mp4'}
  autoPlay muted loop playsInline
  style={{
    width: '100%', maxWidth: '900px', borderRadius: '24px',
    boxShadow: '0 20px 50px rgba(198, 161, 90, 0.12)',
    border: '1px solid rgba(198, 161, 90, 0.2)',
  }}
/>
```

### 2. `/sovereign-ai` — SovereignAi.jsx

```jsx
<video
  src={language === 'fr' ? '/prime_sovereign_fr.mp4' : '/prime_sovereign_en.mp4'}
  autoPlay muted loop playsInline
  style={{
    width: '100%', borderRadius: '16px',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  }}
/>
```

### 3. `/multi-agent-systems` — MultiAgentSystems.jsx

```jsx
<video
  src={language === 'fr' ? '/prime_multiagent_fr.mp4' : '/prime_multiagent_en.mp4'}
  autoPlay muted loop playsInline
  style={{
    width: '100%', borderRadius: '16px',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  }}
/>
```

### 4. `/enterprise-ai-orchestration` — EnterpriseAiOrchestration.jsx

```jsx
<video
  src={language === 'fr' ? '/prime_enterprise_fr.mp4' : '/prime_enterprise_en.mp4'}
  autoPlay muted loop playsInline
  style={{
    width: '100%', maxWidth: '900px', borderRadius: '24px',
    boxShadow: '0 20px 50px rgba(198, 161, 90, 0.12)',
    border: '1px solid rgba(198, 161, 90, 0.2)',
  }}
/>
```

### 5. `/credentials` — Credentials.jsx

```jsx
<video
  src={language === 'fr' ? '/prime_credentials_fr.mp4' : '/prime_credentials_en.mp4'}
  autoPlay muted loop playsInline
  style={{
    width: '100%', borderRadius: '16px',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  }}
/>
```

### 6. `/fleet-command` — FleetCommand.jsx

```jsx
<video
  src={language === 'fr' ? '/prime_fleet_fr.mp4' : '/prime_fleet_en.mp4'}
  autoPlay muted loop playsInline
  style={{
    width: '100%', borderRadius: '16px',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  }}
/>
```

### 7. `/yace-aura` — YaceAura.jsx

```jsx
<video
  src={language === 'fr' ? '/prime_yace_fr.mp4' : '/prime_yace_en.mp4'}
  autoPlay muted loop playsInline
  style={{
    width: '100%', borderRadius: '16px',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  }}
/>
```

---

## File Inventory

After rendering, these files will be placed in `public/`:

| File | Page | Lang | Theme |
|------|------|------|-------|
| `prime_ecosysteme_en.mp4` | /ecosysteme | EN | Light |
| `prime_ecosysteme_fr.mp4` | /ecosysteme | FR | Light |
| `prime_sovereign_en.mp4` | /sovereign-ai | EN | Light |
| `prime_sovereign_fr.mp4` | /sovereign-ai | FR | Light |
| `prime_enterprise_en.mp4` | /enterprise-ai-orchestration | EN | Light |
| `prime_enterprise_fr.mp4` | /enterprise-ai-orchestration | FR | Light |
| `prime_multiagent_en.mp4` | /multi-agent-systems | EN | Dark |
| `prime_multiagent_fr.mp4` | /multi-agent-systems | FR | Dark |
| `prime_credentials_en.mp4` | /credentials | EN | Dark |
| `prime_credentials_fr.mp4` | /credentials | FR | Dark |
| `prime_fleet_en.mp4` | /fleet-command | EN | Dark |
| `prime_fleet_fr.mp4` | /fleet-command | FR | Dark |
| `prime_yace_en.mp4` | /yace-aura | EN | Dark |
| `prime_yace_fr.mp4` | /yace-aura | FR | Dark |

---

## Quick Start

```bash
cd remotion
npm install
npx remotion studio          # Preview in browser
node scripts/render-all.mjs  # Render all 14 videos
```
