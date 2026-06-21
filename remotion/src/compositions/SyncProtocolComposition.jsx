import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { BRAND, FONTS, FONT_CSS } from '../brand';

const CONTENT = {
  en: {
    tagline: 'SYNC PROTOCOL',
    title: 'How does asynchronous',
    titleAccent: 'synchronization work?',
    subtitle: 'Thanks to our encrypted P2P protocol, each node in your ecosystem maintains an optimized local cache.',
    nodes: [
      { label: 'Desktop', sublabel: 'macOS', icon: '🖥' },
      { label: 'Mobile', sublabel: 'iOS', icon: '📱' },
      { label: 'CLI', sublabel: 'Local', icon: '⌨' },
      { label: 'Private', sublabel: 'Cloud', icon: '☁' },
    ],
    statuses: ['Awaiting', 'Syncing', 'Synchronized'],
  },
  fr: {
    tagline: 'PROTOCOLE SYNC',
    title: 'Comment fonctionne la',
    titleAccent: 'synchronisation asynchrone ?',
    subtitle: 'Grâce à notre protocole P2P chiffré, chaque nœud de votre écosystème maintient un cache local optimisé.',
    nodes: [
      { label: 'Bureau', sublabel: 'macOS', icon: '🖥' },
      { label: 'Mobile', sublabel: 'iOS', icon: '📱' },
      { label: 'CLI', sublabel: 'Local', icon: '⌨' },
      { label: 'Cloud', sublabel: 'Privé', icon: '☁' },
    ],
    statuses: ['En attente', 'Sync...', 'Synchronisé'],
  },
};

// ── Helper: draw encrypted packet along a path ──
function SyncPacket({ x, y, opacity }) {
  return (
    <g opacity={opacity}>
      <rect x={x - 6} y={y - 4} width="12" height="8" rx="2"
        fill={BRAND.gold} opacity="0.9" />
      <text x={x} y={y + 3} textAnchor="middle"
        fill={BRAND.dark} fontFamily={FONTS.mono} fontSize="5" fontWeight="800">
        🔒
      </text>
    </g>
  );
}

export default function SyncProtocolComposition({ language = 'en' }) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const c = CONTENT[language];
  const totalFrames = fps * 20;

  // ── Layout: 4 nodes in a diamond arrangement (right panel) ──
  const cx = 520; // center of node cluster
  const cy = 290;
  const spread = 150;

  const nodePositions = [
    { x: cx, y: cy - spread },      // Top: Desktop
    { x: cx + spread, y: cy },      // Right: Mobile
    { x: cx, y: cy + spread },      // Bottom: CLI
    { x: cx - spread, y: cy },      // Left: Cloud
  ];

  // All possible connections (P2P mesh — every node to every other)
  const connections = [];
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      connections.push([i, j]);
    }
  }

  // ── Timing ──
  const exitOpacity = interpolate(frame, [totalFrames - 20, totalFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Text entrance
  const taglineOpacity = interpolate(frame, [3, 18], [0, 1], { extrapolateRight: 'clamp' });
  const taglineY = interpolate(frame, [3, 18], [12, 0], { extrapolateRight: 'clamp' });
  const titleOpacity = interpolate(frame, [12, 35], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [12, 35], [25, 0], { extrapolateRight: 'clamp' });
  const accentOpacity = interpolate(frame, [25, 50], [0, 1], { extrapolateRight: 'clamp' });
  const accentY = interpolate(frame, [25, 50], [25, 0], { extrapolateRight: 'clamp' });
  const subOpacity = interpolate(frame, [40, 65], [0, 1], { extrapolateRight: 'clamp' });

  // Nodes appear staggered
  const nodeAppear = (i) => {
    const delay = 50 + i * 25;
    return {
      opacity: interpolate(frame, [delay, delay + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      scale: interpolate(frame, [delay, delay + 20], [0.5, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    };
  };

  // Connection lines appear after nodes
  const lineAppear = (i) => {
    const delay = 140 + i * 12;
    return interpolate(frame, [delay, delay + 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  };

  // Status transitions: each node goes Awaiting → Syncing → Synchronized
  const getStatus = (nodeIdx) => {
    const syncStart = 200 + nodeIdx * 60;
    const syncEnd = syncStart + 50;
    if (frame < syncStart) return 0; // Awaiting
    if (frame < syncEnd) return 1;   // Syncing
    return 2;                         // Synchronized
  };

  const statusColors = ['#94a3b8', BRAND.amber, BRAND.green];

  // Mesh rotation (background)
  const meshRotation = interpolate(frame, [0, totalFrames], [0, 60], { extrapolateRight: 'extend' });
  const meshOpacity = interpolate(frame, [0, 40], [0, 0.06], { extrapolateRight: 'clamp' });

  // "No Central Server" badge
  const badgeOpacity = interpolate(frame, [350, 380], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{
      width, height, background: BRAND.light,
      display: 'flex', position: 'relative', overflow: 'hidden',
      fontFamily: FONTS.heading, opacity: exitOpacity,
    }}>
      <style>{FONT_CSS}</style>

      {/* Background mesh ring */}
      <svg width="900" height="900" viewBox="0 0 900 900" style={{
        position: 'absolute', top: '50%', left: '58%',
        transform: `translate(-50%, -50%) rotate(${meshRotation}deg)`,
        opacity: meshOpacity,
      }}>
        <circle cx="450" cy="450" r="400" fill="none" stroke={BRAND.gold} strokeWidth="0.5" strokeDasharray="12 18 6 20" />
        <circle cx="450" cy="450" r="320" fill="none" stroke={BRAND.gold} strokeWidth="0.3" strokeDasharray="4 6" />
      </svg>

      {/* Left: Text Content */}
      <div style={{
        flex: 0.8, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '0 60px', zIndex: 10,
      }}>
        {/* Tagline */}
        <div style={{
          opacity: taglineOpacity, transform: `translateY(${taglineY}px)`,
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: BRAND.gold, boxShadow: `0 0 12px ${BRAND.gold}` }} />
          <span style={{
            fontFamily: FONTS.heading, fontWeight: 700, fontSize: 13,
            color: BRAND.gold, letterSpacing: 4,
          }}>
            {c.tagline}
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          opacity: titleOpacity, transform: `translateY(${titleY}px)`,
          fontFamily: FONTS.heading, fontSize: 42, fontWeight: 800,
          color: BRAND.dark, letterSpacing: -1, margin: 0, lineHeight: 1.15,
        }}>
          {c.title}
        </h1>
        <h1 style={{
          opacity: accentOpacity, transform: `translateY(${accentY}px)`,
          fontFamily: FONTS.heading, fontSize: 42, fontWeight: 800,
          background: `linear-gradient(90deg, ${BRAND.gold}, ${BRAND.goldLight})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', letterSpacing: -1, margin: 0, lineHeight: 1.15,
        }}>
          {c.titleAccent}
        </h1>

        {/* Subtitle */}
        <p style={{
          opacity: subOpacity, fontFamily: FONTS.heading,
          fontSize: 16, fontWeight: 400, color: BRAND.muted,
          lineHeight: 1.65, marginTop: 20, maxWidth: 420,
        }}>
          {c.subtitle}
        </p>

        {/* Node status list */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 10, marginTop: 32,
        }}>
          {c.nodes.map((node, i) => {
            const status = getStatus(i);
            const na = nodeAppear(i);
            return (
              <div key={i} style={{
                opacity: na.opacity,
                display: 'flex', alignItems: 'center', gap: 10,
                background: `${BRAND.gold}08`, border: `1px solid ${BRAND.gold}15`,
                borderRadius: 8, padding: '8px 14px',
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: statusColors[status],
                  boxShadow: status === 2 ? `0 0 8px ${BRAND.green}` : 'none',
                }} />
                <span style={{
                  fontFamily: FONTS.mono, fontSize: 11, fontWeight: 600,
                  color: BRAND.dark, flex: 1,
                }}>
                  {node.label} ({node.sublabel})
                </span>
                <span style={{
                  fontFamily: FONTS.mono, fontSize: 10, fontWeight: 700,
                  color: statusColors[status], letterSpacing: 0.5,
                }}>
                  {c.statuses[status]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: P2P Mesh Visualization */}
      <div style={{
        flex: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 10,
      }}>
        <svg width="500" height="500" viewBox="270 60 500 460">

          {/* Connection lines */}
          {connections.map(([a, b], i) => {
            const from = nodePositions[a];
            const to = nodePositions[b];
            const progress = lineAppear(i);
            const midX = from.x + (to.x - from.x) * progress;
            const midY = from.y + (to.y - from.y) * progress;

            // Animated packets along lines
            const packetT = ((frame * 1.5 + i * 40) % 80) / 80;
            const packetX = from.x + (to.x - from.x) * packetT;
            const packetY = from.y + (to.y - from.y) * packetT;
            const packetVis = progress >= 1 && getStatus(a) >= 1 && getStatus(b) >= 1;

            return (
              <g key={`conn-${i}`}>
                <line x1={from.x} y1={from.y} x2={midX} y2={midY}
                  stroke={BRAND.gold} strokeWidth="1.2" opacity="0.25"
                  strokeDasharray="6 4" />
                {packetVis && (
                  <SyncPacket x={packetX} y={packetY} opacity={0.7} />
                )}
              </g>
            );
          })}

          {/* Device nodes */}
          {nodePositions.map((pos, i) => {
            const na = nodeAppear(i);
            const status = getStatus(i);
            const node = c.nodes[i];
            const ringPulse = status === 1 ? 0.3 + Math.sin(frame * 0.15) * 0.2 : 0;
            const syncedGlow = status === 2 ? 0.4 : 0;

            return (
              <g key={`node-${i}`} opacity={na.opacity}>
                {/* Sync pulse ring */}
                {status === 1 && (
                  <circle cx={pos.x} cy={pos.y} r="52"
                    fill="none" stroke={BRAND.amber} strokeWidth="1.5" opacity={ringPulse} />
                )}
                {/* Synced glow */}
                {status === 2 && (
                  <circle cx={pos.x} cy={pos.y} r="48"
                    fill="none" stroke={BRAND.green} strokeWidth="2" opacity={syncedGlow} />
                )}

                {/* Main node circle */}
                <circle cx={pos.x} cy={pos.y} r="38"
                  fill={BRAND.white}
                  stroke={statusColors[status]} strokeWidth="2.5" />

                {/* Icon */}
                <text x={pos.x} y={pos.y - 2} textAnchor="middle" fontSize="22">
                  {node.icon}
                </text>

                {/* Label */}
                <text x={pos.x} y={pos.y + 58} textAnchor="middle"
                  fill={BRAND.dark} fontFamily={FONTS.heading}
                  fontSize="13" fontWeight="700">
                  {node.label}
                </text>
                <text x={pos.x} y={pos.y + 72} textAnchor="middle"
                  fill={BRAND.muted} fontFamily={FONTS.mono}
                  fontSize="10" fontWeight="500">
                  {node.sublabel}
                </text>

                {/* Status dot */}
                <circle cx={pos.x + 28} cy={pos.y - 28} r="6"
                  fill={statusColors[status]}
                  stroke={BRAND.white} strokeWidth="2" />
              </g>
            );
          })}

          {/* "No Central Server" badge */}
          <g opacity={badgeOpacity}>
            <rect x={cx - 70} y={cy - 16} width="140" height="32" rx="16"
              fill={BRAND.dark} />
            <text x={cx} y={cy + 4} textAnchor="middle"
              fill={BRAND.gold} fontFamily={FONTS.mono}
              fontSize="10" fontWeight="700" letterSpacing="1.5">
              P2P ENCRYPTED
            </text>
          </g>
        </svg>
      </div>

      {/* Corner HUD */}
      <div style={{
        position: 'absolute', top: 40, left: 50,
        fontFamily: FONTS.mono, fontSize: 11, color: BRAND.gold,
        opacity: taglineOpacity * 0.6, letterSpacing: 1,
      }}>
        PRIME-AI // SYNC
      </div>
      <div style={{
        position: 'absolute', bottom: 40, right: 50,
        fontFamily: FONTS.mono, fontSize: 11, color: BRAND.muted,
        opacity: taglineOpacity * 0.5, letterSpacing: 1,
      }}>
        prime-ai.fr
      </div>
    </div>
  );
}
