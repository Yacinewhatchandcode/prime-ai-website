import { Shield, Zap, Globe, Terminal, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ROUTES = [
  { path: '/', name: 'Sovereign Infrastructure' },
  { path: '/technologie', name: 'Architecture' },
  { path: '/ecosysteme', name: 'Constellation' },
  { path: '/sovereign-ai', name: 'Deployment Sovereignty' },
  { path: '/multi-agent-systems', name: 'Governed Agents' },
  { path: '/enterprise-ai-orchestration', name: 'Enterprise Integrations' },
  { path: '/orchestration', name: 'Operator Console' },
  { path: '/amlazr', name: 'Execution Preview' },
];

function CyberSurveyor() {
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
              Operator preview only. No live production scans, security checks, QA runs or performance measurements are performed here.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to="/orchestration" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.1)', color: '#fff', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none' }}>
              <Terminal size={16} /> Orchestration Console
            </Link>
            <div role="note" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(148, 163, 184, 0.1)', color: '#cbd5e1', padding: '8px 16px', borderRadius: '4px', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
              PREVIEW · NO LIVE DATA
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
                  {ROUTES.map(url => (
                    <tr key={url.path} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '12px 4px', color: '#cbd5e1' }}>{url.path}</td>
                      <td style={{ padding: '12px 4px', color: '#94a3b8' }}>Not verified</td>
                      <td style={{ padding: '12px 4px', color: '#94a3b8' }}>Not checked</td>
                      <td style={{ padding: '12px 4px', textAlign: 'right', color: '#94a3b8' }}>
                        Not measured
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
                  {ROUTES.map(url => (
                    <tr key={url.path} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '12px 4px', color: '#cbd5e1' }}>{url.path}</td>
                      <td style={{ padding: '12px 4px', color: '#94a3b8' }}>Not run</td>
                      <td style={{ padding: '12px 4px', color: '#94a3b8' }}>Not checked</td>
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
                  {ROUTES.map(url => (
                    <tr key={url.path} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '12px 4px', color: '#cbd5e1' }}>{url.path}</td>
                      <td style={{ padding: '12px 4px', color: '#94a3b8' }}>Not measured</td>
                      <td style={{ padding: '12px 4px', color: '#94a3b8' }}>
                        Not measured
                      </td>
                      <td style={{ padding: '12px 4px', textAlign: 'right', color: '#94a3b8' }}>
                        Not measured
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
