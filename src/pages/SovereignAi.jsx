import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, Sliders, ShieldCheck, Database, Network } from 'lucide-react';
import { Link } from 'react-router-dom';
import PrimeLogo from '../components/PrimeLogo';

function SovereignAi() {
  const { language, t } = useLanguage();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <div className="sub-header">
        <Link to="/" className="sub-header-btn">
          <ChevronLeft size={20} />
        </Link>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <PrimeLogo size={20} glow={false} />
            <div className="sub-header-title" style={{ color: '#f59e0b', fontSize: '1rem' }}>SOVEREIGN AI</div>
          </div>
          <div className="sub-header-subtitle">PRIME MCP SOVEREIGN FLEET</div>
        </div>
        <button className="sub-header-btn">
          <Sliders size={20} />
        </button>
      </div>

      <div style={{ flex: 1, paddingBottom: '40px' }}>
        <div className="dash-top-row">
          <div className="dash-stat">
            <div className="dash-stat-label"><div className="agent-status-dot" style={{ background: '#f59e0b', boxShadow: '0 0 10px #f59e0b' }}></div> STATUS</div>
            <div className="dash-stat-val" style={{ color: '#f59e0b' }}>SECURED</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-label">MCP LAYER</div>
            <div className="dash-stat-val" style={{ color: '#fff' }}>ACTIVE</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-label">NODE TYPE</div>
            <div className="dash-stat-val" style={{ color: '#fff' }}>SOVEREIGN</div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '24px', padding: '0 24px' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#fff', margin: 0, letterSpacing: '1px' }}>{t('sovereign.title1')} <span style={{ color: '#f59e0b' }}>{t('sovereign.title2')}</span></h2>
          <div style={{ fontSize: '0.65rem', color: '#a1a1aa', letterSpacing: '1px', marginTop: '8px' }}>{t('sovereign.tagline')}</div>
        </div>

        <div style={{ padding: '0 24px', marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
          <video
            src={language === 'fr' ? '/prime_sovereign_fr.mp4' : '/prime_sovereign_en.mp4'}
            autoPlay muted loop playsInline
            style={{
              width: '100%', borderRadius: '16px',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            }}
          />
        </div>

        <div className="agent-panel agent-panel-glow-orange">
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={24} color="#f59e0b" />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#f59e0b' }}>{t('sovereign.subtitle')}</div>
              <div style={{ fontSize: '0.6rem', color: '#a1a1aa' }}>SYSTEM ARCHITECTURE</div>
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#e2e8f0', lineHeight: '1.6', marginBottom: '12px' }}>
            {t('sovereign.desc1')}
          </p>
          <p style={{ fontSize: '0.75rem', color: '#e2e8f0', lineHeight: '1.6' }}>
            {t('sovereign.desc2')}
          </p>
        </div>

        <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="agent-panel" style={{ margin: 0, padding: '16px', display: 'flex', gap: '16px' }}>
            <Database size={24} color="#3b82f6" />
            <div>
              <h3 style={{ fontSize: '0.8rem', color: '#3b82f6', marginBottom: '8px' }}>{t('sovereign.col1Title')}</h3>
              <p style={{ fontSize: '0.7rem', color: '#a1a1aa', lineHeight: '1.5' }}>{t('sovereign.col1Desc')}</p>
            </div>
          </div>
          <div className="agent-panel" style={{ margin: 0, padding: '16px', display: 'flex', gap: '16px' }}>
            <Network size={24} color="#a855f7" />
            <div>
              <h3 style={{ fontSize: '0.8rem', color: '#a855f7', marginBottom: '8px' }}>{t('sovereign.col2Title')}</h3>
              <p style={{ fontSize: '0.7rem', color: '#a1a1aa', lineHeight: '1.5' }}>{t('sovereign.col2Desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SovereignAi;
