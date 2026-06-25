import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';
import { BRAND, FONTS, FONT_CSS } from '../brand';

/**
 * HeroReveal — Animated title + subtitle with mesh background
 * 
 * Props:
 *   title       — Main heading line 1
 *   titleAccent — Main heading line 2 (gold gradient)
 *   subtitle    — Sub-heading text
 *   tagline     — Small uppercase pill text
 *   theme       — 'light' | 'dark'
 *   primaryColor — accent color (default gold)
 */
export default function HeroReveal({
  title = 'Sovereign.',
  titleAccent = 'Autonomous.',
  subtitle = '',
  tagline = 'PRIME-AI',
  theme = 'light',
  primaryColor = BRAND.gold,
}) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isLight = theme === 'light';
  const bg = isLight ? BRAND.light : BRAND.consoleBg;
  const textColor = isLight ? BRAND.dark : '#ffffff';
  const mutedColor = isLight ? BRAND.muted : BRAND.consoleSubtext;

  // Animation timings
  const taglineOpacity = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: 'clamp' });
  const taglineY = interpolate(frame, [10, 30], [20, 0], { extrapolateRight: 'clamp' });

  const titleOpacity = interpolate(frame, [20, 45], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [20, 45], [40, 0], { extrapolateRight: 'clamp' });

  const accentOpacity = interpolate(frame, [35, 60], [0, 1], { extrapolateRight: 'clamp' });
  const accentY = interpolate(frame, [35, 60], [40, 0], { extrapolateRight: 'clamp' });

  const subtitleOpacity = interpolate(frame, [55, 80], [0, 1], { extrapolateRight: 'clamp' });
  const subtitleY = interpolate(frame, [55, 80], [20, 0], { extrapolateRight: 'clamp' });

  // Mesh ring rotation
  const meshRotation = interpolate(frame, [0, fps * 20], [0, 360], { extrapolateRight: 'extend' });
  const meshOpacity = interpolate(frame, [0, 40], [0, 0.25], { extrapolateRight: 'clamp' });

  // Glow pulse
  const glowScale = interpolate(frame, [0, fps * 2, fps * 4], [0.95, 1.05, 0.95], { extrapolateRight: 'extend' });
  const glowOpacity = interpolate(frame, [0, fps * 2, fps * 4], [0.15, 0.35, 0.15], { extrapolateRight: 'extend' });

  // Exit fade
  const totalFrames = fps * 20;
  const exitOpacity = interpolate(frame, [totalFrames - 30, totalFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{
      width, height, background: bg, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: FONTS.heading, position: 'relative',
      overflow: 'hidden', opacity: exitOpacity,
    }}>
      <style>{FONT_CSS}</style>

      {/* Mesh Background Rings */}
      <svg
        width="800" height="800"
        viewBox="0 0 800 800"
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: `translate(-50%, -50%) rotate(${meshRotation}deg)`,
          opacity: meshOpacity,
        }}
      >
        <circle cx="400" cy="400" r="350" fill="none" stroke={primaryColor} strokeWidth="1" strokeDasharray="30 20 10 40 100 20" />
        <circle cx="400" cy="400" r="300" fill="none" stroke={primaryColor} strokeWidth="0.5" strokeDasharray="10 10" />
        <circle cx="400" cy="400" r="250" fill="none" stroke={primaryColor} strokeWidth="0.75" strokeDasharray="5 15" />
      </svg>

      <svg
        width="800" height="800"
        viewBox="0 0 800 800"
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: `translate(-50%, -50%) rotate(${-meshRotation * 0.6}deg)`,
          opacity: meshOpacity * 0.6,
        }}
      >
        <circle cx="400" cy="400" r="320" fill="none" stroke={primaryColor} strokeWidth="1" strokeDasharray="10 30 15 15" />
        <circle cx="400" cy="400" r="270" fill="none" stroke={isLight ? BRAND.dark : '#ffffff'} strokeWidth="0.5" strokeDasharray="2 6" />
      </svg>

      {/* Glow Orb */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        width: 500, height: 500,
        transform: `translate(-50%, -50%) scale(${glowScale})`,
        background: `radial-gradient(circle, ${primaryColor}22 0%, transparent 70%)`,
        borderRadius: '50%',
        opacity: glowOpacity,
      }} />

      {/* Content */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center',
        zIndex: 10, padding: '0 120px',
      }}>
        {/* Tagline Pill */}
        <div style={{
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
          display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: 30,
        }}>
          <span style={{
            width: 8, height: 8,
            borderRadius: '50%',
            background: primaryColor,
            boxShadow: `0 0 12px ${primaryColor}`,
          }} />
          <span style={{
            fontFamily: FONTS.heading,
            fontWeight: 700,
            fontSize: 14,
            color: primaryColor,
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}>
            {tagline}
          </span>
        </div>

        {/* Title Line 1 */}
        <h1 style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontFamily: FONTS.heading,
          fontSize: 88,
          fontWeight: 800,
          lineHeight: 1.1,
          color: textColor,
          letterSpacing: -3,
          margin: 0,
        }}>
          {title}
        </h1>

        {/* Title Line 2 — Gold Accent */}
        <h1 style={{
          opacity: accentOpacity,
          transform: `translateY(${accentY}px)`,
          fontFamily: FONTS.heading,
          fontSize: 88,
          fontWeight: 800,
          lineHeight: 1.1,
          background: `linear-gradient(90deg, ${primaryColor} 0%, ${BRAND.goldLight} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: -3,
          margin: 0,
        }}>
          {titleAccent}
        </h1>

        {/* Subtitle */}
        <p style={{
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          fontFamily: FONTS.mono,
          fontSize: 20,
          fontWeight: 500,
          color: mutedColor,
          letterSpacing: 1.5,
          marginTop: 36,
        }}>
          {subtitle}
        </p>
      </div>

      {/* Corner HUD elements */}
      <div style={{
        position: 'absolute', top: 40, left: 50,
        fontFamily: FONTS.mono, fontSize: 11,
        color: primaryColor, opacity: taglineOpacity * 0.6,
        letterSpacing: 1,
      }}>
        PRIME-AI // SOVEREIGN FLEET
      </div>

    </div>
  );
}
