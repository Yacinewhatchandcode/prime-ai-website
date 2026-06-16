import React from 'react';

export default function DeploymentDelivery({ client }) {
  if (!client) {
    return (
      <div className="panel right">
        <div className="panel-header">Delivery & Deployment</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
          NO CLIENT SELECTED
        </div>
      </div>
    );
  }

  const isDeployed = client.status === 'DEPLOYED';
  const isActive = client.status === 'PIPELINE_ACTIVE';

  return (
    <div className="panel right">
      <div className="panel-header">Delivery & Deployment</div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
        
        <DeploymentItem 
          label="Full-Stack Web Solution"
          status={isDeployed ? 'DONE' : isActive ? 'BUILDING' : 'PENDING'}
        />
        
        <DeploymentItem 
          label="Android Mobile App (APK)"
          status={isDeployed ? 'DONE' : isActive ? 'BUILDING' : 'PENDING'}
        />

        <DeploymentItem 
          label="iPhone Mobile App (iOS)"
          status={isDeployed ? 'DONE' : isActive ? 'PENDING' : 'PENDING'}
        />

        <DeploymentItem 
          label="Windows / macOS (EXE/DMG)"
          status={isDeployed ? 'DONE' : isActive ? 'PENDING' : 'PENDING'}
        />

      </div>

      <div style={{ marginTop: 'auto', paddingTop: '40px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '24px',
          background: isDeployed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.02)',
          border: isDeployed ? '1px solid #10b981' : '1px solid var(--border-light)',
          borderRadius: '12px',
          transition: 'all 0.3s'
        }}>
          {/* Master DONE Checkbox */}
          <div style={{
            width: '28px', height: '28px',
            border: isDeployed ? '2px solid #10b981' : '2px solid var(--text-muted)',
            background: isDeployed ? '#10b981' : 'transparent',
            borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {isDeployed && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1.2rem',
            color: isDeployed ? '#10b981' : 'var(--text-muted)',
            letterSpacing: '2px'
          }}>
            DONE
          </div>
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '12px', lineHeight: '1.4' }}>
          When checked, all packages (APK, EXE, iOS, Web) are fully deployed and delivered to the client via WhatsApp.
        </div>
      </div>

    </div>
  );
}

function DeploymentItem({ label, status }) {
  const isDone = status === 'DONE';
  const isBuilding = status === 'BUILDING';

  return (
    <div style={{
      padding: '16px',
      border: '1px solid var(--border-light)',
      borderRadius: '8px',
      background: 'rgba(255,255,255,0.02)',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{ fontSize: '0.9rem', color: isDone ? 'white' : 'var(--text-muted)' }}>
        {label}
      </div>
      <div style={{ 
        fontFamily: 'var(--font-mono)', 
        fontSize: '0.7rem',
        color: isDone ? '#10b981' : isBuilding ? 'var(--neon-gold)' : 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        {isBuilding && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--neon-gold)', animation: 'pulse 1s infinite' }}></div>}
        [{status}]
      </div>
    </div>
  );
}
