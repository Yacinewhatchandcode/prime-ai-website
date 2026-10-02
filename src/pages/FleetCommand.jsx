import React, { useState } from 'react';
import { Globe, Activity, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import VisualExplainer from '../components/VisualExplainer';
import PrimeLogo from '../components/PrimeLogo';
import LocalFleetPanel from '../components/LocalFleetPanel';

function FleetCommand() {
  const { language } = useLanguage();
  const [isWired, setIsWired] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', background: '#0a0a0f', color: '#fff', position: 'relative', overflowX: 'hidden' }}>
      
      {/* Background grid */}
      <div className="cyber-grid"></div>

      {/* Header */}
      <div className="sub-header" style={{ position: 'relative', zIndex: 10, background: 'rgba(10,10,15,0.8)' }}>
        <Link to="/" className="sub-header-btn" aria-label="Back to home">
          <ArrowLeft size={20} />
        </Link>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <PrimeLogo size={20} glow={true} />
            <div className="sub-header-title" style={{ color: '#a855f7', fontSize: '1rem', letterSpacing: '2px' }}>NEXUS COMMAND</div>
          </div>
          <div className="sub-header-subtitle">SOVEREIGN FLEET DASHBOARD</div>
        </div>
        <Link to="/surveyor" className="sub-header-btn" style={{ textDecoration: 'none', cursor: 'pointer' }} title="Open Cyber Surveyor Dashboard">
          <Activity size={20} color={isWired ? '#22c55e' : '#38bdf8'} />
        </Link>
      </div>

      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px', zIndex: 1 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 500 }}>Nexus Command</h1>
        <LocalFleetPanel onReadiness={setIsWired} />
        
        {/* Topology Visualizer */}
        <div className="topology-container">
          <div className="topology-header">
            <h3><Globe size={18} /> Local advisory runtime</h3>
            <span>{isWired ? 'LOCAL INFERENCE READY' : 'LOCAL INFERENCE UNAVAILABLE'}</span>
          </div>
          
          <div className="topology-map">
            {/* The Orb */}
            <div className={`topo-node orb-node ${isWired ? 'pulsing' : ''}`}>
              <div className="node-icon">🔮</div>
              <div className="node-label">LOCAL API</div>
              <div className="node-status">{isWired ? 'READY' : 'UNAVAILABLE'}</div>
            </div>

            {/* Mac M4 */}
            <div className={`topo-node m4-node ${isWired ? 'pulsing-blue' : ''}`}>
              <div className="node-icon">💻</div>
              <div className="node-label">OLLAMA</div>
              <div className="node-status">READINESS ABOVE</div>
            </div>

            {/* Raspberry Pi */}
            <div className={`topo-node pi-node ${isWired ? 'pulsing-green' : ''}`}>
              <div className="node-icon">🍓</div>
              <div className="node-label">LOCAL MEMORY</div>
              <div className="node-status">FILESYSTEM</div>
            </div>

            {/* Connection Lines (SVG) */}
            <svg className="topo-lines" width="100%" height="100%">
              <line x1="50%" y1="30%" x2="20%" y2="70%" className={`wire-line ${isWired ? 'active' : ''}`} />
              <line x1="50%" y1="30%" x2="80%" y2="70%" className={`wire-line ${isWired ? 'active' : ''}`} />
              <line x1="20%" y1="70%" x2="80%" y2="70%" className={`wire-line ${isWired ? 'active' : ''}`} strokeDasharray="5,5" />
            </svg>
          </div>
        </div>

        {/* Video */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <VisualExplainer
            src={language === 'fr' ? '/prime_fleet_fr.mp4' : '/prime_fleet_en.mp4'}
            autoPlay loop
            style={{
              width: '100%', borderRadius: '16px',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            }}
          />
        </div>

      </div>
    </div>
  );
}

export default FleetCommand;
