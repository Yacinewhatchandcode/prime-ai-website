import React from 'react';
import { ChevronLeft, Sliders, Globe, MapPin, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import PrimeLogo from '../components/PrimeLogo';

function CountryNodeTemplate({ countryName, subtitle, flag, nodeColor, nodeHighlight }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw' }}>
      <div className="sub-header">
        <Link to="/" className="sub-header-btn">
          <ChevronLeft size={20} />
        </Link>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <PrimeLogo size={20} glow={false} />
            <div className="sub-header-title" style={{ color: nodeHighlight, fontSize: '1rem' }}>{countryName} NODE</div>
          </div>
          <div className="sub-header-subtitle">PRIME MCP SOVEREIGN FLEET</div>
        </div>
        <button className="sub-header-btn">
          <Sliders size={20} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '40px' }}>
        <div className="dash-top-row">
          <div className="dash-stat">
            <div className="dash-stat-label"><div className="agent-status-dot" style={{ background: nodeColor, boxShadow: `0 0 10px ${nodeColor}` }}></div> STATUS</div>
            <div className="dash-stat-val" style={{ color: nodeColor }}>ONLINE</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-label">REGION</div>
            <div className="dash-stat-val" style={{ color: '#fff' }}>{flag} LOCALIZED</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-label">LATENCY</div>
            <div className="dash-stat-val" style={{ color: '#22c55e' }}>2ms</div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '24px', padding: '0 24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '8px' }}>{flag}</div>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: 0, letterSpacing: '1px' }}>{countryName} <span style={{ color: nodeHighlight }}>FLEET</span></h2>
          <div style={{ fontSize: '0.65rem', color: '#a1a1aa', letterSpacing: '1px', marginTop: '8px' }}>{subtitle}</div>
        </div>

        <div className="agent-panel" style={{ boxShadow: `inset 0 0 30px ${nodeColor}20`, borderColor: `${nodeHighlight}40` }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `${nodeColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={24} color={nodeHighlight} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: nodeHighlight }}>SOVEREIGN INFRASTRUCTURE</div>
              <div style={{ fontSize: '0.6rem', color: '#a1a1aa' }}>LOCALIZED AI DEPLOYMENT</div>
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#e2e8f0', lineHeight: '1.6', marginBottom: '12px' }}>
            This node is fully integrated into the PRIME MCP SOVEREIGN FLEET. It provides highly secure, localized AI orchestration tailored specifically to {countryName}'s regulatory and operational standards.
          </p>
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ width: '8px', height: '8px', background: nodeHighlight, borderRadius: '50%', boxShadow: `0 0 10px ${nodeHighlight}` }}></div>
            <div style={{ flex: 1, fontSize: '0.65rem', color: '#fff' }}>Node synchronization active and stable.</div>
          </div>
        </div>

        <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="agent-panel" style={{ margin: 0, padding: '16px', display: 'flex', gap: '16px' }}>
            <MapPin size={24} color={nodeColor} />
            <div>
              <h3 style={{ fontSize: '0.8rem', color: nodeColor, marginBottom: '8px' }}>Data Sovereignty</h3>
              <p style={{ fontSize: '0.7rem', color: '#a1a1aa', lineHeight: '1.5' }}>All cognitive processing is kept within local borders to guarantee compliance and security.</p>
            </div>
          </div>
          <div className="agent-panel" style={{ margin: 0, padding: '16px', display: 'flex', gap: '16px' }}>
            <Zap size={24} color={nodeHighlight} />
            <div>
              <h3 style={{ fontSize: '0.8rem', color: nodeHighlight, marginBottom: '8px' }}>Hyper-Local Execution</h3>
              <p style={{ fontSize: '0.7rem', color: '#a1a1aa', lineHeight: '1.5' }}>Zero-latency autonomous multi-agent systems built directly for local enterprise frameworks.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CountryNodeTemplate;
