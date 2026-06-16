import React, { useState, useEffect } from 'react';
import { Activity, Shield, Terminal, Network } from 'lucide-react';
import { listen } from '../../utils/tauriBridge';

export default function AutonomousAgentInterface() {
  const [p2pLogs, setP2pLogs] = useState([]);
  const [activeNodes, setActiveNodes] = useState([]);

  useEffect(() => {
    // Listen for the P2P negotiation logs from Tauri backend
    let unlisten;
    async function setupListener() {
      unlisten = await listen('p2p-negotiation', (event) => {
        setP2pLogs(prev => {
          const newLogs = [...prev, `[${new Date().toLocaleTimeString()}] ${event.payload}`];
          if (newLogs.length > 8) newLogs.shift();
          return newLogs;
        });

        // Parse which node is active to pulse it
        if (event.payload.includes('[Agent 1')) setActiveNodes(['agent1']);
        else if (event.payload.includes('[Agent 2')) setActiveNodes(['agent2']);
        else if (event.payload.includes('[Agent 3')) setActiveNodes(['agent3']);
        else if (event.payload.includes('[Agent 4')) setActiveNodes(['agent4']);
      });
    }
    setupListener();
    return () => { if (unlisten) unlisten(); };
  }, []);

  const agents = [
    { id: 'agent1', name: 'Sovereign Lead', role: 'Orchestrator', color: '#d4af37' },
    { id: 'agent2', name: 'Obsidian Memory', role: 'Context & PII', color: '#3b82f6' },
    { id: 'agent3', name: 'Mac M4 Node', role: 'Cross-Compiler', color: '#8b5cf6' },
    { id: 'agent4', name: 'Security Verifier', role: 'Artifact QA', color: '#10b981' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ color: '#d4af37', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontFamily: '"Outfit", sans-serif' }}>
        <Network size={20} />
        Peer-to-Peer Agent Execution Mesh
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {agents.map(agent => (
          <div key={agent.id} style={{ 
            background: 'rgba(0,0,0,0.6)', 
            border: `1px solid ${activeNodes.includes(agent.id) ? agent.color : 'rgba(255,255,255,0.05)'}`,
            padding: '16px', borderRadius: '8px', 
            transition: 'all 0.3s',
            boxShadow: activeNodes.includes(agent.id) ? `0 0 15px ${agent.color}40` : 'none'
          }}>
            <div style={{ color: agent.color, fontSize: '0.8rem', fontFamily: '"JetBrains Mono", monospace', marginBottom: '8px' }}>
              {agent.id.toUpperCase()}
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '4px' }}>{agent.name}</div>
            <div style={{ color: '#6b6b7b', fontSize: '0.75rem' }}>{agent.role}</div>
          </div>
        ))}
      </div>

      <div style={{ 
        padding: '16px', background: 'rgba(5,5,5,0.8)', border: '1px solid rgba(255,255,255,0.05)', 
        borderRadius: '8px', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.8rem',
        minHeight: '150px', display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ color: '#6b6b7b', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
          &gt; P2P_EVENT_STREAM
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {p2pLogs.length === 0 ? (
            <div style={{ color: '#4a4a5a' }}>Awaiting intent trigger...</div>
          ) : (
            p2pLogs.map((log, i) => (
              <div key={i} style={{ color: log.includes('Agent 4') ? '#10b981' : log.includes('Agent 1') ? '#d4af37' : '#e2e8f0' }}>
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
