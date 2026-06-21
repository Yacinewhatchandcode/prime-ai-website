import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';


export default function Ecosysteme() {
  const { language, t } = useLanguage();
  const [activeNode, setActiveNode] = useState(null);

  const nodes = [
    {
      id: 'desktop',
      title: t('eco.desktopTitle'),
      platform: t('eco.desktopPlatform'),
      description: t('eco.desktopDesc'),
      specs: [
        t('eco.desktopSpecs.0'),
        t('eco.desktopSpecs.1'),
        t('eco.desktopSpecs.2')
      ],
      color: "#C6A15A"
    },
    {
      id: 'mobile',
      title: t('eco.mobileTitle'),
      platform: t('eco.mobilePlatform'),
      description: t('eco.mobileDesc'),
      specs: [
        t('eco.mobileSpecs.0'),
        t('eco.mobileSpecs.1'),
        t('eco.mobileSpecs.2')
      ],
      color: "#3D3528"
    },
    {
      id: 'cli',
      title: t('eco.cliTitle'),
      platform: t('eco.cliPlatform'),
      description: t('eco.cliDesc'),
      specs: [
        t('eco.cliSpecs.0'),
        t('eco.cliSpecs.1'),
        t('eco.cliSpecs.2')
      ],
      color: "#1F1A13"
    },
    {
      id: 'cloud',
      title: t('eco.cloudTitle'),
      platform: t('eco.cloudPlatform'),
      description: t('eco.cloudDesc'),
      specs: [
        t('eco.cloudSpecs.0'),
        t('eco.cloudSpecs.1'),
        t('eco.cloudSpecs.2')
      ],
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
            {t('eco.tagline')}
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
          {t('eco.title1')}<br />
          <span style={{
            background: 'linear-gradient(90deg, #C6A15A 0%, #E6C587 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>{t('eco.title2')}</span>
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
          {t('eco.desc')}
        </p>
      </section>

      {/* ── VIDEO ────────────────────────────────────── */}
      <section style={{
        padding: '0 clamp(16px, 5vw, 60px) 40px',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <video
          src={language === 'fr' ? '/prime_ecosysteme_fr.mp4' : '/prime_ecosysteme_en.mp4'}
          autoPlay muted loop playsInline
          style={{
            width: '100%', maxWidth: '900px', borderRadius: '24px',
            boxShadow: '0 20px 50px rgba(198, 161, 90, 0.12)',
            border: '1px solid rgba(198, 161, 90, 0.2)',
          }}
        />
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
                  <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#1F1A13', marginBottom: '8px' }}>{t('eco.keyFeatures')}</h4>
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
              {t('eco.syncTitle')}
            </h2>
            <p style={{ fontSize: '15px', lineHeight: '1.65', color: '#6E6860', marginBottom: '24px' }}>
              {t('eco.syncDesc1')}
            </p>
            <p style={{ fontSize: '15px', lineHeight: '1.65', color: '#6E6860' }}>
              {t('eco.syncDesc2')}
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
                SYNCHRONIZATION_SCHEDULER
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: t('eco.nodes.desktop'), status: t('eco.nodes.synced'), color: "#10b981" },
                  { label: t('eco.nodes.mobile'), status: t('eco.nodes.synced'), color: "#10b981" },
                  { label: t('eco.nodes.cli'), status: t('eco.nodes.synced'), color: "#10b981" },
                  { label: t('eco.nodes.cloud'), status: t('eco.nodes.pending'), color: "#f59e0b" }
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
