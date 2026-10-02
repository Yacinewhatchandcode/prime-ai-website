import React from 'react';
import { Sequence, useVideoConfig } from 'remotion';
import { FleetDashboard, MeshVisualization } from '../templates';
import content from '../content';
import { BRAND } from '../brand';
import IllustrativeLabel from '../templates/IllustrativeLabel';

/**
 * FleetCommandComposition — /fleet-command page video
 * Uses: MeshVisualization (act 1) → FleetDashboard (act 2)
 * Dark theme, purple accent
 */
export default function FleetCommandComposition({ language = 'en' }) {
  const { fps } = useVideoConfig();
  const c = content.fleetCommand[language];
  const halfDuration = fps * 10;

  return (
    <>
      <Sequence from={0} durationInFrames={halfDuration}>
        <MeshVisualization
          tagline={c.tagline}
          title={c.title}
          titleAccent={c.titleAccent}
          nodeLabels={['THE ORB', 'M4 NODE', 'OPTIONAL EDGE', 'PLANNER', 'ANALYST', 'REVIEWER']}
          theme="dark"
          primaryColor={BRAND.purple}
        />
      </Sequence>
      <Sequence from={halfDuration} durationInFrames={halfDuration}>
        <FleetDashboard
          language={language}
          title={c.title}
          titleAccent={c.titleAccent}
          metrics={[
            { label: 'PLANNER', value: language === 'fr' ? 'CONSEIL' : 'ADVISORY', status: 'DEMO', color: BRAND.green },
            { label: 'ANALYST', value: language === 'fr' ? 'CONSEIL' : 'ADVISORY', status: 'DEMO', color: BRAND.green },
            { label: 'REVIEWER', value: language === 'fr' ? 'CONSEIL' : 'ADVISORY', status: 'DEMO', color: BRAND.blue },
            { label: language === 'fr' ? 'MÉMOIRE' : 'MEMORY', value: 'LOCAL', status: 'DEMO', color: BRAND.amber },
          ]}
          logLines={language === 'fr' ? [
            'Objectif: Une demande consultative locale.',
            'Planification: Plan proposé, sans exécution.',
            'Analyse: Contexte fourni par un humain.',
            'Revue: Limites et risques à vérifier.',
            'Mémoire: Résultats locaux, aucun outil exécuté.',
          ] : [
            'Goal: A local advisory request.',
            'Planner: Proposed plan, no execution.',
            'Analyst: Human-supplied context.',
            'Reviewer: Limitations and risks to verify.',
            'Memory: Local results, no tools executed.',
          ]}
          theme="dark"
          primaryColor={BRAND.purple}
        />
      </Sequence>
      <IllustrativeLabel language={language} />
    </>
  );
}
