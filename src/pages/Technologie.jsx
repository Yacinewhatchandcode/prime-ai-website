import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Technologie() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('mesh');
  const [hudScan, setHudScan] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setHudScan(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const technologies = {
    mesh: {
      title: t('technology.mesh.title'),
      description: t('technology.mesh.desc'),
      features: [
        t('technology.mesh.feat1'),
        t('technology.mesh.feat2'),
        t('technology.mesh.feat3')
      ],
      metric: t('technology.mesh.metric')
    },
    inference: {
      title: t('technology.inference.title'),
      description: t('technology.inference.desc'),
      features: [
        t('technology.inference.feat1'),
        t('technology.inference.feat2'),
        t('technology.inference.feat3')
      ],
      metric: t('technology.inference.metric')
    },
    alignment: {
      title: t('technology.alignment.title'),
      description: t('technology.alignment.desc'),
      features: [
        t('technology.alignment.feat1'),
        t('technology.alignment.feat2'),
        t('technology.alignment.feat3')
      ],
      metric: t('technology.alignment.metric')
    }
  };

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

        .tech-tab {
          padding: 14px 28px;
          border-radius: 100px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s;
          border: 1px solid rgba(198, 161, 90, 0.15);
          background: rgba(255, 255, 255, 0.5);
          color: #656059;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .tech-tab.active {
          background: #1F1A13;
          color: #FAF8F4;
          border-color: #1F1A13;
          box-shadow: 0 8px 20px rgba(31, 26, 19, 0.1);
        }

        .tech-card {
          background: #FFFFFF;
          border: 1px solid rgba(198, 161, 90, 0.2);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 15px 40px rgba(198, 161, 90, 0.04);
          transition: all 0.4s;
        }

        @keyframes rotateMesh {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .mesh-rotating {
          animation: rotateMesh 50s linear infinite;
        }

        @media (max-width: 1024px) {
          .tech-split { flex-direction: column !important; gap: 40px !important; }
          .tech-tabs { justify-content: center !important; }
        }
      `}</style>

      {/* ── HEADER HERO ─────────────────────────────────── */}
      <section style={{
        padding: 'clamp(40px, 8vw, 80px) clamp(16px, 5vw, 60px) 60px',
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
            {t('technology.hero.tagline')}
          </span>
        </div>

        <h1 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '48px',
          fontWeight: '800',
          lineHeight: '1.2',
          color: '#1F1A13',
          marginBottom: '24px',
          letterSpacing: '-1px'
        }}>
          {t('technology.hero.title1')}<br />
          <span style={{
            background: 'linear-gradient(90deg, #C6A15A 0%, #E6C587 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>{t('technology.hero.title2')}</span>
        </h1>

        <p style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '16px',
          lineHeight: '1.65',
          color: '#656059',
          marginBottom: '40px',
          maxWidth: '680px',
          margin: '0 auto 40px'
        }}>
          {t('technology.hero.desc')}
        </p>

        {/* Tab Selectors */}
        <div className="tech-tabs" style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '60px', flexWrap: 'wrap' }}>
          <button className={`tech-tab ${activeTab === 'mesh' ? 'active' : ''}`} onClick={() => setActiveTab('mesh')}>
            {t('technology.tabs.mesh')}
          </button>
          <button className={`tech-tab ${activeTab === 'inference' ? 'active' : ''}`} onClick={() => setActiveTab('inference')}>
            {t('technology.tabs.inference')}
          </button>
          <button className={`tech-tab ${activeTab === 'alignment' ? 'active' : ''}`} onClick={() => setActiveTab('alignment')}>
            {t('technology.tabs.alignment')}
          </button>
        </div>
      </section>

      {/* ── CORE TECH DETAILS ───────────────────────────── */}
      <section style={{
        padding: '0 clamp(16px, 5vw, 60px) clamp(60px, 10vw, 100px)',
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative'
      }}>
        <div className="tech-split" style={{ display: 'flex', gap: '60px', alignItems: 'center' }}>
          {/* Visual Area */}
          <div style={{ flex: '1', display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div style={{
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(198, 161, 90, 0.05) 0%, transparent 70%)',
              position: 'absolute'
            }} />

            <svg className="mesh-rotating" width="300" height="300" viewBox="0 0 300 300" style={{ opacity: 0.3 }}>
              <circle cx="150" cy="150" r="130" fill="none" stroke="#C6A15A" strokeWidth="1" strokeDasharray="20 15 5 25" />
              <circle cx="150" cy="150" r="100" fill="none" stroke="#C6A15A" strokeWidth="0.5" strokeDasharray="5 5" />
              <line x1="150" y1="20" x2="150" y2="280" stroke="rgba(198, 161, 90, 0.15)" strokeWidth="1" />
              <line x1="20" y1="150" x2="280" y2="150" stroke="rgba(198, 161, 90, 0.15)" strokeWidth="1" />
            </svg>

            <div style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '2px solid #C6A15A',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(198, 161, 90, 0.1)',
              position: 'relative',
              zIndex: 5
            }}>
              <span style={{ fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: '#C6A15A', fontWeight: 'bold' }}>METRIC</span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#1F1A13', textAlign: 'center', padding: '0 10px', marginTop: '4px' }}>
                {technologies[activeTab].metric}
              </span>
            </div>
          </div>

          {/* Details Area */}
          <div style={{ flex: '1.2' }}>
            <div className="tech-card">
              <h2 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '28px',
                fontWeight: '700',
                color: '#1F1A13',
                marginBottom: '20px'
              }}>
                {technologies[activeTab].title}
              </h2>

              <p style={{
                fontSize: '15px',
                lineHeight: '1.65',
                color: '#656059',
                marginBottom: '30px'
              }}>
                {technologies[activeTab].description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '35px' }}>
                {technologies[activeTab].features.map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: 'rgba(198, 161, 90, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#C6A15A',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}>✓</div>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1F1A13' }}>{feat}</span>
                  </div>
                ))}
              </div>

              <Link to="/yace-aura" className="prime-button-dark">
                {t('technology.btn.test')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TECHNICAL SPECIFICATION GRID ────────────────── */}
      <section style={{
        background: '#FAF8F4',
        borderTop: '1px solid rgba(198, 161, 90, 0.15)',
        padding: '80px 60px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1F1A13' }}>{t('technology.specs.title')}</h2>
            <p style={{ fontSize: '14px', color: '#6E6860', marginTop: '8px' }}>{t('technology.specs.desc')}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              { title: t('technology.specs.spec1Title'), desc: t('technology.specs.spec1Desc') },
              { title: t('technology.specs.spec2Title'), desc: t('technology.specs.spec2Desc') },
              { title: t('technology.specs.spec3Title'), desc: t('technology.specs.spec3Desc') }
            ].map((spec, i) => (
              <div key={i} style={{ background: '#FFFFFF', border: '1px solid rgba(198, 161, 90, 0.12)', borderRadius: '16px', padding: '28px' }}>
                <h3 style={{ fontWeight: '700', fontSize: '16px', color: '#1F1A13', marginBottom: '10px' }}>{spec.title}</h3>
                <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#6E6860' }}>{spec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
