import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { BRAND, FONTS, FONT_CSS } from '../brand';

const CONTENT = {
  en: {
    tagline: 'PRIME-CLI',
    platform: 'Terminal / Shell',
    title: 'Command',
    titleAccent: 'Your Fleet.',
    subtitle: 'For engineers and administrators. Control your sovereign agent fleet directly from your terminal or integrate them into your automation scripts.',
    commands: [
      { prompt: '$ prime fleet status', output: '' },
      { prompt: '', output: '  FLEET STATUS — 14 agents online' },
      { prompt: '', output: '  ┌─────────────────┬──────────┬──────────┐' },
      { prompt: '', output: '  │ AGENT           │ STATUS   │ UPTIME   │' },
      { prompt: '', output: '  ├─────────────────┼──────────┼──────────┤' },
      { prompt: '', output: '  │ Analyzer        │ ● ACTIVE │ 72h 14m  │' },
      { prompt: '', output: '  │ Coder           │ ● ACTIVE │ 72h 14m  │' },
      { prompt: '', output: '  │ Reviewer        │ ● ACTIVE │ 48h 02m  │' },
      { prompt: '', output: '  │ Sentinel        │ ● IDLE   │ 72h 14m  │' },
      { prompt: '', output: '  └─────────────────┴──────────┴──────────┘' },
      { prompt: '$ prime agent deploy --sovereign --encrypt', output: '' },
      { prompt: '', output: '  ✓ Agent deployed to sovereign mesh' },
      { prompt: '', output: '  ✓ E2E encryption enabled (AES-256-GCM)' },
      { prompt: '', output: '  ✓ MCP protocol handshake complete' },
    ],
  },
  fr: {
    tagline: 'PRIME-CLI',
    platform: 'Terminal / Shell',
    title: 'Commandez',
    titleAccent: 'Votre Flotte.',
    subtitle: "Pour les ingénieurs et administrateurs. Contrôlez votre flotte d'agents souverains directement depuis votre terminal.",
    commands: [
      { prompt: '$ prime fleet status', output: '' },
      { prompt: '', output: '  ÉTAT FLOTTE — 14 agents en ligne' },
      { prompt: '', output: '  ┌─────────────────┬──────────┬──────────┐' },
      { prompt: '', output: '  │ AGENT           │ ÉTAT     │ UPTIME   │' },
      { prompt: '', output: '  ├─────────────────┼──────────┼──────────┤' },
      { prompt: '', output: '  │ Analyseur       │ ● ACTIF  │ 72h 14m  │' },
      { prompt: '', output: '  │ Codeur          │ ● ACTIF  │ 72h 14m  │' },
      { prompt: '', output: '  │ Réviseur        │ ● ACTIF  │ 48h 02m  │' },
      { prompt: '', output: '  │ Sentinelle      │ ● VEILLE │ 72h 14m  │' },
      { prompt: '', output: '  └─────────────────┴──────────┴──────────┘' },
      { prompt: '$ prime agent deploy --souverain --chiffrer', output: '' },
      { prompt: '', output: '  ✓ Agent déployé sur maillage souverain' },
      { prompt: '', output: '  ✓ Chiffrement E2E activé (AES-256-GCM)' },
      { prompt: '', output: '  ✓ Handshake protocole MCP terminé' },
    ],
  },
};

export default function PrimeCLIComposition({ language = 'en' }) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const c = CONTENT[language];
  const totalFrames = fps * 15;

  const exitOpacity = interpolate(frame, [totalFrames - 25, totalFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Title area
  const taglineOpacity = interpolate(frame, [5, 25], [0, 1], { extrapolateRight: 'clamp' });
  const titleOpacity = interpolate(frame, [15, 40], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [15, 40], [25, 0], { extrapolateRight: 'clamp' });
  const accentOpacity = interpolate(frame, [30, 55], [0, 1], { extrapolateRight: 'clamp' });
  const accentY = interpolate(frame, [30, 55], [25, 0], { extrapolateRight: 'clamp' });
  const subOpacity = interpolate(frame, [45, 65], [0, 1], { extrapolateRight: 'clamp' });

  // Terminal panel
  const terminalOpacity = interpolate(frame, [50, 75], [0, 1], { extrapolateRight: 'clamp' });
  const terminalY = interpolate(frame, [50, 75], [30, 0], { extrapolateRight: 'clamp' });

  // Cursor blink
  const cursorVisible = Math.sin(frame * 0.2) > 0;

  // Scanline
  const scanlineY = interpolate(frame, [0, totalFrames], [0, height * 3], { extrapolateRight: 'extend' });

  return (
    <div style={{
      width, height, background: BRAND.consoleBg,
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
      fontFamily: FONTS.heading, opacity: exitOpacity,
    }}>
      <style>{FONT_CSS}</style>

      {/* Grid bg */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(rgba(198,161,90,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(198,161,90,0.02) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />

      {/* Scanline */}
      <div style={{
        position: 'absolute', left: 0, right: 0,
        top: scanlineY % height, height: 2,
        background: `linear-gradient(90deg, transparent, ${BRAND.green}20, transparent)`,
        zIndex: 5,
      }} />

      {/* Top section: Title */}
      <div style={{
        padding: '50px 70px 30px', zIndex: 10,
      }}>
        {/* Tagline */}
        <div style={{
          opacity: taglineOpacity,
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: BRAND.green, boxShadow: `0 0 12px ${BRAND.green}` }} />
          <span style={{
            fontFamily: FONTS.heading, fontWeight: 700, fontSize: 13,
            color: BRAND.green, letterSpacing: 4,
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

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 40 }}>
          <div>
            <h1 style={{
              opacity: titleOpacity, transform: `translateY(${titleY}px)`,
              fontFamily: FONTS.heading, fontSize: 64, fontWeight: 800,
              color: '#ffffff', letterSpacing: -2, margin: 0, lineHeight: 1.05,
            }}>
              {c.title}
            </h1>
            <h1 style={{
              opacity: accentOpacity, transform: `translateY(${accentY}px)`,
              fontFamily: FONTS.heading, fontSize: 64, fontWeight: 800,
              background: `linear-gradient(90deg, ${BRAND.green}, ${BRAND.gold})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', letterSpacing: -2, margin: 0, lineHeight: 1.05,
            }}>
              {c.titleAccent}
            </h1>
          </div>
          <p style={{
            opacity: subOpacity, fontFamily: FONTS.heading,
            fontSize: 16, fontWeight: 400, color: BRAND.consoleSubtext,
            lineHeight: 1.6, maxWidth: 420, marginBottom: 8,
          }}>
            {c.subtitle}
          </p>
        </div>
      </div>

      {/* Terminal Panel */}
      <div style={{
        opacity: terminalOpacity, transform: `translateY(${terminalY}px)`,
        margin: '0 60px', flex: 1, zIndex: 10,
        background: 'rgba(5,5,7,0.95)', border: `1px solid ${BRAND.green}18`,
        borderRadius: 14, overflow: 'hidden',
        boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${BRAND.green}05`,
      }}>
        {/* Window chrome */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
          </div>
          <span style={{
            fontFamily: FONTS.mono, fontSize: 12, color: BRAND.green,
            fontWeight: 700, letterSpacing: 1,
          }}>
            PRIME-CLI v3.2.0
          </span>
        </div>

        {/* Terminal content */}
        <div style={{ padding: '20px 24px' }}>
          {c.commands.map((line, i) => {
            const lineDelay = 80 + i * 12;
            const lineOpacity = interpolate(frame, [lineDelay, lineDelay + 10], [0, 1], { extrapolateRight: 'clamp' });
            const lineX = interpolate(frame, [lineDelay, lineDelay + 10], [-8, 0], { extrapolateRight: 'clamp' });

            const isPrompt = line.prompt !== '';
            const hasActive = line.output.includes('● ACTIVE') || line.output.includes('● ACTIF');
            const hasIdle = line.output.includes('● IDLE') || line.output.includes('● VEILLE');
            const hasCheck = line.output.includes('✓');

            let textColor = BRAND.consoleText;
            if (hasActive) textColor = BRAND.consoleText;
            if (hasIdle) textColor = BRAND.consoleText;
            if (hasCheck) textColor = BRAND.green;

            return (
              <div key={i} style={{
                opacity: lineOpacity, transform: `translateX(${lineX}px)`,
                fontFamily: FONTS.mono, fontSize: 14, lineHeight: 1.8,
                whiteSpace: 'pre',
              }}>
                {isPrompt ? (
                  <span>
                    <span style={{ color: BRAND.green, fontWeight: 700 }}>
                      {line.prompt}
                    </span>
                  </span>
                ) : (
                  <span style={{ color: textColor }}>
                    {line.output}
                  </span>
                )}
              </div>
            );
          })}
          {/* Cursor */}
          <div style={{
            fontFamily: FONTS.mono, fontSize: 14, color: BRAND.green,
            opacity: cursorVisible ? 1 : 0, marginTop: 4,
          }}>
            $ █
          </div>
        </div>
      </div>

      {/* HUD */}
      <div style={{
        position: 'absolute', top: 40, right: 60,
        fontFamily: FONTS.mono, fontSize: 11, color: BRAND.consoleSubtext,
        opacity: 0.4, letterSpacing: 1,
      }}>
        PRIME-AI // CLI
      </div>
      <div style={{
        position: 'absolute', bottom: 20, right: 60,
        fontFamily: FONTS.mono, fontSize: 11, color: BRAND.consoleSubtext,
        opacity: 0.3, letterSpacing: 1,
      }}>
        prime-ai.fr
      </div>
    </div>
  );
}
