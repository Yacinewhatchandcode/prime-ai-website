import React from 'react';
import { Composition } from 'remotion';
import { VIDEO } from './brand';

// Page compositions
import EcosystemeComposition from './compositions/EcosystemeComposition';
import SovereignAiComposition from './compositions/SovereignAiComposition';
import MultiAgentComposition from './compositions/MultiAgentComposition';
import EnterpriseComposition from './compositions/EnterpriseComposition';
import CredentialsComposition from './compositions/CredentialsComposition';
import FleetCommandComposition from './compositions/FleetCommandComposition';
import YaceAuraComposition from './compositions/YaceAuraComposition';

// Standalone template previews (useful in Remotion Studio)
import HeroReveal from './templates/HeroReveal';
import FeatureGrid from './templates/FeatureGrid';
import MeshVisualization from './templates/MeshVisualization';
import FleetDashboard from './templates/FleetDashboard';
import SovereignNarrative from './templates/SovereignNarrative';
import EcosystemMap from './templates/EcosystemMap';

/**
 * PrimeAI Remotion Root
 * 
 * Registers all compositions with parametric defaultProps.
 * Each page composition has EN and FR variants.
 * Template previews are also registered for Studio development.
 */
export const RemotionRoot = () => {
  const shared = {
    width: VIDEO.width,
    height: VIDEO.height,
    fps: VIDEO.fps,
    durationInFrames: VIDEO.durationInFrames,
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          PAGE COMPOSITIONS — EN + FR variants
          ═══════════════════════════════════════════════════ */}

      {/* /ecosysteme */}
      <Composition id="Ecosysteme-EN" component={EcosystemeComposition}
        {...shared} defaultProps={{ language: 'en' }} />
      <Composition id="Ecosysteme-FR" component={EcosystemeComposition}
        {...shared} defaultProps={{ language: 'fr' }} />

      {/* /sovereign-ai */}
      <Composition id="SovereignAi-EN" component={SovereignAiComposition}
        {...shared} defaultProps={{ language: 'en' }} />
      <Composition id="SovereignAi-FR" component={SovereignAiComposition}
        {...shared} defaultProps={{ language: 'fr' }} />

      {/* /multi-agent-systems */}
      <Composition id="MultiAgent-EN" component={MultiAgentComposition}
        {...shared} defaultProps={{ language: 'en' }} />
      <Composition id="MultiAgent-FR" component={MultiAgentComposition}
        {...shared} defaultProps={{ language: 'fr' }} />

      {/* /enterprise-ai-orchestration */}
      <Composition id="Enterprise-EN" component={EnterpriseComposition}
        {...shared} defaultProps={{ language: 'en' }} />
      <Composition id="Enterprise-FR" component={EnterpriseComposition}
        {...shared} defaultProps={{ language: 'fr' }} />

      {/* /credentials */}
      <Composition id="Credentials-EN" component={CredentialsComposition}
        {...shared} defaultProps={{ language: 'en' }} />
      <Composition id="Credentials-FR" component={CredentialsComposition}
        {...shared} defaultProps={{ language: 'fr' }} />

      {/* /fleet-command */}
      <Composition id="FleetCommand-EN" component={FleetCommandComposition}
        {...shared} defaultProps={{ language: 'en' }} />
      <Composition id="FleetCommand-FR" component={FleetCommandComposition}
        {...shared} defaultProps={{ language: 'fr' }} />

      {/* /yace-aura */}
      <Composition id="YaceAura-EN" component={YaceAuraComposition}
        {...shared} defaultProps={{ language: 'en' }} />
      <Composition id="YaceAura-FR" component={YaceAuraComposition}
        {...shared} defaultProps={{ language: 'fr' }} />

      {/* ═══════════════════════════════════════════════════
          STANDALONE TEMPLATE PREVIEWS (Remotion Studio)
          ═══════════════════════════════════════════════════ */}

      <Composition id="Template-HeroReveal" component={HeroReveal}
        {...shared} defaultProps={{
          title: 'Sovereign.', titleAccent: 'Autonomous.',
          subtitle: 'Local-first AI for the sovereign enterprise.',
          tagline: 'PRIME-AI', theme: 'light',
        }} />

      <Composition id="Template-FeatureGrid" component={FeatureGrid}
        {...shared} defaultProps={{
          tagline: 'KEY FEATURES',
          bullets: ['On-premise deployment', 'MCP protocol', 'Zero-trust security', 'GDPR native'],
          theme: 'light',
        }} />

      <Composition id="Template-MeshVisualization" component={MeshVisualization}
        {...shared} defaultProps={{
          tagline: 'AGENT MESH', title: 'Connected', titleAccent: 'Intelligence',
          nodeLabels: ['ANALYZER', 'CODER', 'REVIEWER', 'PLANNER', 'EXECUTOR', 'AUDITOR'],
          theme: 'dark',
        }} />

      <Composition id="Template-FleetDashboard" component={FleetDashboard}
        {...shared} defaultProps={{
          title: 'Fleet', titleAccent: 'Command', theme: 'dark',
        }} />

      <Composition id="Template-SovereignNarrative" component={SovereignNarrative}
        {...shared} defaultProps={{
          tagline: 'SOVEREIGNTY', theme: 'light',
        }} />

      <Composition id="Template-EcosystemMap" component={EcosystemMap}
        {...shared} defaultProps={{
          tagline: 'ECOSYSTEM', title: 'One Intelligence,', titleAccent: 'Every Device.',
          theme: 'light',
        }} />
    </>
  );
};
