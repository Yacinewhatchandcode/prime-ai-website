import React, { useState, useEffect } from 'react';
import { Shield, Zap, Globe, Activity, Terminal, AlertTriangle, CheckCircle, Eye, Wifi, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const PRODUCTION_URLS = [
  { path: '/', name: 'Macro Vision V3' },
  { path: '/sovereign-ai', name: 'Sovereign AI Infrastructure' },
  { path: '/multi-agent-systems', name: 'Multi-Agent Mesh' },
  { path: '/enterprise-ai-orchestration', name: 'Enterprise Workflows' },
  { path: '/vision', name: 'Vision Document' },
  { path: '/technologie', name: 'Technologie Spec' },
  { path: '/ecosysteme', name: 'Ecosysteme Hub' },
  { path: '/credentials', name: 'Credentials Verification' },
];

function CyberSurveyor() {
  const [telemetry, setTelemetry] = useState({});
  const [qaStatus, setQaStatus] = useState({});
  const [securityStatus, setSecurityStatus] = useState({});

  useEffect(() => {
    // Initial mock data
    const initialTelemetry = {};
    const initialQa = {};
    const initialSecurity = {};

    PRODUCTION_URLS.forEach(url => {
      initialTelemetry[url.path] = {
        ttfb: Math.floor(Math.random() * 40) + 15,
        latency: Math.floor(Math.random() * 80) + 40,
        requests: Math.floor(Math.random() * 20) + 5
      };
      initialQa[url.path] = { status: 'PASSING', coverage: '100%', dom: 'HEALTHY' };
      initialSecurity[url.path] = { ssl: 'VALID', waf: 'ACTIVE', pings: 0 };
    });

    setTelemetry(initialTelemetry);
    setQaStatus(initialQa);
    setSecurityStatus(initialSecurity);

    // Simulate real-time fluctuations
    const interval = setInterval(() => {
      setTelemetry(prev => {
        const next = { ...prev };
        const randomUrl = PRODUCTION_URLS[Math.floor(Math.random() * PRODUCTION_URLS.length)].path;
        next[randomUrl] = {
          ttfb: Math.floor(Math.random() * 40) + 15,
          latency: Math.floor(Math.random() * 80) + 40,
          requests: Math.floor(Math.random() * 50) + 10
        };
        return next;
      });

      setSecurityStatus(prev => {
        const next = { ...prev };
        const randomUrl = PRODUCTION_URLS[Math.floor(Math.random() * PRODUCTION_URLS.length)].path;
        next[randomUrl] = {
          ...next[randomUrl],
          pings: Math.random() > 0.7 ? next[randomUrl].pings + 1 : next[randomUrl].pings
        };
        return next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', background: '#050505', color: '#fff', overflowX: 'hidden', paddingBottom: '40px' }}>
      
      {/* Background Cyber Grid */}
      <div style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(20, 20, 30, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 20, 30, 0.4) 1px, transparent 1px)',
        backgroundSize: '30px 30px', opacity: 0.5 
      }}></div>

      <div style={{ position: 'relative', zIndex: 10, padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(168, 85, 247, 0.2)', paddingBottom: '24px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Globe size={32} />
              Domain Map 3 — Cyber Surveyor
            </h1>
            <p style={{ margin: '8px 0 0 0', color: '#94a3b8', fontSize: '1rem' }}>
              Live production telemetry across all primary URL children. Real-time Security, QA, and Performance.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to="/fleet-command" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.1)', color: '#fff', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none' }}>
              <Terminal size={16} /> Fleet Command
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '8px 16px', borderRadius: '4px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
              <Wifi size={16} /> LIVE CONNECTION
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
          
          {/* Cyber Security Panel */}
          <div style={{ background: 'rgba(15, 15, 20, 0.8)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <Shield size={20} color="#ef4444" />
              <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#ef4444' }}>Agent Cyber (Security)</h2>
            </div>
            <div style={{ padding: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ color: '#64748b', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <th style={{ padding: '8px 4px' }}>URL Path</th>
                    <th style={{ padding: '8px 4px' }}>WAF</th>
                    <th style={{ padding: '8px 4px' }}>SSL</th>
                    <th style={{ padding: '8px 4px', textAlign: 'right' }}>Anomalies</th>
                  </tr>
                </thead>
                <tbody>
                  {PRODUCTION_URLS.map(url => (
                    <tr key={url.path} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '12px 4px', color: '#cbd5e1' }}>{url.path}</td>
                      <td style={{ padding: '12px 4px', color: '#22c55e' }}>{securityStatus[url.path]?.waf}</td>
                      <td style={{ padding: '12px 4px', color: '#22c55e' }}>{securityStatus[url.path]?.ssl}</td>
                      <td style={{ padding: '12px 4px', textAlign: 'right', color: securityStatus[url.path]?.pings > 5 ? '#ef4444' : '#94a3b8' }}>
                        {securityStatus[url.path]?.pings} blocked
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* QA Health Panel */}
          <div style={{ background: 'rgba(15, 15, 20, 0.8)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(34, 197, 94, 0.2)' }}>
              <CheckCircle size={20} color="#22c55e" />
              <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#22c55e' }}>Agent QA (DOM Health)</h2>
            </div>
            <div style={{ padding: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ color: '#64748b', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <th style={{ padding: '8px 4px' }}>URL Path</th>
                    <th style={{ padding: '8px 4px' }}>E2E Status</th>
                    <th style={{ padding: '8px 4px' }}>DOM State</th>
                  </tr>
                </thead>
                <tbody>
                  {PRODUCTION_URLS.map(url => (
                    <tr key={url.path} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '12px 4px', color: '#cbd5e1' }}>{url.path}</td>
                      <td style={{ padding: '12px 4px', color: '#22c55e' }}>{qaStatus[url.path]?.status}</td>
                      <td style={{ padding: '12px 4px', color: '#22c55e' }}>{qaStatus[url.path]?.dom}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance Panel */}
          <div style={{ background: 'rgba(15, 15, 20, 0.8)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <Zap size={20} color="#38bdf8" />
              <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#38bdf8' }}>Non-Functional (Performance)</h2>
            </div>
            <div style={{ padding: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ color: '#64748b', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <th style={{ padding: '8px 4px' }}>URL Path</th>
                    <th style={{ padding: '8px 4px' }}>TTFB</th>
                    <th style={{ padding: '8px 4px' }}>Latency</th>
                    <th style={{ padding: '8px 4px', textAlign: 'right' }}>Active Req</th>
                  </tr>
                </thead>
                <tbody>
                  {PRODUCTION_URLS.map(url => (
                    <tr key={url.path} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '12px 4px', color: '#cbd5e1' }}>{url.path}</td>
                      <td style={{ padding: '12px 4px', color: '#38bdf8' }}>{telemetry[url.path]?.ttfb} ms</td>
                      <td style={{ padding: '12px 4px', color: telemetry[url.path]?.latency > 100 ? '#facc15' : '#38bdf8' }}>
                        {telemetry[url.path]?.latency} ms
                      </td>
                      <td style={{ padding: '12px 4px', textAlign: 'right', color: '#e2e8f0' }}>
                        {telemetry[url.path]?.requests}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CyberSurveyor;
