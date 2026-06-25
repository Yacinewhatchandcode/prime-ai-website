import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';
import SovereignLightLayout from './components/SovereignLightLayout';
import './agent-app.css';
import OrbHome from './pages/OrbHome';
import AgentOrchestration from './pages/AgentOrchestration';
import MediaCommandCenter from './pages/MediaCommandCenter';
import WhatsAppAgent from './pages/WhatsAppAgent';
import MemorySystem from './pages/MemorySystem';
import PrimeFactory from './pages/PrimeFactory';
import AmlazrArena from './pages/AmlazrArena';
import AziremCoder from './pages/AziremCoder';
import CountryNodeTemplate from './pages/CountryNodeTemplate';
import YaceAura from './pages/YaceAura';
import Vision from './pages/Vision';
import Technologie from './pages/Technologie';
import Ecosysteme from './pages/Ecosysteme';
import Credentials from './pages/Credentials';
import RevenueConsole from './pages/RevenueConsole';
import SovereignAi from './pages/SovereignAi';
import MultiAgentSystems from './pages/MultiAgentSystems';
import EnterpriseAiOrchestration from './pages/EnterpriseAiOrchestration';
import Yace19Lab from './pages/Yace19Lab';
import FleetCommand from './pages/FleetCommand';
import CyberSurveyor from './pages/CyberSurveyor';

function App() {
  return (
    <LanguageProvider>
      <HashRouter>
        <Routes>
          {/* Light Premium Layout */}
          <Route element={<SovereignLightLayout />}>
            <Route path="/" element={<Vision />} />
            <Route path="/vision" element={<Vision />} />
            <Route path="/technologie" element={<Technologie />} />
            <Route path="/ecosysteme" element={<Ecosysteme />} />
            <Route path="/sovereign-ai" element={<SovereignAi />} />
            <Route path="/multi-agent-systems" element={<MultiAgentSystems />} />
            <Route path="/enterprise-ai-orchestration" element={<EnterpriseAiOrchestration />} />
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
            <Route path="/credentials" element={<Credentials />} />
            <Route path="/revenue" element={<RevenueConsole />} />
            <Route path="/yace19" element={<Yace19Lab />} />
            <Route path="/fleet-command" element={<FleetCommand />} />
            <Route path="/surveyor" element={<CyberSurveyor />} />
          </Route>
          
          {/* Country Nodes */}
          <Route path="/uk" element={<CountryNodeTemplate countryName="United Kingdom" subtitle="Sovereign. Secure. Autonomous." flag="🇬🇧" nodeColor="#e11d48" nodeHighlight="#3b82f6" />} />
          <Route path="/de" element={<CountryNodeTemplate countryName="Germany" subtitle="Souverän. Sicher. Autonom." flag="🇩🇪" nodeColor="#facc15" nodeHighlight="#ef4444" />} />
          <Route path="/ch" element={<CountryNodeTemplate countryName="Switzerland" subtitle="Souverän. Sicher. Autonom." flag="🇨🇭" nodeColor="#ef4444" nodeHighlight="#f87171" />} />
          <Route path="/ae" element={<CountryNodeTemplate countryName="Dubai (UAE)" subtitle="Sovereign. Secure. Autonomous." flag="🇦🇪" nodeColor="#10b981" nodeHighlight="#f59e0b" />} />
          <Route path="/jp" element={<CountryNodeTemplate countryName="Japan" subtitle="Sovereign. Secure. Autonomous." flag="🇯🇵" nodeColor="#ef4444" nodeHighlight="#9ca3af" />} />
          <Route path="/cn" element={<CountryNodeTemplate countryName="China" strokeColor="#ef4444" flag="🇨🇳" nodeColor="#ef4444" nodeHighlight="#facc15" />} />
          <Route path="/sg" element={<CountryNodeTemplate countryName="Singapore" subtitle="Sovereign. Secure. Autonomous." flag="🇸🇬" nodeColor="#ef4444" nodeHighlight="#f87171" />} />
          <Route path="/za" element={<CountryNodeTemplate countryName="South Africa" subtitle="Sovereign. Secure. Autonomous." flag="🇿🇦" nodeColor="#10b981" nodeHighlight="#facc15" />} />
          <Route path="/br" element={<CountryNodeTemplate countryName="Brazil" subtitle="Sovereign. Secure. Autonomous." flag="🇧🇷" nodeColor="#10b981" nodeHighlight="#facc15" />} />
          <Route path="/ca" element={<CountryNodeTemplate countryName="Canada" subtitle="Sovereign. Secure. Autonomous." flag="🇨🇦" nodeColor="#ef4444" nodeHighlight="#f87171" />} />
        </Routes>
      </HashRouter>
    </LanguageProvider>
  );
}

export default App;
