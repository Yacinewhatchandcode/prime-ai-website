# Production preparation — hosting verification required

The user identifies `prime-ai.fr` production hosting as Hostinger. The older
GitHub Pages procedure below is historical, not a verified current deployment
target or registrar record. Confirm each domain's hosting, document root and
release/rollback procedure before publication. The live site is the old version;
the latest local replica has not been deployed.

The current source preview is on port 4186. Port 4174 serves an earlier build.
Rebuilding is paused while free disk space remains below the 3 GiB reserve.
The three-domain Julia retrieval runtime is not connected, and localhost intent
proxies are not public production adapters. Mobile Chromium checks do not
establish real-device iPhone/Safari acceptance or complete security assurance.

## Build and verify locally

Use the repository's existing locked dependencies. Do not restore dependencies
unless a validation command reports a missing package.

```sh
npm run qa:routes
npm run test:data
npm run test:proxy
npm run build
npm run test:fleet-ui
```

The generated `dist/` must contain `index.html`, hashed `assets/`, all public
MP4s, `manifest.webmanifest`, `sw.js`, icons, `CNAME` containing exactly
`prime-ai.fr`, and `.nojekyll`. HashRouter keeps all 31 application routes under
`/#/…`; no server-side route rewrites are required. The build targets the domain
root, not a GitHub repository subpath.

Start the isolated loopback preview on an unused port, keeping any existing
4173 service untouched:

```sh
PORT=4174 npm run preview:local
```

For optional actual desktop advisory inference, also supply
`LOCAL_FLEET_URL=http://127.0.0.1:8767` and `LOCAL_FLEET_TOKEN_FILE` pointing at
the parent backend's token file. The token is injected only by this local Node
server. Never copy the token or filesystem backend data into `dist/` or Git.

Run the browser evidence pipeline against this local preview:

```sh
npm run qa:gold
npm run qa:data
node scripts/qa-media-ui.mjs
QA_LOCAL_FLEET=1 QA_LANGUAGE=en QA_OUTPUT=qa-evidence/gold-en npm run qa:pages
QA_LOCAL_FLEET=1 QA_LANGUAGE=fr QA_OUTPUT=qa-evidence/gold-fr npm run qa:pages
```

Reports and captioned screenshots are in `qa-evidence/`. These bounded Chromium
smoke tests are not exhaustive acceptance, real-device Safari testing, backend
execution verification, or a production availability check.

## Human-gated publication

Only after a separate explicit deployment approval, publish **the contents of
`dist/`** to the repository's `gh-pages` branch with the guarded
`prime-ai.fr release` workflow (`.github/workflows/prime-ai-release.yml`; see
[docs/STATIC_RELEASE.md](docs/STATIC_RELEASE.md)). First dry-run an approved
immutable `main` SHA to build, validate and hash an immutable artifact. Publish
requires that successful dry-run's run ID, artifact ID and reviewed tree digest;
it downloads those exact bytes without rebuilding, waits for the
`prime-ai-production` Environment approval (reviewers by default, or the separately enabled
and explicitly artifact-bound `single-owner/v1` policy documented in the release contract), saves a rollback tag and
fast-forwards `gh-pages` without force-pushing. Do not use the legacy
force-push `GOLIVEPRIMEAI.cmd`. Do not publish the source checkout, local preview
server, tokens, mission storage, or QA exports. No Vercel/Netlify configuration
is needed. Preserve `CNAME` and `.nojekyll` on that branch.

The owner must independently verify repository Pages settings, HTTPS, and
the actual DNS provider against the selected host's documented domain records; this task
did not query or change production/DNS. A fresh browser visit installs the
versioned offline app shell; cache activation removes older shell caches.
Existing open tabs use their already-loaded version until reload. APIs, videos
and media Range requests are deliberately not cached.

The free browser workspace needs no cloud, account or paid API. Cross-device
sync means manual `.primeai.json` export/import, not automatic synchronization.
GitHub Pages cannot run the native local fleet proxy: advisory inference works
only through a separately started localhost preview/backend. Imported mission
snapshots are historical advisory data, not authenticated live telemetry.
