import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { BRAND, FONTS, FONT_CSS } from '../brand';

/**
 * SovereignNarrative — Text-driven storytelling with cinematic transitions
 * 
 * Props:
 *   scenes — array of { text, accent? } objects shown sequentially
 *   tagline — small label
 *   theme   — 'light' | 'dark'
 *   primaryColor — accent color
 */
export default function SovereignNarrative({
  scenes = [
    { text: 'Your Data.', accent: 'Your Rules.' },
    { text: 'Local-First.', accent: 'Always Sovereign.' },
    { text: 'No Cloud.', accent: 'No Compromise.' },
  ],
  tagline = 'SOVEREIGN AI',
  theme = 'light',
  primaryColor = BRAND.gold,
}) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isLight = theme === 'light';
  const bg = isLight ? BRAND.light : BRAND.consoleBg;
  const textColor = isLight ? BRAND.dark : '#ffffff';

  const totalFrames = fps * 20;
  const framesPerScene = Math.floor(totalFrames / scenes.length);

  // Determine which scene is active
  const sceneIndex = Math.min(Math.floor(frame / framesPerScene), scenes.length - 1);
  const sceneFrame = frame - sceneIndex * framesPerScene;
  const scene = scenes[sceneIndex];

  // Scene animations
  const sceneOpacity = interpolate(sceneFrame, [0, 20, framesPerScene - 25, framesPerScene], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
  const sceneScale = interpolate(sceneFrame, [0, 25], [0.92, 1], { extrapolateRight: 'clamp' });
  const sceneY = interpolate(sceneFrame, [0, 25], [30, 0], { extrapolateRight: 'clamp' });

  // Accent text delayed
  const accentOpacity = interpolate(sceneFrame, [20, 45], [0, 1], { extrapolateRight: 'clamp' });
  const accentY = interpolate(sceneFrame, [20, 45], [20, 0], { extrapolateRight: 'clamp' });

  // Horizontal line animation
  const lineWidth = interpolate(sceneFrame, [30, 60], [0, 200], { extrapolateRight: 'clamp' });

  // Background parallax
  const bgShift = interpolate(frame, [0, totalFrames], [0, -200], { extrapolateRight: 'clamp' });

  // Progress bar
  const progress = interpolate(frame, [0, totalFrames], [0, 100], { extrapolateRight: 'clamp' });

  // Tagline
  const taglineOpacity = interpolate(frame, [5, 25], [0, 1], { extrapolateRight: 'clamp' });

  // Overall exit
  const exitOpacity = interpolate(frame, [totalFrames - 20, totalFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{
      width, height, background: bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: FONTS.heading, position: 'relative',
      overflow: 'hidden', opacity: exitOpacity,
    }}>
      <style>{FONT_CSS}</style>

      {/* Ambient gradient background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 50% ${50 + bgShift * 0.02}%, ${primaryColor}10 0%, transparent 60%)`,
      }} />

      {/* Vertical lines decoration */}
      {[0.2, 0.4, 0.6, 0.8].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${pos * 100}%`, top: 0, bottom: 0,
          width: 1,
          background: `${primaryColor}08`,
        }} />
      ))}

      {/* Tagline — persistent */}
      <div style={{
        position: 'absolute', top: 60,
        display: 'flex', alignItems: 'center', gap: 10,
        opacity: taglineOpacity,
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: primaryColor, boxShadow: `0 0 10px ${primaryColor}`,
        }} />
        <span style={{
          fontFamily: FONTS.heading, fontWeight: 700, fontSize: 14,
          color: primaryColor, letterSpacing: 4, textTransform: 'uppercase',
        }}>
          {tagline}
        </span>
      </div>

      {/* Scene Content */}
      <div style={{
        opacity: sceneOpacity,
        transform: `translateY(${sceneY}px) scale(${sceneScale})`,
        textAlign: 'center', zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <h1 style={{
          fontFamily: FONTS.heading, fontSize: 96, fontWeight: 800,
          color: textColor, letterSpacing: -3, margin: 0, lineHeight: 1.1,
        }}>
          {scene.text}
        </h1>

        {scene.accent && (
          <h1 style={{
            opacity: accentOpacity,
            transform: `translateY(${accentY}px)`,
            fontFamily: FONTS.heading, fontSize: 96, fontWeight: 800,
            background: `linear-gradient(90deg, ${primaryColor}, ${BRAND.goldLight})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', letterSpacing: -3, margin: 0, lineHeight: 1.1,
          }}>
            {scene.accent}
          </h1>
        )}

        {/* Decorative line */}
        <div style={{
          width: lineWidth, height: 3,
          background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)`,
          borderRadius: 3, marginTop: 40,
        }} />
      </div>

      {/* Scene counter */}
      <div style={{
        position: 'absolute', bottom: 60,
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        {scenes.map((_, i) => (
          <div key={i} style={{
            width: i === sceneIndex ? 40 : 10,
            height: 4,
            borderRadius: 2,
            background: i === sceneIndex ? primaryColor : `${primaryColor}30`,
            transition: 'all 0.3s',
          }} />
        ))}
      </div>

      {/* Progress bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        width: `${progress}%`, height: 3,
        background: `linear-gradient(90deg, ${primaryColor}, ${BRAND.goldLight})`,
      }} />

      {/* Corner HUD */}
      <div style={{
        position: 'absolute', bottom: 30, right: 50,
        fontFamily: FONTS.mono, fontSize: 11,
        color: isLight ? BRAND.muted : BRAND.consoleSubtext,
        opacity: 0.4, letterSpacing: 1,
      }}>
        prime-ai.fr
      </div>
    </div>
  );
}
