import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Sequence } from 'remotion';
import { BRAND, FONTS, FONT_CSS } from '../brand';

const CONTENT = {
  en: {
    tagline: 'PRIME-DESKTOP',
    platform: 'macOS / Windows',
    title: 'Your Workflow.',
    titleAccent: 'Sovereign.',
    subtitle: 'The backbone of your daily workflow. Capture, organize, and reason continuously with seamless local sync.',
    features: [
      'Native file system integration',
      'Continuous reasoning engine',
      'Encrypted local sync',
      'Sovereign data ownership',
    ],
    files: [
      { name: 'reports/', type: 'dir', status: 'SYNCED' },
      { name: 'analysis_q2.md', type: 'file', status: 'SYNCED' },
      { name: 'strategy.pdf', type: 'file', status: 'SYNCING' },
      { name: 'models/', type: 'dir', status: 'SYNCED' },
      { name: 'agent_config.yaml', type: 'file', status: 'SYNCED' },
    ],
  },
  fr: {
    tagline: 'PRIME-DESKTOP',
    platform: 'macOS / Windows',
    title: 'Votre Flux.',
    titleAccent: 'Souverain.',
    subtitle: "L'épine dorsale de votre flux de travail quotidien. Capturez, organisez et raisonnez en continu avec une synchronisation locale transparente.",
    features: [
      'Intégration native système de fichiers',
      'Moteur de raisonnement continu',
      'Synchronisation locale chiffrée',
      'Souveraineté totale des données',
    ],
    files: [
      { name: 'rapports/', type: 'dir', status: 'SYNCED' },
      { name: 'analyse_t2.md', type: 'file', status: 'SYNCED' },
      { name: 'stratégie.pdf', type: 'file', status: 'SYNC' },
      { name: 'modèles/', type: 'dir', status: 'SYNCED' },
      { name: 'config_agent.yaml', type: 'file', status: 'SYNCED' },
    ],
  },
};

export default function PrimeDesktopComposition({ language = 'en' }) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const c = CONTENT[language];
  const totalFrames = fps * 15;

  // ── Global animations ──
  const exitOpacity = interpolate(frame, [totalFrames - 25, totalFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Tagline
  const taglineOpacity = interpolate(frame, [5, 25], [0, 1], { extrapolateRight: 'clamp' });
  const taglineY = interpolate(frame, [5, 25], [15, 0], { extrapolateRight: 'clamp' });

  // Title
  const titleOpacity = interpolate(frame, [15, 40], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [15, 40], [30, 0], { extrapolateRight: 'clamp' });

  // Accent
  const accentOpacity = interpolate(frame, [30, 55], [0, 1], { extrapolateRight: 'clamp' });
  const accentY = interpolate(frame, [30, 55], [30, 0], { extrapolateRight: 'clamp' });

  // Subtitle
  const subOpacity = interpolate(frame, [45, 70], [0, 1], { extrapolateRight: 'clamp' });

  // Desktop window panel
  const panelOpacity = interpolate(frame, [60, 85], [0, 1], { extrapolateRight: 'clamp' });
  const panelY = interpolate(frame, [60, 85], [40, 0], { extrapolateRight: 'clamp' });

  // File sync progress
  const syncProgress = interpolate(frame, [100, 200], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Feature cards
  const featuresBase = 220;

  // Mesh rotation
  const meshRotation = interpolate(frame, [0, totalFrames], [0, 180], { extrapolateRight: 'extend' });
  const meshOpacity = interpolate(frame, [0, 40], [0, 0.15], { extrapolateRight: 'clamp' });

  return (
    <div style={{
      width, height, background: BRAND.light,
      display: 'flex', position: 'relative', overflow: 'hidden',
      fontFamily: FONTS.heading, opacity: exitOpacity,
    }}>
      <style>{FONT_CSS}</style>

      {/* Background mesh ring */}
      <svg width="700" height="700" viewBox="0 0 700 700" style={{
        position: 'absolute', top: '50%', left: '25%',
        transform: `translate(-50%, -50%) rotate(${meshRotation}deg)`,
        opacity: meshOpacity,
      }}>
        <circle cx="350" cy="350" r="300" fill="none" stroke={BRAND.gold} strokeWidth="0.8" strokeDasharray="20 15 8 30" />
        <circle cx="350" cy="350" r="250" fill="none" stroke={BRAND.gold} strokeWidth="0.5" strokeDasharray="5 10" />
      </svg>

      {/* Left: Text Content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '0 70px', zIndex: 10,
      }}>
        {/* Tagline */}
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
            fontFamily: FONTS.mono, fontSize: 11, color: BRAND.muted,
            marginLeft: 8,
          }}>
            {c.platform}
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          opacity: titleOpacity, transform: `translateY(${titleY}px)`,
          fontFamily: FONTS.heading, fontSize: 72, fontWeight: 800,
          color: BRAND.dark, letterSpacing: -2, margin: 0, lineHeight: 1.05,
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

        {/* Subtitle */}
        <p style={{
          opacity: subOpacity, fontFamily: FONTS.heading,
          fontSize: 18, fontWeight: 400, color: BRAND.muted,
          lineHeight: 1.6, marginTop: 20, maxWidth: 500,
        }}>
          {c.subtitle}
        </p>

        {/* Feature pills */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 28,
        }}>
          {c.features.map((feat, i) => {
            const delay = featuresBase + i * 18;
            const fOpacity = interpolate(frame, [delay, delay + 20], [0, 1], { extrapolateRight: 'clamp' });
            const fX = interpolate(frame, [delay, delay + 20], [-15, 0], { extrapolateRight: 'clamp' });
            return (
              <div key={i} style={{
                opacity: fOpacity, transform: `translateX(${fX}px)`,
                background: `${BRAND.gold}12`, border: `1px solid ${BRAND.gold}35`,
                borderRadius: 100, padding: '8px 18px',
                fontFamily: FONTS.mono, fontSize: 12, fontWeight: 600,
                color: BRAND.goldDark, letterSpacing: 0.5,
              }}>
                {feat}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Desktop Window Panel */}
      <div style={{
        flex: 0.9, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 50px 0 0', zIndex: 10,
      }}>
        <div style={{
          opacity: panelOpacity, transform: `translateY(${panelY}px)`,
          background: '#FFFFFF', border: `1.5px solid ${BRAND.gold}30`,
          borderRadius: 16, width: '100%', maxWidth: 520, overflow: 'hidden',
          boxShadow: `0 20px 60px rgba(198, 161, 90, 0.1)`,
        }}>
          {/* Window chrome */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '14px 18px', borderBottom: `1px solid ${BRAND.gold}15`,
            background: BRAND.light,
          }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
            </div>
            <span style={{
              fontFamily: FONTS.mono, fontSize: 11, color: BRAND.muted,
              marginLeft: 10, letterSpacing: 1,
            }}>
              PRIME-DESKTOP — FILE SYNC
            </span>
          </div>

          {/* Sync progress bar */}
          <div style={{ padding: '16px 18px 0', }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 8,
            }}>
              <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: BRAND.gold, fontWeight: 700, letterSpacing: 1 }}>
                LOCAL SYNC
              </span>
              <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: BRAND.muted }}>
                {Math.round(syncProgress)}%
              </span>
            </div>
            <div style={{
              width: '100%', height: 4, background: `${BRAND.gold}15`,
              borderRadius: 4, overflow: 'hidden',
            }}>
              <div style={{
                width: `${syncProgress}%`, height: '100%',
                background: `linear-gradient(90deg, ${BRAND.gold}, ${BRAND.goldLight})`,
                borderRadius: 4, transition: 'width 0.1s linear',
              }} />
            </div>
          </div>

          {/* File tree */}
          <div style={{ padding: '16px 18px 18px' }}>
            {c.files.map((file, i) => {
              const fDelay = 90 + i * 20;
              const fOpacity = interpolate(frame, [fDelay, fDelay + 18], [0, 1], { extrapolateRight: 'clamp' });
              const fX = interpolate(frame, [fDelay, fDelay + 18], [20, 0], { extrapolateRight: 'clamp' });
              const isDir = file.type === 'dir';
              const statusColor = file.status === 'SYNCED' ? BRAND.green : BRAND.amber;

              return (
                <div key={i} style={{
                  opacity: fOpacity, transform: `translateX(${fX}px)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', borderBottom: `1px solid ${BRAND.gold}08`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      fontFamily: FONTS.mono, fontSize: 14,
                      color: isDir ? BRAND.gold : BRAND.muted,
                    }}>
                      {isDir ? '📁' : '📄'}
                    </span>
                    <span style={{
                      fontFamily: FONTS.mono, fontSize: 13, fontWeight: 500,
                      color: BRAND.dark,
                    }}>
                      {file.name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor }} />
                    <span style={{
                      fontFamily: FONTS.mono, fontSize: 10, color: statusColor,
                      fontWeight: 700, letterSpacing: 0.5,
                    }}>
                      {file.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Corner HUD */}
      <div style={{
        position: 'absolute', top: 40, left: 50,
        fontFamily: FONTS.mono, fontSize: 11, color: BRAND.gold,
        opacity: taglineOpacity * 0.6, letterSpacing: 1,
      }}>
        PRIME-AI // DESKTOP
      </div>
      <div style={{
        position: 'absolute', bottom: 40, right: 50,
        fontFamily: FONTS.mono, fontSize: 11, color: BRAND.muted,
        opacity: subOpacity * 0.5, letterSpacing: 1,
      }}>
        prime-ai.fr
      </div>
    </div>
  );
}
