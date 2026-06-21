import React from 'react';
import { Sequence, useVideoConfig } from 'remotion';
import { HeroReveal, EcosystemMap, FeatureGrid } from '../templates';
import content from '../content';
import { BRAND } from '../brand';

/**
 * EcosystemeComposition — /ecosysteme page video
 * Uses: EcosystemMap (act 1) → FeatureGrid (act 2)
 * Light theme, gold accent
 */
export default function EcosystemeComposition({ language = 'en' }) {
  const { fps } = useVideoConfig();
  const c = content.ecosysteme[language];
  const halfDuration = fps * 10;

  return (
    <>
      <Sequence from={0} durationInFrames={halfDuration}>
        <EcosystemMap
          tagline={c.tagline}
          title={c.title}
          titleAccent={c.titleAccent}
          nodes={[
            { label: 'DESKTOP', x: 0.18, y: 0.42, color: BRAND.gold },
            { label: 'MOBILE', x: 0.82, y: 0.38, color: BRAND.goldDark },
            { label: 'PRIME-CLI', x: 0.22, y: 0.75, color: BRAND.dark },
            { label: 'CLOUD', x: 0.78, y: 0.73, color: BRAND.goldLight },
          ]}
          theme="light"
          primaryColor={BRAND.gold}
        />
      </Sequence>
      <Sequence from={halfDuration} durationInFrames={halfDuration}>
        <FeatureGrid
          tagline={c.tagline}
          bullets={c.bullets}
          theme="light"
          primaryColor={BRAND.gold}
        />
      </Sequence>
    </>
  );
}
