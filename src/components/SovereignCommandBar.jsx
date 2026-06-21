import React, { useState } from 'react';
import { Paperclip, Mic, ArrowUp, Settings, Lock, Monitor, Box } from 'lucide-react';
import { API_BASE } from '../utils/api';

export default function SovereignCommandBar() {
  const [intent, setIntent] = useState('');
  const [model, setModel] = useState('GPT-5.5 Sovereign');
  const [workLocally, setWorkLocally] = useState(true);

  const handleExecute = async () => {
    if (!intent) return;
    try {
      if (import.meta.env.DEV) console.log(`Executing intent on ${model}: ${intent}`);
      const res = await fetch(`${API_BASE}/api/dispatch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: intent, priority: "normal" })
      });
      if (res.ok) {
        if (import.meta.env.DEV) console.log("Successfully dispatched prompt to agent swarm");
      }
    } catch (e) {
      console.error("Dispatch service unavailable", e);
    }
    setIntent('');
  };

  return (
    <div className="sovereign-command-bar-wrapper">
      
      {/* Top Bar: Model Selection & Settings */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '0.85rem',
            color: '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }} onClick={() => setModel(model === 'GPT-5.5 Sovereign' ? 'Gemma-Nano Local' : 'GPT-5.5 Sovereign')}>
            <Box size={14} color="#d4af37" />
            {model}
            <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>▼</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }}></span>
            Reasoning: High
          </div>
        </div>
        <Settings size={16} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
      </div>

      {/* Main Input Area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.4)', borderRadius: '16px', padding: '8px 16px', border: '1px solid rgba(255,255,255,0.03)' }}>
        <Paperclip size={20} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
        <input 
          type="text" 
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          placeholder="Take acmeco_q3_financials.xlsx and create an executive MBR deck..."
          onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#fff',
            fontSize: '1rem',
            fontFamily: '"Outfit", sans-serif',
            padding: '8px 0'
          }}
        />
        <Mic size={20} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
        <button onClick={handleExecute} style={{
          background: intent ? '#d4af37' : 'rgba(255,255,255,0.1)',
          border: 'none',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: intent ? 'pointer' : 'default',
          transition: 'all 0.3s'
        }}>
          <ArrowUp size={20} color={intent ? '#000' : 'var(--text-muted)'} />
        </button>
      </div>

      {/* Bottom Status Row */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '16px', padding: '0 8px' }}>
        <div 
          onClick={() => setWorkLocally(!workLocally)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', opacity: workLocally ? 1 : 0.5 }}
        >
          <Lock size={14} color={workLocally ? '#10b981' : '#6b6b7b'} />
          <span style={{ fontSize: '0.8rem', color: workLocally ? '#e2e8f0' : '#6b6b7b' }}>Work locally</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', opacity: 0.5 }}>
          <Monitor size={14} color="#6b6b7b" />
          <span style={{ fontSize: '0.8rem', color: '#6b6b7b' }}>screencast</span>
        </div>
      </div>

    </div>
  );
}
