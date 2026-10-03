# PRIME AI V2 — local website QA

## Isolated Pi tutorial integration

The official `@earendil-works/pi-coding-agent` 1.0.1 runtime is installed locally
under ignored `.tools/pi/`, not globally or in the production bundle. Its isolated
agent configuration uses the existing loopback Ollama `qwen3:8b`; no paid provider
or credentials were added. This local installation is not restored by `npm ci`.

`node scripts/pi-local.mjs check` verifies model discovery without inference.
`node scripts/pi-local.mjs review` runs a bounded, non-persisted read-only logo
review, with a 3 GiB disk guard and 120-second timeout. Extensions, project resource
approval and global context discovery are disabled; no bash/write/edit tools are
exposed. The launcher restricts the selected task, but is not an OS filesystem
sandbox. Generated answers still require verification: the first live check
confused the navy outline with the blue stroke. Pi is not a release controller,
does not change deployment approval policy and does not prove website publication.

`/convergence` displays a two-color progress pie based on ten equally weighted,
documented milestones. It is a dated evidence snapshot, not live agent telemetry,
elapsed effort or an ETA. Production publication and unconnected integrations
remain incomplete; update milestone evidence only after actual validation.
Intent HTTP 429 responses display `RATE_LIMITED` and the server's `Retry-After`
delay when supplied. The client never automatically retries approvals or streams.
The build emits directory index pages for the six local routes so GitHub Pages
can serve direct navigation without an API/rewrite server. Trailing slashes are
normalized by the route entry component.

## White PRIME-AI reference replica

The local white replica uses `public/prime-trinity.svg`: a sharp custom mark of
three interlocking equilateral triangles rotated by 40 degrees, forming nine
outer points, in blue, white and red. This is user-directed brand symbolism
inspired by the Bahá'í nine-point motif, not an official Bahá'í emblem or an
assertion of religious affiliation. The footer connects the user-provided
PRIME-AI, YACE19AI and AMLAZR domains; external links are not deployment evidence.
The logo does not change the resolution of the separate globe illustration.
Existing full-page image exports predate this small brand update.

The logo now opens color-linked personal avatar layers: red PRIME-AI, blue
YACE19AI, white AMLAZR. Local URLs `/replica?brand=prime`,
`/replica?brand=yace19ai` and `/replica?brand=amlazr` select the corresponding
profile. Selection also resolves the matching hostname if this implementation
is later installed there; this does not deploy to or change any public domain.
A raised CSS-3D ribbon sits mid-page, between augmented cognition and the ecosystem.
A single tap selects a color; a second tap within 450ms unfolds its meaning and
conversation inline below the ribbon, without a modal or scroll lock.
Enter/Space and the explicit Unfold layer button provide accessible
alternatives. The personal logo declaration comes directly from the user;
additional layer meanings are labelled design copy.

Voice is explicit, optional device-local browser text-to-speech: it starts only
if an English voice reports `localService`, and stops on dialog close or unmount.
No microphone is accessed, no speech autoplay occurs, and no introduction text
is submitted to inference. Julia retrieval is explicitly **not connected**:
the other Julia runtime owner confirmed its current embed is a scripted demo,
not a verified conversational/retrieval backend. No production issuer is called
and no Julia assets are copied from another checkout. The existing approved
local intent service remains available within each layer, but its source scope
is not represented as YACE19AI/AMLAZR knowledge.

Brand-layer changes are live on dev port 4186. Port 4174's previously built
version, source index and full-page image exports are not regenerated while disk
reserve is below 3 GiB.

The isolated reference implementation is the default **`/`** homepage and also
lives at **`/replica`**. Existing workspace navigation remains at **`/legacy/#/`**
and direct existing **`/#/...`** links. Open
**`/responsive-preview`** to see the same real page in simultaneous 1440px desktop
and 390px mobile iframe viewports. Controls support 1280/1024px desktop, 375px
mobile, and resetting both panes. Each pane scrolls independently. Existing
HashRouter routes and the gold experience are unchanged.

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 4186 --strictPort
# http://127.0.0.1:4186/responsive-preview
npm run build
npx eslint src/pages/ReplicaLanding.jsx src/pages/ResponsivePreview.jsx src/main.jsx scripts/capture-prime-reference.mjs scripts/qa-replica.mjs
QA_OUTPUT=/absolute/path/to/artifacts node scripts/qa-replica.mjs
```

Use a supervisor/tool-managed detached process to keep the local server running.
Do not stop other servers; choose a free port and set `QA_BASE_URL` accordingly.
This JavaScript project has no TypeScript configuration or typecheck script;
the production build and targeted ESLint checks validate the implementation.

**`/semantic-library`** provides local source-backed retrieval of all eight public
metadata keywords, all seven landing sections, and all nine foundation/platform
details: 24 records in 12 concept groups. Curated aliases (including French terms)
connect related concepts. It is deterministic keyword retrieval, not embeddings,
AI inference, or live private fleet memory. Each result includes source type and
timestamp; production evidence includes origin and snapshot SHA-256.

**`/replica-image`** presents downloadable complete 2× desktop/mobile PNG captures
and a tailored full-page paired composition. Both pages are complete, with their
natural proportions preserved. These are exact captures of the implementation,
not a promise of pixel-identical source artwork. The live page never uses the
full-page exports as its layout.

```sh
# Run while the isolated dev server is available:
node scripts/index-replica-content.mjs /path/to/production-reference
npm run test:replica
npm run export:replica
QA_BASE_URL=http://127.0.0.1:4174 QA_OUTPUT=/path/to/artifacts npm run qa:replica
```

Image composition uses Pillow (`ImageFont.load_default(size=...)` requires a recent
Pillow). Generated local data and images live under `public/replica-data/` and
`public/replica-exports/`. Regenerate them after changing the landing content.
The legacy app is lazy-loaded, avoiding loading its entire workspace bundle for
the white homepage.

The paired preview also includes a compact **written intent avatar**. Its spectrum
is explicitly decorative and reacts to the draft text locally, not to sensors,
agent activity or model inference. Typing retrieval is opt-in, debounced/cancellable,
and searches the local source index without sending draft text. There is no
automatic personal profiling, speech generation or recursive model training.

The optional local intent service uses server-side authentication through
`/api/intent/*` on both the Vite dev server and `preview:local`. Set
`LOCAL_INTENT_URL=http://127.0.0.1:4191` and `LOCAL_INTENT_TOKEN_FILE` to the
service-owned token path; never put its contents in client code or Vite-prefixed
environment variables. Missing service/configuration is displayed explicitly.
Only explicit Send creates a compiled, awaiting-approval mission. Read-only
execution/local inference require a second explicit approval. Actual SSE mission
events and retrieved facts are separate from generated inference; the backend
delivers completed answers, **not token deltas**. Stop requests backend cancellation.
ByteBot viewing, desktop mutations and VPS access stay disabled without an
authorized adapter. No desktop stream or pointer is simulated.

```sh
node --test scripts/intent-client.test.mjs scripts/intent-proxy.test.mjs
QA_OUTPUT=/path/to/artifacts node scripts/qa-intent-chat.mjs
# Optional deliberate read-only backend mission, only after service is ready:
QA_APPROVE_READ_ONLY=1 QA_OUTPUT=/path/to/artifacts node scripts/qa-intent-chat.mjs
```

Port 4174 was handed off by its previous owning QA session. The upgraded server
uses the existing `preview:local` server so authorized loopback fleet calls remain
proxied without exposing the token in the browser. Keep the coordinator-owned token
file unchanged and pass its authorized path, not the token itself:

```sh
npm run build
LOCAL_FLEET_URL=http://127.0.0.1:8767 \
  LOCAL_FLEET_TOKEN_FILE=/authorized/path/to/api-token \
  PORT=4174 npm run preview:local
```

The white page has accessible mobile navigation, EN/FR copy, native modal details,
local overview/platform videos, and a deliberately **local-only** newsletter demo.
No signup email is sent or persisted, no booking is made, and no fleet is deployed.
The cognitive HUD and agent constellation are clearly illustrative, not live data.

Artwork in `public/replica-art/` consists of illustration-only crops from the
supplied design reference, not a whole-page screenshot. Every text element,
card, form and navigation control is HTML. `provenance.json` records crop bounds
and the resolution limitation: the original standalone high-resolution renders
were not found in the repo or public production bundle. Existing local videos
are reused. To reproduce the crops, use Pillow and
`python3 scripts/extract-prime-art.py /path/to/reference.png public/replica-art`.

`node scripts/capture-prime-reference.mjs /absolute/path/to/artifacts` records
the production HTML, its directly linked public JS/CSS, and up to two referenced
images, with origin, UTC timestamps and SHA-256 hashes. This bounded same-site
capture does not execute the bundle, call APIs, submit forms, authenticate,
crawl unrelated pages, or deploy. Keep the captured bundle in a private local
artifact directory rather than serving it from `public/`.

The website uses React, Vite and **HashRouter**. The staging source declares 31 routes,
including ten country nodes. Navigation links alone are not the route inventory.
`npm run qa:routes` deterministically extracts every explicit route from `src/App.jsx`,
writing `qa/routes.json` (component inventory) and `qa/paths.json` (array of `/#/...`
paths compatible with an external QA bootstrap). Dynamic routes require explicit
examples before the inventory generator accepts them.

## Isolated local preview

Run from the isolated worktree, never the primary checkout:

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 4174 --strictPort
```

Strict port selection fails rather than replacing another service. Leave an existing
4173 server untouched. The preview serves `dist`; finish rebuilding before running
QA, otherwise requests can race asset replacement. A supervisor/tool-managed detached
process is needed to keep the server available after the launching session exits.

## Reproducible Chromium page matrix

```sh
npm run qa:routes
# If Chromium is missing, install it explicitly:
npx playwright install chromium
QA_BASE_URL=http://127.0.0.1:4174 QA_OUTPUT=qa-evidence/final-en \
  QA_STATIC_FALLBACK=1 npm run qa:pages
QA_BASE_URL=http://127.0.0.1:4174 QA_OUTPUT=qa-evidence/final-fr \
  QA_LANGUAGE=fr npm run qa:pages
```

Default coverage is all 31 routes at 1440x900 desktop and 390x844 mobile, in English.
`QA_LANGUAGE=fr` verifies translated pages and French media. For targeted regressions,
set `QA_ROUTES=/memory,/credentials,/revenue`. Detected issues cause a nonzero exit.

Only HTTP loopback targets are accepted. External origins, backend requests and all
mutations are blocked by default; **no successful API mocks are supplied**.
`QA_STATIC_FALLBACK=1` additionally permits same-origin read-only API requests after
verifying that the isolated preview returns HTML for `/api/state`. This unmocked
missing-backend profile exercises the original Vite HTML-fallback regression.
It is not a test of working backend integrations. External requests remain blocked.

Each run writes durable `report.json`, `routes.json`, `captions.json` and full-page
PNG screenshots to its output directory (ignored by Git). The report records
console/page errors, failed same-origin resources, blocked integrations, document
headings and main landmarks, unnamed controls, viewport overflow, decoded image/video
dimensions and media errors, keyboard focus, skip links, keyboard dropdowns, mobile
menu focus containment/Escape and safe home navigation. Normal `ERR_ABORTED` media
range cancellations are recorded separately, not treated as failed playback.

Coverage is bounded, **not exhaustive acceptance**: it does not submit forms, deploy,
connect wallets, initiate transactions, crawl external links, verify fleet telemetry,
or replace a manual screen-reader/contrast/browser/device audit. External Google fonts
are blocked, so screenshots use fallback fonts. Media is observed within a short
loading window; decoding does not prove full playback or caption availability.
Curiosity exists in a separate uncommitted localhost version reported by the parent
session, but is absent from this staging source and is not claimed as retained here.
Existing public media is preserved; no newer archive/retrieval is assumed integrated.

Backoffice, revenue and memory panels report missing/invalid backend JSON explicitly.
Set `VITE_API_BASE` **before building** to connect an authorized local backend.
Illustrative fleet metrics, example workflow output and simulated topology are labeled
as previews rather than verified live status.

## Actual localhost advisory fleet

`/#/fleet-command` now reads real readiness, persisted missions and filesystem memory
counts from the local multi-role backend. A submitted goal queues sequential planner,
analyst and reviewer inference. Completed outputs are advisory, not automatic tool
execution, deployment, research or acceptance evidence. Missing backend/invalid JSON,
queue rejection, role failures and stale polling data are explicit in the panel.
Private memory text is not exposed; the API supplies counts and mission memory IDs.

After building, serve this worktree with the native same-origin preview/proxy:

```sh
LOCAL_FLEET_URL=http://127.0.0.1:8767 \
LOCAL_FLEET_TOKEN_FILE=/absolute/server-only/api-token \
PORT=4174 npm run preview:local
```

The token is loaded by the server, never embedded in the build or sent to the browser.
Only GET health/status/missions/UUID mission/memory and POST missions are proxied under
`/api/local-fleet/`. Writes require matching Origin and JSON; goal limit is 4000
characters/8192-byte request. Redirects, public upstreams, other API routes and oversized
responses are rejected; upstream timeout is eight seconds. The server binds only to
127.0.0.1 and serves video byte ranges. Existing backend integrations are not remapped
to this advisory API. Restart/resume execution is not exposed by this UI.

## Free portable workspace and offline app

Open `http://127.0.0.1:4174/#/ecosysteme` after building and starting the
local preview above. Create/edit goals, tasks and task status, and save notes.
Wait for **Saved in this browser** before reloading. No account, paid API or
cloud is required. Export a `.primeai.json` download, manually transfer it to
another device/browser, choose Import, review the merge, then Confirm merge.
The receiver keeps its own browser identity. This is manual file transfer,
not automatic synchronization. Private cloud is explicitly not configured.

The v1 JSON contains `format: "prime-ai-data"`, `version: 1`, `createdAt`,
`device`, `workspace` (notes, goals, tasks and settings), advisory `missions`,
and a canonical SHA-256 `checksum`. Snapshots include a goal ID, source
`local-fleet`, the complete mission record and its hash. Unknown fields/versions,
malformed dates, duplicate IDs, missing references, corrupt hashes and oversized
files are rejected, not partially imported. Maximum file size is 2 MiB UTF-8;
limits are 100 goals, 500 tasks, 100 snapshots, 64,000-character notes,
4,000-character goal titles, 2,000-character task titles and
256,000-character role outputs. Exports use compact JSON.
Optional backend `skillRetrieval` metadata is preserved verbatim, limited to
8 KiB, three selected definitions and twenty provenance entries per definition.
Approved local-root and unverified supplied-index provenance and bounded retrieval
failure records are supported; definitions must remain non-executable.

Merge is deterministic by ID and canonical UTC `updatedAt`: latest timestamp
wins, with canonical-record ordering breaking equal timestamps. Accurate device
clocks matter. Differing records are shown as conflicts with both revisions and
the winning side; conflict details can be downloaded. Keep original exports to
retain losing revisions. The v1 UI has no deletion/tombstones. Unsaved drafts
block import/export; merges exceeding limits fail without discarding records.

Browser IndexedDB is primary; unavailable IndexedDB permits a size-bounded
localStorage fallback. Quota/write failures and stale-tab overwrites are explicit;
reload before retrying from another tab. Private browsing, storage clearing and
browser eviction can erase local data, so keep exports. Files and stored notes
are **not encrypted**. Checksums detect corruption, not authorship or authenticity;
imported snapshots are not authenticated live fleet telemetry.

On desktop, a reachable optional local backend enables Run advisory mission.
Queued/progress/terminal snapshots persist and can be refreshed. A terminal
completed snapshot must include all three role outputs and a memory ID.
Unreachable backend/offline/mobile shows an explicit unavailable status; the
free workspace remains functional. Mission polling is bounded; a timeout does
not cancel the backend job, and Refresh snapshot retrieves its eventual result.
There is no autonomous tool execution or deployment.

The production build includes a manifest and existing-logo-derived install icons.
Its versioned service worker caches only the app shell (HTML, emitted JS/CSS,
manifest/icons), cleans old shell caches, and falls back to cached HTML offline.
It never caches `/api/`, external requests, media or Range requests. Videos and
live integrations require connectivity. A successful initial load and service
worker activation are required; installation requires HTTPS or loopback.
The loopback-only preview cannot be reached directly from a physical phone;
Chromium mobile emulation is not proof of physical-device installation.

```sh
npm run test:data
npm run qa:data
# Opt in to one actual, bounded advisory mission on desktop:
QA_RUN_ADVISORY=1 npm run qa:data
```

`qa:data` uses real Chromium at 1440x900 and 390x844, independent storage profiles,
actual downloads/imports, merge conflicts, checksum rejection, offline editing
and reload, and overflow/page-error checks. External requests and mutations
other than the opt-in mission are blocked. Evidence is written to
`qa-evidence/prime-data/report.json`, `progress.json` and captioned viewport
screenshots, alongside the actual exported and merged `.primeai.json` files.
These workflow smoke checks are not exhaustive acceptance.

## Visual explainer media

All original 34 MP4s had digitally silent AAC tracks (mean/max -91 dB).
The site now presents them as muted visual explainers with visible EN/FR
disclosure and on-screen explanatory text, not invented narration.
`VisualExplainer` provides play/pause, keyboard seek and supported fullscreen,
without native audio/unmute controls. Videos remain intentionally excluded from
offline shell caching. Static dashboard animations are illustrative, not live
fleet telemetry; iMac/Pi hardware is optional, not assumed active.

The MacroVisionV3 Sequence clock bug is fixed at its source. The original tech
video source was absent; a tracked 47-second blue-grid/card composition now
explains the actual local-first workflow. See `remotion/INTEGRATION.md` for
locked dependency restoration, existing-browser rendering, disk guards and the
exact composition/output mapping. No website runtime dependency was added.

```sh
node scripts/qa-media-files.mjs before
# After rendering only changed files and rebuilding/restarting the local preview:
npm run qa:media
```

Evidence is under `qa-evidence/media-upgrade/`: codec/duration and blank-frame
metrics before/after, contact sheets, and actual Chromium playback/UI results.
The numeric blank-frame threshold does not replace inspecting the video content.

```sh
npm run test:proxy
npm run test:fleet-ui
QA_LOCAL_FLEET=1 QA_OUTPUT=qa-evidence/fleet-pages npm run qa:pages
# Observe an existing actual mission without creating another:
QA_MISSION_ID=<uuid> npm run qa:fleet
# Explicitly authorize a single actual local advisory mission:
QA_CREATE_MISSION=1 npm run qa:fleet
```

Proxy tests and `test:fleet-ui` use isolated localhost contract fixtures, clearly marked
synthetic. `qa:fleet` does not mock API responses: it captures actual terminal role
outputs, errors, memory before/after, and desktop/mobile reload evidence; a failed
mission fails QA. Creation is opt-in and submits only one goal. `qa:pages` with
`QA_LOCAL_FLEET=1` permits real local-fleet GETs but still blocks all mutations and
external requests. Use this profile, not `QA_STATIC_FALLBACK`, on the native proxy.

## Sovereign Gold interface

All 31 routes share the black/gold 3D shell, concise bilingual route summaries,
accessible six-item navigation, gold cards and a chapter-based MP4 reel.
Full original screens remain available through **Original preview**, loaded
only when opened. The actual free workspace and optional real advisory missions
remain directly usable on Ecosysteme and FleetCommand; mission history and full
outputs use progressive disclosure without truncating stored records.

Exact tokens live in `src/styles/sovereign-gold-tokens.css`. Readable muted text
blends the prescribed muted token with white to avoid low contrast. Pointer tilt
is transform-only and bounded to eight degrees; reduced motion disables automatic
scene/reveal motion and video autoplay. Players lazy-load, remain muted/inline,
pause outside the viewport and expose keyboard controls. External fonts are not
required.

`npm run qa:gold` checks real rendered structure/motion/media and compares 124
before/after word counts. `qa:pages` supplies the separate full route matrix;
`qa:data` checks transfer and offline persistence. Evidence distinguishes deferred
media from failed loading; all public MP4s are independently decoded by
`scripts/qa-media-ui.mjs`. Smoke coverage is not exhaustive acceptance.
Manual media controls use a deterministic reduced-motion QA profile; viewport
autoplay and explicit reduced-motion playback are checked separately by
`qa:gold`, including tablet navigation. Cancelled Range requests are recorded
separately from HTTP failures and media decoding errors.

See [DEPLOY.md](DEPLOY.md) for human-gated GitHub Pages preparation. These QA
commands do not push or deploy.
