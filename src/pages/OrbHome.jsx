import React from 'react';

function OrbHome() {
  return (
    <div style={{
      height: '100%', width: '100%', display: 'flex', flexDirection: 'column', 
      alignItems: 'center', justifyContent: 'center', color: '#fff',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Orb Core */}
      <div style={{
        width: '240px', height: '240px', borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, rgba(212, 175, 55, 0.8), rgba(0,0,0,1))',
        boxShadow: '0 0 60px rgba(212, 175, 55, 0.4), inset 0 0 40px rgba(255,255,255,0.1)',
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {/* Inner pulsing core */}
        <div style={{
          width: '100px', height: '100px', borderRadius: '50%',
          background: '#d4af37', filter: 'blur(20px)', opacity: 0.6,
          animation: 'pulse 3s infinite alternate'
        }}></div>
      </div>

      {/* Orchestration Rings */}
      <div style={{
        position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
        border: '1px solid rgba(212, 175, 55, 0.1)', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', zIndex: 1
      }}></div>
      <div style={{
        position: 'absolute', width: '800px', height: '800px', borderRadius: '50%',
        border: '1px dashed rgba(255, 255, 255, 0.05)', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', zIndex: 1
      }}></div>

      <div style={{ marginTop: '64px', textAlign: 'center', zIndex: 10 }}>
        <h1 style={{ 
          fontFamily: '"Outfit", sans-serif', fontWeight: 300, fontSize: '3rem', 
          letterSpacing: '8px', marginBottom: '16px' 
        }}>PRIME-AI</h1>
        <p style={{ 
          fontFamily: '"JetBrains Mono", monospace', fontSize: '0.85rem', 
          color: '#6b6b7b', letterSpacing: '4px', textTransform: 'uppercase' 
        }}>Sovereign Cognitive Engine :: Online</p>
      </div>

      {/* Voice Input Placeholder */}
      <div style={{
        marginTop: '48px', padding: '16px 32px', background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.05)', borderRadius: '100px',
        display: 'flex', alignItems: 'center', gap: '16px', zIndex: 10,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#d4af37' }}></div>
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.9rem', color: '#a0a0b0' }}>
          Awaiting intent...
        </span>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.4; }
          100% { transform: scale(1.2); opacity: 0.8; }
        }
      `}} />
    </div>
  );
}

export default OrbHome;
