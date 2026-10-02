import React from 'react';
import { Sequence, useVideoConfig } from 'remotion';
import { HeroReveal, FleetDashboard } from '../templates';
import content from '../content';
import { BRAND } from '../brand';
import IllustrativeLabel from '../templates/IllustrativeLabel';

/**
 * YaceAuraComposition — /yace-aura page video
 * Uses: HeroReveal (act 1) → FleetDashboard (act 2)
 * Dark theme, gold accent for crypto aesthetic
 */
export default function YaceAuraComposition({ language = 'en' }) {
  const { fps } = useVideoConfig();
  const c = content.yaceAura[language];
  const halfDuration = fps * 10;

  return (
    <>
      <Sequence from={0} durationInFrames={halfDuration}>
        <HeroReveal
          title={c.title}
          titleAccent={c.titleAccent}
          subtitle={c.subtitle}
          tagline={c.tagline}
          theme="dark"
          primaryColor={BRAND.gold}
        />
      </Sequence>
      <Sequence from={halfDuration} durationInFrames={halfDuration}>
        <FleetDashboard
          language={language}
          title="YACE"
          titleAccent="•AURA"
          metrics={[
            { label: 'SOL NETWORK', value: language === 'fr' ? 'ILLUSTRATION' : 'ILLUSTRATIVE', status: 'DEMO', color: BRAND.blue },
            { label: language === 'fr' ? 'TRANSACTIONS' : 'TRADES', value: language === 'fr' ? 'AUCUNE' : 'NONE', status: 'DEMO', color: BRAND.green },
            { label: 'SENTIMENT', value: language === 'fr' ? 'NON MESURÉ' : 'NOT MEASURED', status: 'DEMO', color: BRAND.amber },
            { label: language === 'fr' ? 'PORTEFEUILLE' : 'WALLET', value: language === 'fr' ? 'NON CONNECTÉ' : 'NOT CONNECTED', status: 'DEMO', color: BRAND.gold },
          ]}
          logLines={language === 'fr' ? [
            'Réseau: Schéma illustratif, aucune télémétrie.',
            'Sentiment: Aucune analyse de marché exécutée.',
            'Transactions: Aucun échange effectué.',
            'Audio: Explication visuelle sans narration.',
            'Portefeuille: Aucun compte connecté.',
          ] : [
            'Network: Illustrative layout, no telemetry.',
            'Sentiment: No market analysis executed.',
            'Trades: No swaps executed.',
            'Audio: Visual explainer without narration.',
            'Wallet: No account connected.',
          ]}
          theme="dark"
          primaryColor={BRAND.gold}
        />
      </Sequence>
      <IllustrativeLabel language={language} />
    </>
  );
}
