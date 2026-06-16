import React from 'react';

const clients = [
  { id: 'c1', name: 'Jean Dupont', status: 'WAITING_TRIGGER', time: '10:42 AM' },
  { id: 'c2', name: 'Agence XYZ', status: 'PIPELINE_ACTIVE', time: '09:15 AM' },
  { id: 'c3', name: 'Sophie L.', status: 'DEPLOYED', time: 'Yesterday' }
];

export default function ClientList({ selectedClientId, onSelectClient }) {
  return (
    <div className="panel left" style={{ padding: '0' }}>
      <div className="panel-header" style={{ padding: '24px 24px 12px 24px', margin: 0 }}>
        WhatsApp Intakes
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {clients.map(client => {
          const isSelected = selectedClientId === client.id;
          return (
            <div 
              key={client.id}
              onClick={() => onSelectClient(client.id)}
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid var(--border-light)',
                background: isSelected ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                borderLeft: isSelected ? '3px solid var(--neon-gold)' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: '500', color: isSelected ? 'white' : 'var(--text-muted)' }}>
                  {client.name}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {client.time}
                </span>
              </div>
              <div style={{ 
                fontSize: '0.65rem', 
                fontFamily: 'var(--font-mono)',
                color: client.status === 'WAITING_TRIGGER' ? 'var(--neon-gold)' : 
                       client.status === 'PIPELINE_ACTIVE' ? '#3b82f6' : '#10b981'
              }}>
                [{client.status}]
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
