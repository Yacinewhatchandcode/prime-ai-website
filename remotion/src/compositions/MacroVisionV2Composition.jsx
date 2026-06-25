import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from 'remotion';
import { BRAND, FONTS, FONT_CSS } from '../brand';

// ── Content per language ──────────────────────────────────────

const CONTENT = {
  en: {
    beat1: {
      counter: '$2.59 TRILLION',
      counterNum: 2590000000000,
      subtitle: 'Global AI spending, 2026 — Gartner',
      voiceover: 'The age of borrowed intelligence is over.',
    },
    beat2: {
      headline: 'Your data. Their jurisdiction. Their rules.',
      subtext: 'The EU AI Act is enforceable. Compliance isn\'t optional.',
    },
    beat3: {
      headline: 'Sovereign AI Infrastructure',
      pillars: ['On-Premise', 'Sovereign Cloud', 'Edge'],
      subtitle: 'Production-grade. Model-agnostic. Jurisdiction-locked.',
    },
    beat4: {
      counter: '$300B+',
      counterLabel: 'sovereign AI market by 2040',
      badges: ['Finance', 'Healthcare', 'Defense'],
      tagline: 'Not another wrapper. Infrastructure with a data moat.',
    },
    beat5: {
      cta: 'Own your intelligence.',
    },
  },
  fr: {
    beat1: {
      counter: '2 590 MILLIARDS $',
      counterNum: 2590000000000,
      subtitle: 'Dépenses mondiales en IA, 2026 — Gartner',
      voiceover: "L'ère de l'intelligence empruntée est révolue.",
    },
    beat2: {
      headline: 'Vos données. Leur juridiction. Leurs règles.',
      subtext: "Le EU AI Act est en vigueur. La conformité n'est plus optionnelle.",
    },
    beat3: {
      headline: 'Infrastructure IA Souveraine',
      pillars: ['Sur site', 'Cloud Souverain', 'Edge'],
      subtitle: 'Production. Agnostique. Juridiquement verrouillé.',
    },
    beat4: {
      counter: '300 Mds $+',
      counterLabel: "marché IA souveraine d'ici 2040",
      badges: ['Finance', 'Santé', 'Défense'],
      tagline: 'Pas un wrapper. Une infrastructure avec un fossé de données.',
    },
    beat5: {
      cta: 'Maîtrisez votre intelligence.',
    },
  },
};

const WARNING_RED = '#E53E3E';

// ── Helper: Animated counter ─────────────────────────────────

function AnimatedCounter({ frame, fps, startFrame, endFrame, targetValue, prefix, suffix, color }) {
  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // Ease-out cubic
  const eased = 1 - Math.pow(1 - progress, 3);
  const current = Math.floor(eased * targetValue);

  // Format with commas/spaces
  const formatted = prefix + current.toLocaleString('en-US') + suffix;

  return (
    <span style={{
      fontFamily: FONTS.mono,
      fontSize: 72,
      fontWeight: 800,
      color: color || BRAND.gold,
      letterSpacing: -2,
      textShadow: `0 0 60px ${BRAND.gold}40, 0 0 120px ${BRAND.gold}20`,
    }}>
      {formatted}
    </span>
  );
}

// ── Helper: Gold mesh background ─────────────────────────────

function GoldMesh({ frame, opacity = 0.08 }) {
  const rotation = interpolate(frame, [0, 600], [0, 360], { extrapolateRight: 'extend' });
  const particles = Array.from({ length: 40 }).map((_, i) => {
    const angle = ((i * 9) + frame * 0.3) * (Math.PI / 180);
    const radius = 200 + (i % 5) * 80;
    const x = 960 + Math.cos(angle) * radius;
    const y = 540 + Math.sin(angle) * radius;
    const pOpacity = 0.15 + Math.sin(frame * 0.03 + i * 0.7) * 0.1;
    const r = 1.5 + (i % 3);
    return { x, y, pOpacity, r };
  });

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{
      position: 'absolute', top: 0, left: 0, opacity,
    }}>
      {/* Rotating mesh rings */}
      <g transform={`rotate(${rotation}, 960, 540)`}>
        <circle cx="960" cy="540" r="400" fill="none" stroke={BRAND.gold}
          strokeWidth="0.5" strokeDasharray="20 30 10 40" />
        <circle cx="960" cy="540" r="300" fill="none" stroke={BRAND.gold}
          strokeWidth="0.3" strokeDasharray="8 12" />
        <circle cx="960" cy="540" r="500" fill="none" stroke={BRAND.gold}
          strokeWidth="0.4" strokeDasharray="5 15 25 10" />
      </g>
      {/* Particles */}
      {particles.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={BRAND.gold} opacity={p.pOpacity} />
      ))}
      {/* Diagonal grid lines */}
      {[0, 1, 2, 3, 4].map(i => (
        <line key={`l-${i}`} x1={i * 480} y1="0" x2={i * 480 + 200} y2="1080"
          stroke={BRAND.gold} strokeWidth="0.3" opacity="0.06" />
      ))}
    </svg>
  );
}

// ── Helper: PrimeAI Logo ─────────────────────────────────────

function PrimeLogo({ scale = 1, opacity = 1 }) {
  return (
    <div style={{
      opacity,
      display: 'flex', alignItems: 'center', gap: 14 * scale,
    }}>
      {/* Stylized "P" mark */}
      <div style={{
        width: 48 * scale, height: 48 * scale, borderRadius: 12 * scale,
        background: `linear-gradient(135deg, ${BRAND.gold}, ${BRAND.goldDark})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 4px 30px ${BRAND.gold}50`,
      }}>
        <span style={{
          fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28 * scale,
          color: BRAND.dark, letterSpacing: -1,
        }}>P</span>
      </div>
      <span style={{
        fontFamily: FONTS.heading, fontWeight: 800, fontSize: 32 * scale,
        color: BRAND.gold, letterSpacing: 3,
      }}>PRIME-AI</span>
    </div>
  );
}

// ── Beat 1: THE SHIFT ────────────────────────────────────────

function Beat1({ frame, fps, c }) {
  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [fps * 4 - 15, fps * 4], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = fadeIn * fadeOut;

  const counterEnd = fps * 2.5;
  const counterProgress = interpolate(frame, [10, counterEnd], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const eased = 1 - Math.pow(1 - counterProgress, 3);
  const trillions = (eased * 2.59).toFixed(2);

  const textSlide = interpolate(frame, [15, 45], [30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const textFade = interpolate(frame, [15, 45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const voiceSlide = interpolate(frame, [fps * 2, fps * 2 + 25], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const voiceFade = interpolate(frame, [fps * 2, fps * 2 + 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', opacity,
    }}>
      {/* Counter */}
      <div style={{
        fontFamily: FONTS.mono, fontSize: 92, fontWeight: 800,
        color: BRAND.gold, letterSpacing: -3,
        textShadow: `0 0 60px ${BRAND.gold}40, 0 0 120px ${BRAND.gold}20`,
        transform: `translateY(${textSlide}px)`, opacity: textFade,
      }}>
        ${trillions} TRILLION
      </div>

      {/* Subtitle */}
      <div style={{
        fontFamily: FONTS.mono, fontSize: 16, fontWeight: 500,
        color: BRAND.muted, letterSpacing: 3, marginTop: 16,
        transform: `translateY(${textSlide}px)`, opacity: textFade * 0.7,
        textTransform: 'uppercase',
      }}>
        {c.beat1.subtitle}
      </div>

      {/* Voiceover text */}
      <div style={{
        fontFamily: FONTS.heading, fontSize: 34, fontWeight: 600,
        color: BRAND.light, marginTop: 60, letterSpacing: -0.5,
        transform: `translateY(${voiceSlide}px)`, opacity: voiceFade,
        textAlign: 'center',
      }}>
        {c.beat1.voiceover}
      </div>
    </div>
  );
}

// ── Beat 2: THE PROBLEM ──────────────────────────────────────

function Beat2({ frame, fps, c }) {
  const localFrame = frame;
  const fadeIn = interpolate(localFrame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(localFrame, [fps * 4 - 15, fps * 4], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = fadeIn * fadeOut;

  // Cloud lock icons animation
  const iconsScale = interpolate(localFrame, [5, 30], [0.7, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const iconsFade = interpolate(localFrame, [5, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const headFade = interpolate(localFrame, [20, 45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const headSlide = interpolate(localFrame, [20, 45], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const subFade = interpolate(localFrame, [fps * 1.5, fps * 1.5 + 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const subSlide = interpolate(localFrame, [fps * 1.5, fps * 1.5 + 25], [15, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Warning pulse
  const pulseOpacity = 0.15 + Math.sin(localFrame * 0.15) * 0.1;

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', opacity,
    }}>
      {/* Warning accent overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: `radial-gradient(ellipse at center, ${WARNING_RED}08 0%, transparent 70%)`,
        opacity: pulseOpacity,
      }} />

      {/* Cloud lock icons */}
      <svg width="400" height="120" viewBox="0 0 400 120" style={{
        opacity: iconsFade, transform: `scale(${iconsScale})`, marginBottom: 40,
      }}>
        {[0, 1, 2].map(i => {
          const cx = 80 + i * 120;
          return (
            <g key={i} transform={`translate(${cx}, 60)`}>
              {/* Cloud shape */}
              <path d="M-30,8 Q-30,-12 -10,-12 Q-6,-25 8,-25 Q28,-25 30,-8 Q42,-8 42,8 Q42,20 30,20 L-22,20 Q-35,20 -30,8 Z"
                fill="none" stroke={WARNING_RED} strokeWidth="2" opacity="0.6" />
              {/* Lock */}
              <rect x="-6" y="0" width="12" height="10" rx="2" fill="none" stroke={WARNING_RED} strokeWidth="1.5" />
              <path d="M-3,0 L-3,-5 Q-3,-10 0,-10 Q3,-10 3,-5 L3,0"
                fill="none" stroke={WARNING_RED} strokeWidth="1.5" />
              <circle cx="0" cy="5" r="1.5" fill={WARNING_RED} />
            </g>
          );
        })}
      </svg>

      {/* Headline */}
      <div style={{
        fontFamily: FONTS.heading, fontSize: 48, fontWeight: 800,
        color: BRAND.light, letterSpacing: -1, textAlign: 'center',
        transform: `translateY(${headSlide}px)`, opacity: headFade,
      }}>
        {c.beat2.headline}
      </div>

      {/* Subtext */}
      <div style={{
        fontFamily: FONTS.heading, fontSize: 20, fontWeight: 400,
        color: WARNING_RED, marginTop: 28, textAlign: 'center',
        letterSpacing: 0.5, opacity: subFade,
        transform: `translateY(${subSlide}px)`,
        padding: '12px 32px', borderRadius: 8,
        border: `1px solid ${WARNING_RED}30`,
        background: `${WARNING_RED}08`,
      }}>
        {c.beat2.subtext}
      </div>
    </div>
  );
}

// ── Beat 3: THE SOLUTION ─────────────────────────────────────

function Beat3({ frame, fps, c }) {
  const duration = fps * 6; // 6 seconds
  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [duration - 15, duration], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = fadeIn * fadeOut;

  // Logo reveal with particles
  const logoScale = spring({ frame: frame - 5, fps, config: { damping: 15, stiffness: 80 } });
  const logoOpacity = interpolate(frame, [5, 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Headline
  const headFade = interpolate(frame, [25, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const headSlide = interpolate(frame, [25, 50], [25, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Pillar cards — staggered entrance
  const pillarDelay = [fps * 1.8, fps * 2.2, fps * 2.6];

  // Subtitle
  const subFade = interpolate(frame, [fps * 3.5, fps * 3.5 + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Architecture dots (simplified connected nodes)
  const archFade = interpolate(frame, [fps * 4, fps * 4 + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Gold particles for logo reveal
  const particles = Array.from({ length: 20 }).map((_, i) => {
    const angle = ((i * 18) + frame * 2) * (Math.PI / 180);
    const dist = 60 + Math.sin(frame * 0.05 + i) * 20;
    const x = 960 + Math.cos(angle) * dist;
    const y = 200 + Math.sin(angle) * dist * 0.5;
    const pOp = interpolate(frame, [0, 30], [0, 0.3 + Math.sin(i) * 0.15], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
    return { x, y, pOp, r: 1.5 + (i % 3) };
  });

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', opacity,
    }}>
      {/* Logo particles */}
      <svg width="1920" height="400" viewBox="0 0 1920 400" style={{
        position: 'absolute', top: 0, left: 0,
      }}>
        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={BRAND.gold} opacity={p.pOp} />
        ))}
      </svg>

      {/* Logo */}
      <div style={{
        opacity: logoOpacity,
        transform: `scale(${logoScale})`,
        marginBottom: 20,
      }}>
        <PrimeLogo scale={1.3} />
      </div>

      {/* Headline */}
      <div style={{
        fontFamily: FONTS.heading, fontSize: 52, fontWeight: 800,
        color: BRAND.gold, letterSpacing: -1, marginBottom: 44,
        transform: `translateY(${headSlide}px)`, opacity: headFade,
        textShadow: `0 0 40px ${BRAND.gold}30`,
      }}>
        {c.beat3.headline}
      </div>

      {/* 3 Pillar Cards */}
      <div style={{
        display: 'flex', gap: 40, marginBottom: 36,
      }}>
        {c.beat3.pillars.map((pillar, i) => {
          const pSpring = spring({ frame: frame - pillarDelay[i] * (30 / fps), fps, config: { damping: 14, stiffness: 70 } });
          const pFade = interpolate(frame, [pillarDelay[i], pillarDelay[i] + 15], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });
          return (
            <div key={i} style={{
              opacity: pFade,
              transform: `scale(${pSpring}) translateY(${(1 - pSpring) * 20}px)`,
              background: `linear-gradient(135deg, ${BRAND.gold}15, ${BRAND.gold}08)`,
              border: `1px solid ${BRAND.gold}40`,
              borderRadius: 16, padding: '24px 44px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            }}>
              {/* Arrow connector to next */}
              <div style={{
                fontFamily: FONTS.heading, fontSize: 20, fontWeight: 700,
                color: BRAND.gold, letterSpacing: 1,
              }}>
                {pillar}
              </div>
              {/* Numbered badge */}
              <div style={{
                fontFamily: FONTS.mono, fontSize: 11, fontWeight: 600,
                color: BRAND.muted, letterSpacing: 2,
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Arrows between pillars */}
      <svg width="600" height="20" viewBox="0 0 600 20" style={{
        position: 'absolute', top: '52%', left: '50%',
        transform: 'translateX(-50%)', opacity: archFade * 0.4,
      }}>
        <line x1="160" y1="10" x2="250" y2="10" stroke={BRAND.gold} strokeWidth="1.5" strokeDasharray="4 3" />
        <line x1="350" y1="10" x2="440" y2="10" stroke={BRAND.gold} strokeWidth="1.5" strokeDasharray="4 3" />
      </svg>

      {/* Subtitle */}
      <div style={{
        fontFamily: FONTS.mono, fontSize: 16, fontWeight: 500,
        color: BRAND.muted, letterSpacing: 2, opacity: subFade,
        textTransform: 'uppercase',
      }}>
        {c.beat3.subtitle}
      </div>

      {/* Architecture nodes */}
      <svg width="800" height="100" viewBox="0 0 800 100" style={{
        opacity: archFade * 0.5, marginTop: 30,
      }}>
        {/* Central sovereign node */}
        <circle cx="400" cy="40" r="16" fill={`${BRAND.gold}20`} stroke={BRAND.gold} strokeWidth="1.5" />
        <text x="400" y="44" textAnchor="middle" fill={BRAND.gold}
          fontFamily={FONTS.mono} fontSize="8" fontWeight="700">SOV</text>
        {/* Device nodes */}
        {[200, 300, 500, 600].map((cx, i) => (
          <g key={i}>
            <line x1={cx} y1="70" x2="400" y2="40"
              stroke={BRAND.gold} strokeWidth="0.8" opacity="0.3" strokeDasharray="3 3" />
            <circle cx={cx} cy="70" r="8" fill={`${BRAND.gold}15`} stroke={BRAND.gold} strokeWidth="1" />
          </g>
        ))}
      </svg>
    </div>
  );
}

// ── Beat 4: THE PROOF ────────────────────────────────────────

function Beat4({ frame, fps, c }) {
  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [fps * 3 - 15, fps * 3], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = fadeIn * fadeOut;

  // Counter
  const counterFade = interpolate(frame, [5, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const counterSlide = interpolate(frame, [5, 30], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Badges — staggered
  const badgeDelays = [fps * 0.8, fps * 1.1, fps * 1.4];

  // Tagline
  const tagFade = interpolate(frame, [fps * 1.8, fps * 1.8 + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', opacity,
    }}>
      {/* Counter */}
      <div style={{
        transform: `translateY(${counterSlide}px)`, opacity: counterFade,
        textAlign: 'center', marginBottom: 12,
      }}>
        <div style={{
          fontFamily: FONTS.mono, fontSize: 76, fontWeight: 800,
          color: BRAND.gold, letterSpacing: -2,
          textShadow: `0 0 60px ${BRAND.gold}40`,
        }}>
          {c.beat4.counter}
        </div>
        <div style={{
          fontFamily: FONTS.mono, fontSize: 16, fontWeight: 500,
          color: BRAND.muted, letterSpacing: 3, marginTop: 8,
          textTransform: 'uppercase',
        }}>
          {c.beat4.counterLabel}
        </div>
      </div>

      {/* 3 Vertical Badges */}
      <div style={{
        display: 'flex', gap: 32, marginTop: 44, marginBottom: 40,
      }}>
        {c.beat4.badges.map((badge, i) => {
          const bSpring = spring({ frame: frame - badgeDelays[i] * (30 / fps), fps, config: { damping: 12, stiffness: 80 } });
          const bFade = interpolate(frame, [badgeDelays[i], badgeDelays[i] + 12], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });
          return (
            <div key={i} style={{
              opacity: bFade,
              transform: `scale(${bSpring})`,
              background: `${BRAND.gold}10`,
              border: `1px solid ${BRAND.gold}35`,
              borderRadius: 12, padding: '18px 36px',
              fontFamily: FONTS.heading, fontSize: 18, fontWeight: 700,
              color: BRAND.gold, letterSpacing: 1,
              textTransform: 'uppercase',
            }}>
              {badge}
            </div>
          );
        })}
      </div>

      {/* Tagline */}
      <div style={{
        fontFamily: FONTS.heading, fontSize: 22, fontWeight: 500,
        color: BRAND.light, opacity: tagFade, letterSpacing: 0.5,
        textAlign: 'center', maxWidth: 600,
      }}>
        {c.beat4.tagline}
      </div>
    </div>
  );
}

// ── Beat 5: THE CALL ─────────────────────────────────────────

function Beat5({ frame, fps, c }) {
  const fadeIn = interpolate(frame, [0, 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [fps * 3 - 10, fps * 3], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = fadeIn * fadeOut;

  const ctaScale = spring({ frame: frame - 10, fps, config: { damping: 18, stiffness: 60 } });
  const logoFade = interpolate(frame, [fps * 1.5, fps * 1.5 + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Glow pulse
  const glowIntensity = 40 + Math.sin(frame * 0.08) * 20;

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', opacity,
    }}>
      {/* CTA */}
      <div style={{
        fontFamily: FONTS.heading, fontSize: 56, fontWeight: 800,
        color: BRAND.gold, letterSpacing: -1,
        transform: `scale(${ctaScale})`,
        textShadow: `0 0 ${glowIntensity}px ${BRAND.gold}50`,
        marginBottom: 32,
      }}>
        {c.beat5.cta}
      </div>



      {/* Logo */}
      <div style={{ opacity: logoFade }}>
        <PrimeLogo scale={0.9} />
      </div>
    </div>
  );
}

// ── Main Composition ─────────────────────────────────────────

export default function MacroVisionV2Composition({ language = 'en' }) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const c = CONTENT[language];

  // Beat timing (frames): 0-4s, 4-8s, 8-14s, 14-17s, 17-20s
  const beat1Start = 0;
  const beat1Duration = fps * 4;     // 120 frames
  const beat2Start = beat1Duration;
  const beat2Duration = fps * 4;     // 120 frames
  const beat3Start = beat2Start + beat2Duration;
  const beat3Duration = fps * 6;     // 180 frames
  const beat4Start = beat3Start + beat3Duration;
  const beat4Duration = fps * 3;     // 90 frames
  const beat5Start = beat4Start + beat4Duration;
  const beat5Duration = fps * 3;     // 90 frames

  return (
    <div style={{
      width, height, background: BRAND.dark,
      position: 'relative', overflow: 'hidden',
      fontFamily: FONTS.heading,
    }}>
      <style>{FONT_CSS}</style>

      {/* Persistent gold mesh background */}
      <GoldMesh frame={frame} opacity={0.06} />

      {/* Dark vignette overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
        zIndex: 1,
      }} />

      {/* Content layer */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        zIndex: 10,
      }}>
        {/* Beat 1 — THE SHIFT (0-4s) */}
        <Sequence from={beat1Start} durationInFrames={beat1Duration}>
          <Beat1 frame={useCurrentFrame()} fps={fps} c={c} />
        </Sequence>

        {/* Beat 2 — THE PROBLEM (4-8s) */}
        <Sequence from={beat2Start} durationInFrames={beat2Duration}>
          <Beat2 frame={useCurrentFrame()} fps={fps} c={c} />
        </Sequence>

        {/* Beat 3 — THE SOLUTION (8-14s) */}
        <Sequence from={beat3Start} durationInFrames={beat3Duration}>
          <Beat3 frame={useCurrentFrame()} fps={fps} c={c} />
        </Sequence>

        {/* Beat 4 — THE PROOF (14-17s) */}
        <Sequence from={beat4Start} durationInFrames={beat4Duration}>
          <Beat4 frame={useCurrentFrame()} fps={fps} c={c} />
        </Sequence>

        {/* Beat 5 — THE CALL (17-20s) */}
        <Sequence from={beat5Start} durationInFrames={beat5Duration}>
          <Beat5 frame={useCurrentFrame()} fps={fps} c={c} />
        </Sequence>
      </div>

      {/* Corner HUD — persistent */}
      <div style={{
        position: 'absolute', top: 36, left: 48,
        fontFamily: FONTS.mono, fontSize: 11, fontWeight: 600,
        color: BRAND.gold, opacity: 0.4, letterSpacing: 1.5, zIndex: 20,
      }}>
        PRIME-AI // SOVEREIGN THESIS
      </div>
      <div style={{
        position: 'absolute', bottom: 36, right: 48,
        fontFamily: FONTS.mono, fontSize: 11, fontWeight: 500,
        color: BRAND.muted, opacity: 0.35, letterSpacing: 1, zIndex: 20,
      }}>
        prime-ai.fr
      </div>

      {/* Bottom timeline bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, width: '100%', height: 3,
        background: `${BRAND.gold}15`, zIndex: 20,
      }}>
        <div style={{
          height: '100%',
          width: `${(frame / (fps * 20)) * 100}%`,
          background: `linear-gradient(90deg, ${BRAND.gold}, ${BRAND.goldLight})`,
          boxShadow: `0 0 12px ${BRAND.gold}60`,
        }} />
      </div>
    </div>
  );
}
