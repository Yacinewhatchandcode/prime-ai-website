import React from 'react';
import { Sequence, useVideoConfig } from 'remotion';
import { FleetDashboard, SovereignNarrative } from '../templates';
import content from '../content';
import { BRAND } from '../brand';

/**
 * CredentialsComposition — /credentials page video
 * Uses: SovereignNarrative (act 1) → FleetDashboard (act 2)
 * Dark theme, amber/gold accent
 */
export default function CredentialsComposition({ language = 'en' }) {
  const { fps } = useVideoConfig();
  const c = content.credentials[language];
  const halfDuration = fps * 10;

  return (
    <>
      <Sequence from={0} durationInFrames={halfDuration}>
        <SovereignNarrative
          scenes={[
            { text: c.title, accent: c.titleAccent },
            { text: c.bullets[0].split('—')[0], accent: c.bullets[0].split('—')[1] || '' },
            { text: c.bullets[2].split('—')[0], accent: c.bullets[2].split('—')[1] || '' },
          ]}
          tagline={c.tagline}
          theme="dark"
          primaryColor={BRAND.amber}
        />
      </Sequence>
      <Sequence from={halfDuration} durationInFrames={halfDuration}>
        <FleetDashboard
          title="Credential"
          titleAccent="Vault"
          metrics={[
            { label: 'BROWSER SESSIONS', value: 'ACTIVE', status: 'HEADED', color: BRAND.green },
            { label: 'VAULT STATUS', value: 'SEALED', status: 'ENCRYPTED', color: BRAND.amber },
            { label: 'PIPELINE', value: 'B2B', status: 'RUNNING', color: BRAND.blue },
            { label: 'AUDIT TRAIL', value: '100%', status: 'SOVEREIGN', color: BRAND.gold },
          ]}
          logLines={c.bullets.map(b => b.replace('—', ':'))}
          theme="dark"
          primaryColor={BRAND.amber}
        />
      </Sequence>
    </>
  );
}
