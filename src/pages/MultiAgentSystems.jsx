import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, Sliders, Cpu, Activity, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import PrimeLogo from '../components/PrimeLogo';

function MultiAgentSystems() {
  const { t } = useLanguage();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <div className="sub-header">
        <Link to="/" className="sub-header-btn">
          <ChevronLeft size={20} />
        </Link>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <PrimeLogo size={20} glow={false} />
            <div className="sub-header-title" style={{ color: '#a855f7', fontSize: '1rem' }}>MULTI-AGENT</div>
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
            <div className="dash-stat-label"><div className="agent-status-dot" style={{ background: '#a855f7', boxShadow: '0 0 10px #a855f7' }}></div> SWARM</div>
            <div className="dash-stat-val" style={{ color: '#a855f7' }}>ONLINE</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-label">AGENTS</div>
            <div className="dash-stat-val" style={{ color: '#fff' }}>14 ACTIVE</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-label">TOPOLOGY</div>
            <div className="dash-stat-val" style={{ color: '#fff' }}>MESH</div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '24px', padding: '0 24px' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#fff', margin: 0, letterSpacing: '1px' }}>{t('multiAgent.title1')} <span style={{ color: '#a855f7' }}>{t('multiAgent.title2')}</span></h2>
          <div style={{ fontSize: '0.65rem', color: '#a1a1aa', letterSpacing: '1px', marginTop: '8px' }}>{t('multiAgent.tagline')}</div>
        </div>

        <div className="agent-panel" style={{ boxShadow: 'inset 0 0 30px rgba(168, 85, 247, 0.05)', borderColor: 'rgba(168, 85, 247, 0.2)' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu size={24} color="#a855f7" />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#a855f7' }}>{t('multiAgent.subtitle')}</div>
              <div style={{ fontSize: '0.6rem', color: '#a1a1aa' }}>COGNITIVE ORCHESTRATION</div>
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#e2e8f0', lineHeight: '1.6', marginBottom: '12px' }}>
            {t('multiAgent.desc1')}
          </p>
          <p style={{ fontSize: '0.75rem', color: '#e2e8f0', lineHeight: '1.6' }}>
            {t('multiAgent.desc2')}
          </p>
        </div>

        <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="agent-panel" style={{ margin: 0, padding: '16px', display: 'flex', gap: '16px' }}>
            <Activity size={24} color="#f59e0b" />
            <div>
              <h3 style={{ fontSize: '0.8rem', color: '#f59e0b', marginBottom: '8px' }}>{t('multiAgent.col1Title')}</h3>
              <p style={{ fontSize: '0.7rem', color: '#a1a1aa', lineHeight: '1.5' }}>{t('multiAgent.col1Desc')}</p>
            </div>
          </div>
          <div className="agent-panel" style={{ margin: 0, padding: '16px', display: 'flex', gap: '16px' }}>
            <Zap size={24} color="#3b82f6" />
            <div>
              <h3 style={{ fontSize: '0.8rem', color: '#3b82f6', marginBottom: '8px' }}>{t('multiAgent.col2Title')}</h3>
              <p style={{ fontSize: '0.7rem', color: '#a1a1aa', lineHeight: '1.5' }}>{t('multiAgent.col2Desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MultiAgentSystems;
