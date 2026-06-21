import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { BRAND, FONTS, FONT_CSS } from '../brand';

/**
 * MeshVisualization — Animated node mesh showing agents connecting
 * 
 * Props:
 *   tagline      — top label
 *   title        — heading
 *   titleAccent  — accent heading
 *   nodeLabels   — array of node label strings (4-8 items)
 *   theme        — 'light' | 'dark'
 *   primaryColor — accent color
 */
export default function MeshVisualization({
  tagline = 'AGENT MESH',
  title = 'Connected',
  titleAccent = 'Intelligence',
  nodeLabels = ['Agent A', 'Agent B', 'Agent C', 'Agent D', 'Agent E', 'Agent F'],
  theme = 'dark',
  primaryColor = BRAND.purple,
}) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isLight = theme === 'light';
  const bg = isLight ? BRAND.light : BRAND.consoleBg;
  const textColor = isLight ? BRAND.dark : '#ffffff';
  const mutedColor = isLight ? BRAND.muted : BRAND.consoleSubtext;

  const totalFrames = fps * 20;
  const exitOpacity = interpolate(frame, [totalFrames - 30, totalFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Node positions in a circle
  const centerX = width / 2;
  const centerY = height / 2 + 30;
  const radius = 320;
  const nodes = nodeLabels.map((label, i) => {
    const angle = (i / nodeLabels.length) * Math.PI * 2 - Math.PI / 2;
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      label,
    };
  });

  // Central orb
  const orbPulse = interpolate(frame, [0, fps * 2, fps * 4], [0.9, 1.1, 0.9], { extrapolateRight: 'extend' });
  const orbGlow = interpolate(frame, [0, fps * 2, fps * 4], [0.3, 0.6, 0.3], { extrapolateRight: 'extend' });

  // Title animations
  const titleOpacity = interpolate(frame, [10, 35], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [10, 35], [30, 0], { extrapolateRight: 'clamp' });

  return (
    <div style={{
      width, height, background: bg, position: 'relative',
      overflow: 'hidden', fontFamily: FONTS.heading, opacity: exitOpacity,
    }}>
      <style>{FONT_CSS}</style>

      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(${primaryColor}08 1px, transparent 1px), linear-gradient(90deg, ${primaryColor}08 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* Connection lines */}
      <svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }}>
        {nodes.map((node, i) => {
          // Connect each node to center
          const lineDelay = 30 + i * 12;
          const lineProgress = interpolate(frame, [lineDelay, lineDelay + 30], [0, 1], { extrapolateRight: 'clamp' });
          const lineX = centerX + (node.x - centerX) * lineProgress;
          const lineY = centerY + (node.y - centerY) * lineProgress;

          return (
            <line
              key={`center-${i}`}
              x1={centerX} y1={centerY}
              x2={lineX} y2={lineY}
              stroke={primaryColor}
              strokeWidth={1.5}
              strokeDasharray="8 4"
              opacity={lineProgress * 0.5}
            />
          );
        })}
        {/* Inter-node connections (every other pair) */}
        {nodes.map((nodeA, i) => {
          const j = (i + 1) % nodes.length;
          const nodeB = nodes[j];
          const connDelay = 60 + i * 10;
          const connProgress = interpolate(frame, [connDelay, connDelay + 25], [0, 1], { extrapolateRight: 'clamp' });
          return (
            <line
              key={`conn-${i}`}
              x1={nodeA.x} y1={nodeA.y}
              x2={nodeA.x + (nodeB.x - nodeA.x) * connProgress}
              y2={nodeA.y + (nodeB.y - nodeA.y) * connProgress}
              stroke={primaryColor}
              strokeWidth={1}
              opacity={connProgress * 0.3}
            />
          );
        })}
      </svg>

      {/* Central Orb */}
      <div style={{
        position: 'absolute',
        left: centerX - 50, top: centerY - 50,
        width: 100, height: 100,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${primaryColor}40, ${primaryColor}10)`,
        border: `2px solid ${primaryColor}60`,
        transform: `scale(${orbPulse})`,
        boxShadow: `0 0 60px ${primaryColor}${Math.round(orbGlow * 99).toString(16).padStart(2, '0')}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 20,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: primaryColor,
          boxShadow: `0 0 30px ${primaryColor}`,
        }} />
      </div>

      {/* Agent Nodes */}
      {nodes.map((node, i) => {
        const nodeDelay = 25 + i * 15;
        const nodeOpacity = interpolate(frame, [nodeDelay, nodeDelay + 20], [0, 1], { extrapolateRight: 'clamp' });
        const nodeScale = interpolate(frame, [nodeDelay, nodeDelay + 20], [0.5, 1], { extrapolateRight: 'clamp' });
        // Continuous pulse per node
        const pulseOffset = i * (fps / nodeLabels.length);
        const nodePulse = interpolate(
          (frame + pulseOffset) % (fps * 3),
          [0, fps * 1.5, fps * 3],
          [1, 1.15, 1],
          { extrapolateRight: 'clamp' }
        );

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: node.x - 60, top: node.y - 30,
              width: 120, textAlign: 'center',
              opacity: nodeOpacity,
              transform: `scale(${nodeScale * nodePulse})`,
              zIndex: 15,
            }}
          >
            <div style={{
              width: 20, height: 20,
              borderRadius: '50%',
              background: primaryColor,
              boxShadow: `0 0 20px ${primaryColor}80`,
              margin: '0 auto 8px',
            }} />
            <span style={{
              fontFamily: FONTS.mono,
              fontSize: 12, fontWeight: 700,
              color: primaryColor,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}>
              {node.label}
            </span>
          </div>
        );
      })}

      {/* Title overlay at top */}
      <div style={{
        position: 'absolute', top: 60, left: 0, right: 0,
        textAlign: 'center', zIndex: 30,
        opacity: titleOpacity, transform: `translateY(${titleY}px)`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: primaryColor, boxShadow: `0 0 10px ${primaryColor}` }} />
          <span style={{ fontFamily: FONTS.heading, fontWeight: 700, fontSize: 13, color: primaryColor, letterSpacing: 4, textTransform: 'uppercase' }}>
            {tagline}
          </span>
        </div>
        <h1 style={{
          fontFamily: FONTS.heading, fontSize: 64, fontWeight: 800,
          lineHeight: 1.15, color: textColor, letterSpacing: -2, margin: 0,
        }}>
          {title}{' '}
          <span style={{
            background: `linear-gradient(90deg, ${primaryColor}, ${BRAND.goldLight})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            {titleAccent}
          </span>
        </h1>
      </div>

      {/* HUD corners */}
      <div style={{
        position: 'absolute', bottom: 40, right: 50,
        fontFamily: FONTS.mono, fontSize: 11, color: mutedColor,
        opacity: 0.4, letterSpacing: 1,
      }}>
        MESH TOPOLOGY // ACTIVE
      </div>
    </div>
  );
}
