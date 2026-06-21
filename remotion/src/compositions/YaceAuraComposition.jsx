import React from 'react';
import { Sequence, useVideoConfig } from 'remotion';
import { HeroReveal, FleetDashboard } from '../templates';
import content from '../content';
import { BRAND } from '../brand';

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
          title="YACE"
          titleAccent="•AURA"
          metrics={[
            { label: 'SOL NETWORK', value: '2845 TPS', status: 'ACTIVE', color: BRAND.blue },
            { label: 'SWAP VOLUME', value: '$508.20', status: 'TRADING', color: BRAND.green },
            { label: 'SENTIMENT', value: '83%', status: 'BULLISH', color: BRAND.amber },
            { label: 'WALLET', value: 'PHANTOM', status: 'READY', color: BRAND.gold },
          ]}
          logLines={[
            'Solana Network Scout: TPS 2845, Slot 298452109.',
            'YouTube Sentiment Scout: Score 0.75 (Bullish).',
            'Jupiter Swap Simulator: 1.0 SOL → 145.20 USDC.',
            'Vocal Command Bridge: Bullish alert played.',
            'Wallet Bridge: Phantom connected.',
          ]}
          theme="dark"
          primaryColor={BRAND.gold}
        />
      </Sequence>
    </>
  );
}
