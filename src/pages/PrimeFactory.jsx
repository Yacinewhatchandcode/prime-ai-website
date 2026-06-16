import React, { useState } from 'react';
import PrimeLogo from '../components/PrimeLogo';
import ObjectivePanel from '../components/CommandCenter/ObjectivePanel';
import ProjectPipeline from '../components/CommandCenter/ProjectPipeline';
import DeliverableStream from '../components/CommandCenter/DeliverableStream';

// Mock data (would be fetched from DB/MCP in reality)
const clientsDb = {
  'c1': { id: 'c1', name: 'Jean Dupont', status: 'WAITING_TRIGGER', time: '10:42 AM' },
  'c2': { id: 'c2', name: 'Agence XYZ', status: 'PIPELINE_ACTIVE', time: '09:15 AM' },
  'c3': { id: 'c3', name: 'Sophie L.', status: 'DEPLOYED', time: 'Yesterday' }
};

export default function PrimeFactory() {
  const [selectedClientId, setSelectedClientId] = useState(null);

  const selectedClient = selectedClientId ? clientsDb[selectedClientId] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', color: '#fcfcfc', position: 'relative', overflowY: 'auto' }}>
      <div style={{ padding: '48px', flex: 1, display: 'flex', flexDirection: 'column', gap: '48px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '24px' }}>
          <div>
            <h1 style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 300, fontSize: '2rem', letterSpacing: '2px', marginBottom: '8px' }}>
              PRIME FACTORY
            </h1>
            <p style={{ color: '#6b6b7b', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Autonomous Generation System
            </p>
          </div>
        </div>

        <div className="command-center" style={{ height: '700px', background: 'transparent' }}>
          {/* Left Panel: Objectives */}
          <ObjectivePanel />

          {/* Center Panel: Orchestration Map */}
          <ProjectPipeline client={selectedClient} />

          {/* Right Panel: Deliverables */}
          <DeliverableStream />
        </div>
      </div>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
}
