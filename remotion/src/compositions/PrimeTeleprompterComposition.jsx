import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { BRAND, FONTS, FONT_CSS } from '../brand';

const CONTENT = {
  en: {
    tagline: 'TELEPROMPTER',
    platform: 'Cognitive Optimizer',
    title: 'Optimize',
    titleAccent: 'Instructions.',
    subtitle: 'Your agents learn to be perfect. Watch them refine their own behavior, polish their thinking, and continuously adapt to become exactly what you need.',
    features: [
      'Self-improving intelligence',
      'Continuous refinement',
      'Flawless adaptation',
      'Perfect memory recall',
    ],
    logs: [
      { text: 'Analyzing past performance and discovering patterns...', type: 'info' },
      { text: 'Identifying areas for brilliant improvement...', type: 'warn' },
      { text: 'Refining thought process for maximum clarity...', type: 'info' },
      { text: 'Polishing the perfect response structure...', type: 'info' },
      { text: 'Mastery complete. Performance is now flawless.', type: 'success' },
      { text: 'New intelligence permanently locked into memory.', type: 'success' }
    ]
  },
  fr: {
    tagline: 'TELEPROMPTER',
    platform: 'Optimisateur Cognitif',
    title: 'Optimise',
    titleAccent: 'Les Consignes.',
    subtitle: "Vos agents apprennent à être parfaits. Regardez-les affiner leur comportement, perfectionner leur pensée et s'adapter continuellement.",
    features: [
      'Intelligence évolutive',
      'Raffinement continu',
      'Adaptation sans faille',
      'Mémorisation parfaite',
    ],
    logs: [
      { text: 'Analyse des performances passées en cours...', type: 'info' },
      { text: 'Identification des axes d\'amélioration brillants...', type: 'warn' },
      { text: 'Raffinement du processus de pensée pour une clarté maximale...', type: 'info' },
      { text: 'Perfectionnement de la structure de réponse idéale...', type: 'info' },
      { text: 'Maîtrise totale. Performance sans faille.', type: 'success' },
      { text: 'Nouvelle intelligence verrouillée en permanence.', type: 'success' }
    ]
  }
};

export default function PrimeTeleprompterComposition({ language = 'en' }) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const c = CONTENT[language];
  const totalFrames = fps * 15;

  const exitOpacity = interpolate(frame, [totalFrames - 25, totalFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Tagline
  const taglineOpacity = interpolate(frame, [5, 25], [0, 1], { extrapolateRight: 'clamp' });
  const taglineY = interpolate(frame, [5, 25], [15, 0], { extrapolateRight: 'clamp' });

  // Title
  const titleOpacity = interpolate(frame, [15, 40], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [15, 40], [30, 0], { extrapolateRight: 'clamp' });

  const accentOpacity = interpolate(frame, [30, 55], [0, 1], { extrapolateRight: 'clamp' });
  const accentY = interpolate(frame, [30, 55], [30, 0], { extrapolateRight: 'clamp' });

  const subOpacity = interpolate(frame, [45, 70], [0, 1], { extrapolateRight: 'clamp' });

  // Terminal window panel
  const terminalOpacity = interpolate(frame, [55, 80], [0, 1], { extrapolateRight: 'clamp' });
  const terminalY = interpolate(frame, [55, 80], [50, 0], { extrapolateRight: 'clamp' });

  // Scanline
  const scanlineY = interpolate(frame, [0, totalFrames], [0, height * 2], { extrapolateRight: 'extend' });

  return (
    <div style={{
      width, height, background: BRAND.consoleBg,
      display: 'flex', position: 'relative', overflow: 'hidden',
      fontFamily: FONTS.heading, opacity: exitOpacity,
    }}>
      <style>{FONT_CSS}</style>

      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(rgba(198,161,90,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(198,161,90,0.03) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* V2 Uniform Glow Orb */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 800, height: 800, transform: `translate(-50%, -50%)`,
        background: `radial-gradient(circle, ${BRAND.gold}15 0%, transparent 60%)`,
        borderRadius: '50%',
        opacity: Math.sin(frame * 0.05) * 0.2 + 0.8,
      }} />

      {/* Scanline */}
      <div style={{
        position: 'absolute', left: 0, right: 0,
        top: scanlineY % height, height: 2,
        background: `linear-gradient(90deg, transparent, ${BRAND.gold}25, transparent)`,
        zIndex: 5,
      }} />

      {/* Left: Text Content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '0 70px', zIndex: 10,
      }}>
        <div style={{
          opacity: taglineOpacity, transform: `translateY(${taglineY}px)`,
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: BRAND.gold, boxShadow: `0 0 12px ${BRAND.gold}` }} />
          <span style={{
            fontFamily: FONTS.heading, fontWeight: 700, fontSize: 13,
            color: BRAND.gold, letterSpacing: 4,
          }}>
            {c.tagline}
          </span>
          <span style={{
            fontFamily: FONTS.mono, fontSize: 11, color: BRAND.consoleSubtext,
            marginLeft: 8,
          }}>
            {c.platform}
          </span>
        </div>

        <h1 style={{
          opacity: titleOpacity, transform: `translateY(${titleY}px)`,
          fontFamily: FONTS.heading, fontSize: 72, fontWeight: 800,
          color: '#ffffff', letterSpacing: -2, margin: 0, lineHeight: 1.05,
        }}>
          {c.title}
        </h1>
        <h1 style={{
          opacity: accentOpacity, transform: `translateY(${accentY}px)`,
          fontFamily: FONTS.heading, fontSize: 72, fontWeight: 800,
          background: `linear-gradient(90deg, ${BRAND.gold}, ${BRAND.goldLight})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', letterSpacing: -2, margin: 0, lineHeight: 1.05,
        }}>
          {c.titleAccent}
        </h1>

        <p style={{
          opacity: subOpacity, fontFamily: FONTS.heading,
          fontSize: 17, fontWeight: 400, color: BRAND.consoleSubtext,
          lineHeight: 1.6, marginTop: 20, maxWidth: 480,
        }}>
          {c.subtitle}
        </p>

        {/* Feature pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 28 }}>
          {c.features.map((feat, i) => {
            const delay = 200 + i * 18;
            const fOpacity = interpolate(frame, [delay, delay + 20], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <div key={i} style={{
                opacity: fOpacity,
                background: `${BRAND.gold}12`, border: `1px solid ${BRAND.gold}30`,
                borderRadius: 100, padding: '8px 18px',
                fontFamily: FONTS.mono, fontSize: 12, fontWeight: 600,
                color: BRAND.gold, letterSpacing: 0.5,
              }}>
                {feat}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Console Mockup */}
      <div style={{
        flex: 0.85, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 60px 0 0', zIndex: 10,
      }}>
        <div style={{
          opacity: terminalOpacity, transform: `translateY(${terminalY}px)`,
          background: 'rgba(15,15,18,0.9)', border: `2px solid ${BRAND.gold}25`,
          borderRadius: 20, width: 380, height: 400, display: 'flex', flexDirection: 'column',
          boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 60px ${BRAND.gold}08`,
          fontFamily: FONTS.mono, overflow: 'hidden'
        }}>
          {/* Console Header */}
          <div style={{
            background: '#1F1A13', padding: '10px 18px', display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', borderBottom: `1px solid ${BRAND.gold}15`
          }}>
            <span style={{ fontSize: 10, color: BRAND.gold, fontWeight: 'bold', letterSpacing: 1.5 }}>
              TELEPROMPT // COMPILER
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff5f56' }} />
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffbd2e' }} />
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#27c93f' }} />
            </div>
          </div>

          {/* Console Output */}
          <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 11, lineHeight: 1.45 }}>
            {c.logs.map((log, i) => {
              const logDelay = 110 + i * 45;
              const logOpacity = interpolate(frame, [logDelay, logDelay + 20], [0, 1], { extrapolateRight: 'clamp' });
              const logX = interpolate(frame, [logDelay, logDelay + 20], [-10, 0], { extrapolateRight: 'clamp' });
              
              const colors = {
                info: '#e2e8f0',
                warn: '#f59e0b',
                success: BRAND.green
              };
              
              return (
                <div key={i} style={{
                  opacity: logOpacity,
                  transform: `translateX(${logX}px)`,
                  color: colors[log.type],
                  borderLeft: `2px solid ${log.type === 'success' ? BRAND.green : log.type === 'warn' ? '#f59e0b' : BRAND.gold}`,
                  paddingLeft: 10
                }}>
                  {log.text}
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div style={{
            padding: '16px 20px', borderTop: `1px solid ${BRAND.gold}15`, background: 'rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: BRAND.consoleSubtext, marginBottom: 6 }}>
              <span>COMPILING_PROMPTS_FEWSHOT</span>
              <span>94%</span>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${interpolate(frame, [100, totalFrames], [0, 94], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}%`,
                background: BRAND.gold,
                boxShadow: `0 0 10px ${BRAND.gold}`
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* HUD */}
      <div style={{
        position: 'absolute', top: 40, left: 50,
        fontFamily: FONTS.mono, fontSize: 11, color: BRAND.gold,
        opacity: taglineOpacity * 0.6, letterSpacing: 1,
      }}>
        PRIME-AI // COMPILER
      </div>
      <div style={{
        position: 'absolute', bottom: 40, right: 50,
        fontFamily: FONTS.mono, fontSize: 11, color: BRAND.consoleSubtext,
        opacity: subOpacity * 0.5, letterSpacing: 1,
      }}>
        prime-ai.fr
      </div>
    </div>
  );
}
