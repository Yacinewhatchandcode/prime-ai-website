# PrimeAI Remotion integration

## Honest visual-only playback

The original 34 MP4s contained digitally silent AAC tracks (mean/max -91 dB).
They are visual explainers, not narrated videos. Do not invent transcripts,
narration or soundtrack availability. New compositions contain no audio sources.
Use the shared player for every site video:

```jsx
import VisualExplainer from '../components/VisualExplainer';
import { useLanguage } from '../context/LanguageContext';

const { language } = useLanguage();
<VisualExplainer
  src={language === 'fr' ? '/prime_macro_fr.mp4' : '/prime_macro_en.mp4'}
  autoPlay loop
  style={{ width: '100%', display: 'block', borderRadius: '24px' }}
/>;
```

It enforces muted/inline playback, supplies keyboard-accessible play/pause and
seek plus supported fullscreen, and shows EN/FR visual-only disclosure. Native
audio/unmute controls are not exposed. On-screen text supplies the explanation;
the disclosure is not a fabricated transcript.

## Composition mapping

Each stem has `_en.mp4` and `_fr.mp4` outputs in `public/`.

| Output stem | Composition | Page | Identity |
|-------------|-------------|------|----------|
| `prime_macro` | MacroVisionV3 | / and /vision | Dark/gold, 22s |
| `prime_tech` | Technology | /technologie | Blue grid/cards, 1280x720, 47s |
| `prime_arch_specs` | ArchSpecs | /technologie | Light/gold |
| `prime_sync_protocol` | SyncProtocol | /technologie | Light/gold |
| `prime_ecosysteme` | Ecosysteme | /ecosysteme | Light/gold |
| `prime_sovereign` | SovereignAi | /sovereign-ai | Light/gold |
| `prime_enterprise` | Enterprise | /enterprise-ai-orchestration | Light/gold |
| `prime_multiagent` | MultiAgent | /multi-agent-systems | Dark |
| `prime_credentials` | Credentials | /credentials | Dark/gold |
| `prime_fleet` | FleetCommand | /fleet-command | Dark/purple |
| `prime_yace` | YaceAura | /yace-aura | Dark/gold |
| `prime_desktop` | PrimeDesktop | Product cards | Light/gold |
| `prime_mobile` | PrimeMobile | Product cards | Light/gold |
| `prime_cli` | PrimeCLI | Product cards | Light/gold |
| `prime_cloud` | PrimeCloud | Product cards | Light/gold |
| `prime_gram` | PrimeGram | Product cards | Light/gold |
| `prime_teleprompter` | PrimeTeleprompter | Product cards | Light/gold |

The original `prime_tech` source was absent from this checkout and from its
render mapping. `TechnologyComposition` is its tracked replacement, preserving
the blue-grid/card identity and duration while explaining actual local-first
capabilities. iMac/Pi are optional nodes, not assumed online. All static
dashboard videos are explicitly illustrative; they are not live fleet status.

Macro beats must call `useCurrentFrame()` **inside each Sequence child**.
Passing the parent's absolute frame makes later acts fade before they appear.
Transitions retain visible content instead of fading to empty backgrounds.
Rendering uses local font fallbacks without external font-service requests.

## Bounded local rendering and evidence

Restore only the existing locked renderer packages, with enough free disk:

```sh
npm ci --prefix remotion --no-audit --no-fund
df -h .
# From the website root; use the existing Playwright browser, not a new download:
REMOTION_BROWSER_EXECUTABLE="$(node --input-type=module -e 'import { chromium } from "playwright"; console.log(chromium.executablePath())')" \
  node remotion/scripts/render-all.mjs --only MacroVisionV3-EN,MacroVisionV3-FR,YaceAura-EN,YaceAura-FR,Technology-EN,Technology-FR,FleetCommand-EN,FleetCommand-FR,Credentials-EN,Credentials-FR
```

The renderer checks for at least 3 GiB before each composition, uses two
Chromium workers and a five-minute per-file deadline, rejects unknown IDs, and
atomically replaces the public file only after a successful render. A missing
existing browser or disk guard reports `RENDER_BLOCKED`; no automatic browser
downloads are allowed. Preserve successful outputs and report any pending files.

```sh
node scripts/qa-media-files.mjs before
# Render changed compositions, then:
node scripts/qa-media-files.mjs after
# Build/restart only the owned 4174 preview before actual browser playback:
node scripts/qa-media-ui.mjs
```

File QA records ffprobe codecs/dimensions/duration and the requested ffmpeg
signalstats measurement: 2 fps, 320px width, blank when YMAX <120, target <=10%.
Eight-frame contact sheets need visual inspection, not just a threshold.
Browser QA decodes/plays all public MP4s and exercises the actual shared player
on every video-bearing route in EN/FR at desktop/mobile sizes. It blocks external
requests and all mutations. JSON, signalstats, contact sheets, screenshots and
captions live under `qa-evidence/media-upgrade/`; this is bounded smoke/content
verification, not exhaustive product acceptance.
