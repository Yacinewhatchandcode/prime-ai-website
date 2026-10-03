import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';
import SovereignLightLayout from './components/SovereignLightLayout';
import RouteMetadata from './components/RouteMetadata';
import './agent-app.css';
const OrbHome = lazy(() => import('./pages/OrbHome'));
const AgentOrchestration = lazy(() => import('./pages/AgentOrchestration'));
const MediaCommandCenter = lazy(() => import('./pages/MediaCommandCenter'));
const WhatsAppAgent = lazy(() => import('./pages/WhatsAppAgent'));
const MemorySystem = lazy(() => import('./pages/MemorySystem'));
const PrimeFactory = lazy(() => import('./pages/PrimeFactory'));
const AmlazrArena = lazy(() => import('./pages/AmlazrArena'));
const AziremCoder = lazy(() => import('./pages/AziremCoder'));
const CountryNodeTemplate = lazy(() => import('./pages/CountryNodeTemplate'));
const YaceAura = lazy(() => import('./pages/YaceAura'));
const PrimeInfrastructure = lazy(() => import('./pages/PrimeInfrastructure'));
const NotFound = lazy(() => import('./pages/NotFound'));
const CyberSurveyor = lazy(() => import('./pages/CyberSurveyor'));
const InfrastructureDetail = lazy(() => import('./pages/InfrastructureDetail'));

function Yace19Redirect() {
  useEffect(() => {
    window.location.replace('https://yace19ai.com');
  }, []);
  return (
    <main className="external-redirect">
      <p role="status">Opening YACE19AI research…</p>
      <a href="https://yace19ai.com">Continue to YACE19AI</a>
    </main>
  );
}

function ConstellationRuntime() {
  useEffect(() => {
    let cancelled = false;
    let juliaRuntime;
    let constellation;
    const embedUrl = import.meta.env.VITE_JULIA_EMBED_URL || '/julia/embed.js';
    let script = document.querySelector('script[data-prime-julia-runtime]');
    const ownsScript = !script;
    if (!script) {
      script = document.createElement('script');
      script.type = 'module';
      script.src = embedUrl;
      script.dataset.primeJuliaRuntime = 'true';
      document.head.append(script);
    }
    const mount = () => {
      if (cancelled || !window.PrimeJulia) return;
      try {
        juliaRuntime = window.PrimeJulia.mount({ site: 'prime-ai' });
        constellation = window.PrimeJulia.mountConstellation({ site: 'prime-ai' });
      } catch (error) {
        console.error('[PRIME-AI] Unable to mount the Julia runtime:', error);
      }
    };
    script.addEventListener('load', mount);
    script.addEventListener('error', () => console.error(`[PRIME-AI] Failed to load Julia runtime: ${embedUrl}`), { once: true });
    if (window.PrimeJulia) mount();
    return () => {
      cancelled = true;
      script?.removeEventListener('load', mount);
      juliaRuntime?.unmount();
      constellation?.unmount();
      if (ownsScript) script?.remove();
    };
  }, []);

  return (
    <footer className="constellation-footer">
      <span>Part of the PRIME-AI Sovereign Constellation</span>
      <nav aria-label="Sovereign Constellation sites">
        <a href="https://yace19ai.com">YACE19AI</a>
        <a href="https://prime-ai.fr">PRIME-AI</a>
        <a href="https://amlazr.com">AMLAZR</a>
        <a href="https://www.linkedin.com/in/yacine-benhamou-b26386124/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </nav>
    </footer>
  );
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <RouteMetadata />
        <Suspense fallback={<div role="status" className="route-loading">Loading page…</div>}>
        <Routes>
          {/* Light Premium Layout */}
          <Route element={<SovereignLightLayout />}>
            <Route path="/" element={<PrimeInfrastructure />} />
            <Route path="/vision" element={<Navigate to="/" replace />} />
            <Route path="/technologie" element={<InfrastructureDetail page="technology" />} />
            <Route path="/ecosysteme" element={<InfrastructureDetail page="ecosystem" />} />
            <Route path="/sovereign-ai" element={<InfrastructureDetail page="sovereignty" />} />
            <Route path="/multi-agent-systems" element={<InfrastructureDetail page="agents" />} />
            <Route path="/enterprise-ai-orchestration" element={<InfrastructureDetail page="integrations" />} />
          </Route>

          {/* Dark OS Console Layout */}
          <Route element={<Layout />}>
            <Route path="/yace-aura" element={<YaceAura />} />
            <Route path="/orb" element={<OrbHome />} />
            <Route path="/orchestration" element={<AgentOrchestration />} />
            <Route path="/media" element={<MediaCommandCenter />} />
            <Route path="/whatsapp" element={<WhatsAppAgent />} />
            <Route path="/memory" element={<MemorySystem />} />
            <Route path="/factory" element={<PrimeFactory />} />
            <Route path="/amlazr" element={<AmlazrArena />} />
            <Route path="/azirem" element={<AziremCoder />} />
            <Route path="/credentials" element={<Navigate to="/" replace />} />
            <Route path="/revenue" element={<Navigate to="/" replace />} />
            <Route path="/yace19" element={<Yace19Redirect />} />
            <Route path="/fleet-command" element={<Navigate to="/orchestration" replace />} />
            <Route path="/surveyor" element={<CyberSurveyor />} />
          </Route>
          
          {/* Country Nodes */}
          <Route path="/uk" element={<CountryNodeTemplate countryName="United Kingdom" flag="🇬🇧" />} />
          <Route path="/de" element={<CountryNodeTemplate countryName="Germany" flag="🇩🇪" />} />
          <Route path="/ch" element={<CountryNodeTemplate countryName="Switzerland" flag="🇨🇭" />} />
          <Route path="/ae" element={<CountryNodeTemplate countryName="United Arab Emirates" flag="🇦🇪" />} />
          <Route path="/jp" element={<CountryNodeTemplate countryName="Japan" flag="🇯🇵" />} />
          <Route path="/cn" element={<CountryNodeTemplate countryName="China" flag="🇨🇳" />} />
          <Route path="/sg" element={<CountryNodeTemplate countryName="Singapore" flag="🇸🇬" />} />
          <Route path="/za" element={<CountryNodeTemplate countryName="South Africa" flag="🇿🇦" />} />
          <Route path="/br" element={<CountryNodeTemplate countryName="Brazil" flag="🇧🇷" />} />
          <Route path="/ca" element={<CountryNodeTemplate countryName="Canada" flag="🇨🇦" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        <ConstellationRuntime />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
