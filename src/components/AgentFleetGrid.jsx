import React from 'react';
import { Server, Activity, ShieldCheck, Cpu, TerminalSquare } from 'lucide-react';

const AGENT_FLEET = [
  { id: 'agent-1', name: 'Sovereign Auditor', role: 'Security & Self-Healing', status: 'active', model: 'Claude 3.5' },
  { id: 'agent-2', name: 'B2B Sales Broker', role: 'Revenue Outreach', status: 'active', model: 'DeepSeek V4' },
  { id: 'agent-3', name: 'Freelance Sniper', role: 'Bounty Acquisition', status: 'active', model: 'GPT-5.4' },
  { id: 'agent-4', name: 'Coinbase High-Freq', role: 'Tri-Arb Trading', status: 'active', model: 'Hermes' },
  { id: 'agent-5', name: 'Solana Miner', role: 'Hash Compute', status: 'active', model: 'Local M4' },
  { id: 'agent-6', name: 'Gemma Factory Arch', role: 'App Planning', status: 'idle', model: 'Gemma 2' },
  { id: 'agent-7', name: 'Gemma Factory Build', role: 'App Execution', status: 'idle', model: 'Gemma 2' },
  { id: 'agent-8', name: 'Airdrop Farmer', role: 'Monad/Berachain', status: 'active', model: 'Claude 3.5' },
  { id: 'agent-9', name: 'Agent William', role: 'A2A Mesh Broker', status: 'active', model: 'Hermes' },
  { id: 'agent-10', name: 'Playwright Scraper', role: 'Gov Data Intel', status: 'active', model: 'Kimi K2.6' },
  { id: 'agent-11', name: 'Hyperframes Editor', role: 'Video Sync', status: 'idle', model: 'MiniMax' },
  { id: 'agent-12', name: 'Nexus Telemetry', role: 'Dashboard Logs', status: 'active', model: 'Hermes' },
  { id: 'agent-13', name: 'OOBE Protocol', role: 'Solana SDK', status: 'active', model: 'Claude 3.5' },
  { id: 'agent-14', name: 'System Core', role: 'Orchestration Guard', status: 'active', model: 'DeepSeek V4 Pro' },
];

function AgentFleetGrid() {
  return (
    <div className="agent-fleet-container">
      <div className="agent-fleet-header">
        <h3><TerminalSquare size={16} /> Sovereign Fleet Roster (14/14 Online)</h3>
      </div>
      <div className="agent-grid">
        {AGENT_FLEET.map(agent => (
          <div key={agent.id} className={`agent-card ${agent.status}`}>
            <div className="agent-card-top">
              <span className="agent-name">{agent.name}</span>
              <span className={`status-dot ${agent.status}`}></span>
            </div>
            <div className="agent-card-role">{agent.role}</div>
            <div className="agent-card-bottom">
              <Cpu size={12} color="#8b5cf6" />
              <span>{agent.model}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AgentFleetGrid;
