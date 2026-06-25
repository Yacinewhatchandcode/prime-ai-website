import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { BRAND, FONTS, FONT_CSS } from '../brand';

/**
 * FeatureGrid — 3-4 feature cards appearing sequentially
 * 
 * Props:
 *   tagline      — top pill label
 *   bullets      — array of bullet strings (3-4 items)
 *   theme        — 'light' | 'dark'
 *   primaryColor — accent color
 */
export default function FeatureGrid({
  tagline = 'KEY FEATURES',
  bullets = [],
  theme = 'light',
  primaryColor = BRAND.gold,
}) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isLight = theme === 'light';
  const bg = isLight ? BRAND.light : BRAND.consoleBg;
  const cardBg = isLight ? BRAND.white : 'rgba(255,255,255,0.04)';
  const cardBorder = isLight ? `1px solid ${primaryColor}25` : `1px solid ${primaryColor}30`;
  const textColor = isLight ? BRAND.dark : '#ffffff';
  const mutedColor = isLight ? BRAND.muted : BRAND.consoleSubtext;

  const totalFrames = fps * 20;
  const exitOpacity = interpolate(frame, [totalFrames - 30, totalFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Tagline entrance
  const taglineOpacity = interpolate(frame, [5, 25], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div style={{
      width, height, background: bg, display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: FONTS.heading, position: 'relative',
      overflow: 'hidden', opacity: exitOpacity, padding: '0 80px',
    }}>
      <style>{FONT_CSS}</style>

      {/* Background dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle, ${primaryColor}08 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        opacity: 0.5,
      }} />

      {/* Glow Orb */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        width: 800, height: 800,
        transform: `translate(-50%, -50%)`,
        background: `radial-gradient(circle, ${primaryColor}15 0%, transparent 60%)`,
        borderRadius: '50%',
        opacity: Math.sin(frame * 0.05) * 0.2 + 0.8,
      }} />

      {/* Tagline */}
      <div style={{
        opacity: taglineOpacity,
        display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: 50, zIndex: 10,
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: primaryColor, boxShadow: `0 0 10px ${primaryColor}`,
        }} />
        <span style={{
          fontFamily: FONTS.heading, fontWeight: 700,
          fontSize: 14, color: primaryColor,
          letterSpacing: 4, textTransform: 'uppercase',
        }}>
          {tagline}
        </span>
      </div>

      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: bullets.length <= 3 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
        gap: 28, maxWidth: 1400, width: '100%', zIndex: 10,
      }}>
        {bullets.map((bullet, i) => {
          const delay = 30 + i * 25;
          const cardOpacity = interpolate(frame, [delay, delay + 25], [0, 1], { extrapolateRight: 'clamp' });
          const cardY = interpolate(frame, [delay, delay + 25], [40, 0], { extrapolateRight: 'clamp' });
          const cardScale = interpolate(frame, [delay, delay + 25], [0.95, 1], { extrapolateRight: 'clamp' });

          // Numbered index bullet
          const num = String(i + 1).padStart(2, '0');

          return (
            <div
              key={i}
              style={{
                opacity: cardOpacity,
                transform: `translateY(${cardY}px) scale(${cardScale})`,
                background: cardBg,
                border: cardBorder,
                borderRadius: 20,
                padding: '40px 36px',
                display: 'flex', flexDirection: 'column', gap: 16,
              }}
            >
              {/* Number badge */}
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: `${primaryColor}15`,
                border: `1.5px solid ${primaryColor}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONTS.mono, fontWeight: 700,
                fontSize: 16, color: primaryColor,
              }}>
                {num}
              </div>

              {/* Bullet text */}
              <p style={{
                fontFamily: FONTS.heading,
                fontSize: 22, fontWeight: 600,
                lineHeight: 1.45, color: textColor,
                margin: 0,
              }}>
                {bullet}
              </p>

              {/* Decorative line */}
              <div style={{
                width: 40, height: 2,
                background: `linear-gradient(90deg, ${primaryColor}, transparent)`,
                borderRadius: 2, marginTop: 8,
              }} />
            </div>
          );
        })}
      </div>

      {/* Corner HUD */}
      <div style={{
        position: 'absolute', bottom: 40, left: 50,
        fontFamily: FONTS.mono, fontSize: 11,
        color: mutedColor, opacity: 0.5, letterSpacing: 1,
      }}>
        PRIME-AI // FEATURES
      </div>
    </div>
  );
}
