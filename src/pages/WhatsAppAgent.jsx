import React, { useState, useEffect } from 'react';
import { Send, QrCode, Shield, RefreshCw, MessageSquare, Play, Square, Activity, Database, Check } from 'lucide-react';

const API_BASE = "http://localhost:5000";

export default function WhatsAppAgent() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [gatewayStatus, setGatewayStatus] = useState('DISCONNECTED'); // DISCONNECTED, GENERATING_QR, AWAITING_SCAN, CONNECTED
  const [qrCodeProgress, setQrCodeProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sending, setSending] = useState(false);

  // Fetch logs on mount/interval
  const fetchLogs = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/logs`);
      if (res.ok) {
        const data = await res.json();
        // Filter logs related to WhatsApp or general gateway actions
        const waLogs = data.filter(l => 
          l.agent.toLowerCase().includes('whatsapp') || 
          l.agent.toLowerCase().includes('wa') || 
          l.text.toLowerCase().includes('whatsapp')
        );
        setLogs(waLogs);
      }
    } catch (e) {
      console.warn("FastAPI backend offline, logging internally");
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStartGateway = () => {
    setGatewayStatus('GENERATING_QR');
    setQrCodeProgress(0);
    
    // Simulate QR code loading
    const interval = setInterval(() => {
      setQrCodeProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setGatewayStatus('AWAITING_SCAN');
          return 100;
        }
        return p + 20;
      });
    }, 300);
  };

  const handleConfirmScan = async () => {
    setGatewayStatus('CONNECTED');
    const newLog = {
      timestamp: new Date().toLocaleTimeString(),
      agent: "WhatsApp Gateway",
      text: "WhatsApp session successfully authenticated. Live event channel open.",
      type: "success"
    };
    
    setLogs(prev => [newLog, ...prev]);

    // Commit to FastAPI if online
    try {
      await fetch(`${API_BASE}/api/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent: "WhatsApp Gateway",
          text: "WhatsApp session authenticated via browser cockpit.",
          type: "success"
        })
      });
    } catch (e) {
      console.warn(e);
    }
  };

  const handleStopGateway = () => {
    setGatewayStatus('DISCONNECTED');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!phone || !message) return;
    setSending(true);

    try {
      // Simulate sending logic (or forward to real dispatcher)
      const res = await fetch(`${API_BASE}/api/dispatch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `[WhatsApp Outbound] Target: ${phone} -> Message: ${message}`,
          priority: "high"
        })
      });

      if (res.ok) {
        setSendSuccess(true);
        setPhone('');
        setMessage('');
        setTimeout(() => setSendSuccess(false), 3000);
        
        // Log locally
        const sentLog = {
          timestamp: new Date().toLocaleTimeString(),
          agent: "WhatsApp Broadcaster",
          text: `Message successfully dispatched to ${phone}: "${message}"`,
          type: "success"
        };
        setLogs(prev => [sentLog, ...prev]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', color: '#fcfcfc', position: 'relative' }}>
      <div style={{ padding: '48px', flex: 1, display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '24px' }}>
          <div>
            <h1 style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 300, fontSize: '2rem', letterSpacing: '2px', margin: 0 }}>
              WHATSAPP COGNITIVE BRIDGE
            </h1>
            <p style={{ color: '#6b6b7b', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '8px 0 0' }}>
              Conversational Gateway & Outbound Broadcaster
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {gatewayStatus === 'CONNECTED' ? (
              <button 
                onClick={handleStopGateway}
                style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '10px 20px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: '"JetBrains Mono", monospace' }}
              >
                <Square size={16} /> DECONNECTER LA PASSERELLE
              </button>
            ) : gatewayStatus === 'DISCONNECTED' ? (
              <button 
                onClick={handleStartGateway}
                style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid #d4af37', color: '#d4af37', padding: '10px 20px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: '"JetBrains Mono", monospace' }}
              >
                <Play size={16} /> INITIALISER WHATSAPP
              </button>
            ) : null}
          </div>
        </div>

        {/* Dynamic Layout Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          
          {/* Pair Block (QR & Instructions) */}
          <div style={{ background: 'rgba(15,15,18,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
              <QrCode size={20} color="#d4af37" />
              <h3 style={{ margin: 0, fontSize: '1rem', fontFamily: '"Outfit", sans-serif', fontWeight: 500 }}>
                CONNEXION DE L'APPAREIL (QR CODE)
              </h3>
            </div>

            {gatewayStatus === 'DISCONNECTED' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: '16px' }}>
                <QrCode size={80} style={{ opacity: 0.15, color: '#d4af37' }} />
                <span style={{ fontSize: '0.75rem', color: '#6b6b7b', fontFamily: '"JetBrains Mono", monospace' }}>[ PASSERELLE INACTIVE ]</span>
                <button onClick={handleStartGateway} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px 24px', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.3s' }}>
                  Générer le QR Code de jumelage
                </button>
              </div>
            )}

            {gatewayStatus === 'GENERATING_QR' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: '16px' }}>
                <RefreshCw size={40} className="spin" style={{ color: '#d4af37', animation: 'spin 2s linear infinite' }} />
                <span style={{ fontSize: '0.75rem', color: '#cbd5e1', fontFamily: '"JetBrains Mono", monospace' }}>Génération du conteneur sécurisé... {qrCodeProgress}%</span>
              </div>
            )}

            {gatewayStatus === 'AWAITING_SCAN' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '10px 0' }}>
                <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', display: 'inline-flex' }}>
                  {/* Styled Mock QR Code */}
                  <div style={{ width: '150px', height: '150px', background: 'repeating-conic-gradient(from 45deg, #000 0deg 90deg, #fff 90deg 180deg)', backgroundSize: '15px 15px', borderRadius: '4px' }}></div>
                </div>
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 'bold' }}>⚠️ EN ATTENTE DE JUMELAGE</span>
                  <p style={{ fontSize: '0.7rem', color: '#8b8b9b', margin: 0, lineHeight: 1.5 }}>Scannez ce QR Code avec votre téléphone dans WhatsApp (Appareils connectés) pour authentifier la session locale.</p>
                </div>
                <button onClick={handleConfirmScan} style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', color: '#34d399', width: '100%', padding: '12px', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Check size={16} /> SIMULER LE SCAN DU TÉLÉPHONE
                </button>
              </div>
            )}

            {gatewayStatus === 'CONNECTED' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: '16px' }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifycontent: 'center', color: '#10b981', display: 'flex', justifyContent: 'center' }}>
                  <Check size={36} />
                </div>
                <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 'bold', letterSpacing: '1px' }}>SESSION APPAREILLÉE</span>
                <span style={{ fontSize: '0.7rem', color: '#6b6b7b', fontFamily: '"JetBrains Mono", monospace' }}>Device: Client Web WhatsApp (Chrome)</span>
              </div>
            )}
          </div>

          {/* Test Broadcaster Form */}
          <div style={{ background: 'rgba(15,15,18,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
              <MessageSquare size={20} color="#d4af37" />
              <h3 style={{ margin: 0, fontSize: '1rem', fontFamily: '"Outfit", sans-serif', fontWeight: 500 }}>
                BROADCASTER OUTBOUND DIRECT
              </h3>
            </div>

            <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: '#6b6b7b', fontWeight: 'bold' }}>Destinataire (Numéro ou Identifiant)</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="+33 6 12 34 56 78"
                  required
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                <label style={{ fontSize: '0.75rem', color: '#6b6b7b', fontWeight: 'bold' }}>Message Outbound</label>
                <textarea 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  placeholder="Bonjour, je vous contacte concernant votre projet..."
                  required
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.85rem', outline: 'none', resize: 'none', height: '100%', minHeight: '120px' }}
                />
              </div>

              {sendSuccess && (
                <div style={{ color: '#10b981', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} /> Message transmis avec succès au Swarm de messagerie !
                </div>
              )}

              <button 
                type="submit" 
                disabled={sending || gatewayStatus !== 'CONNECTED'}
                style={{ 
                  background: gatewayStatus === 'CONNECTED' ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.03)', 
                  border: `1px solid ${gatewayStatus === 'CONNECTED' ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.05)'}`, 
                  color: gatewayStatus === 'CONNECTED' ? '#c084fc' : '#4a4a5a', 
                  padding: '12px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold', 
                  cursor: gatewayStatus === 'CONNECTED' ? 'pointer' : 'not-allowed', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
                  transition: 'all 0.3s' 
                }}
              >
                <Send size={14} /> ENVOYER LE MESSAGE BROADCAST
              </button>
            </form>
          </div>
        </div>

        {/* Live Logs Terminal */}
        <div style={{ background: 'rgba(10,10,12,0.85)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontFamily: '"Outfit", sans-serif', color: '#d4af37', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} /> CONSOLE D'ÉVÉNEMENTS WHATSAPP BRIDGE
            </h4>
            <span style={{ fontSize: '0.65rem', color: '#6b6b7b', fontFamily: '"JetBrains Mono", monospace' }}>Platform: Local Browser Gateway</span>
          </div>

          <div style={{ height: '180px', background: '#050507', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', padding: '16px', overflowY: 'auto', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {logs.map((l, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ color: '#d4af37' }}>[{l.timestamp || 'Live'}]</span>
                <span style={{ color: '#818cf8', fontWeight: 'bold', minWidth: '130px' }}>{l.agent}</span>
                <span style={{ color: l.type === 'success' ? '#34d399' : l.type === 'warning' ? '#fbbf24' : '#e2e8f0', whiteSpace: 'pre-wrap', flex: 1 }}>{l.text}</span>
              </div>
            ))}
            {logs.length === 0 && (
              <div style={{ color: '#6b6b7b', textAlign: 'center', marginTop: '60px', fontStyle: 'italic' }}>En attente de démarrage ou de logs de conversation.</div>
            )}
          </div>
        </div>

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
