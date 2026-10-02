# PRIME AI V2 — local website QA

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
