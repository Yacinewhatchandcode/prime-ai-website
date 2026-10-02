import React from 'react';
import { Sequence, useVideoConfig } from 'remotion';
import { FleetDashboard, SovereignNarrative } from '../templates';
import content from '../content';
import { BRAND } from '../brand';
import IllustrativeLabel from '../templates/IllustrativeLabel';

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
          language={language}
          title="Credential"
          titleAccent="Vault"
          metrics={[
            { label: 'BROWSER', value: 'LOCAL', status: 'DEMO', color: BRAND.green },
            { label: 'VAULT', value: language === 'fr' ? 'ILLUSTRATION' : 'ILLUSTRATIVE', status: 'DEMO', color: BRAND.amber },
            { label: 'PIPELINE', value: language === 'fr' ? 'NON CONFIGURÉ' : 'NOT CONFIGURED', status: 'DEMO', color: BRAND.blue },
            { label: 'AUDIT', value: language === 'fr' ? 'REVUE HUMAINE' : 'HUMAN REVIEW', status: 'DEMO', color: BRAND.gold },
          ]}
          logLines={c.bullets.map(b => b.replace('—', ':'))}
          theme="dark"
          primaryColor={BRAND.amber}
        />
      </Sequence>
      <IllustrativeLabel language={language} />
    </>
  );
}
