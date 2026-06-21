import React from 'react';
import { Sequence, useVideoConfig } from 'remotion';
import { HeroReveal, FeatureGrid } from '../templates';
import content from '../content';
import { BRAND } from '../brand';

/**
 * EnterpriseComposition — /enterprise-ai-orchestration page video
 * Uses: HeroReveal (act 1) → FeatureGrid (act 2)
 * Light theme, blue accent for enterprise feel
 */
export default function EnterpriseComposition({ language = 'en' }) {
  const { fps } = useVideoConfig();
  const c = content.enterprise[language];
  const halfDuration = fps * 10;

  return (
    <>
      <Sequence from={0} durationInFrames={halfDuration}>
        <HeroReveal
          title={c.title}
          titleAccent={c.titleAccent}
          subtitle={c.subtitle}
          tagline={c.tagline}
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
