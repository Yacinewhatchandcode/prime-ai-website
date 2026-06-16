import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Ecosysteme() {
  const { t } = useLanguage();
  const [activeNode, setActiveNode] = useState(null);

  const nodes = [
    {
      id: 'desktop',
      title: t('ecosystem.desktop.title'),
      platform: t('ecosystem.desktop.platform'),
      description: t('ecosystem.desktop.desc'),
      specs: [t('ecosystem.desktop.spec1'), t('ecosystem.desktop.spec2'), t('ecosystem.desktop.spec3')],
      color: "#C6A15A"
    },
    {
      id: 'mobile',
      title: t('ecosystem.mobile.title'),
      platform: t('ecosystem.mobile.platform'),
      description: t('ecosystem.mobile.desc'),
      specs: [t('ecosystem.mobile.spec1'), t('ecosystem.mobile.spec2'), t('ecosystem.mobile.spec3')],
      color: "#3D3528"
    },
    {
      id: 'cli',
      title: t('ecosystem.cli.title'),
      platform: t('ecosystem.cli.platform'),
      description: t('ecosystem.cli.desc'),
      specs: [t('ecosystem.cli.spec1'), t('ecosystem.cli.spec2'), t('ecosystem.cli.spec3')],
      color: "#1F1A13"
    },
    {
      id: 'cloud',
      title: t('ecosystem.cloud.title'),
      platform: t('ecosystem.cloud.platform'),
      description: t('ecosystem.cloud.desc'),
      specs: [t('ecosystem.cloud.spec1'), t('ecosystem.cloud.spec2'), t('ecosystem.cloud.spec3')],
      color: "#E6C587"
    }
  ];

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'hidden' }}>
      <style>{`
        .prime-button-dark {
          background: #1F1A13;
          color: #FAF8F4;
          border: 1px solid #1F1A13;
          padding: 12px 28px;
          border-radius: 100px;
          font-weight: 600;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          text-decoration: none;
          letter-spacing: 0.5px;
        }
        .prime-button-dark:hover {
          background: #3D3528;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(31, 26, 19, 0.15);
        }

        .eco-card {
          background: #FFFFFF;
          border: 1px solid rgba(198, 161, 90, 0.15);
          border-radius: 20px;
          padding: 32px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }
        .eco-card:hover {
          transform: translateY(-5px);
          border-color: #C6A15A;
          box-shadow: 0 15px 40px rgba(198, 161, 90, 0.08);
        }
        .eco-card.active {
          border-color: #C6A15A;
          background: rgba(198, 161, 90, 0.03);
          box-shadow: 0 15px 40px rgba(198, 161, 90, 0.08);
        }

        @keyframes pulseDot {
          0% { transform: scale(0.9); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.5; }
        }
        .pulse-dot {
          animation: pulseDot 3s ease-in-out infinite;
        }

        @media (max-width: 1024px) {
          .eco-grid { grid-template-columns: 1fr !important; }
          .detail-split { flex-direction: column !important; }
        }
      `}</style>

      {/* ── HEADER HERO ─────────────────────────────────── */}
      <section style={{
        padding: 'clamp(40px, 8vw, 80px) clamp(16px, 5vw, 60px) 40px',
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        textAlign: 'center'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <span style={{ width: '6px', height: '6px', background: '#C6A15A', borderRadius: '50%' }} />
          <span style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: '700',
            fontSize: '11px',
            color: '#C6A15A',
            letterSpacing: '3px',
            textTransform: 'uppercase'
          }}>
            {t('ecosystem.hero.tagline')}
          </span>
        </div>

        <h1 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '46px',
          fontWeight: '800',
          lineHeight: '1.2',
          color: '#1F1A13',
          marginBottom: '24px',
          letterSpacing: '-1px'
        }}>
          {t('ecosystem.hero.title1')}<br />
          <span style={{
            background: 'linear-gradient(90deg, #C6A15A 0%, #E6C587 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>{t('ecosystem.hero.title2')}</span>
        </h1>

        <p style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '16px',
          lineHeight: '1.65',
          color: '#656059',
          marginBottom: '50px',
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          {t('ecosystem.hero.desc')}
        </p>
      </section>

      {/* ── INTERACTIVE GRID & MAP ─────────────────────── */}
      <section style={{
        padding: '0 clamp(16px, 5vw, 60px) clamp(40px, 8vw, 80px)',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div className="eco-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '24px',
          marginBottom: '50px'
        }}>
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`eco-card ${activeNode === node.id ? 'active' : ''}`}
              onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                  color: '#C6A15A',
                  fontWeight: '700'
                }}>
                  {node.platform}
                </span>
                <span className="pulse-dot" style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: node.color,
                  boxShadow: `0 0 10px ${node.color}`
                }} />
              </div>

              <h2 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#1F1A13',
                marginBottom: '12px'
              }}>
                {node.title}
              </h2>

              <p style={{
                fontSize: '14px',
                lineHeight: '1.55',
                color: '#6E6860',
                marginBottom: '20px'
              }}>
                {node.description}
              </p>

              {activeNode === node.id && (
                <div style={{
                  borderTop: '1px solid rgba(198, 161, 90, 0.15)',
                  paddingTop: '16px',
                  marginTop: '16px'
                }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#1F1A13', marginBottom: '8px' }}>{t('ecosystem.specs.title')}</h4>
                  <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '13px', color: '#656059', lineHeight: '1.6' }}>
                    {node.specs.map((spec, index) => (
                      <li key={index} style={{ marginBottom: '4px' }}>{spec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/yace-aura" className="prime-button-dark">
            {t('ecosystem.btn.console')} <span style={{ marginLeft: '6px' }}>⚡</span>
          </Link>
        </div>
      </section>

      {/* ── SOVEREIGN FLEET PROTOCOLS ───────────────────── */}
      <section style={{
        background: '#FAF8F4',
        borderTop: '1px solid rgba(198, 161, 90, 0.15)',
        padding: '80px 60px'
      }}>
        <div className="detail-split" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '60px', alignItems: 'center' }}>
          <div style={{ flex: '1.2' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#1F1A13', marginBottom: '20px', letterSpacing: '-0.5px' }}>
              {t('ecosystem.sync.title')}
            </h2>
            <p style={{ fontSize: '15px', lineHeight: '1.65', color: '#6E6860', marginBottom: '24px' }}>
              {t('ecosystem.sync.desc1')}
            </p>
            <p style={{ fontSize: '15px', lineHeight: '1.65', color: '#6E6860' }}>
              {t('ecosystem.sync.desc2')}
            </p>
          </div>

          <div style={{ flex: '1', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid rgba(198, 161, 90, 0.25)',
              borderRadius: '24px',
              padding: '30px',
              width: '100%',
              maxWidth: '380px',
              boxShadow: '0 15px 45px rgba(198, 161, 90, 0.04)'
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                color: '#C6A15A',
                fontWeight: 'bold',
                marginBottom: '16px',
                borderBottom: '1px solid rgba(198, 161, 90, 0.15)',
                paddingBottom: '8px'
              }}>
                {t('ecosystem.sync.scheduler')}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: t('ecosystem.sync.nodes.desktop'), status: t('ecosystem.sync.status.synced'), color: "#10b981" },
                  { label: t('ecosystem.sync.nodes.mobile'), status: t('ecosystem.sync.status.synced'), color: "#10b981" },
                  { label: t('ecosystem.sync.nodes.cli'), status: t('ecosystem.sync.status.synced'), color: "#10b981" },
                  { label: t('ecosystem.sync.nodes.cloud'), status: t('ecosystem.sync.status.pending'), color: "#f59e0b" }
                ].map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#1F1A13' }}>{item.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.color }} />
                      <span style={{ fontSize: '11px', color: '#6E6860', fontFamily: "'JetBrains Mono', monospace" }}>{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
