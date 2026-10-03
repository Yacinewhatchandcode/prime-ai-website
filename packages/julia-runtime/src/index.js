import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { isAllowedOrigin } from './origins.js';

const SITES = {
  yace19ai: {
    label: 'YACE19AI',
    role: 'Research, models and world models',
    url: 'https://yace19ai.com',
    color: '#5686ff',
    links: [['Research', '/research'], ['Models', '/models'], ['Philosophy', '/philosophy']],
  },
  'prime-ai': {
    label: 'PRIME-AI',
    role: 'Sovereign cognitive infrastructure',
    url: 'https://prime-ai.fr',
    color: '#9b7aff',
    links: [['Infrastructure', '/'], ['Architecture', '/technologie'], ['Sovereignty', '/sovereign-ai']],
  },
  amlazr: {
    label: 'AMLAZR',
    role: 'Execution intelligence',
    url: 'https://amlazr.com',
    color: '#ff5b67',
    links: [['Overview', '/'], ['Agents', '/agents'], ['Workflows', '/workflows']],
  },
  linkedin: {
    label: 'LinkedIn',
    role: 'Network',
    url: 'https://www.linkedin.com/in/yacine-benhamou-b26386124/',
    color: '#0a66c2',
    links: [['Profile', '/in/yacine-benhamou-b26386124/']],
  },
};

const VALID_SITES = new Set(['yace19ai', 'prime-ai', 'amlazr']);
const STATE_NAMES = ['idle', 'listening', 'thinking', 'speaking', 'working', 'success', 'error'];
const DEFAULT_WINDOW_ENDPOINT = 'https://prime-ai.fr/api/julia-window';

const styleText = `
  :host{all:initial}*{box-sizing:border-box}
  .julia-launcher{position:fixed;z-index:2147483000;right:max(18px,env(safe-area-inset-right));bottom:max(20px,env(safe-area-inset-bottom));width:68px;height:68px;border:1px solid #b6a0ff;border-radius:50%;background:radial-gradient(circle at 35% 28%,#d9d0ff,#7a54ee 64%,#351b92);color:white;box-shadow:0 0 0 5px #9b7aff22,0 10px 40px #160a3880;cursor:pointer;font:700 12px system-ui;display:grid;place-items:center}
  .julia-launcher,.julia-panel,.julia-agent{pointer-events:auto}
  .julia-launcher:focus-visible,.julia-panel button:focus-visible,.constellation button:focus-visible,.constellation a:focus-visible{outline:3px solid #fff;outline-offset:3px}
  .julia-launcher svg{position:absolute;inset:-5px;overflow:visible;transform:rotate(-90deg)}
  .julia-launcher circle{fill:none;stroke:#ffffff38;stroke-width:2}
  .julia-launcher .progress{stroke:#fff;stroke-linecap:round;transition:stroke-dashoffset .4s linear}
  .julia-panel{position:fixed;z-index:2147483001;right:max(18px,env(safe-area-inset-right));bottom:calc(max(20px,env(safe-area-inset-bottom)) + 82px);width:min(390px,calc(100vw - 28px));max-height:min(74vh,650px);overflow:auto;border:1px solid #9b7aff65;border-radius:24px;background:linear-gradient(145deg,#171225f7,#0a0911fa);box-shadow:0 24px 80px #0009;color:#f7f4ff;font:14px/1.5 system-ui;backdrop-filter:blur(18px);padding:20px}
  .julia-panel[hidden]{display:none}.julia-panel h2{font:600 20px/1.2 system-ui;margin:0}.julia-panel p{color:#c8c2d7;margin:8px 0}
  .julia-header{display:flex;align-items:center;justify-content:space-between;gap:12px}.julia-status{display:flex;align-items:center;gap:8px;color:#dcd3ff;font-size:12px;text-transform:capitalize}
  .julia-dot{width:8px;height:8px;border-radius:50%;background:#9b7aff;box-shadow:0 0 12px currentColor}
  .julia-panel button{border:1px solid #ffffff24;background:#ffffff0c;color:#fff;border-radius:12px;padding:9px 12px;font:inherit;cursor:pointer}
  .julia-panel button.primary{background:#7857e8;border-color:#a994ff;font-weight:650}
  .julia-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}.julia-panel .julia-close{padding:5px 9px}
  .julia-chat{height:180px;overflow:auto;margin:14px 0;padding:12px;border-radius:14px;background:#ffffff08;border:1px solid #ffffff13}
  .julia-avatar{height:112px;display:flex;align-items:center;justify-content:center;overflow:hidden;border-radius:14px;background:radial-gradient(ellipse,#382665,#15111f 70%)}
  .julia-avatar canvas,.julia-avatar img{width:100%;height:100%;object-fit:contain}
  .julia-message{margin:0 0 10px!important;padding:9px 11px;border-radius:12px;background:#ffffff0b;color:#f5f2ff!important}
  .julia-form{display:flex;gap:8px}.julia-form input{flex:1;min-width:0;border-radius:12px;border:1px solid #ffffff30;background:#ffffff0c;color:#fff;padding:11px 12px;font:inherit}
  .julia-countdown{color:#e8e0ff;font:600 12px ui-monospace,monospace}
  .julia-agent{position:fixed;inset:0;z-index:2147483002;background:#08070de8;display:grid;place-items:center;padding:24px;color:white;font:14px system-ui}
  .julia-agent[hidden]{display:none}.julia-deck{position:absolute;inset:8% 5%;perspective:1100px;overflow:hidden;border-radius:24px;border:1px solid #ffffff35;box-shadow:0 30px 100px #000}
  .julia-deck iframe{width:100%;height:100%;border:0;transform:scale(.86) rotateY(-7deg);filter:blur(2px) brightness(.48);transform-origin:center;pointer-events:none;background:white}
  .julia-agent-card{position:absolute;top:18%;right:7%;max-width:250px;padding:12px 16px;border:1px solid #ad91ff95;border-radius:14px;background:#1d1638ed;box-shadow:0 10px 40px #0008}
  .julia-agent-card:nth-of-type(3){top:auto;right:auto;left:8%;bottom:20%}
  .julia-agent-card:nth-of-type(4){top:auto;bottom:14%;right:16%}
  .julia-agent-portrait{position:absolute;z-index:2;left:50%;bottom:5%;transform:translateX(-50%);width:min(34vw,280px);height:min(68vh,520px);object-fit:contain;filter:drop-shadow(0 0 30px #9474ff75)}
  .julia-stop{position:absolute;z-index:4;top:max(18px,env(safe-area-inset-top));right:max(18px,env(safe-area-inset-right));background:#a82038!important;border-color:#ff7185!important;font-weight:700!important}
  .constellation{position:fixed;z-index:2147482000;top:max(18px,env(safe-area-inset-top));right:max(18px,env(safe-area-inset-right));font:13px/1.4 system-ui;color:#f7f4ff}
  .constellation-toggle{border:1px solid #9b7aff77;border-radius:999px;background:#13101de8;color:inherit;padding:10px 14px;box-shadow:0 8px 30px #0003;cursor:pointer}
  .constellation-drawer{position:absolute;right:0;top:calc(100% + 10px);width:min(360px,calc(100vw - 28px));padding:12px;border:1px solid #9b7aff5e;border-radius:20px;background:#11101af5;box-shadow:0 18px 60px #0008;backdrop-filter:blur(18px)}
  .constellation-drawer[hidden]{display:none}.constellation-site{padding:10px 9px;border-bottom:1px solid #ffffff14}.constellation-site:last-child{border:0}
  .constellation-site summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:10px;font-weight:650}.constellation-site summary::-webkit-details-marker{display:none}
  .constellation-orb{width:11px;height:11px;border-radius:50%;background:var(--orb);box-shadow:0 0 16px var(--orb)}
  .constellation-role{margin:8px 0;color:#c8c2d7;font-size:12px}.constellation-links{display:flex;flex-wrap:wrap;gap:7px}
  .constellation a{color:#eee8ff;text-decoration:none;border:1px solid #ffffff25;border-radius:999px;padding:5px 9px;font-size:11px}.constellation a:hover{border-color:#b7a4ff}
  .constellation-current{margin-left:auto;color:#bca8ff;font-size:10px;text-transform:uppercase}
  .constellation-strap{padding:10px 9px 4px;border-top:1px solid #ffffff18;color:#a9a2b7;font-size:10px}
  @media(max-width:600px){.constellation{top:auto;right:0;bottom:0;left:0}.constellation-toggle{position:absolute;right:auto;left:max(14px,env(safe-area-inset-left));bottom:max(14px,env(safe-area-inset-bottom));width:54px;height:54px;border-radius:50%;font-size:0;padding:0}.constellation-toggle:after{content:'✦';font-size:24px}.constellation-drawer{position:fixed;top:auto;right:0;bottom:0;left:0;width:100%;max-height:72dvh;overflow:auto;border-radius:22px 22px 0 0;padding:16px 16px max(22px,env(safe-area-inset-bottom))}.julia-agent-portrait{width:62vw;height:54vh}.julia-deck{inset:10% 3% 15%;}.julia-agent-card{top:13%;right:4%;max-width:165px;font-size:12px}.julia-agent-card:nth-of-type(3){left:3%;bottom:19%}}
  @media(prefers-reduced-motion:reduce){*,*:before,*:after{scroll-behavior:auto!important;transition:none!important}}
`;

function makeStyles(doc) {
  const style = doc.createElement('style');
  style.textContent = styleText;
  return style;
}

function validSite(site) {
  if (!VALID_SITES.has(site)) throw new TypeError(`Unknown Julia site: ${site}`);
  return site;
}

function createMessage(doc, text) {
  const p = doc.createElement('p');
  p.className = 'julia-message';
  p.textContent = text;
  return p;
}

function createAvatar(canvas, fallback) {
  const lowMemory = navigator.deviceMemory && navigator.deviceMemory <= 2;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (lowMemory) {
    fallback.hidden = false;
    return { pause() {}, resume() {}, dispose() {} };
  }
  let renderer;
  let scene;
  let camera;
  let frame = 0;
  let active = false;
  let initialized = false;
  let failed = false;
  let model;
  let resizeObserver;
  let lastFrame = 0;
  let clock;
  const init = () => {
    if (initialized || failed) return;
    initialized = true;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
      renderer.setSize(canvas.clientWidth || 150, canvas.clientHeight || 112, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(35, (canvas.clientWidth || 150) / (canvas.clientHeight || 112), 0.1, 100);
      camera.position.set(0, 1.1, 3.4);
      scene.add(new THREE.HemisphereLight(0xd8d0ff, 0x171024, 2));
      const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
      keyLight.position.set(2, 3, 4);
      scene.add(keyLight);
      const loader = new GLTFLoader();
      loader.setMeshoptDecoder(MeshoptDecoder);
      loader.load('/julia/julia.glb', (gltf) => {
        model = gltf.scene;
        const bounds = new THREE.Box3().setFromObject(model);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        const scale = 1.55 / Math.max(size.y, 0.01);
        model.scale.setScalar(scale);
        model.position.set(-center.x * scale, -center.y * scale - 0.15, -center.z * scale);
        scene.add(model);
        fallback.hidden = true;
        clock = new THREE.Clock();
        renderFrame();
      }, undefined, (error) => {
        console.error('[Julia] Could not load the 3D model:', error);
        fallback.hidden = false;
        failed = true;
        renderer.dispose();
      });
      resizeObserver = new ResizeObserver(() => {
        const width = canvas.clientWidth || 150;
        const height = canvas.clientHeight || 112;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      });
      resizeObserver.observe(canvas);
    } catch (error) {
      console.error('[Julia] WebGL is unavailable; using the portrait fallback:', error);
      fallback.hidden = false;
      failed = true;
      renderer?.dispose();
    }
  }

  function renderFrame(now) {
    if (!active) return;
    frame = window.requestAnimationFrame(renderFrame);
    if (now - lastFrame < 33 || !renderer || !scene || !camera) return;
    lastFrame = now;
    if (model && !reducedMotion && clock) {
      model.rotation.y = Math.sin(clock.getElapsedTime() * 0.35) * 0.08;
    }
    renderer.render(scene, camera);
  }

  return {
    pause() {
      active = false;
      window.cancelAnimationFrame(frame);
    },
    resume() {
      if (lowMemory || failed || active) return;
      active = true;
      init();
      frame = window.requestAnimationFrame(renderFrame);
    },
    dispose() {
      active = false;
      window.cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      scene?.traverse((object) => {
        object.geometry?.dispose();
        if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
        else object.material?.dispose();
      });
      renderer?.dispose();
    },
  };
}

function createApiTools(site, suppliedTools, root, onAction, stopSignal) {
  const allowed = new Set(['navigate', 'scrollTo', 'highlight', 'click', 'fill', 'openConstellation', 'switchSite']);
  const execute = async (name, args = {}) => {
    if (!allowed.has(name)) throw new Error(`Tool not allowed: ${name}`);
    onAction(name, args);
    const custom = suppliedTools?.[name];
    if (typeof custom === 'function') return custom(args);
    if (stopSignal.stopped) throw new Error('Agent Mode was stopped');
    const selector = typeof args.selector === 'string' ? args.selector : '';
    switch (name) {
      case 'navigate': {
        const path = args.path;
        if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//')) throw new TypeError('navigate requires a same-site path beginning with /');
        location.assign(path);
        return { navigated: path };
      }
      case 'scrollTo': {
        const target = document.querySelector(selector);
        if (!target) throw new Error(`scrollTo target not found: ${selector}`);
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return { scrolled: selector };
      }
      case 'highlight': {
        const target = document.querySelector(selector);
        if (!target) throw new Error(`highlight target not found: ${selector}`);
        target.dataset.primeJuliaPreviousOutline = target.style.outline || '';
        target.style.outline = '3px solid #9b7aff';
        target.style.outlineOffset = '4px';
        window.setTimeout(() => {
          target.style.outline = target.dataset.primeJuliaPreviousOutline;
          delete target.dataset.primeJuliaPreviousOutline;
          target.style.outlineOffset = '';
        }, 2400);
        return { highlighted: selector };
      }
      case 'click': {
        const target = document.querySelector(selector);
        if (!(target instanceof HTMLElement)) throw new Error(`click target not found: ${selector}`);
        if (target.matches('button[type="submit"],input[type="submit"],[data-destructive="true"],[data-dangerous="true"]') ||
          /delete|remove|purchase|pay|submit|send|publish|deploy/i.test(`${target.textContent} ${target.getAttribute('aria-label') || ''}`)) {
          if (!window.confirm('Julia is requesting confirmation before this action. Continue?')) return { cancelled: true };
        }
        target.click();
        return { clicked: selector };
      }
      case 'fill': {
        const target = document.querySelector(selector);
        if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) {
          throw new Error(`fill target is not an input: ${selector}`);
        }
        if (target.disabled || target.readOnly) throw new Error('Cannot fill a disabled or read-only control');
        target.value = String(args.value ?? '');
        target.dispatchEvent(new Event('input', { bubbles: true }));
        target.dispatchEvent(new Event('change', { bubbles: true }));
        return { filled: selector };
      }
      case 'openConstellation': {
        root.dispatchEvent(new CustomEvent('prime-julia-open-constellation', { bubbles: true }));
        return { opened: 'constellation' };
      }
      case 'switchSite': {
        const nextSite = validSite(args.site);
        if (nextSite === site) return { switched: false };
        window.open(SITES[nextSite].url, '_blank', 'noopener');
        return { switched: nextSite };
      }
      default: throw new Error(`Unhandled Julia tool: ${name}`);
    }
  };
  return Object.fromEntries([...allowed].map((name) => [name, (args) => execute(name, args)]));
}

async function requestWindow(endpoint, site) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ site }),
    credentials: 'omit',
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Could not start Julia session (${response.status})`);
  if (!Number.isFinite(payload.exp) || typeof payload.token !== 'string') throw new Error('Window issuer returned an invalid session');
  return payload;
}

export function mount({ site, container = document.body, tools = {}, windowEndpoint = DEFAULT_WINDOW_ENDPOINT } = {}) {
  validSite(site);
  if (!(container instanceof Element)) throw new TypeError('container must be a DOM Element');
  const doc = container.ownerDocument || document;
  const portal = doc.createElement('div');
  portal.dataset.primeJulia = site;
  portal.style.cssText = 'position:fixed;inset:0;z-index:2147483000;pointer-events:none';
  const shadow = portal.attachShadow({ mode: 'open' });
  shadow.append(makeStyles(doc));
  const launcher = doc.createElement('button');
  launcher.className = 'julia-launcher';
  launcher.type = 'button';
  launcher.setAttribute('aria-label', 'Talk with Julia');
  launcher.innerHTML = '<svg viewBox="0 0 78 78" aria-hidden="true"><circle cx="39" cy="39" r="36"></circle><circle class="progress" cx="39" cy="39" r="36"></circle></svg><span>Julia</span>';
  const progress = launcher.querySelector('.progress');
  const circumference = 2 * Math.PI * 36;
  progress.style.strokeDasharray = `${circumference}`;
  progress.style.strokeDashoffset = `${circumference}`;

  const panel = doc.createElement('section');
  panel.className = 'julia-panel';
  panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Julia assistant');
  panel.innerHTML = '<div class="julia-header"><div><h2>Julia</h2><div class="julia-status"><span class="julia-dot"></span><span class="state">Ready</span></div></div><span class="julia-countdown" aria-live="polite"></span><button class="julia-close" type="button" aria-label="Close Julia">×</button></div><p class="persona"></p><div class="julia-avatar"><canvas aria-hidden="true"></canvas><img src="/julia/julia.png" alt="Julia" hidden></div><div class="julia-chat" aria-live="polite"></div><div class="julia-actions"><button class="primary start" type="button">Start free 5-minute session</button><button class="mic" type="button">Use microphone</button><button class="agent" type="button">Enter Agent Mode</button></div><form class="julia-form"><input aria-label="Message Julia" placeholder="Ask Julia a question…" autocomplete="off"><button class="primary" type="submit">Send</button></form><p class="window-error" role="alert"></p>';
  const agent = doc.createElement('section');
  agent.className = 'julia-agent';
  agent.hidden = true;
  agent.setAttribute('aria-label', 'Julia Agent Mode');
  agent.innerHTML = `<button class="julia-stop" type="button">Stop Agent Mode</button><div class="julia-deck"><iframe title="Receded website preview" src="${location.origin}" loading="lazy"></iframe></div><img class="julia-agent-portrait" src="/julia/julia.png" alt="Julia, your AI assistant"><div class="julia-agent-card">Julia is ready to act on this page.</div><div class="julia-agent-card">Tool calls are limited to this page and the approved registry.</div><div class="julia-agent-card">Select Stop Agent Mode to end control.</div>`;
  shadow.append(launcher, panel, agent);
  (container === doc.body ? doc.body : container).append(portal);
  const avatar = createAvatar(panel.querySelector('canvas'), panel.querySelector('.julia-avatar img'));
  avatar.pause();

  panel.querySelector('.persona').textContent = {
    yace19ai: 'Your research companion for questions, models and world models.',
    'prime-ai': 'Your sovereign orchestrator for models, memory and governed agents.',
    amlazr: 'Your operator companion for workflows, browser tasks and outcomes.',
  }[site];
  const chat = panel.querySelector('.julia-chat');
  const stateLabel = panel.querySelector('.state');
  const errorLabel = panel.querySelector('.window-error');
  const stopSignal = { stopped: false };
  const apiTools = createApiTools(site, tools, portal, (name, args) => {
    const cards = agent.querySelectorAll('.julia-agent-card');
    if (cards[0]) cards[0].textContent = `${name} ${JSON.stringify(args)}`;
  }, stopSignal);
  let state = 'idle';
  let session = null;
  let intervalId = 0;
  let recognition = null;
  const listeners = new AbortController();
  const setState = (next) => {
    if (!STATE_NAMES.includes(next)) throw new TypeError(`Unknown Julia state: ${next}`);
    state = next;
    stateLabel.textContent = next;
    panel.dataset.state = next;
    portal.dispatchEvent(new CustomEvent('prime-julia-state', { detail: { state: next } }));
  };
  const updateCountdown = () => {
    if (!session) return;
    const seconds = Math.max(0, Math.ceil(session.exp - Date.now() / 1000));
    panel.querySelector('.julia-countdown').textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
    progress.style.strokeDashoffset = `${circumference * (1 - seconds / (session.ttl || 300))}`;
    if (seconds === 0) endSession();
  };
  const endSession = () => {
    clearInterval(intervalId);
    intervalId = 0;
    session = null;
    setState('idle');
    chat.append(createMessage(doc, 'Our five-minute window has ended. Thanks for exploring Julia. Discuss a private deployment with the PRIME-AI team.'));
    const conversion = doc.createElement('a');
    conversion.href = 'https://calendly.com/info-primeai/30min';
    conversion.target = '_blank';
    conversion.rel = 'noopener noreferrer';
    conversion.textContent = 'Discuss a private deployment';
    conversion.style.cssText = 'display:inline-block;margin-top:8px;color:#c8b9ff';
    chat.append(conversion);
    panel.querySelector('.start').disabled = true;
    panel.querySelector('.start').textContent = 'Free window used';
  };
  const runDemo = async () => {
    setState('listening');
    await new Promise((resolve) => setTimeout(resolve, 350));
    if (!session) return;
    setState('thinking');
    await new Promise((resolve) => setTimeout(resolve, 650));
    if (!session) return;
    setState('speaking');
  };
  const start = async () => {
    errorLabel.textContent = '';
    const button = panel.querySelector('.start');
    button.disabled = true;
    button.textContent = 'Connecting…';
    setState('thinking');
    try {
      const endpoint = site === 'prime-ai' ? `${location.origin}/api/julia-window` : windowEndpoint;
      session = await requestWindow(endpoint, site);
      try {
        localStorage.setItem('prime-julia-window', String(session.exp));
      } catch {
        // Session storage is only a UX marker; the signed server token is authoritative.
      }
      setState('idle');
      button.textContent = 'Free window active';
      chat.append(createMessage(doc, 'Your five-minute live window is active. Ask me anything or try Agent Mode.'));
      updateCountdown();
      intervalId = window.setInterval(updateCountdown, 1000);
      await runDemo();
    } catch (error) {
      session = null;
      setState('error');
      errorLabel.textContent = error.message;
      button.disabled = false;
      button.textContent = 'Start free 5-minute session';
    }
  };
  const assistantReply = (text) => {
    if (!session) throw new Error('Start a five-minute session before messaging Julia');
    setState('working');
    chat.append(createMessage(doc, text));
    window.setTimeout(() => {
      if (!session) return;
      setState('thinking');
      window.setTimeout(() => {
        if (!session) return;
        setState('speaking');
        const utterance = window.speechSynthesis && window.SpeechSynthesisUtterance && new window.SpeechSynthesisUtterance(text);
        if (utterance) {
          utterance.onend = () => session && setState('idle');
          window.speechSynthesis.speak(utterance);
        } else {
          window.setTimeout(() => session && setState('idle'), 900);
        }
      }, 350);
    }, 500);
  };
  const toggleAgent = async () => {
    if (!session) {
      errorLabel.textContent = 'Start a five-minute session before entering Agent Mode.';
      return;
    }
    stopSignal.stopped = false;
    agent.hidden = false;
    setState('working');
    try {
      await apiTools.highlight({ selector: 'main h1, h1' });
    } catch (error) {
      agent.querySelector('.julia-agent-card').textContent = error.message;
    }
    agent.querySelector('.julia-agent-card:nth-of-type(3)').textContent = 'Julia highlighted the page heading. Try the approved tool registry.';
  };
  launcher.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    if (panel.hidden) avatar.pause();
    else avatar.resume?.();
  }, { signal: listeners.signal });
  panel.querySelector('.julia-close').addEventListener('click', () => { panel.hidden = true; avatar.pause(); }, { signal: listeners.signal });
  panel.querySelector('.start').addEventListener('click', start, { signal: listeners.signal });
  panel.addEventListener('prime-julia-state', () => { if (!panel.hidden) avatar.resume?.(); });
  panel.querySelector('.agent').addEventListener('click', toggleAgent, { signal: listeners.signal });
  panel.querySelector('.mic').addEventListener('click', () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      errorLabel.textContent = 'Speech recognition is not available in this browser. Use the text field instead.';
      return;
    }
    recognition = new SpeechRecognition();
    recognition.lang = doc.documentElement.lang || 'en-US';
    recognition.onstart = () => setState('listening');
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      chat.append(createMessage(doc, text));
      assistantReply(`I heard: ${text}. This is Julia’s interactive demonstration mode; connect a model backend to enable live answers.`);
    };
    recognition.onerror = (event) => { errorLabel.textContent = `Microphone error: ${event.error}`; setState('error'); };
    recognition.start();
  }, { signal: listeners.signal });
  panel.querySelector('.julia-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = panel.querySelector('input');
    const text = input.value.trim();
    if (!text) return;
    chat.append(createMessage(doc, text));
    input.value = '';
    try {
      assistantReply(`This is Julia’s interactive demonstration mode. I can help with “${text}” when a model backend is configured.`);
    } catch (error) {
      errorLabel.textContent = error.message;
    }
  }, { signal: listeners.signal });
  agent.querySelector('.julia-stop').addEventListener('click', () => {
    stopSignal.stopped = true;
    agent.hidden = true;
    setState(session ? 'idle' : 'idle');
  }, { signal: listeners.signal });
  window.addEventListener('message', (event) => {
    if (!isAllowedOrigin(event.origin) || event.data?.type !== 'prime-julia-handoff' || typeof event.data.token !== 'string' ||
      !Number.isFinite(event.data.exp) || event.data.exp <= Date.now() / 1000) return;
    session = { token: event.data.token, exp: event.data.exp };
    chat.append(createMessage(doc, 'Your Julia session continued from the previous constellation site.'));
    panel.querySelector('.start').disabled = true;
    panel.querySelector('.start').textContent = 'Free window active';
    updateCountdown();
    intervalId = window.setInterval(updateCountdown, 1000);
    panel.hidden = false;
  }, { signal: listeners.signal });
  window.addEventListener('pagehide', () => {
    recognition?.stop();
    clearInterval(intervalId);
    avatar.dispose();
    listeners.abort();
  }, { once: true });

  const runtime = {
    root: portal,
    getState: () => state,
    getSession: () => session && { exp: session.exp },
    handoff: (target, origin) => {
      if (!session || !isAllowedOrigin(origin) || !target?.postMessage) return false;
      target.postMessage({ type: 'prime-julia-handoff', token: session.token, exp: session.exp }, origin);
      return true;
    },
    runTool: (name, args) => apiTools[name]?.(args) ?? Promise.reject(new Error(`Tool not allowed: ${name}`)),
    open: () => { panel.hidden = false; },
    stop: () => { stopSignal.stopped = true; agent.hidden = true; },
    unmount: () => {
      clearInterval(intervalId);
      recognition?.stop();
      listeners.abort();
      portal.remove();
      if (window.__primeJuliaMounted) {
        window.__primeJuliaMounted = window.__primeJuliaMounted.filter((item) => item !== runtime);
      }
    },
  };
  window.__primeJuliaMounted ||= [];
  window.__primeJuliaMounted.push(runtime);
  return runtime;
}

export function mountConstellation({ site, container = document.body } = {}) {
  validSite(site);
  if (!(container instanceof Element)) throw new TypeError('container must be a DOM Element');
  const doc = container.ownerDocument || document;
  const root = doc.createElement('div');
  root.className = 'constellation';
  root.dataset.primeConstellation = site;
  root.append(makeStyles(doc));
  const toggle = doc.createElement('button');
  toggle.className = 'constellation-toggle';
  toggle.type = 'button';
  toggle.textContent = 'ONE ECOSYSTEM · Three universes';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', `constellation-${site}`);
  const drawer = doc.createElement('nav');
  drawer.id = `constellation-${site}`;
  drawer.className = 'constellation-drawer';
  drawer.hidden = true;
  drawer.setAttribute('aria-label', 'Sovereign Constellation');
  const entries = Object.entries(SITES).map(([key, item]) => {
    const details = doc.createElement('details');
    details.className = 'constellation-site';
    if (key === site) details.open = true;
    const summary = doc.createElement('summary');
    const orb = doc.createElement('span');
    orb.className = 'constellation-orb';
    orb.style.setProperty('--orb', item.color);
    const label = doc.createElement('span');
    label.textContent = item.label;
    summary.append(orb, label);
    if (key === site) {
      const current = doc.createElement('span');
      current.className = 'constellation-current';
      current.textContent = 'Current site';
      summary.append(current);
    }
    const role = doc.createElement('p');
    role.className = 'constellation-role';
    role.textContent = item.role;
    const links = doc.createElement('div');
    links.className = 'constellation-links';
    item.links.forEach(([linkLabel, path]) => {
      const anchor = doc.createElement('a');
      anchor.textContent = linkLabel;
      anchor.href = key === 'linkedin' ? item.url : `${item.url}${path}`;
      if (key !== site) {
        anchor.target = '_blank';
        anchor.rel = 'noopener';
        anchor.addEventListener('click', (event) => {
            event.preventDefault();
            const julia = window.__primeJuliaMounted?.find((runtime) => runtime.getSession?.());
            const active = julia?.getSession?.();
            if (!active) {
              window.open(anchor.href, '_blank', 'noopener');
              return;
            }
            const target = window.open(anchor.href, '_blank');
            if (!target) return;
            const targetOrigin = new URL(anchor.href).origin;
            if (!isAllowedOrigin(targetOrigin)) return;
            const transfer = () => julia.handoff(target, targetOrigin);
            const handshake = (messageEvent) => {
              if (messageEvent.source !== target || messageEvent.origin !== targetOrigin || messageEvent.data?.type !== 'prime-julia-ready') return;
            transfer();
            window.removeEventListener('message', handshake);
            clearInterval(timer);
          };
          window.addEventListener('message', handshake);
          const timer = window.setInterval(transfer, 400);
          window.setTimeout(() => { window.removeEventListener('message', handshake); clearInterval(timer); }, 8000);
        });
      }
      links.append(anchor);
    });
    details.append(summary, role, links);
    return details;
  });
  const strap = doc.createElement('div');
  strap.className = 'constellation-strap';
  strap.textContent = 'Part of the PRIME-AI Sovereign Constellation';
  drawer.append(...entries, strap);
  root.append(toggle, drawer);
  (container === doc.body ? doc.body : container).append(root);
  const changeOpen = (open) => {
    drawer.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => changeOpen(drawer.hidden));
  root.addEventListener('prime-julia-open-constellation', () => changeOpen(true));
  const readyOrigin = location.origin;
  if (window.opener && isAllowedOrigin(document.referrer ? new URL(document.referrer).origin : '')) {
    window.opener.postMessage({ type: 'prime-julia-ready' }, new URL(document.referrer).origin);
  }
  return {
    root,
    open: () => changeOpen(true),
    close: () => changeOpen(false),
    unmount: () => root.remove(),
    currentSite: site,
    origin: readyOrigin,
  };
}

const PrimeJulia = { mount, mountConstellation };
if (typeof window !== 'undefined') {
  window.PrimeJulia = PrimeJulia;
  window.__primeJuliaMounted ||= [];
}

export default PrimeJulia;
