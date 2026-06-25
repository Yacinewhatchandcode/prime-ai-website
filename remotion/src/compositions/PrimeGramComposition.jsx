import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { BRAND, FONTS, FONT_CSS } from '../brand';

const CONTENT = {
  en: {
    tagline: 'PRIME-GRAM',
    platform: 'Telegram Gateway',
    title: 'Secure',
    titleAccent: 'Chat Command.',
    subtitle: 'Your brilliant companion on the go. Talk to your agents, ask questions, and watch your intelligence work seamlessly in your favorite chat app.',
    features: [
      'Talk naturally anywhere',
      'Instant visual notifications',
      'Smart task delegation',
      'Total privacy shield',
    ],
    transcript: [
      { role: 'YOU', text: '/status' },
      { role: 'PRIME', text: 'Swarm active: 8 agents online. Memory sync: 100%. Type /help to see all commands.' },
      { role: 'YOU', text: '/delegate audit-repo Yacinewhatchandcode/prime-ai-website' },
      { role: 'PRIME', text: 'Audit dispatched to Devops agent. Tracking progress...' },
    ],
  },
  fr: {
    tagline: 'PRIME-GRAM',
    platform: 'Passerelle Telegram',
    title: 'Commande',
    titleAccent: 'Par Chat.',
    subtitle: 'Votre brillant compagnon mobile. Parlez à vos agents, posez des questions et regardez votre intelligence travailler de façon fluide dans votre application de chat.',
    features: [
      'Parlez naturellement partout',
      'Notifications visuelles instantanées',
      'Délégation intelligente',
      'Bouclier de confidentialité total',
    ],
    transcript: [
      { role: 'VOUS', text: '/status' },
      { role: 'PRIME', text: 'Essaim actif : 8 agents en ligne. Synchronisation : 100%. Taper /help pour voir.' },
      { role: 'VOUS', text: '/delegate audit-repo Yacinewhatchandcode/prime-ai-website' },
      { role: 'PRIME', text: 'Audit envoyé au DevOps agent. Suivi en cours...' },
    ],
  },
};

export default function PrimeGramComposition({ language = 'en' }) {
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

  // Chat window panel
  const chatOpacity = interpolate(frame, [55, 80], [0, 1], { extrapolateRight: 'clamp' });
  const chatY = interpolate(frame, [55, 80], [50, 0], { extrapolateRight: 'clamp' });

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

      {/* Right: Telegram mockup */}
      <div style={{
        flex: 0.85, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 60px 0 0', zIndex: 10,
      }}>
        <div style={{
          opacity: chatOpacity, transform: `translateY(${chatY}px)`,
          background: '#182533', border: `2px solid ${BRAND.gold}25`,
          borderRadius: 24, width: 360, height: 440, display: 'flex', flexDirection: 'column',
          boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 60px ${BRAND.gold}08`,
          overflow: 'hidden'
        }}>
          {/* Telegram Header */}
          <div style={{
            background: '#24303f', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12,
            borderBottom: '1px solid rgba(0,0,0,0.2)'
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%', background: BRAND.gold,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1F1A13', fontWeight: 800
            }}>
              P
            </div>
            <div>
              <div style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>PRIME-AI Swarm</div>
              <div style={{ color: '#5288c1', fontSize: 12 }}>bot</div>
            </div>
          </div>

          {/* Telegram Messages */}
          <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
            {c.transcript.map((msg, i) => {
              const msgDelay = 120 + i * 40;
              const msgOpacity = interpolate(frame, [msgDelay, msgDelay + 25], [0, 1], { extrapolateRight: 'clamp' });
              const msgY = interpolate(frame, [msgDelay, msgDelay + 25], [15, 0], { extrapolateRight: 'clamp' });
              const isUser = msg.role !== 'PRIME';
              
              return (
                <div key={i} style={{
                  opacity: msgOpacity,
                  transform: `translateY(${msgY}px)`,
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  background: isUser ? '#2b5278' : '#182533',
                  border: isUser ? 'none' : '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '12px 12px ' + (isUser ? '0px' : '12px') + ' 12px',
                  padding: '10px 14px',
                  maxWidth: '80%',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}>
                  <p style={{
                    color: '#fff', fontSize: 13, margin: 0, lineHeight: 1.5,
                    fontFamily: isUser ? FONTS.heading : FONTS.mono,
                  }}>
                    {msg.text}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Telegram Input Bar */}
          <div style={{
            background: '#24303f', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10
          }}>
            <div style={{
              flex: 1, background: '#182533', borderRadius: 8, padding: '8px 12px',
              color: '#7f91a4', fontSize: 13, fontFamily: FONTS.heading
            }}>
              Write a message...
            </div>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', background: '#5288c1',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12
            }}>
              ➔
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
        PRIME-AI // MESSAGING
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
