import React, { useState, useEffect } from 'react';
import { Shield, Zap, Radio, Globe, Terminal, Activity, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import PrimeLogo from '../components/PrimeLogo';
import AgentFleetGrid from '../components/AgentFleetGrid';

function FleetCommand() {
  const [isWired, setIsWired] = useState(false);
  const [logs, setLogs] = useState([]);

  // Simulate telemetry logs streaming in
  useEffect(() => {
    if (!isWired) return;
    
    const messages = [
      "A2A Protocol: Initializing Agent William bridge...",
      "MCP Server: Verified 14/14 logical agents online.",
      "M4 Node: Scrubbing PII for cross-device replication.",
      "Raspberry Pi: Edge node connected via Sovereign Mesh.",
      "Orb Node: Hardware synchronization complete.",
      "AI-Trader: Awaiting market signals on port 8082.",
      "Fleet Commander: Heartbeat established (23ms ping).",
      "Sovereign Auditor: Active. 0 discrepancies found."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length) {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${messages[i]}`]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [isWired]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', background: '#0a0a0f', color: '#fff', position: 'relative', overflowX: 'hidden' }}>
      
      {/* Background grid */}
      <div className="cyber-grid"></div>

      {/* Header */}
      <div className="sub-header" style={{ position: 'relative', zIndex: 10, background: 'rgba(10,10,15,0.8)' }}>
        <Link to="/" className="sub-header-btn">
          <ArrowLeft size={20} />
        </Link>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <PrimeLogo size={20} glow={true} />
            <div className="sub-header-title" style={{ color: '#a855f7', fontSize: '1rem', letterSpacing: '2px' }}>NEXUS COMMAND</div>
          </div>
          <div className="sub-header-subtitle">SOVEREIGN FLEET DASHBOARD</div>
        </div>
        <div className="sub-header-btn" style={{ cursor: 'default' }}>
          <Activity size={20} color={isWired ? '#22c55e' : '#64748b'} />
        </div>
      </div>

      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px', zIndex: 1 }}>
        
        {/* Topology Visualizer */}
        <div className="topology-container">
          <div className="topology-header">
            <h3><Globe size={18} /> Mesh Network Topology</h3>
            <button 
              className={`wire-orb-btn ${isWired ? 'active' : ''}`}
              onClick={() => setIsWired(!isWired)}
            >
              {isWired ? <><Zap size={14} /> SYSTEM WIRED</> : <><Radio size={14} /> WIRE THE ORB</>}
            </button>
          </div>
          
          <div className="topology-map">
            {/* The Orb */}
            <div className={`topo-node orb-node ${isWired ? 'pulsing' : ''}`}>
              <div className="node-icon">🔮</div>
              <div className="node-label">THE ORB</div>
              <div className="node-status">{isWired ? 'SYNCED' : 'OFFLINE'}</div>
            </div>

            {/* Mac M4 */}
            <div className={`topo-node m4-node ${isWired ? 'pulsing-blue' : ''}`}>
              <div className="node-icon">💻</div>
              <div className="node-label">M4 NODE</div>
              <div className="node-status">A2A BROKER</div>
            </div>

            {/* Raspberry Pi */}
            <div className={`topo-node pi-node ${isWired ? 'pulsing-green' : ''}`}>
              <div className="node-icon">🍓</div>
              <div className="node-label">R-PI EDGE</div>
              <div className="node-status">REMOTE NODE</div>
            </div>

            {/* Connection Lines (SVG) */}
            <svg className="topo-lines" width="100%" height="100%">
              <line x1="50%" y1="30%" x2="20%" y2="70%" className={`wire-line ${isWired ? 'active' : ''}`} />
              <line x1="50%" y1="30%" x2="80%" y2="70%" className={`wire-line ${isWired ? 'active' : ''}`} />
              <line x1="20%" y1="70%" x2="80%" y2="70%" className={`wire-line ${isWired ? 'active' : ''}`} strokeDasharray="5,5" />
            </svg>
          </div>
        </div>

        {/* 14 Agent Grid */}
        <AgentFleetGrid />

        {/* Terminal Telemetry */}
        <div className="telemetry-terminal">
          <div className="terminal-header">
            <Terminal size={14} /> MCP Telemetry Stream
          </div>
          <div className="terminal-body">
            {!isWired && <div style={{ color: '#64748b' }}>Waiting for Orb connection...</div>}
            {logs.map((log, idx) => (
              <div key={idx} className="terminal-line">{log}</div>
            ))}
            {isWired && <div className="terminal-cursor">_</div>}
          </div>
        </div>

      </div>
    </div>
  );
}

export default FleetCommand;
