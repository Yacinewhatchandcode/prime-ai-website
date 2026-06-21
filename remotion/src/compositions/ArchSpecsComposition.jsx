import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Sequence } from 'remotion';
import { BRAND, FONTS, FONT_CSS } from '../brand';

const CONTENT = {
  en: {
    tagline: 'COGNITIVE ARCHITECTURE',
    specs: [
      {
        title: 'Zero Data Sharing',
        desc: 'Your prompts, reasoning logs, and local memories never transit through third-party cloud services.',
        icon: 'shield',
      },
      {
        title: 'Adaptive Model Swarm',
        desc: 'Intelligent dynamic routing between ultra-fast lightweight models and deep reasoning models.',
        icon: 'swarm',
      },
      {
        title: 'Structure Graph Semantics',
        desc: 'Hierarchical vector indexing and local knowledge graph continuously connecting all your data.',
        icon: 'graph',
      },
    ],
  },
  fr: {
    tagline: 'ARCHITECTURE COGNITIVE',
    specs: [
      {
        title: 'Zéro Partage de Données',
        desc: 'Vos prompts, journaux de raisonnement et mémoires locales ne transitent jamais par des services cloud tiers.',
        icon: 'shield',
      },
      {
        title: 'Essaim de Modèles Adaptatif',
        desc: 'Routage dynamique intelligent entre modèles légers ultra-rapides et modèles de raisonnement profond.',
        icon: 'swarm',
      },
      {
        title: 'Sémantique en Graphe Structuré',
        desc: 'Indexation vectorielle hiérarchique et graphe de connaissances local connectant continuellement toutes vos données.',
        icon: 'graph',
      },
    ],
  },
};

// ── SVG Icon Scenes ──────────────────────────────────────────

function ShieldScene({ frame, fps, active }) {
  const opacity = active ? interpolate(frame % (fps * 7), [0, 15, fps * 7 - 15, fps * 7], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const shieldScale = interpolate(frame % (fps * 7), [5, 30], [0.6, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const pulseRadius = interpolate(frame % 60, [0, 60], [80, 120], { extrapolateRight: 'clamp' });
  const pulseOpacity = interpolate(frame % 60, [0, 60], [0.4, 0], { extrapolateRight: 'clamp' });

  // Data packets flowing locally (left-to-right arcs, never going up to "cloud")
  const packets = [0, 1, 2, 3, 4].map((i) => {
    const offset = (frame * 2 + i * 50) % 300;
    const px = 100 + offset * 1.8;
    const py = 300 + Math.sin(offset * 0.04) * 40;
    const pOpacity = offset < 40 || offset > 260 ? 0.2 : 0.7;
    return { px, py, pOpacity };
  });

  // Cloud with X mark (top area)
  const cloudY = 80;
  const crossOpacity = interpolate(frame % 90, [20, 40, 60, 80], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <g style={{ opacity }}>
      {/* Shield glow pulse */}
      <circle cx="480" cy="270" r={pulseRadius} fill="none" stroke={BRAND.gold} strokeWidth="1.5" opacity={pulseOpacity} />

      {/* Shield body */}
      <g transform={`translate(480, 270) scale(${shieldScale})`}>
        <path d="M0,-70 L55,-45 L55,15 Q55,60 0,80 Q-55,60 -55,15 L-55,-45 Z"
          fill="none" stroke={BRAND.gold} strokeWidth="3" />
        <path d="M0,-55 L42,-35 L42,10 Q42,48 0,65 Q-42,48 -42,10 L-42,-35 Z"
          fill={`${BRAND.gold}15`} stroke="none" />
        {/* Lock icon inside shield */}
        <rect x="-12" y="-10" width="24" height="20" rx="3" fill="none" stroke={BRAND.gold} strokeWidth="2" />
        <path d="M-7,-10 L-7,-20 Q-7,-30 0,-30 Q7,-30 7,-20 L7,-10"
          fill="none" stroke={BRAND.gold} strokeWidth="2" />
        <circle cx="0" cy="0" r="3" fill={BRAND.gold} />
      </g>

      {/* Cloud with X (blocked) */}
      <g transform={`translate(480, ${cloudY})`}>
        <path d="M-40,10 Q-40,-15 -15,-15 Q-10,-30 10,-30 Q35,-30 38,-10 Q55,-10 55,10 Q55,25 40,25 L-30,25 Q-45,25 -40,10 Z"
          fill="none" stroke={BRAND.muted} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
        {/* Red X */}
        <g opacity={crossOpacity}>
          <line x1="-12" y1="-12" x2="12" y2="12" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          <line x1="12" y1="-12" x2="-12" y2="12" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>

      {/* Local data flow arcs */}
      {packets.map((p, i) => (
        <circle key={i} cx={p.px} cy={p.py} r="4" fill={BRAND.gold} opacity={p.pOpacity} />
      ))}
      {/* Local label */}
      <text x="480" y="400" textAnchor="middle" fill={BRAND.gold} fontFamily={FONTS.mono}
        fontSize="11" fontWeight="700" letterSpacing="2" opacity="0.7">
        LOCAL ONLY
      </text>
    </g>
  );
}

function SwarmScene({ frame, fps, active }) {
  const opacity = active ? interpolate(frame % (fps * 7), [0, 15, fps * 7 - 15, fps * 7], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;

  // 6 model nodes in a circular arrangement
  const nodeCount = 6;
  const centerX = 480;
  const centerY = 260;
  const radius = 130;
  const labels = ['FAST-7B', 'DEEP-70B', 'CODE-34B', 'VISION-13B', 'REASON-8B', 'EMBED-1B'];
  const sizes = [14, 22, 18, 16, 20, 12]; // relative importance

  const rotationOffset = (frame * 0.5) % 360;

  const nodes = Array.from({ length: nodeCount }).map((_, i) => {
    const angle = ((360 / nodeCount) * i + rotationOffset) * (Math.PI / 180);
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    return { x, y, label: labels[i], size: sizes[i] };
  });

  // Active routing line (cycles which node is "selected")
  const activeNode = Math.floor((frame / (fps * 1.2)) % nodeCount);

  // Routing particles along connection lines
  const particleProgress = (frame % 30) / 30;

  return (
    <g style={{ opacity }}>
      {/* Central router hub */}
      <circle cx={centerX} cy={centerY} r="28" fill={`${BRAND.gold}20`} stroke={BRAND.gold} strokeWidth="2" />
      <circle cx={centerX} cy={centerY} r="12" fill={BRAND.gold} />
      <text x={centerX} y={centerY + 4} textAnchor="middle" fill={BRAND.dark}
        fontFamily={FONTS.mono} fontSize="8" fontWeight="800">
        HUB
      </text>

      {/* Connection lines from hub to each node */}
      {nodes.map((node, i) => {
        const isActive = i === activeNode;
        const lineOpacity = isActive ? 0.8 : 0.15;
        return (
          <g key={i}>
            <line x1={centerX} y1={centerY} x2={node.x} y2={node.y}
              stroke={BRAND.gold} strokeWidth={isActive ? 2 : 0.8} opacity={lineOpacity}
              strokeDasharray={isActive ? 'none' : '4 4'} />
            {/* Routing particle */}
            {isActive && (
              <circle
                cx={centerX + (node.x - centerX) * particleProgress}
                cy={centerY + (node.y - centerY) * particleProgress}
                r="5" fill={BRAND.gold} opacity="0.9"
              />
            )}
          </g>
        );
      })}

      {/* Model nodes */}
      {nodes.map((node, i) => {
        const isActive = i === activeNode;
        const nodeScale = isActive ? 1.2 : 1;
        const glowR = isActive ? node.size + 10 : 0;
        return (
          <g key={`node-${i}`}>
            {isActive && (
              <circle cx={node.x} cy={node.y} r={glowR} fill="none"
                stroke={BRAND.gold} strokeWidth="1" opacity="0.4" />
            )}
            <circle cx={node.x} cy={node.y} r={node.size * nodeScale}
              fill={isActive ? BRAND.gold : `${BRAND.gold}25`}
              stroke={BRAND.gold} strokeWidth={isActive ? 2 : 1} />
            <text x={node.x} y={node.y + node.size + 16} textAnchor="middle"
              fill={isActive ? BRAND.gold : BRAND.muted}
              fontFamily={FONTS.mono} fontSize="9" fontWeight="700" letterSpacing="0.5">
              {node.label}
            </text>
          </g>
        );
      })}

      {/* Swarm label */}
      <text x={centerX} y="420" textAnchor="middle" fill={BRAND.gold} fontFamily={FONTS.mono}
        fontSize="11" fontWeight="700" letterSpacing="2" opacity="0.7">
        DYNAMIC ROUTING
      </text>
    </g>
  );
}

function GraphScene({ frame, fps, active }) {
  const opacity = active ? interpolate(frame % (fps * 7), [0, 15, fps * 7 - 15, fps * 7], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;

  // Knowledge graph nodes
  const graphNodes = [
    { x: 480, y: 200, label: 'CORE', r: 24 },
    { x: 350, y: 280, label: 'DOCS', r: 16 },
    { x: 610, y: 280, label: 'CODE', r: 16 },
    { x: 400, y: 370, label: 'NOTES', r: 14 },
    { x: 560, y: 370, label: 'TASKS', r: 14 },
    { x: 320, y: 180, label: 'MAIL', r: 12 },
    { x: 640, y: 180, label: 'CHAT', r: 12 },
    { x: 480, y: 420, label: 'FILES', r: 12 },
  ];

  // Edges connecting nodes
  const edges = [
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7],
    [1, 3], [2, 4], [1, 5], [2, 6], [3, 7], [4, 7],
  ];

  // Animated edge formation
  const edgeProgress = (i) => {
    const delay = i * 8;
    return interpolate(frame, [delay + 10, delay + 35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  };

  // Vector space dots (background ambiance)
  const vectorDots = Array.from({ length: 30 }).map((_, i) => {
    const vx = 300 + ((i * 137 + frame * 0.3) % 360);
    const vy = 150 + ((i * 89 + frame * 0.2) % 300);
    const vOpacity = 0.1 + Math.sin(frame * 0.05 + i) * 0.08;
    return { vx, vy, vOpacity };
  });

  // Pulsing connector animation
  const pulseEdge = Math.floor((frame / 25) % edges.length);

  return (
    <g style={{ opacity }}>
      {/* Vector space background dots */}
      {vectorDots.map((d, i) => (
        <circle key={`v-${i}`} cx={d.vx} cy={d.vy} r="2" fill={BRAND.gold} opacity={d.vOpacity} />
      ))}

      {/* Edges */}
      {edges.map((edge, i) => {
        const from = graphNodes[edge[0]];
        const to = graphNodes[edge[1]];
        const progress = edgeProgress(i);
        const isPulsing = i === pulseEdge;
        const midX = from.x + (to.x - from.x) * progress;
        const midY = from.y + (to.y - from.y) * progress;
        return (
          <g key={`edge-${i}`}>
            <line x1={from.x} y1={from.y} x2={midX} y2={midY}
              stroke={BRAND.gold} strokeWidth={isPulsing ? 2 : 0.8}
              opacity={isPulsing ? 0.7 : 0.2} />
            {isPulsing && progress >= 1 && (
              <circle cx={from.x + (to.x - from.x) * ((frame % 40) / 40)}
                cy={from.y + (to.y - from.y) * ((frame % 40) / 40)}
                r="4" fill={BRAND.gold} opacity="0.8" />
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {graphNodes.map((node, i) => {
        const nodeDelay = i * 10;
        const nodeOpacity = interpolate(frame, [nodeDelay, nodeDelay + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const isCore = i === 0;
        return (
          <g key={`gn-${i}`} opacity={nodeOpacity}>
            {isCore && (
              <circle cx={node.x} cy={node.y} r={node.r + 8} fill="none"
                stroke={BRAND.gold} strokeWidth="1" opacity="0.3"
                strokeDasharray="3 3" />
            )}
            <circle cx={node.x} cy={node.y} r={node.r}
              fill={isCore ? `${BRAND.gold}30` : `${BRAND.gold}15`}
              stroke={BRAND.gold} strokeWidth={isCore ? 2 : 1} />
            <text x={node.x} y={node.y + 4} textAnchor="middle"
              fill={isCore ? BRAND.gold : BRAND.muted}
              fontFamily={FONTS.mono} fontSize={isCore ? 10 : 8} fontWeight="700">
              {node.label}
            </text>
          </g>
        );
      })}

      {/* Label */}
      <text x="480" y="470" textAnchor="middle" fill={BRAND.gold} fontFamily={FONTS.mono}
        fontSize="11" fontWeight="700" letterSpacing="2" opacity="0.7">
        KNOWLEDGE GRAPH
      </text>
    </g>
  );
}

// ── Main Composition ────────────────────────────────────────

export default function ArchSpecsComposition({ language = 'en' }) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const c = CONTENT[language];
  const totalFrames = fps * 20;

  // Each concept gets ~6.6 seconds (200 frames at 30fps)
  const sectionDuration = Math.floor(totalFrames / 3);
  const activeSection = Math.min(Math.floor(frame / sectionDuration), 2);

  // Global exit
  const exitOpacity = interpolate(frame, [totalFrames - 20, totalFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Tagline
  const taglineOpacity = interpolate(frame, [3, 20], [0, 1], { extrapolateRight: 'clamp' });
  const taglineY = interpolate(frame, [3, 20], [12, 0], { extrapolateRight: 'clamp' });

  // Section text transitions
  const sectionFrame = frame - activeSection * sectionDuration;
  const textOpacity = interpolate(sectionFrame, [0, 20, sectionDuration - 20, sectionDuration], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const textY = interpolate(sectionFrame, [0, 20], [25, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Progress dots
  const meshRotation = interpolate(frame, [0, totalFrames], [0, 90], { extrapolateRight: 'extend' });
  const meshOpacity = interpolate(frame, [0, 30], [0, 0.08], { extrapolateRight: 'clamp' });

  return (
    <div style={{
      width, height, background: BRAND.light,
      display: 'flex', position: 'relative', overflow: 'hidden',
      fontFamily: FONTS.heading, opacity: exitOpacity,
    }}>
      <style>{FONT_CSS}</style>

      {/* Background mesh ring */}
      <svg width="800" height="800" viewBox="0 0 800 800" style={{
        position: 'absolute', top: '50%', left: '55%',
        transform: `translate(-50%, -50%) rotate(${meshRotation}deg)`,
        opacity: meshOpacity,
      }}>
        <circle cx="400" cy="400" r="350" fill="none" stroke={BRAND.gold} strokeWidth="0.6" strokeDasharray="15 20 5 25" />
        <circle cx="400" cy="400" r="280" fill="none" stroke={BRAND.gold} strokeWidth="0.4" strokeDasharray="5 8" />
      </svg>

      {/* Left: Text Content */}
      <div style={{
        flex: 0.85, display: 'flex', flexDirection: 'column', justifyContent: 'center',
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

        {/* Active spec title */}
        <h1 style={{
          opacity: textOpacity, transform: `translateY(${textY}px)`,
          fontFamily: FONTS.heading, fontSize: 52, fontWeight: 800,
          color: BRAND.dark, letterSpacing: -1.5, margin: 0, lineHeight: 1.15,
        }}>
          {c.specs[activeSection].title}
        </h1>

        {/* Description */}
        <p style={{
          opacity: textOpacity, transform: `translateY(${textY * 0.7}px)`,
          fontFamily: FONTS.heading, fontSize: 17, fontWeight: 400,
          color: BRAND.muted, lineHeight: 1.65, marginTop: 20, maxWidth: 480,
        }}>
          {c.specs[activeSection].desc}
        </p>

        {/* Progress indicators */}
        <div style={{
          display: 'flex', gap: 12, marginTop: 40, opacity: taglineOpacity,
        }}>
          {c.specs.map((spec, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div style={{
                width: i === activeSection ? 32 : 10,
                height: 4,
                borderRadius: 2,
                background: i === activeSection ? BRAND.gold : `${BRAND.gold}30`,
                transition: 'all 0.3s',
              }} />
              <span style={{
                fontFamily: FONTS.mono, fontSize: 9, fontWeight: 600,
                color: i === activeSection ? BRAND.gold : BRAND.muted,
                letterSpacing: 1, opacity: i === activeSection ? 1 : 0.5,
              }}>
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Animated SVG Scene */}
      <div style={{
        flex: 1.15, display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 10,
      }}>
        <svg width="660" height="500" viewBox="250 100 460 400">
          <ShieldScene frame={frame} fps={fps} active={activeSection === 0} />
          <SwarmScene frame={frame} fps={fps} active={activeSection === 1} />
          <GraphScene frame={frame} fps={fps} active={activeSection === 2} />
        </svg>
      </div>

      {/* Corner HUD */}
      <div style={{
        position: 'absolute', top: 40, left: 50,
        fontFamily: FONTS.mono, fontSize: 11, color: BRAND.gold,
        opacity: taglineOpacity * 0.6, letterSpacing: 1,
      }}>
        PRIME-AI // SPECIFICATIONS
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
