import React from 'react';

export default function ObjectivePanel() {
  return (
    <div className="panel left">
      <div className="panel-header">Active Objectives</div>
      
      <div className="objective-block">
        <div className="objective-title">[ BUILDING ]</div>
        <div className="objective-value">AI CRM PLATFORM</div>
        <div className="objective-progress">
          <div className="objective-progress-bar"></div>
        </div>
        <div className="stream-meta" style={{ marginTop: '12px' }}>
          <span>STATUS: ALLOCATING AGENTS</span>
          <span className="stream-status building">72%</span>
        </div>
      </div>

      <div className="objective-block" style={{ opacity: 0.5, borderColor: 'var(--border-light)', background: 'transparent' }}>
        <div className="objective-title" style={{ color: 'var(--text-muted)' }}>[ QUEUED ]</div>
        <div className="objective-value" style={{ color: 'var(--text-muted)' }}>AUTONOMOUS DEMO MP4</div>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div className="panel-header">System Metrics</div>
        <div className="stream-meta" style={{ marginBottom: '8px' }}>
          <span>CPU LOAD</span>
          <span>14%</span>
        </div>
        <div className="stream-meta" style={{ marginBottom: '8px' }}>
          <span>MEMORY FACTORY</span>
          <span className="stream-status">SYNCED</span>
        </div>
        <div className="stream-meta">
          <span>MCP PROTOCOL</span>
          <span className="stream-status">ONLINE</span>
        </div>
      </div>
    </div>
  );
}
