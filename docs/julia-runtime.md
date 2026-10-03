# Julia runtime

The embeddable ES module is generated from `packages/julia-runtime/src/index.js` at `/julia/embed.js`; the optimized GLB and portrait fallback are served at `/julia/julia.glb` and `/julia/julia.png`. The 3D renderer, model, and microphone permissions are lazy: the GLB is fetched only after a visitor opens Julia. Low-memory devices and WebGL failures use the portrait fallback.

## Embed contract

```html
<script type="module" src="https://prime-ai.fr/julia/embed.js"></script>
<script type="module">
  const waitForPrimeJulia = () => {
    if (!window.PrimeJulia) return window.setTimeout(waitForPrimeJulia, 20);
    const julia = window.PrimeJulia.mount({
      site: 'yace19ai', // 'prime-ai' | 'amlazr'
      tools: {
        // Optional named handlers; only the documented whitelist is accepted.
        navigate: async ({ path }) => router.navigate(path),
        scrollTo: async ({ selector }) => document.querySelector(selector)?.scrollIntoView(),
      },
    });
    const constellation = window.PrimeJulia.mountConstellation({ site: 'yace19ai' });
    window.addEventListener('pagehide', () => {
      julia.unmount();
      constellation.unmount();
    }, { once: true });
  };
  waitForPrimeJulia();
</script>
```

The package entry is `@prime-ai/julia-runtime` (`mount`, `mountConstellation`). `mount({ site, container?, tools?, windowEndpoint? })` returns `root`, `getState()`, `getSession()`, `runTool(name, args)`, `handoff(targetWindow, exactAllowedOrigin)`, `open()` and `unmount()`. Its state events are dispatched as `prime-julia-state` with `detail.state`. State names are `idle`, `listening`, `thinking`, `speaking`, `working`, `success` and `error`.

The only tool names are `navigate`, `scrollTo`, `highlight`, `click`, `fill`, `openConstellation` and `switchSite`. Arguments: `navigate({ path })` accepts a same-site absolute path; `scrollTo({ selector })` and `highlight({ selector })` act on a page element; `click({ selector })` acts on a page element and prompts before likely destructive actions; `fill({ selector, value })` fills an enabled form control; `openConstellation({})` opens the shared drawer; `switchSite({ site })` accepts one of the three site IDs. Site integrations may provide async handlers under those exact names; the runtime exposes no general-purpose script or arbitrary URL execution tool. Agent Mode always shows a Stop button.

## Free five-minute window

The browser requests `POST /api/julia-window` with `{ "site": "prime-ai" | "yace19ai" | "amlazr" }`. A successful response is `{ "token": "<HMAC JWT>", "exp": <epoch-seconds>, "ttl": 300 }`. The issuer signs a 300-second token and reserves one window per hashed client IP for 24 hours in Upstash Redis. Configure `JULIA_WINDOW_SECRET` with at least 32 characters and `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` in the Vercel project. Missing production configuration returns 503. No session token is stored in localStorage; the localStorage expiry marker is for UX only. `packages/julia-runtime/src/origins.js` is the single exact-origin allow-list used by the embed runtime, local Vite server, issuer and production embed handler. It includes AMLAZR production (`https://amlazr.com` and `https://www.amlazr.com`) and its LAN dev origin (`http://192.168.1.80:3000`); unknown origins receive no ACAO header and are rejected. CORS does not use wildcard origins.

On Vercel, `/julia/embed.js` rewrites to `api/julia-embed.js`, which serves the built public bundle and echoes only the requesting origin when it exactly matches the shared allow-list. The function includes `public/julia/embed.js` in its deployment bundle.

Vite development binds to `0.0.0.0:5174`; if that port is occupied, set `VITE_PORT=5176` and use `http://192.168.1.80:5176` from the same Wi-Fi network. For browser microphone access, run `VITE_PORT=5176 npm run dev:https` and accept its local self-signed certificate, or use an HTTPS tunnel. Playwright sets a short three-second issuer TTL only in the local test server.

## Build and verify

```sh
npm run julia:build
npm test
npx playwright test
```
