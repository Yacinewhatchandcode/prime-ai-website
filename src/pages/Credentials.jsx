import React, { useState, useEffect } from 'react';
import { Shield, Lock, Play, Square, RefreshCw, Send, CheckCircle, Database, Server, UserCheck } from 'lucide-react';

import { API_BASE } from '../utils/api';

export default function Credentials() {
  // Connection states
  const [lkEmail, setLkEmail] = useState('');
  const [lkPassword, setLkPassword] = useState('');
  const [lkPhone, setLkPhone] = useState('');
  const [lkCode, setLkCode] = useState('');
  const [lkStatus, setLkStatus] = useState('DISCONNECTED'); // DISCONNECTED, CONNECTING, PENDING_2FA, CONNECTED, ERROR
  const [lkError, setLkError] = useState('');

  // Campaign states
  const [prospects, setProspects] = useState([]);
  const [logs, setLogs] = useState([]);
  const [campaignRunning, setCampaignRunning] = useState(false);
  const [activeCampaign, setActiveCampaign] = useState('None');
  const [currentMaster, setCurrentMaster] = useState(0);

  // Stats
  const [stats, setStats] = useState({
    scanned: 218,
    analyzed: 56,
    invitations: 1,
    calls: 45,
    meetings: 0,
    deals: 1
  });

  // Load state and prospects
  const loadData = async () => {
    try {
      // 1. Load Prospects
      const resP = await fetch(`${API_BASE}/api/prospects`);
      if (resP.ok) {
        const dataP = await resP.json();
        setProspects(dataP);
      }

      // 2. Load Global State
      const resS = await fetch(`${API_BASE}/api/state`);
      if (resS.ok) {
        const dataS = await resS.json();
        setCampaignRunning(dataS.is_running);
        setActiveCampaign(dataS.active_campaign || 'None');
        setCurrentMaster(dataS.current_master);
        setLogs(dataS.logs || []);
        if (dataS.stats) {
          setStats(dataS.stats);
        }
      }

      // 3. Load LinkedIn status
      const resL = await fetch(`${API_BASE}/api/login/linkedin/status`);
      if (resL.ok) {
        const dataL = await resL.json();
        setLkStatus(dataL.status);
        setLkError(dataL.error);
        if (dataL.email) {
          setLkEmail(dataL.email);
        }
        if (dataL.phone) {
          setLkPhone(dataL.phone);
        }
      }
    } catch (e) {
      console.error("Backend service unavailable", e);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Action handlers
  const handleLinkedinConnect = async () => {
    try {
      setLkStatus('CONNECTING');
      const res = await fetch(`${API_BASE}/api/login/linkedin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: lkEmail, password: lkPassword, phone: lkPhone })
      });
      if (res.ok) {
        loadData();
      }
    } catch (e) {
      setLkStatus('ERROR');
      setLkError("Impossibilité de contacter le serveur Playwright.");
    }
  };

  const handle2FASubmit = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/login/linkedin/2fa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: lkCode })
      });
      if (res.ok) {
        setLkCode('');
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLinkedinStop = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/login/linkedin/stop`, {
        method: 'POST'
      });
      if (res.ok) {
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCampaignToggle = async () => {
    try {
      if (campaignRunning) {
        const res = await fetch(`${API_BASE}/api/campaign/stop`, { method: 'POST' });
        if (res.ok) {
          loadData();
        }
      } else {
        const res = await fetch(`${API_BASE}/api/campaign/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ campaign_name: "Outreach Swarm Cascade", target_prospect_id: "prospect-1" })
        });
        if (res.ok) {
          loadData();
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'CONNECTED': return { bg: 'rgba(16,185,129,0.15)', color: '#10b981', label: '🟢 CONNECTÉ' };
      case 'PENDING_2FA': return { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', label: '🟡 VALIDATION 2FA REQUISE' };
      case 'CONNECTING': return { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6', label: '🔵 CONNEXION EN COURS...' };
      case 'ERROR': return { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', label: '🔴 ERREUR DE CONNEXION' };
      default: return { bg: 'rgba(107,114,128,0.15)', color: '#9ca3af', label: '⚪ DÉCONNECTÉ' };
    }
  };

  const badge = getStatusBadgeColor(lkStatus);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', color: '#fcfcfc', position: 'relative' }}>
      <div style={{ padding: 'clamp(16px, 5vw, 48px)', flex: 1, display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 300, fontSize: '2rem', letterSpacing: '2px', marginBottom: '8px', margin: 0 }}>
              PRIME-AI SOUVERAIN BACKOFFICE
            </h1>
            <p style={{ color: '#6b6b7b', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '8px 0 0' }}>
              Real Headed Playwright Browser Controls & SQLite Persistance
            </p>
          </div>
          <button 
            onClick={handleCampaignToggle} 
            style={{ 
              background: campaignRunning ? 'rgba(239,68,68,0.15)' : 'rgba(212,175,55,0.15)', 
              border: `1px solid ${campaignRunning ? '#ef4444' : '#d4af37'}`, 
              color: campaignRunning ? '#ef4444' : '#d4af37', 
              padding: '10px 20px', 
              borderRadius: '12px', 
              fontSize: '0.8rem', 
              fontWeight: 'bold', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              transition: 'all 0.3s', 
              fontFamily: '"JetBrains Mono", monospace' 
            }}
          >
            {campaignRunning ? <Square size={16} /> : <Play size={16} />}
            {campaignRunning ? "ARRÊTER L'ORCHESTRATION" : "DÉMARRER L'ORCHESTRATION"}
          </button>
        </div>

        {/* Credentials Form Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          
          {/* LinkedIn Chrome Automated Panel */}
          <div style={{ background: 'rgba(15,15,18,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Lock size={20} color="#d4af37" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontFamily: '"Outfit", sans-serif', fontWeight: 500 }}>
                  CONNEXION LINKEDIN (NAVIGATEUR CHROME EN DIRECT)
                </h3>
              </div>
              <span style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.color}30`, padding: '4px 12px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                {badge.label}
              </span>
            </div>

            <p style={{ color: '#8b8b9b', fontSize: '0.75rem', lineHeight: 1.5, margin: 0 }}>
              Cette fonctionnalité lance un <strong>véritable navigateur Chrome local</strong> sur votre bureau. Vous pouvez voir le robot saisir vos identifiants humains classiques et se connecter. Aucun jeton d'API développeur ou cookie de session n'est requis.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: '#6b6b7b', fontWeight: 'bold' }}>Nom d'utilisateur / E-mail</label>
                <input 
                  type="email" 
                  value={lkEmail} 
                  onChange={(e) => setLkEmail(e.target.value)} 
                  placeholder="votre.email@linkedin.com"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: '#6b6b7b', fontWeight: 'bold' }}>Mot de passe</label>
                <input 
                  type="password" 
                  value={lkPassword} 
                  onChange={(e) => setLkPassword(e.target.value)} 
                  placeholder="••••••••••••"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: '#6b6b7b', fontWeight: 'bold' }}>Numéro de téléphone (Vérification)</label>
                <input 
                  type="text" 
                  value={lkPhone} 
                  onChange={(e) => setLkPhone(e.target.value)} 
                  placeholder="+33 6 12 34 56 78"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>
            </div>

            {/* 2FA input box */}
            {lkStatus === 'PENDING_2FA' && (
              <div style={{ border: '1px solid rgba(245,158,11,0.3)', borderRadius: '12px', padding: '16px', background: 'rgba(245,158,11,0.02)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 'bold' }}>⚠️ CODE DOUBLE AUTHENTIFICATION DEMANDÉ</span>
                <p style={{ color: '#8b8b9b', fontSize: '0.7rem', margin: 0, lineHeight: 1.4 }}>Un code temporaire a été envoyé par LinkedIn. Saisissez-le ici pour débloquer le robot :</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    value={lkCode} 
                    onChange={(e) => setLkCode(e.target.value)} 
                    placeholder="123456" 
                    style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '0.9rem', textAlign: 'center', width: '120px', letterSpacing: '2px', outline: 'none' }}
                  />
                  <button onClick={handle2FASubmit} style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid #f59e0b', color: '#f59e0b', borderRadius: '8px', padding: '0 20px', fontWeight: 'bold', fontSize: '0.75rem', cursor: 'pointer' }}>
                    SOUMETTRE LE CODE 2FA
                  </button>
                </div>
              </div>
            )}

            {lkError && <div style={{ color: '#ef4444', fontSize: '0.75rem', whiteSpace: 'pre-line' }}>{lkError}</div>}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={handleLinkedinConnect} 
                disabled={lkStatus === 'CONNECTING' || lkStatus === 'CONNECTED'} 
                style={{ flex: 1, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.4)', color: '#c084fc', padding: '12px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.3s' }}
              >
                <Server size={14} /> DÉMARRER LA CONNEXION DU NAVIGATEUR EN DIRECT
              </button>
              {lkStatus !== 'DISCONNECTED' && (
                <button 
                  onClick={handleLinkedinStop} 
                  style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171', padding: '0 20px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}
                >
                  ARRÊTER la session
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Real-time SQLite prospects table */}
        <div style={{ background: 'rgba(15,15,18,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database size={20} color="#d4af37" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontFamily: '"Outfit", sans-serif', fontWeight: 500 }}>
              PIPELINE DE PROSPECTION B2B RÉEL (PERSISTANCE SQLITE)
            </h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#6b6b7b', fontFamily: '"JetBrains Mono", monospace' }}>
                  <th style={{ padding: '12px 8px' }}>PROSPECT</th>
                  <th style={{ padding: '12px 8px' }}>ENTREPRISE</th>
                  <th style={{ padding: '12px 8px' }}>STATUS ACQUISITION</th>
                  <th style={{ padding: '12px 8px' }}>DRAFT COMMENTAIRE</th>
                  <th style={{ padding: '12px 8px' }}>NOTE D'INVITATION</th>
                </tr>
              </thead>
              <tbody>
                {prospects.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.3s' }}>
                    <td style={{ padding: '14px 8px', fontWeight: 'bold' }}>{p.name}<br /><span style={{ fontSize: '0.7rem', color: '#6b6b7b' }}>{p.title}</span></td>
                    <td style={{ padding: '14px 8px' }}>{p.company}</td>
                    <td style={{ padding: '14px 8px' }}>
                      <span style={{ background: p.stage === 'Qualifié' ? 'rgba(56,189,248,0.1)' : 'rgba(139,92,246,0.1)', color: p.stage === 'Qualifié' ? '#38bdf8' : '#c084fc', padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold' }}>
                        {p.stage}
                      </span>
                    </td>
                    <td style={{ padding: '14px 8px', color: '#8b8b9b', fontSize: '0.7rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.comment_draft || "En attente d'optimisation..."}</td>
                    <td style={{ padding: '14px 8px', color: '#8b8b9b', fontSize: '0.7rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.connection_note || "En attente de génération..."}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time telemetery logs console */}
        <div style={{ background: 'rgba(10,10,12,0.85)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontFamily: '"Outfit", sans-serif', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Server size={16} /> SOVEREIGN LOGGING & COGNITIVE SWARM TELEMETRY
            </h4>
            <span style={{ fontSize: '0.65rem', color: '#6b6b7b', fontFamily: '"JetBrains Mono", monospace' }}>Models: hermes3 (Ollama)</span>
          </div>

          <div style={{ height: '220px', background: '#050507', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', padding: '16px', overflowY: 'auto', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {logs.map((l, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ color: '#d4af37' }}>[{l.timestamp}]</span>
                <span style={{ color: '#818cf8', fontWeight: 'bold', minWidth: '150px' }}>{l.agent}</span>
                <span style={{ color: l.type === 'success' ? '#34d399' : l.type === 'warning' ? '#fbbf24' : '#e2e8f0', whiteSpace: 'pre-wrap', flex: 1 }}>{l.text}</span>
              </div>
            ))}
            {logs.length === 0 && (
              <div style={{ color: '#6b6b7b', textAlign: 'center', marginTop: '80px', fontStyle: 'italic' }}>Aucune transaction de swarm logguée pour le moment. Lancer l'orchestration pour voir le mesh s'activer.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
