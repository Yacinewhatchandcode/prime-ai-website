import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { BRAND, FONTS, FONT_CSS } from '../brand';

/**
 * FleetDashboard — Simulated dashboard with live metrics + telemetry
 * 
 * Props:
 *   title       — Dashboard title
 *   titleAccent — Accent portion
 *   metrics     — array of { label, value, status, color }
 *   logLines    — array of telemetry log strings
 *   theme       — 'light' | 'dark'
 *   primaryColor — accent color
 */
export default function FleetDashboard({
  title = 'Fleet',
  titleAccent = 'Command',
  metrics = [
    { label: 'AGENTS ONLINE', value: '14', status: 'ACTIVE', color: BRAND.green },
    { label: 'MESH STATUS', value: 'SYNCED', status: 'OK', color: BRAND.green },
    { label: 'MCP LAYER', value: 'ACTIVE', status: 'OPERATIONAL', color: BRAND.blue },
    { label: 'LATENCY', value: '23ms', status: 'OPTIMAL', color: BRAND.amber },
  ],
  logLines = [
    'A2A Protocol: Initializing Agent bridge...',
    'MCP Server: Verified 14/14 agents online.',
    'Edge Node: Sovereign Mesh connected.',
    'Fleet Commander: Heartbeat established.',
    'Sovereign Auditor: 0 discrepancies found.',
  ],
  theme = 'dark',
  primaryColor = BRAND.purple,
}) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const totalFrames = fps * 20;
  const exitOpacity = interpolate(frame, [totalFrames - 30, totalFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Header animations
  const headerOpacity = interpolate(frame, [5, 30], [0, 1], { extrapolateRight: 'clamp' });
  const headerY = interpolate(frame, [5, 30], [20, 0], { extrapolateRight: 'clamp' });

  // Scanline effect
  const scanlineY = interpolate(frame, [0, totalFrames], [0, height * 3], { extrapolateRight: 'extend' });

  return (
    <div style={{
      width, height,
      background: BRAND.consoleBg,
      position: 'relative', overflow: 'hidden',
      fontFamily: FONTS.heading, opacity: exitOpacity,
    }}>
      <style>{FONT_CSS}</style>

      {/* Cyber grid background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(rgba(168,85,247,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.03) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
      }} />

      {/* Scanline */}
      <div style={{
        position: 'absolute', left: 0, right: 0,
        top: scanlineY % height,
        height: 2,
        background: `linear-gradient(90deg, transparent, ${primaryColor}30, transparent)`,
        boxShadow: `0 0 20px ${primaryColor}15`,
        zIndex: 5,
      }} />

      {/* Top Header Bar */}
      <div style={{
        padding: '40px 60px 0',
        opacity: headerOpacity,
        transform: `translateY(${headerY}px)`,
        zIndex: 10, position: 'relative',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1px solid ${primaryColor}25`,
          paddingBottom: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Logo orb */}
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: `radial-gradient(circle, ${primaryColor}30, ${primaryColor}10)`,
              border: `1.5px solid ${primaryColor}50`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: primaryColor, boxShadow: `0 0 12px ${primaryColor}` }} />
            </div>
            <div>
              <h1 style={{
                fontFamily: FONTS.heading, fontSize: 36, fontWeight: 800,
                color: '#ffffff', letterSpacing: -1, margin: 0, lineHeight: 1,
              }}>
                {title}{' '}
                <span style={{ color: primaryColor }}>{titleAccent}</span>
              </h1>
              <span style={{
                fontFamily: FONTS.mono, fontSize: 11,
                color: BRAND.consoleSubtext, letterSpacing: 2,
              }}>
                SOVEREIGN FLEET DASHBOARD
              </span>
            </div>
          </div>

          {/* Status pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: `${BRAND.green}15`,
            border: `1px solid ${BRAND.green}40`,
            borderRadius: 100, padding: '8px 20px',
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: BRAND.green, boxShadow: `0 0 8px ${BRAND.green}` }} />
            <span style={{ fontFamily: FONTS.mono, fontSize: 12, fontWeight: 700, color: BRAND.green, letterSpacing: 1 }}>
              ALL SYSTEMS ONLINE
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid', gridTemplateColumns: `repeat(${metrics.length}, 1fr)`,
        gap: 20, padding: '30px 60px', zIndex: 10, position: 'relative',
      }}>
        {metrics.map((metric, i) => {
          const delay = 25 + i * 15;
          const mOpacity = interpolate(frame, [delay, delay + 20], [0, 1], { extrapolateRight: 'clamp' });
          const mY = interpolate(frame, [delay, delay + 20], [30, 0], { extrapolateRight: 'clamp' });

          return (
            <div key={i} style={{
              opacity: mOpacity,
              transform: `translateY(${mY}px)`,
              background: 'rgba(15,23,42,0.5)',
              border: `1px solid ${metric.color}25`,
              borderRadius: 14, padding: '22px 24px',
              backdropFilter: 'blur(8px)',
            }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: BRAND.consoleSubtext, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>
                {metric.label}
              </div>
              <div style={{ fontFamily: FONTS.heading, fontSize: 32, fontWeight: 800, color: '#ffffff', marginBottom: 4 }}>
                {metric.value}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: metric.color }} />
                <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: metric.color, letterSpacing: 1 }}>{metric.status}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Terminal Log Panel */}
      <div style={{
        margin: '10px 60px 0', padding: 28,
        background: 'rgba(5,5,7,0.9)',
        border: `1px solid ${primaryColor}15`,
        borderRadius: 14, zIndex: 10, position: 'relative',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
          borderBottom: `1px solid rgba(255,255,255,0.06)`, paddingBottom: 12,
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
          </div>
          <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: primaryColor, fontWeight: 700, letterSpacing: 1 }}>
            MCP TELEMETRY STREAM
          </span>
        </div>

        {logLines.map((line, i) => {
          const logDelay = 80 + i * 25;
          const logOpacity = interpolate(frame, [logDelay, logDelay + 15], [0, 1], { extrapolateRight: 'clamp' });
          const logX = interpolate(frame, [logDelay, logDelay + 15], [-20, 0], { extrapolateRight: 'clamp' });

          return (
            <div key={i} style={{
              opacity: logOpacity,
              transform: `translateX(${logX}px)`,
              fontFamily: FONTS.mono, fontSize: 14,
              color: BRAND.consoleText, lineHeight: 2,
              display: 'flex', gap: 12,
            }}>
              <span style={{ color: BRAND.gold, minWidth: 80 }}>[{String(14 + i).padStart(2, '0')}:{String(45 + i * 3).padStart(2, '0')}:{String(10 + i * 7).padStart(2, '0')}]</span>
              <span style={{ color: primaryColor, fontWeight: 700, minWidth: 180 }}>
                {line.split(':')[0]}:
              </span>
              <span>{line.split(':').slice(1).join(':')}</span>
            </div>
          );
        })}

        {/* Blinking cursor */}
        <div style={{
          fontFamily: FONTS.mono, fontSize: 14, color: primaryColor,
          opacity: Math.sin(frame * 0.15) > 0 ? 1 : 0,
          marginTop: 4,
        }}>
          █
        </div>
      </div>

      {/* HUD */}
      <div style={{
        position: 'absolute', bottom: 30, left: 60,
        fontFamily: FONTS.mono, fontSize: 11, color: BRAND.consoleSubtext,
        opacity: 0.4, letterSpacing: 1,
      }}>
        PRIME-AI // FLEET DASHBOARD
      </div>
      <div style={{
        position: 'absolute', bottom: 30, right: 60,
        fontFamily: FONTS.mono, fontSize: 11, color: BRAND.consoleSubtext,
        opacity: 0.4, letterSpacing: 1,
      }}>
        prime-ai.fr
      </div>
    </div>
  );
}
