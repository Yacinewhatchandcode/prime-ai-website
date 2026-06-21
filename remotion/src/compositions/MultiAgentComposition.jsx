import React from 'react';
import { Sequence, useVideoConfig } from 'remotion';
import { MeshVisualization, FeatureGrid } from '../templates';
import content from '../content';
import { BRAND } from '../brand';

/**
 * MultiAgentComposition — /multi-agent-systems page video
 * Uses: MeshVisualization (act 1) → FeatureGrid (act 2)
 * Dark theme, purple accent
 */
export default function MultiAgentComposition({ language = 'en' }) {
  const { fps } = useVideoConfig();
  const c = content.multiAgent[language];
  const halfDuration = fps * 10;

  return (
    <>
      <Sequence from={0} durationInFrames={halfDuration}>
        <MeshVisualization
          tagline={c.tagline}
          title={c.title}
          titleAccent={c.titleAccent}
          nodeLabels={[
            'ANALYZER', 'CODER', 'REVIEWER',
            'PLANNER', 'EXECUTOR', 'AUDITOR',
          ]}
          theme="dark"
          primaryColor={BRAND.purple}
        />
      </Sequence>
      <Sequence from={halfDuration} durationInFrames={halfDuration}>
        <FeatureGrid
          tagline={c.tagline}
          bullets={c.bullets}
          theme="dark"
          primaryColor={BRAND.purple}
        />
      </Sequence>
    </>
  );
}
