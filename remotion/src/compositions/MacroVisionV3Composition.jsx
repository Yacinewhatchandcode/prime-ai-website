import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from 'remotion';
import { BRAND, FONTS, FONT_CSS } from '../brand';

// ── V3: Product-focused explainer for end users ──────────────

const CONTENT = {
  en: {
    beat1: {
      tagline: 'WHAT IS PRIME-AI?',
      headline: 'Your Local AI Workspace',
      subtitle: 'Desktop and mobile. Your data. Your rules.',
    },
    beat2: {
      tagline: 'HOW IT WORKS',
      devices: [
        { icon: '💻', name: 'Desktop', desc: 'Local goals & notes' },
        { icon: '📱', name: 'Mobile', desc: 'Offline tasks & notes' },
        { icon: '⌨️', name: 'Portable JSON', desc: 'Manual file transfer' },
        { icon: '☁️', name: 'Local Fleet', desc: 'Optional desktop AI' },
      ],
      subtitle: 'Manual transfer. No account. No paid API or cloud.',
    },
    beat3: {
      tagline: 'WHAT IT DOES',
      features: [
        { icon: '🧠', label: 'Organize', desc: 'Write goals, tasks and notes in your browser' },
        { icon: '🔗', label: 'Keep', desc: 'Browser storage persists across reloads' },
        { icon: '🤖', label: 'Transfer', desc: 'Export a file and review import conflicts' },
        { icon: '🔒', label: 'Advise', desc: 'Optional local roles; no tool execution' },
      ],
    },
    beat4: {
      tagline: 'THE DIFFERENCE',
      comparison: [
        { them: 'Free Browser', us: 'Optional Desktop Fleet' },
        { them: 'Goals, tasks and notes', us: 'Local Ollama inference' },
        { them: 'Offline app shell', us: 'Three advisory roles' },
        { them: 'Manual JSON transfer', us: 'Real mission snapshots' },
        { them: 'No account or cloud', us: 'No autonomous execution' },
      ],
    },
    beat5: {
      cta: 'Own your intelligence.',
      subtitle: 'Start with the free local workspace. No cloud required.',
    },
  },
  fr: {
    beat1: {
      tagline: "QU'EST-CE QUE PRIME-AI ?",
      headline: 'Votre Espace IA Local',
      subtitle: 'Bureau et mobile. Vos données. Vos règles.',
    },
    beat2: {
      tagline: 'COMMENT ÇA MARCHE',
      devices: [
        { icon: '💻', name: 'Bureau', desc: 'Objectifs & notes locaux' },
        { icon: '📱', name: 'Mobile', desc: 'Tâches & notes hors ligne' },
        { icon: '⌨️', name: 'JSON Portable', desc: 'Transfert manuel' },
        { icon: '☁️', name: 'Flotte Locale', desc: 'IA de bureau facultative' },
      ],
      subtitle: 'Transfert manuel. Sans compte, API payante ni cloud.',
    },
    beat3: {
      tagline: 'CE QUE ÇA FAIT',
      features: [
        { icon: '🧠', label: 'Organiser', desc: 'Objectifs, tâches et notes dans le navigateur' },
        { icon: '🔗', label: 'Conserver', desc: 'Stockage local conservé après rechargement' },
        { icon: '🤖', label: 'Transférer', desc: "Export de fichier et revue des conflits" },
        { icon: '🔒', label: 'Conseiller', desc: "Rôles locaux facultatifs, sans exécution d'outils" },
      ],
    },
    beat4: {
      tagline: 'LA DIFFÉRENCE',
      comparison: [
        { them: 'Navigateur Gratuit', us: 'Flotte de Bureau Facultative' },
        { them: 'Objectifs, tâches et notes', us: 'Inférence Ollama locale' },
        { them: 'Application hors ligne', us: 'Trois rôles consultatifs' },
        { them: 'Transfert JSON manuel', us: 'Instantanés de missions réelles' },
        { them: "Sans compte ni cloud", us: "Sans exécution autonome" },
      ],
    },
    beat5: {
      cta: 'Maîtrisez votre intelligence.',
      subtitle: "Commencez avec l'espace local gratuit. Sans cloud.",
    },
  },
};

// ── Shared components ────────────────────────────────────────

function GoldMesh({ frame, opacity = 0.06 }) {
  const particles = Array.from({ length: 30 }).map((_, i) => {
    const angle = ((i * 12) + frame * 0.2) * (Math.PI / 180);
    const radius = 250 + (i % 4) * 100;
    const x = 960 + Math.cos(angle) * radius;
    const y = 540 + Math.sin(angle) * radius;
    const pOp = 0.12 + Math.sin(frame * 0.02 + i * 0.5) * 0.08;
    return { x, y, pOp, r: 1 + (i % 3) };
  });
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: 'absolute', top: 0, left: 0, opacity }}>
      {particles.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={BRAND.gold} opacity={p.pOp} />
      ))}
    </svg>
  );
}

function PrimeLogo({ scale = 1, opacity = 1 }) {
  return (
    <div style={{ opacity, display: 'flex', alignItems: 'center', gap: 14 * scale }}>
      <div style={{
        width: 44 * scale, height: 44 * scale, borderRadius: 11 * scale,
        background: `linear-gradient(135deg, ${BRAND.gold}, ${BRAND.goldDark || BRAND.gold})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 4px 24px ${BRAND.gold}50`,
      }}>
        <span style={{ fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26 * scale, color: BRAND.dark }}>P</span>
      </div>
      <span style={{ fontFamily: FONTS.heading, fontWeight: 800, fontSize: 28 * scale, color: BRAND.gold, letterSpacing: 3 }}>PRIME-AI</span>
    </div>
  );
}

// ── Beat 1: WHAT IS PRIME-AI? (0-4s) ────────────────────────

function Beat1({ fps, c }) {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 20], [0.85, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [fps * 4 - 12, fps * 4], [1, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const logoScale = 0.92 + 0.08 * spring({ frame, fps, config: { damping: 15, stiffness: 80 } });
  const tagFade = interpolate(frame, [15, 35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const headFade = interpolate(frame, [25, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const headSlide = interpolate(frame, [25, 50], [30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const subFade = interpolate(frame, [fps * 1.5, fps * 2], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: fadeIn * fadeOut }}>
      <div style={{ transform: `scale(${logoScale})`, marginBottom: 40 }}>
        <PrimeLogo scale={1.4} />
      </div>
      <div style={{
        fontFamily: FONTS.mono, fontSize: 13, fontWeight: 700, color: BRAND.gold,
        letterSpacing: 4, opacity: tagFade, marginBottom: 16, textTransform: 'uppercase',
      }}>{c.beat1.tagline}</div>
      <div style={{
        fontFamily: FONTS.heading, fontSize: 64, fontWeight: 800, color: BRAND.light,
        letterSpacing: -2, opacity: headFade, transform: `translateY(${headSlide}px)`,
        textShadow: `0 0 60px ${BRAND.gold}25`,
      }}>{c.beat1.headline}</div>
      <div style={{
        fontFamily: FONTS.heading, fontSize: 22, fontWeight: 400, color: BRAND.muted,
        marginTop: 20, opacity: subFade, letterSpacing: 0.5,
      }}>{c.beat1.subtitle}</div>
    </div>
  );
}

// ── Beat 2: HOW IT WORKS — 4 Devices (4-9s) ─────────────────

function Beat2({ fps, c }) {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 15], [0.85, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [fps * 5 - 12, fps * 5], [1, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const tagFade = interpolate(frame, [5, 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const subFade = interpolate(frame, [fps * 3, fps * 3 + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Central node pulse
  const pulse = 1 + Math.sin(frame * 0.1) * 0.15;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: fadeIn * fadeOut }}>
      <div style={{
        fontFamily: FONTS.mono, fontSize: 13, fontWeight: 700, color: BRAND.gold,
        letterSpacing: 4, opacity: tagFade, marginBottom: 44,
      }}>{c.beat2.tagline}</div>

      {/* Device cards in a row with connection lines to center */}
      <div style={{ position: 'relative', width: 900, height: 280 }}>
        {/* Central PRIME node */}
        <div style={{
          position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) scale(${pulse})`,
          width: 60, height: 60, borderRadius: 30,
          background: `radial-gradient(circle, ${BRAND.gold}40, ${BRAND.gold}10)`,
          border: `2px solid ${BRAND.gold}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 30px ${BRAND.gold}30`,
          zIndex: 5,
        }}>
          <span style={{ fontFamily: FONTS.mono, fontSize: 10, fontWeight: 800, color: BRAND.gold }}>PRIME</span>
        </div>

        {/* Connection lines */}
        <svg width="900" height="280" viewBox="0 0 900 280" style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
          {[112, 312, 588, 788].map((x, i) => {
            const lineOpacity = interpolate(frame, [fps * 0.5 + i * 8, fps * 0.5 + i * 8 + 15], [0, 0.35], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            return <line key={i} x1={x} y1="140" x2="450" y2="140" stroke={BRAND.gold} strokeWidth="1" strokeDasharray="4 4" opacity={lineOpacity} />;
          })}
        </svg>

        {/* Device cards */}
        {c.beat2.devices.map((d, i) => {
          const x = [0, 200, 500, 700][i];
          const delay = fps * 0.3 + i * 10;
          const cardSpring = spring({ frame: frame - delay * (30 / fps), fps, config: { damping: 14, stiffness: 70 } });
          const cardFade = interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <div key={i} style={{
              position: 'absolute', left: x, top: 60, width: 170, opacity: cardFade,
              transform: `scale(${cardSpring})`,
              background: `linear-gradient(135deg, ${BRAND.gold}12, ${BRAND.gold}05)`,
              border: `1px solid ${BRAND.gold}30`, borderRadius: 16, padding: '20px 16px',
              textAlign: 'center', zIndex: 3,
            }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>{d.icon}</div>
              <div style={{ fontFamily: FONTS.heading, fontSize: 16, fontWeight: 700, color: BRAND.gold, marginBottom: 6 }}>{d.name}</div>
              <div style={{ fontFamily: FONTS.heading, fontSize: 12, fontWeight: 400, color: BRAND.muted, lineHeight: 1.4 }}>{d.desc}</div>
            </div>
          );
        })}
      </div>

      <div style={{
        fontFamily: FONTS.heading, fontSize: 18, fontWeight: 500, color: BRAND.light,
        marginTop: 28, opacity: subFade, letterSpacing: 0.3, textAlign: 'center',
      }}>{c.beat2.subtitle}</div>
    </div>
  );
}

// ── Beat 3: WHAT IT DOES — 4 Features (9-14s) ───────────────

function Beat3({ fps, c }) {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 15], [0.85, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [fps * 5 - 12, fps * 5], [1, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const tagFade = interpolate(frame, [0, 25], [0.85, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: fadeIn * fadeOut }}>
      <div style={{
        fontFamily: FONTS.mono, fontSize: 28, fontWeight: 700, color: BRAND.gold,
        letterSpacing: 4, opacity: tagFade, marginBottom: 50,
      }}>{c.beat3.tagline}</div>

      <div style={{ display: 'flex', gap: 28 }}>
        {c.beat3.features.map((f, i) => {
          const delay = fps * 0.4 + i * 12;
          const cardSpring = spring({ frame: frame - delay * (30 / fps), fps, config: { damping: 14, stiffness: 70 } });
          const cardFade = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const glow = Math.sin(frame * 0.06 + i * 1.5) * 0.3 + 0.7;
          return (
            <div key={i} style={{
              opacity: cardFade, transform: `scale(${cardSpring})`,
              width: 200, padding: '32px 20px', textAlign: 'center',
              background: `linear-gradient(180deg, ${BRAND.gold}10, transparent)`,
              border: `1px solid ${BRAND.gold}25`, borderRadius: 20,
              boxShadow: `0 0 ${20 * glow}px ${BRAND.gold}10`,
            }}>
              <div style={{ fontSize: 44, marginBottom: 16 }}>{f.icon}</div>
              <div style={{ fontFamily: FONTS.heading, fontSize: 20, fontWeight: 800, color: BRAND.gold, marginBottom: 10, letterSpacing: 0.5 }}>{f.label}</div>
              <div style={{ fontFamily: FONTS.heading, fontSize: 13, fontWeight: 400, color: BRAND.muted, lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Beat 4: THE DIFFERENCE — Comparison Table (14-18s) ───────

function Beat4({ fps, c }) {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 15], [0.85, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [fps * 4 - 12, fps * 4], [1, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const tagFade = interpolate(frame, [0, 25], [0.85, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: fadeIn * fadeOut }}>
      <div style={{
        fontFamily: FONTS.mono, fontSize: 28, fontWeight: 700, color: BRAND.gold,
        letterSpacing: 4, opacity: tagFade, marginBottom: 44,
      }}>{c.beat4.tagline}</div>

      {/* Comparison rows */}
      <div style={{ width: 700 }}>
        {c.beat4.comparison.map((row, i) => {
          const delay = fps * 0.3 + i * 10;
          const rowFade = interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const rowSlide = interpolate(frame, [delay, delay + 12], [15, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const isHeader = i === 0;
          return (
            <div key={i} style={{
              display: 'flex', opacity: rowFade, transform: `translateY(${rowSlide}px)`,
              borderBottom: `1px solid ${BRAND.gold}${isHeader ? '30' : '12'}`,
              padding: isHeader ? '0 0 16px 0' : '14px 0',
            }}>
              <div style={{
                flex: 1, textAlign: 'center',
                fontFamily: FONTS.heading, fontSize: isHeader ? 18 : 16,
                fontWeight: isHeader ? 700 : 400,
                color: isHeader ? '#888' : '#666',
                letterSpacing: isHeader ? 1 : 0,
              }}>{row.them}</div>
              <div style={{
                width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONTS.mono, fontSize: 14, color: BRAND.gold, opacity: 0.5,
              }}>vs</div>
              <div style={{
                flex: 1, textAlign: 'center',
                fontFamily: FONTS.heading, fontSize: isHeader ? 18 : 16,
                fontWeight: isHeader ? 800 : 600,
                color: isHeader ? BRAND.gold : BRAND.light,
                letterSpacing: isHeader ? 1 : 0,
              }}>{row.us}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Beat 5: CTA (18-22s) ─────────────────────────────────────

function Beat5({ fps, c }) {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 25], [0.85, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ctaScale = 0.95 + 0.05 * spring({ frame, fps, config: { damping: 18, stiffness: 60 } });
  const subFade = interpolate(frame, [fps * 0.8, fps * 0.8 + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const logoFade = interpolate(frame, [fps * 1.8, fps * 1.8 + 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const glow = 40 + Math.sin(frame * 0.08) * 20;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: fadeIn }}>
      <div style={{
        fontFamily: FONTS.heading, fontSize: 56, fontWeight: 800, color: BRAND.gold,
        letterSpacing: -1, transform: `scale(${ctaScale})`,
        textShadow: `0 0 ${glow}px ${BRAND.gold}50`, marginBottom: 20,
      }}>{c.beat5.cta}</div>
      <div style={{
        fontFamily: FONTS.heading, fontSize: 18, fontWeight: 400, color: BRAND.muted,
        opacity: subFade, marginBottom: 36,
      }}>{c.beat5.subtitle}</div>

      <div style={{ opacity: logoFade }}><PrimeLogo scale={0.9} /></div>
    </div>
  );
}

// ── Main Composition ─────────────────────────────────────────

export default function MacroVisionV3Composition({ language = 'en' }) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const c = CONTENT[language];

  const b1 = 0, b1d = fps * 4;
  const b2 = b1 + b1d, b2d = fps * 5;
  const b3 = b2 + b2d, b3d = fps * 5;
  const b4 = b3 + b3d, b4d = fps * 4;
  const b5 = b4 + b4d, b5d = fps * 4;

  return (
    <div style={{ width, height, background: BRAND.dark, position: 'relative', overflow: 'hidden', fontFamily: FONTS.heading }}>
      <style>{FONT_CSS}</style>
      <GoldMesh frame={frame} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)', zIndex: 1 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }}>
        <Sequence from={b1} durationInFrames={b1d}><Beat1 fps={fps} c={c} /></Sequence>
        <Sequence from={b2} durationInFrames={b2d}><Beat2 fps={fps} c={c} /></Sequence>
        <Sequence from={b3} durationInFrames={b3d}><Beat3 fps={fps} c={c} /></Sequence>
        <Sequence from={b4} durationInFrames={b4d}><Beat4 fps={fps} c={c} /></Sequence>
        <Sequence from={b5} durationInFrames={b5d}><Beat5 fps={fps} c={c} /></Sequence>
      </div>
      <div style={{ position: 'absolute', top: 36, left: 48, fontFamily: FONTS.mono, fontSize: 11, fontWeight: 600, color: BRAND.gold, opacity: 0.4, letterSpacing: 1.5, zIndex: 20 }}>PRIME-AI // SOVEREIGN FLEET</div>
      <div style={{ position: 'absolute', bottom: 36, right: 48, fontFamily: FONTS.mono, fontSize: 11, fontWeight: 500, color: BRAND.muted, opacity: 0.35, letterSpacing: 1, zIndex: 20 }}>prime-ai.fr</div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 3, background: `${BRAND.gold}15`, zIndex: 20 }}>
        <div style={{ height: '100%', width: `${(frame / (fps * 22)) * 100}%`, background: `linear-gradient(90deg, ${BRAND.gold}, ${BRAND.goldLight || BRAND.gold})`, boxShadow: `0 0 12px ${BRAND.gold}60` }} />
      </div>
    </div>
  );
}
