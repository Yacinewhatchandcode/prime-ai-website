// Browser-safe Tauri bridge. Production must never silently substitute demo data.
import { API_BASE } from './api.js';

const listeners = {};
const demoMode = import.meta.env.DEV && import.meta.env.VITE_DEMO_MODE === 'true';

export async function listen(event, callback) {
  if (typeof window !== 'undefined' && window.__TAURI_INTERNALS__) {
    const { listen: tauriListen } = await import('@tauri-apps/api/event');
    return tauriListen(event, callback);
  }

  if (!demoMode) {
    throw new Error(`Tauri event '${event}' is unavailable in this browser context`);
  }

  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(callback);
  return () => {
    listeners[event] = listeners[event].filter(cb => cb !== callback);
  };
}

export function emitMock(event, payload) {
  if (!demoMode) return;
  if (listeners[event]) {
    listeners[event].forEach(cb => {
      try {
        cb({ payload });
      } catch (err) {
        console.error('Demo listener failed', err);
      }
    });
  }
}

export async function invoke(command, args = {}) {
  if (typeof window !== 'undefined' && window.__TAURI_INTERNALS__) {
    // A failed native command is an error, not permission to simulate success.
    const { invoke: tauriInvoke } = await import('@tauri-apps/api/core');
    return tauriInvoke(command, args);
  }

  if (command === 'get_fleet_status') {
    try {
      const response = await fetch(`${API_BASE}/api/fleet-state`, {
        signal: AbortSignal.timeout(5000),
        cache: 'no-store',
      });
      if (!response.ok) return 'OFFLINE';
      const data = await response.json();
      // A successful HTTP request alone is not proof that the fleet is online.
      const state = typeof data?.status === 'string' ? data.status.toLowerCase() : null;
      if (state === 'online' || state === 'healthy') return 'ONLINE';
      if (state === 'offline' || state === 'unhealthy') return 'OFFLINE';
      return 'UNKNOWN';
    } catch (error) {
      console.warn('Fleet status unavailable', error);
      return 'OFFLINE';
    }
  }

  if (!demoMode) {
    if (command === 'check_neural_core') return false;
    throw new Error(`Command '${command}' requires the installed PRIME-AI runtime`);
  }

  console.info(`[DEMO ONLY] ${command}`, args);

  if (command === 'check_neural_core') return true;

  if (command === 'initialize_neural_core') {
    const steps = [
      'Connecting to Sovereign Fleet registry...',
      'Resolving Gemma Nano Q3_K_M (1.1GB)...',
      'Downloading neural weights [24%]',
      'Downloading neural weights [58%]',
      'Downloading neural weights [89%]',
      'Verifying SHA-256 integrity...',
      'Extracting inference sidecar...',
      'Binding local tensor runtime...',
      'Neural Core Online. Sovereign execution ready.',
    ];
    let delay = 100;
    steps.forEach(step => {
      setTimeout(() => emitMock('neural-core-progress', `[DEMO] ${step}`), delay);
      delay += 500;
    });
    return true;
  }

  if (command === 'trigger_gemma_sidecar') {
    const steps = [
      'Parsing WhatsApp Intent...',
      'Loading Gemma Nano context window...',
      'Generating Sovereign architecture blueprint...',
      'Resolving component dependencies...',
      'Intent successfully mapped to Orchestration Queue.',
    ];
    let delay = 100;
    steps.forEach(step => {
      setTimeout(() => emitMock('gemma-progress', `[DEMO] ${step}`), delay);
      delay += 400;
    });
    return true;
  }

  if (command === 'trigger_p2p_negotiation') {
    const steps = [
      '[Agent 1: Sovereign Lead] Requesting user preferences from Obsidian Vault...',
      '[Agent 2: Obsidian Memory] Vault synced. PII redacted. Injecting configuration.',
      '[Agent 1: Sovereign Lead] Payload ready. Initiating cross-compilation pipeline.',
      '[Agent 1: Sovereign Lead] Delegating DMG build to Mac M4 Node.',
      '[Agent 3: Mac M4 Node] Acknowledged. Booting native Tauri compilation environment...',
      '[Agent 3: Mac M4 Node] Resolving dependencies and optimizing bundles...',
      '[Agent 3: Mac M4 Node] DMG payload generated. Handoff to Security Verifier.',
      '[Agent 4: Security Verifier] Analyzing binary footprint. Zero PII detected.',
      '[Agent 4: Security Verifier] Injecting Sovereign Certificates. Artifact approved.',
    ];
    let delay = 100;
    steps.forEach(step => {
      setTimeout(() => emitMock('p2p-negotiation', `[DEMO] ${step}`), delay);
      delay += 600;
    });
    return true;
  }

  if (command === 'trigger_packaging') {
    emitMock('packaging-progress', '[DEMO] Initializing Build Orchestrator...');
    setTimeout(() => emitMock('packaging-progress', '[DEMO] > building client app...'), 300);
    setTimeout(() => emitMock('packaging-progress', '[DEMO] > Vite build finished in 450ms'), 700);
    const steps = [
      'Packaging macOS DMG...',
      'Generating Apple iOS IPA (iPhone 14 Pro Max target)...',
      'Injecting Neon-Gold PrimeAI Logo variant...',
      'Signing payloads with Sovereign Certificates...',
      'Deployment packages ready for delivery.',
    ];
    let delay = 1000;
    steps.forEach(step => {
      setTimeout(() => emitMock('packaging-progress', `[DEMO] ${step}`), delay);
      delay += 600;
    });
    return true;
  }

  throw new Error(`Unknown demo command: ${command}`);
}
