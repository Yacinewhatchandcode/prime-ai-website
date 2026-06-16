import React, { useState, useEffect } from 'react';
import { invoke } from '../utils/tauriBridge';
import { Shield, Zap, Radio, Globe, Terminal, Activity, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import PrimeLogo from '../components/PrimeLogo';
import AgentFleetGrid from '../components/AgentFleetGrid';
import AutonomousAgentInterface from '../components/CommandCenter/AutonomousAgentInterface';

function AgentOrchestration() {
  const [isWired, setIsWired] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!isWired) return;
    
    const fetchStatus = async () => {
      try {
        const status = await invoke('get_fleet_status');
        setLogs(prev => {
          const newLogs = [...prev, `[${new Date().toLocaleTimeString()}] MCP: ${status}`];
          if (newLogs.length > 8) newLogs.shift();
          return newLogs;
        });
      } catch (e) {
        console.error(e);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [isWired]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', color: '#fcfcfc', position: 'relative' }}>
      
      <div style={{ padding: '48px', flex: 1, display: 'flex', flexDirection: 'column', gap: '48px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '24px' }}>
          <div>
            <h1 style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 300, fontSize: '2rem', letterSpacing: '2px', marginBottom: '8px' }}>
              AGENT ORCHESTRATION
            </h1>
            <p style={{ color: '#6b6b7b', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Multi-Agent Coordination Engine
            </p>
          </div>
          <button 
            style={{ 
              background: isWired ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
              border: `1px solid ${isWired ? '#d4af37' : 'rgba(255,255,255,0.1)'}`,
              color: isWired ? '#d4af37' : '#fff',
              padding: '8px 24px', borderRadius: '4px', cursor: 'pointer',
              fontFamily: '"JetBrains Mono", monospace', fontSize: '0.8rem',
              transition: 'all 0.3s ease'
            }}
            onClick={() => setIsWired(!isWired)}
          >
            {isWired ? 'ACTIVE SYNC' : 'INITIATE SYNC'}
          </button>
        </div>

        {/* 14 Agent Grid */}
        <div style={{ opacity: 0.9 }}>
          <AgentFleetGrid />
        </div>

        {/* Newly Generated App/Agent from Gemma Factory */}
        <div style={{ background: 'rgba(5,5,5,0.5)', border: '1px solid rgba(255,255,255,0.02)', borderRadius: '8px', padding: '24px' }}>
          <AutonomousAgentInterface />
        </div>

        {/* Telemetry */}
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.8rem', color: '#6b6b7b', background: 'rgba(0,0,0,0.5)', padding: '24px', borderRadius: '4px' }}>
          <div style={{ textTransform: 'uppercase', marginBottom: '16px', color: '#d4af37' }}>Orchestration Telemetry</div>
          {!isWired && <div>Awaiting sync initialization...</div>}
          {logs.map((log, idx) => (
            <div key={idx} style={{ marginBottom: '8px' }}>{log}</div>
          ))}
          {isWired && <div style={{ animation: 'blink 1s infinite' }}>_</div>}
        </div>

      </div>
    </div>
  );
}

export default AgentOrchestration;
