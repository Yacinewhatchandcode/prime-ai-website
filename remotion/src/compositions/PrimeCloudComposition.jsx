import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { BRAND, FONTS, FONT_CSS } from '../brand';

const CONTENT = {
  en: {
    tagline: 'PRIME-PRIVATE CLOUD',
    platform: 'Sovereign Infrastructure',
    title: 'Your Cloud.',
    titleAccent: 'Your Rules.',
    subtitle: 'Your fully autonomous private cloud. Keep your thoughts, your memories, and your intelligence completely invisible to the outside world.',
    metrics: [
      { label: 'INTELLIGENCE', value: 'ACTIVE', status: 'LOCAL MIND', color: BRAND.green },
      { label: 'COMMUNICATION', value: 'SHIELDED', status: 'PRIVATE', color: BRAND.blue },
      { label: 'MEMORY', value: 'VAULTED', status: 'SOVEREIGN', color: BRAND.gold },
      { label: 'AWARENESS', value: 'ALWAYS ON', status: 'AUTONOMOUS', color: BRAND.green },
    ],
    servers: [
      { name: 'brain-node-01', cpu: 94, gpu: 87, status: 'RUNNING' },
      { name: 'vision-relay-secure', cpu: 23, gpu: 0, status: 'RUNNING' },
      { name: 'memory-processor-hq', cpu: 67, gpu: 45, status: 'RUNNING' },
      { name: 'backup-shield', cpu: 12, gpu: 0, status: 'STANDBY' },
    ],
    noCloud: 'ABSOLUTE FREEDOM — YOUR SERVERS • YOUR RULES • YOUR MIND',
  },
  fr: {
    tagline: 'PRIME-CLOUD PRIVÉ',
    platform: 'Infrastructure Souveraine',
    title: 'Votre Cloud.',
    titleAccent: 'Vos Règles.',
    subtitle: "Votre cloud privé entièrement autonome. Gardez vos pensées, vos mémoires et votre intelligence totalement invisibles au monde extérieur.",
    metrics: [
      { label: 'INTELLIGENCE', value: 'ACTIF', status: 'ESPRIT LOCAL', color: BRAND.green },
      { label: 'COMMUNICATION', value: 'PROTÉGÉ', status: 'PRIVÉ', color: BRAND.blue },
      { label: 'MÉMOIRE', value: 'VERROUILLÉ', status: 'SOUVERAIN', color: BRAND.gold },
      { label: 'CONSCIENCE', value: 'TOUJOURS ACTIF', status: 'AUTONOME', color: BRAND.green },
    ],
    servers: [
      { name: 'cerveau-noeud-01', cpu: 94, gpu: 87, status: 'ACTIF' },
      { name: 'relais-vision-sécurisé', cpu: 23, gpu: 0, status: 'ACTIF' },
      { name: 'processeur-mémoire-hq', cpu: 67, gpu: 45, status: 'ACTIF' },
      { name: 'bouclier-backup', cpu: 12, gpu: 0, status: 'VEILLE' },
    ],
    noCloud: 'LIBERTÉ ABSOLUE — VOS SERVEURS • VOS RÈGLES • VOTRE ESPRIT',
  },
};

export default function PrimeCloudComposition({ language = 'en' }) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const c = CONTENT[language];
  const totalFrames = fps * 15;

  const exitOpacity = interpolate(frame, [totalFrames - 25, totalFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Header
  const headerOpacity = interpolate(frame, [5, 30], [0, 1], { extrapolateRight: 'clamp' });
  const headerY = interpolate(frame, [5, 30], [20, 0], { extrapolateRight: 'clamp' });

  // Title
  const titleOpacity = interpolate(frame, [20, 45], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [20, 45], [25, 0], { extrapolateRight: 'clamp' });
  const accentOpacity = interpolate(frame, [35, 60], [0, 1], { extrapolateRight: 'clamp' });
  const accentY = interpolate(frame, [35, 60], [25, 0], { extrapolateRight: 'clamp' });

  const subOpacity = interpolate(frame, [50, 75], [0, 1], { extrapolateRight: 'clamp' });

  // Scanline
  const scanlineY = interpolate(frame, [0, totalFrames], [0, height * 3], { extrapolateRight: 'extend' });

  // Glow pulse
  const glowPulse = interpolate(frame, [0, fps * 2, fps * 4], [0.3, 0.6, 0.3], { extrapolateRight: 'extend' });

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
        backgroundImage: `linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
      }} />

      {/* Scanline */}
      <div style={{
        position: 'absolute', left: 0, right: 0,
        top: scanlineY % height, height: 2,
        background: `linear-gradient(90deg, transparent, ${BRAND.blue}20, transparent)`,
        zIndex: 5,
      }} />

      {/* V2 Uniform Glow Orb */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 800, height: 800, transform: `translate(-50%, -50%)`,
        background: `radial-gradient(circle, ${BRAND.gold}15 0%, transparent 60%)`,
        borderRadius: '50%',
        opacity: Math.sin(frame * 0.05) * 0.2 + 0.8,
      }} />

      {/* Header */}
      <div style={{
        padding: '45px 70px 0', zIndex: 10,
        opacity: headerOpacity, transform: `translateY(${headerY}px)`,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1px solid ${BRAND.blue}20`, paddingBottom: 18,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Server orb */}
            <div style={{
              width: 42, height: 42, borderRadius: '50%',
              background: `radial-gradient(circle, ${BRAND.blue}25, ${BRAND.blue}08)`,
              border: `1.5px solid ${BRAND.blue}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: BRAND.blue, boxShadow: `0 0 12px ${BRAND.blue}` }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: FONTS.heading, fontWeight: 700, fontSize: 13, color: BRAND.blue, letterSpacing: 4 }}>
                  {c.tagline}
                </span>
              </div>
              <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: BRAND.consoleSubtext, letterSpacing: 1 }}>
                {c.platform}
              </span>
            </div>
          </div>

          {/* Sovereignty badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: `${BRAND.gold}12`, border: `1px solid ${BRAND.gold}35`,
            borderRadius: 100, padding: '8px 20px',
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: BRAND.gold, boxShadow: `0 0 8px ${BRAND.gold}` }} />
            <span style={{ fontFamily: FONTS.mono, fontSize: 11, fontWeight: 700, color: BRAND.gold, letterSpacing: 1 }}>
              100% SOVEREIGN
            </span>
          </div>
        </div>
      </div>

      {/* Title + Subtitle */}
      <div style={{ padding: '30px 70px 0', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 40 }}>
          <div>
            <h1 style={{
              opacity: titleOpacity, transform: `translateY(${titleY}px)`,
              fontFamily: FONTS.heading, fontSize: 60, fontWeight: 800,
              color: '#ffffff', letterSpacing: -2, margin: 0, lineHeight: 1.05,
            }}>
              {c.title}
            </h1>
            <h1 style={{
              opacity: accentOpacity, transform: `translateY(${accentY}px)`,
              fontFamily: FONTS.heading, fontSize: 60, fontWeight: 800,
              background: `linear-gradient(90deg, ${BRAND.blue}, ${BRAND.gold})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', letterSpacing: -2, margin: 0, lineHeight: 1.05,
            }}>
              {c.titleAccent}
            </h1>
          </div>
          <p style={{
            opacity: subOpacity, fontFamily: FONTS.heading,
            fontSize: 15, fontWeight: 400, color: BRAND.consoleSubtext,
            lineHeight: 1.6, maxWidth: 440, marginBottom: 8,
          }}>
            {c.subtitle}
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16, padding: '24px 70px', zIndex: 10,
      }}>
        {c.metrics.map((metric, i) => {
          const delay = 60 + i * 15;
          const mOpacity = interpolate(frame, [delay, delay + 20], [0, 1], { extrapolateRight: 'clamp' });
          const mY = interpolate(frame, [delay, delay + 20], [25, 0], { extrapolateRight: 'clamp' });
          return (
            <div key={i} style={{
              opacity: mOpacity, transform: `translateY(${mY}px)`,
              background: 'rgba(15,23,42,0.5)', border: `1px solid ${metric.color}20`,
              borderRadius: 12, padding: '18px 20px',
              backdropFilter: 'blur(8px)',
            }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: BRAND.consoleSubtext, fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>
                {metric.label}
              </div>
              <div style={{ fontFamily: FONTS.heading, fontSize: 26, fontWeight: 800, color: '#ffffff', marginBottom: 4 }}>
                {metric.value}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: metric.color }} />
                <span style={{ fontFamily: FONTS.mono, fontSize: 9, color: metric.color, letterSpacing: 1 }}>
                  {metric.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Server List */}
      <div style={{
        margin: '6px 70px 0', padding: 22,
        background: 'rgba(5,5,7,0.9)', border: `1px solid ${BRAND.blue}12`,
        borderRadius: 12, zIndex: 10, flex: 1,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
          borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 10,
        }}>
          <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: BRAND.blue, fontWeight: 700, letterSpacing: 1 }}>
            SERVER RACK — INFRASTRUCTURE
          </span>
        </div>

        {c.servers.map((server, i) => {
          const sDelay = 130 + i * 20;
          const sOpacity = interpolate(frame, [sDelay, sDelay + 18], [0, 1], { extrapolateRight: 'clamp' });
          const sX = interpolate(frame, [sDelay, sDelay + 18], [-15, 0], { extrapolateRight: 'clamp' });
          const isStandby = server.status === 'STANDBY' || server.status === 'VEILLE';
          const statusColor = isStandby ? BRAND.amber : BRAND.green;

          // Animated CPU bar
          const cpuWidth = interpolate(frame, [sDelay + 10, sDelay + 40], [0, server.cpu], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const gpuWidth = interpolate(frame, [sDelay + 15, sDelay + 45], [0, server.gpu], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

          return (
            <div key={i} style={{
              opacity: sOpacity, transform: `translateX(${sX}px)`,
              display: 'grid', gridTemplateColumns: '220px 1fr 1fr 100px',
              gap: 16, alignItems: 'center',
              padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.03)',
            }}>
              <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: BRAND.consoleText, fontWeight: 500 }}>
                {server.name}
              </span>

              {/* CPU bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: BRAND.consoleSubtext, minWidth: 30 }}>CPU</span>
                <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    width: `${cpuWidth}%`, height: '100%',
                    background: server.cpu > 80 ? BRAND.amber : BRAND.green,
                    borderRadius: 3,
                  }} />
                </div>
                <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: BRAND.consoleSubtext, minWidth: 30 }}>
                  {Math.round(cpuWidth)}%
                </span>
              </div>

              {/* GPU bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: BRAND.consoleSubtext, minWidth: 30 }}>GPU</span>
                <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    width: `${gpuWidth}%`, height: '100%',
                    background: BRAND.blue,
                    borderRadius: 3,
                  }} />
                </div>
                <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: BRAND.consoleSubtext, minWidth: 30 }}>
                  {Math.round(gpuWidth)}%
                </span>
              </div>

              {/* Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor }} />
                <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: statusColor, fontWeight: 700, letterSpacing: 0.5 }}>
                  {server.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* No-cloud banner */}
      <div style={{
        padding: '14px 70px 20px', zIndex: 10,
        opacity: interpolate(frame, [250, 280], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        <div style={{
          fontFamily: FONTS.mono, fontSize: 12, fontWeight: 700,
          color: BRAND.gold, letterSpacing: 2, textAlign: 'center',
          padding: '12px 0',
          borderTop: `1px solid ${BRAND.gold}15`,
        }}>
          {c.noCloud}
        </div>
      </div>

      {/* HUD */}
      <div style={{
        position: 'absolute', top: 45, right: 70,
        fontFamily: FONTS.mono, fontSize: 11, color: BRAND.consoleSubtext,
        opacity: 0, letterSpacing: 1,
      }}>
        {/* Hidden — header has its own nav */}
      </div>
      <div style={{
        position: 'absolute', bottom: 18, right: 70,
        fontFamily: FONTS.mono, fontSize: 11, color: BRAND.consoleSubtext,
        opacity: 0.3, letterSpacing: 1,
      }}>
        prime-ai.fr
      </div>
    </div>
  );
}
