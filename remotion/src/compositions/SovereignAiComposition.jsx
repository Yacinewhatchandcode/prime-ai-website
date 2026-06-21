import React from 'react';
import { Sequence, useVideoConfig } from 'remotion';
import { HeroReveal, SovereignNarrative } from '../templates';
import content from '../content';
import { BRAND } from '../brand';

/**
 * SovereignAiComposition — /sovereign-ai page video
 * Uses: SovereignNarrative (act 1) → HeroReveal (act 2)
 * Light theme, gold/amber accent
 */
export default function SovereignAiComposition({ language = 'en' }) {
  const { fps } = useVideoConfig();
  const c = content.sovereignAi[language];
  const halfDuration = fps * 10;

  return (
    <>
      <Sequence from={0} durationInFrames={halfDuration}>
        <SovereignNarrative
          scenes={[
            { text: c.bullets[0].split('—')[0], accent: c.bullets[0].split('—')[1] || '' },
            { text: c.bullets[1].split('—')[0], accent: c.bullets[1].split('—')[1] || '' },
            { text: c.bullets[2].split('—')[0], accent: c.bullets[2].split('—')[1] || '' },
          ]}
          tagline={c.tagline}
          theme="light"
          primaryColor={BRAND.gold}
        />
      </Sequence>
      <Sequence from={halfDuration} durationInFrames={halfDuration}>
        <HeroReveal
          title={c.title}
          titleAccent={c.titleAccent}
          subtitle={c.subtitle}
          tagline={c.tagline}
          theme="light"
          primaryColor={BRAND.gold}
        />
      </Sequence>
    </>
  );
}
