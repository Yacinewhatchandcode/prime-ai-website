import React from 'react';
import { Sequence, useVideoConfig } from 'remotion';
import { FleetDashboard, MeshVisualization } from '../templates';
import content from '../content';
import { BRAND } from '../brand';

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
          nodeLabels={['THE ORB', 'M4 NODE', 'R-PI EDGE', 'AI TRADER', 'SCOUT', 'AUDITOR']}
          theme="dark"
          primaryColor={BRAND.purple}
        />
      </Sequence>
      <Sequence from={halfDuration} durationInFrames={halfDuration}>
        <FleetDashboard
          title={c.title}
          titleAccent={c.titleAccent}
          metrics={[
            { label: 'AGENTS ONLINE', value: '14', status: 'ACTIVE', color: BRAND.green },
            { label: 'MESH STATUS', value: 'SYNCED', status: 'OK', color: BRAND.green },
            { label: 'MCP LAYER', value: 'ACTIVE', status: 'OPERATIONAL', color: BRAND.blue },
            { label: 'LATENCY', value: '23ms', status: 'OPTIMAL', color: BRAND.amber },
          ]}
          logLines={[
            'A2A Protocol: Initializing Agent bridge...',
            'MCP Server: Verified 14/14 agents online.',
            'Edge Node: Sovereign Mesh connected.',
            'Fleet Commander: Heartbeat established (23ms).',
            'Sovereign Auditor: 0 discrepancies found.',
          ]}
          theme="dark"
          primaryColor={BRAND.purple}
        />
      </Sequence>
    </>
  );
}
