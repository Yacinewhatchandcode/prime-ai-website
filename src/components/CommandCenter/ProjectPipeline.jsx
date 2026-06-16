import React, { useState, useEffect } from 'react';
import PrimeLogo from '../PrimeLogo';
import { invoke, listen } from '../../utils/tauriBridge';

export default function ProjectPipeline({ client }) {
  const [pipelineState, setPipelineState] = useState(client ? client.status : 'IDLE');
  const [coreStatus, setCoreStatus] = useState('CHECKING'); // CHECKING, MISSING, INITIALIZING, READY
  const [coreLog, setCoreLog] = useState('');

  // Neural Core Initialization Check
  useEffect(() => {
    async function checkCore() {
      try {
        const isReady = await invoke('check_neural_core');
        setCoreStatus(isReady ? 'READY' : 'MISSING');
      } catch (e) {
        console.error(e);
        // Fallback for browser dev mode
        setCoreStatus('READY'); 
      }
    }
    checkCore();
  }, []);

  useEffect(() => {
    if (client) setPipelineState(client.status);
  }, [client]);

  if (!client) {
    return (
      <div className="orchestration-map" style={{ flexDirection: 'column' }}>
        <div style={{ opacity: 0.3, animation: 'float 6s ease-in-out infinite' }}>
          <PrimeLogo size={120} />
        </div>
        <div style={{ marginTop: '24px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          AWAITING WHATSAPP SIGNAL...
        </div>
      </div>
    );
  }

  const handleInitCore = async () => {
    setCoreStatus('INITIALIZING');
    const unlisten = await listen('neural-core-progress', (event) => {
      setCoreLog(event.payload);
      if (event.payload.includes('Online')) {
        setTimeout(() => setCoreStatus('READY'), 1000);
      }
    });
    
    try {
      await invoke('initialize_neural_core');
    } catch (e) {
      console.error(e);
    }
    unlisten();
  };

  const handleTrigger = async () => {
    setPipelineState('PIPELINE_ACTIVE');
    const unlisten = await listen('gemma-progress', (event) => {
      setCoreLog(event.payload);
    });
    
    try {
      await invoke('trigger_gemma_sidecar', { intent: "I need a luxury AI CRM tailored for French creative agencies." });
      
      // Step 2: Trigger P2P Negotiation across the 4 agents
      const unlistenP2p = await listen('p2p-negotiation', (event) => {
        setCoreLog("Mesh: " + event.payload);
      });
      await invoke('trigger_p2p_negotiation');
      unlistenP2p();

      // Step 3: Trigger the actual DMG/Build Packaging
      const unlistenPkg = await listen('packaging-progress', (event) => {
        setCoreLog("Builder: " + event.payload);
        if (event.payload.includes('ready for delivery')) {
          setPipelineState('DEPLOYED');
        }
      });
      await invoke('trigger_packaging');
      unlistenPkg();
    } catch (e) {
      console.error(e);
    }
    unlisten();
  };

  return (
    <div className="orchestration-map" style={{ flexDirection: 'column', padding: '40px', alignItems: 'flex-start', justifyContent: 'flex-start', overflowY: 'auto' }}>
      
      <div style={{ width: '100%', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{client.name}</h2>
        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          SOURCE: WHATSAPP VOICE INTAKE
        </div>
      </div>

      <div style={{ width: '100%', marginBottom: '40px' }}>
        <div className="panel-header">Extracted Intent & Ideas</div>
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', 
          border: '1px solid var(--border-light)', 
          padding: '24px', 
          borderRadius: '12px',
          fontStyle: 'italic',
          color: '#e2e8f0',
          lineHeight: '1.6'
        }}>
          "I need a luxury AI CRM tailored for French creative agencies. It needs to look cinematic, handle client onboarding automatically, and give me a mobile app so I can see notifications when a lead closes."
        </div>
      </div>

      <div style={{ width: '100%', marginBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {coreStatus === 'MISSING' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--neon-gold)', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>LOCAL MODEL ABSENT</div>
            <button onClick={handleInitCore} style={btnStyle(true)}>DOWNLOAD GEMMA NANO (1.1GB)</button>
          </div>
        )}

        {coreStatus === 'INITIALIZING' && (
          <div style={{ textAlign: 'center', width: '100%' }}>
            <div style={{ color: '#3b82f6', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>INITIALIZING NEURAL CORE</div>
            <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#e2e8f0' }}>
              {coreLog || 'Connecting...'}
              <span style={{ animation: 'pulse 1s infinite' }}>_</span>
            </div>
          </div>
        )}

        {coreStatus === 'READY' && (
          <div style={{ width: '100%', textAlign: 'center' }}>
            <button 
              onClick={handleTrigger}
              disabled={pipelineState !== 'WAITING_TRIGGER'}
              style={btnStyle(pipelineState === 'WAITING_TRIGGER')}
            >
              {pipelineState === 'WAITING_TRIGGER' ? 'TRIGGER SOVEREIGN PIPELINE' : 'PIPELINE ACTIVE'}
            </button>
            {pipelineState === 'PIPELINE_ACTIVE' && (
              <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--neon-gold)', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#e2e8f0' }}>
                {coreLog || 'Processing intent...'}
                <span style={{ animation: 'pulse 1s infinite' }}>_</span>
              </div>
            )}
          </div>
        )}

      </div>

      <div style={{ width: '100%' }}>
        <div className="panel-header">Factory Compilation Progress</div>
        <ProgressBar label="Web App (React/Node)" percentage={pipelineState === 'PIPELINE_ACTIVE' ? 80 : pipelineState === 'DEPLOYED' ? 100 : 0} />
        <ProgressBar label="Android APK" percentage={pipelineState === 'PIPELINE_ACTIVE' ? 45 : pipelineState === 'DEPLOYED' ? 100 : 0} />
        <ProgressBar label="Windows EXE" percentage={pipelineState === 'PIPELINE_ACTIVE' ? 10 : pipelineState === 'DEPLOYED' ? 100 : 0} />
        <ProgressBar label="iPhone iOS App" percentage={pipelineState === 'PIPELINE_ACTIVE' ? 5 : pipelineState === 'DEPLOYED' ? 100 : 0} />
      </div>
    </div>
  );
}

function ProgressBar({ label, percentage }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
        <span>{label}</span>
        <span style={{ color: 'var(--neon-gold)' }}>{percentage}%</span>
      </div>
      <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ 
          width: percentage + '%', 
          height: '100%', 
          background: percentage === 100 ? '#10b981' : 'var(--neon-gold)',
          transition: 'width 1s ease-in-out, background 0.3s'
        }}></div>
      </div>
    </div>
  );
}

const btnStyle = (isActive) => ({
  background: isActive ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255,255,255,0.05)',
  border: isActive ? '1px solid var(--neon-gold)' : '1px solid var(--border-light)',
  color: isActive ? 'var(--neon-gold)' : 'var(--text-muted)',
  padding: '16px 48px',
  borderRadius: '8px',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.9rem',
  letterSpacing: '2px',
  cursor: isActive ? 'pointer' : 'not-allowed',
  transition: 'all 0.3s ease',
  boxShadow: isActive ? '0 0 20px rgba(245, 158, 11, 0.2)' : 'none'
});
