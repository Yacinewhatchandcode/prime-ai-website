import React, { useState, useEffect } from 'react';
import { listen } from '../../utils/tauriBridge';

export default function DeliverableStream() {
  const [logs, setLogs] = useState([
    { id: 1, type: 'info', content: 'MCP Orchestrator initialized.', time: new Date().toLocaleTimeString() },
  ]);

  useEffect(() => {
    let unlistenGemma;
    let unlistenPkg;

    const setupListeners = async () => {
      unlistenGemma = await listen('gemma-progress', (event) => {
        setLogs(prev => [...prev, {
          id: Date.now(),
          type: 'action',
          content: `[Gemma Sidecar] ${event.payload}`,
          time: new Date().toLocaleTimeString()
        }]);
      });

      unlistenPkg = await listen('packaging-progress', (event) => {
        const payload = event.payload;
        const logEntry = {
          id: Date.now(),
          type: payload.includes('ready') ? 'success' : 'action',
          content: `[Build Orchestrator] ${payload}`,
          time: new Date().toLocaleTimeString(),
        };

        if (payload.includes('Neon-Gold PrimeAI Logo variant')) {
          logEntry.isLogoArtifact = true;
        }

        setLogs(prev => [...prev, logEntry]);
      });
    };

    setupListeners();

    return () => {
      if (unlistenGemma) unlistenGemma();
      if (unlistenPkg) unlistenPkg();
    };
  }, []);

  return (
    <div className="panel right">
      <div className="panel-header">Deliverable Stream</div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', flex: 1, paddingRight: '8px' }}>
        {logs.map((log) => (
          <div key={log.id} className="stream-item">
            <div className="stream-meta">
              <span>{log.time}</span>
              <span className={`stream-status ${log.type === 'action' ? 'building' : ''}`}>
                {log.type.toUpperCase()}
              </span>
            </div>
            <div className="stream-content">
              {log.content}
              {log.link && (
                <div style={{ marginTop: '4px' }}>
                  <a className="stream-link" href={log.link}>[View Artifact]</a>
                </div>
              )}
              {log.isLogoArtifact && (
                <div style={{ marginTop: '12px', padding: '16px', background: 'rgba(0,0,0,0.5)', borderRadius: '12px', border: '1px solid var(--neon-gold)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '8px' }}>TARGET: iPhone 14 Pro Max (iOS 18.7.8)</div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ 
                      width: '64px', 
                      height: '64px', 
                      background: 'black', 
                      borderRadius: '14px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      boxShadow: '0 0 15px var(--neon-gold), inset 0 0 10px #a855f7',
                      border: '2px solid #a855f7'
                    }}>
                      {/* PrimeAI Logo Variant representation */}
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--neon-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 22h20L12 2z"></path>
                        <path d="M12 10l-4 8h8l-4-8z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
