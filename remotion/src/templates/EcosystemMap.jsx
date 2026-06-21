import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { BRAND, FONTS, FONT_CSS } from '../brand';

/**
 * EcosystemMap — World/device map with node connections lighting up
 * 
 * Props:
 *   tagline      — top label
 *   title        — heading
 *   titleAccent  — accent text
 *   nodes        — array of { label, x (0-1), y (0-1), color }
 *   theme        — 'light' | 'dark'
 *   primaryColor — accent color
 */
export default function EcosystemMap({
  tagline = 'UNIFIED ECOSYSTEM',
  title = 'One Intelligence,',
  titleAccent = 'Every Device.',
  nodes = [
    { label: 'DESKTOP', x: 0.18, y: 0.40, color: BRAND.gold },
    { label: 'MOBILE', x: 0.82, y: 0.35, color: BRAND.goldDark },
    { label: 'CLI', x: 0.25, y: 0.72, color: BRAND.dark },
    { label: 'CLOUD', x: 0.75, y: 0.70, color: BRAND.goldLight },
    { label: 'EDGE', x: 0.50, y: 0.85, color: BRAND.gold },
  ],
  theme = 'light',
  primaryColor = BRAND.gold,
}) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isLight = theme === 'light';
  const bg = isLight ? BRAND.light : BRAND.consoleBg;
  const textColor = isLight ? BRAND.dark : '#ffffff';
  const mutedColor = isLight ? BRAND.muted : BRAND.consoleSubtext;

  const totalFrames = fps * 20;
  const exitOpacity = interpolate(frame, [totalFrames - 30, totalFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Title animation
  const titleOpacity = interpolate(frame, [5, 30], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [5, 30], [25, 0], { extrapolateRight: 'clamp' });

  // Central hub position
  const hubX = width * 0.5;
  const hubY = height * 0.52;

  // Hub pulse
  const hubPulse = interpolate(frame, [0, fps * 2, fps * 4], [1, 1.12, 1], { extrapolateRight: 'extend' });
  const hubGlowOp = interpolate(frame, [0, fps * 2, fps * 4], [0.3, 0.6, 0.3], { extrapolateRight: 'extend' });

  // Map glow rings
  const ringScale = interpolate(frame, [0, fps * 5], [0.8, 1.5], { extrapolateRight: 'extend' });
  const ringOpacity = interpolate(frame, [0, fps * 5], [0.3, 0], { extrapolateRight: 'extend' });

  return (
    <div style={{
      width, height, background: bg, position: 'relative',
      overflow: 'hidden', fontFamily: FONTS.heading, opacity: exitOpacity,
    }}>
      <style>{FONT_CSS}</style>

      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle, ${primaryColor}0a 1px, transparent 1px)`,
        backgroundSize: '35px 35px',
      }} />

      {/* Concentric rings from hub */}
      {[1, 2, 3].map(i => {
        const rScale = interpolate(
          (frame + i * 30) % (fps * 4),
          [0, fps * 4], [0.3, 1.8],
          { extrapolateRight: 'clamp' }
        );
        const rOp = interpolate(
          (frame + i * 30) % (fps * 4),
          [0, fps * 4], [0.4, 0],
          { extrapolateRight: 'clamp' }
        );
        return (
          <div key={i} style={{
            position: 'absolute',
            left: hubX - 200, top: hubY - 200,
            width: 400, height: 400, borderRadius: '50%',
            border: `1px solid ${primaryColor}`,
            transform: `scale(${rScale})`,
            opacity: rOp,
          }} />
        );
      })}

      {/* Connection lines from hub to nodes */}
      <svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0, zIndex: 5 }}>
        {nodes.map((node, i) => {
          const nx = node.x * width;
          const ny = node.y * height;
          const lineDelay = 35 + i * 18;
          const lineProgress = interpolate(frame, [lineDelay, lineDelay + 30], [0, 1], { extrapolateRight: 'clamp' });
          const lx = hubX + (nx - hubX) * lineProgress;
          const ly = hubY + (ny - hubY) * lineProgress;

          // Data packet traveling along line
          const packetProgress = interpolate(
            (frame - lineDelay - 30 + i * 15) % (fps * 2),
            [0, fps * 2], [0, 1],
            { extrapolateRight: 'clamp' }
          );
          const px = hubX + (nx - hubX) * packetProgress;
          const py = hubY + (ny - hubY) * packetProgress;
          const packetOp = lineProgress > 0.9 ? 0.8 : 0;

          return (
            <g key={i}>
              <line
                x1={hubX} y1={hubY} x2={lx} y2={ly}
                stroke={node.color || primaryColor}
                strokeWidth={2} strokeDasharray="6 4"
                opacity={lineProgress * 0.5}
              />
              {/* Data packet */}
              <circle
                cx={px} cy={py} r={5}
                fill={node.color || primaryColor}
                opacity={packetOp}
              />
            </g>
          );
        })}
      </svg>

      {/* Central Hub */}
      <div style={{
        position: 'absolute', left: hubX - 55, top: hubY - 55,
        width: 110, height: 110, borderRadius: '50%',
        background: `radial-gradient(circle, ${primaryColor}35, ${primaryColor}10)`,
        border: `2.5px solid ${primaryColor}70`,
        transform: `scale(${hubPulse})`,
        boxShadow: `0 0 50px ${primaryColor}40`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 20,
      }}>
        {/* Triangle logo */}
        <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
          <path d="M50 15L85 75H70L50 40L30 75H15L50 15Z" fill={primaryColor} />
          <path d="M50 35L62 58H38L50 35Z" fill={isLight ? BRAND.dark : '#ffffff'} opacity="0.8" />
        </svg>
        <span style={{
          fontFamily: FONTS.mono, fontSize: 9, fontWeight: 700,
          color: primaryColor, letterSpacing: 2, marginTop: 4,
        }}>
          PRIME
        </span>
      </div>

      {/* Device Nodes */}
      {nodes.map((node, i) => {
        const nodeDelay = 35 + i * 18;
        const nodeOpacity = interpolate(frame, [nodeDelay + 15, nodeDelay + 35], [0, 1], { extrapolateRight: 'clamp' });
        const nodeScale = interpolate(frame, [nodeDelay + 15, nodeDelay + 35], [0.6, 1], { extrapolateRight: 'clamp' });

        // Per-node pulse
        const nPulse = interpolate(
          (frame + i * 20) % (fps * 3),
          [0, fps * 1.5, fps * 3], [1, 1.08, 1],
          { extrapolateRight: 'clamp' }
        );

        const nx = node.x * width;
        const ny = node.y * height;

        return (
          <div key={i} style={{
            position: 'absolute',
            left: nx - 50, top: ny - 28,
            width: 100, textAlign: 'center',
            opacity: nodeOpacity,
            transform: `scale(${nodeScale * nPulse})`,
            zIndex: 15,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: isLight ? BRAND.white : 'rgba(255,255,255,0.06)',
              border: `1.5px solid ${(node.color || primaryColor)}40`,
              margin: '0 auto 8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 4px 20px ${(node.color || primaryColor)}20`,
            }}>
              <div style={{
                width: 14, height: 14, borderRadius: '50%',
                background: node.color || primaryColor,
                boxShadow: `0 0 10px ${node.color || primaryColor}`,
              }} />
            </div>
            <span style={{
              fontFamily: FONTS.mono, fontSize: 11, fontWeight: 700,
              color: node.color || primaryColor, letterSpacing: 1,
            }}>
              {node.label}
            </span>
          </div>
        );
      })}

      {/* Title */}
      <div style={{
        position: 'absolute', top: 50, left: 0, right: 0,
        textAlign: 'center', zIndex: 30,
        opacity: titleOpacity, transform: `translateY(${titleY}px)`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 14 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: primaryColor, boxShadow: `0 0 10px ${primaryColor}` }} />
          <span style={{ fontFamily: FONTS.heading, fontWeight: 700, fontSize: 13, color: primaryColor, letterSpacing: 4, textTransform: 'uppercase' }}>
            {tagline}
          </span>
        </div>
        <h1 style={{
          fontFamily: FONTS.heading, fontSize: 56, fontWeight: 800,
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

      {/* HUD */}
      <div style={{
        position: 'absolute', bottom: 30, left: 50,
        fontFamily: FONTS.mono, fontSize: 11, color: mutedColor, opacity: 0.4, letterSpacing: 1,
      }}>
        PRIME-AI // ECOSYSTEM
      </div>
      <div style={{
        position: 'absolute', bottom: 30, right: 50,
        fontFamily: FONTS.mono, fontSize: 11, color: mutedColor, opacity: 0.4, letterSpacing: 1,
      }}>
        prime-ai.fr
      </div>
    </div>
  );
}
