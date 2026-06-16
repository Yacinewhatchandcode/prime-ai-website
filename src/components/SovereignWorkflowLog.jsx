import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, FileText, ChevronRight } from 'lucide-react';

const API_BASE = "http://localhost:5000";

export default function SovereignWorkflowLog() {
  const [liveOutputs, setLiveOutputs] = useState([]);

  const fetchOutputs = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/outputs`);
      if (res.ok) {
        const data = await res.json();
        setLiveOutputs(data.files || []);
      }
    } catch (e) {
      console.warn("Could not fetch live outputs", e);
    }
  };

  useEffect(() => {
    fetchOutputs();
    const interval = setInterval(fetchOutputs, 5000);
    return () => clearInterval(interval);
  }, []);

  const logs = [
    {
      time: "14m 48s",
      title: "Generated Sovereign Executive Deck",
      details: [
        "Extracted raw data from local acmeco_q3_financials.xlsx",
        "Applied logic: High effort reasoning for EBITDA trends",
        "Created an editable 8-slide executive MBR deck",
        "Verified PPTX exports with native chart parts"
      ],
      action: "acmeco_q3_fy2025_exec_mbr.pptx"
    },
    {
      time: "2m 12s",
      title: "Compiled Sovereign Fleet Node Binary",
      details: [
        "Requested PII redaction from Obsidian Memory Agent",
        "Delegated cross-compilation to Mac M4 Node",
        "Signed artifacts with local certificates"
      ],
      action: "prime-fleet-node-v1.4.dmg"
    }
  ];

  return (
    <div className="sovereign-workflow-log-sidebar">
      <div style={{ color: '#d4af37', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Clock size={14} />
        Active Workflow Iterations
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {logs.map((log, index) => (
          <div key={index} style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '16px', position: 'relative' }}>
            <div style={{ 
              position: 'absolute', left: '-5px', top: '0', width: '9px', height: '9px', 
              borderRadius: '50%', background: '#10b981', border: '2px solid #0a0a0c'
            }}></div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '4px' }}>Worked for {log.time}</div>
            <div style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '500', marginBottom: '12px' }}>{log.title}</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
              {log.details.map((detail, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <CheckCircle size={12} color="var(--text-muted)" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.4' }}>{detail}</span>
                </div>
              ))}
            </div>

            <div style={{ 
              background: 'rgba(255,255,255,0.05)', padding: '8px 12px', borderRadius: '8px', 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={14} color="#d4af37" />
                <span style={{ color: '#e2e8f0', fontSize: '0.8rem' }}>{log.action}</span>
              </div>
              <ChevronRight size={14} color="var(--text-muted)" />
            </div>
          </div>
        ))}

        {/* Live Outputs Section */}
        {liveOutputs.length > 0 && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', marginTop: '8px' }}>
            <div style={{ color: '#8b5cf6', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={12} />
              Generated Artifacts ({liveOutputs.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
              {liveOutputs.slice(0, 5).map((file, idx) => (
                <a 
                  key={idx} 
                  href={`${API_BASE}/solutions/outputs/${file.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    background: 'rgba(139, 92, 246, 0.05)', padding: '8px 12px', borderRadius: '8px', 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
                    border: '1px solid rgba(139, 92, 246, 0.1)', textDecoration: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <FileText size={12} color="#c084fc" />
                    <span style={{ color: '#e2e8f0', fontSize: '0.7rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                  </div>
                  <ChevronRight size={12} color="#8b5cf6" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
