import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { BRAND, FONTS, FONT_CSS } from '../brand';

const CONTENT = {
  en: {
    tagline: 'PRIME-MOBILE',
    platform: 'iOS / Android',
    title: 'Intelligence',
    titleAccent: 'On the Go.',
    subtitle: 'Intelligence on the go. Talk to your agents anywhere, instantly capture brilliant ideas, and watch your thoughts sync across all your devices seamlessly.',
    features: [
      'Talk naturally anywhere',
      'Flawless private transcription',
      'Always-on intelligence',
      'Perfect synchronization',
    ],
    transcript: [
      { role: 'YOU', text: 'Summarize the Q2 report and flag risks.' },
      { role: 'PRIME', text: 'Q2 revenue up 34%. Key risk: supply chain delays in APAC region. Recommending hedge strategy.' },
      { role: 'YOU', text: 'Draft a brief for the board.' },
    ],
  },
  fr: {
    tagline: 'PRIME-MOBILE',
    platform: 'iOS / Android',
    title: 'Intelligence',
    titleAccent: 'Nomade.',
    subtitle: "L'intelligence en mouvement. Parlez à vos agents partout, capturez instantanément vos idées brillantes et voyez vos pensées se synchroniser sur tous vos appareils.",
    features: [
      'Parlez naturellement partout',
      'Transcription privée sans faille',
      'Intelligence toujours active',
      'Synchronisation parfaite',
    ],
    transcript: [
      { role: 'VOUS', text: 'Résume le rapport T2 et signale les risques.' },
      { role: 'PRIME', text: 'Revenus T2 en hausse de 34%. Risque clé : retards chaîne logistique APAC. Stratégie de couverture recommandée.' },
      { role: 'VOUS', text: 'Rédige un brief pour le conseil.' },
    ],
  },
};

export default function PrimeMobileComposition({ language = 'en' }) {
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

  // Phone panel
  const phoneOpacity = interpolate(frame, [55, 80], [0, 1], { extrapolateRight: 'clamp' });
  const phoneY = interpolate(frame, [55, 80], [50, 0], { extrapolateRight: 'clamp' });

  // Voice waveform
  const wavePhase = frame * 0.12;

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

      {/* Right: Phone mockup */}
      <div style={{
        flex: 0.85, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 60px 0 0', zIndex: 10,
      }}>
        <div style={{
          opacity: phoneOpacity, transform: `translateY(${phoneY}px)`,
          background: 'rgba(15,15,18,0.9)', border: `2px solid ${BRAND.gold}25`,
          borderRadius: 32, width: 340, padding: '40px 24px 30px',
          boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 60px ${BRAND.gold}08`,
          backdropFilter: 'blur(10px)',
        }}>
          {/* Status bar */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 24, padding: '0 4px',
          }}>
            <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: BRAND.consoleSubtext }}>
              9:41
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: BRAND.green }} />
              <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: BRAND.green, fontWeight: 700, letterSpacing: 1 }}>
                ENCRYPTED
              </span>
            </div>
          </div>

          {/* Voice waveform */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 3, height: 60, marginBottom: 20,
          }}>
            {Array.from({ length: 24 }).map((_, i) => {
              const barHeight = 8 + Math.abs(Math.sin(wavePhase + i * 0.4)) * 40;
              const barOpacity = 0.4 + Math.abs(Math.sin(wavePhase + i * 0.3)) * 0.6;
              return (
                <div key={i} style={{
                  width: 3, height: barHeight, borderRadius: 2,
                  background: BRAND.gold, opacity: barOpacity,
                }} />
              );
            })}
          </div>

          {/* Recording label */}
          <div style={{
            textAlign: 'center', marginBottom: 20,
          }}>
            <span style={{
              fontFamily: FONTS.mono, fontSize: 11, fontWeight: 700,
              color: BRAND.gold, letterSpacing: 2,
            }}>
              ● LISTENING
            </span>
          </div>

          {/* Conversation transcript */}
          <div style={{
            borderTop: `1px solid ${BRAND.gold}15`, paddingTop: 16,
          }}>
            {c.transcript.map((msg, i) => {
              const msgDelay = 120 + i * 40;
              const msgOpacity = interpolate(frame, [msgDelay, msgDelay + 25], [0, 1], { extrapolateRight: 'clamp' });
              const msgX = interpolate(frame, [msgDelay, msgDelay + 25], [-10, 0], { extrapolateRight: 'clamp' });
              const isUser = msg.role !== 'PRIME';
              return (
                <div key={i} style={{
                  opacity: msgOpacity, transform: `translateX(${msgX}px)`,
                  marginBottom: 12,
                }}>
                  <span style={{
                    fontFamily: FONTS.mono, fontSize: 10, fontWeight: 700,
                    color: isUser ? BRAND.gold : BRAND.green,
                    letterSpacing: 1,
                  }}>
                    {msg.role}
                  </span>
                  <p style={{
                    fontFamily: FONTS.heading, fontSize: 12, color: BRAND.consoleText,
                    lineHeight: 1.5, margin: '4px 0 0',
                  }}>
                    {msg.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* HUD */}
      <div style={{
        position: 'absolute', top: 40, left: 50,
        fontFamily: FONTS.mono, fontSize: 11, color: BRAND.gold,
        opacity: taglineOpacity * 0.6, letterSpacing: 1,
      }}>
        PRIME-AI // MOBILE
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
