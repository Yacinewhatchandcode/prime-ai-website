import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import SovereignCommandBar from './SovereignCommandBar';
import SovereignWorkflowLog from './SovereignWorkflowLog';

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname;

  const isSubsystemActive = ['/orb', '/orchestration', '/media', '/whatsapp', '/memory', '/factory'].includes(path);
  const isLabActive = ['/amlazr', '/yace19', '/azirem'].includes(path);

  return (
    <div className="agent-app-container">
      <div className="agent-bg-glow"></div>
      <div className="cyber-grid"></div>
      
      {/* Sovereign Global Navigation */}
      <nav className="agent-global-nav">
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #FAF8F4 0%, #C6A15A 100%)',
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(255, 255, 255, 0.08)'
          }}>
            <span style={{ color: '#020205', fontWeight: '800', fontSize: '15px' }}>▲</span>
          </div>
          <span style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: '700',
            fontSize: '15px',
            letterSpacing: '3px',
            color: '#FAF8F4',
            textTransform: 'uppercase'
          }}>
            PRIME <span style={{ color: '#C6A15A' }}>-</span> AI <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: '300' }}>// SOVEREIGN OS</span>
          </span>
        </Link>
        
        {/* Desktop Links */}
        <div className="agent-nav-links desktop-only">
          <Link to="/vision" className={`agent-nav-item ${path === '/vision' || path === '/' ? 'active' : ''}`}>👁️ VISION</Link>
          <Link to="/yace-aura" className={`agent-nav-item aura ${path === '/yace-aura' ? 'active' : ''}`}>👑 YACE•AURA</Link>
          <Link to="/credentials" className={`agent-nav-item backoffice ${path === '/credentials' ? 'active' : ''}`}>🔒 BACKOFFICE</Link>
          <Link to="/revenue" className={`agent-nav-item revenue ${path === '/revenue' ? 'active' : ''}`}>💰 REVENUE</Link>
          
          {/* Subsystems Dropdown */}
          <div className="agent-nav-dropdown">
            <span className={`agent-nav-dropdown-trigger ${isSubsystemActive ? 'active' : ''}`}>🛰️ SUBSYSTEMS <span className="arrow">▼</span></span>
            <div className="agent-nav-dropdown-content">
              <Link to="/orb" className="dropdown-link">01_ORB</Link>
              <Link to="/orchestration" className="dropdown-link">02_FLEET</Link>
              <Link to="/media" className="dropdown-link">03_MEDIA</Link>
              <Link to="/whatsapp" className="dropdown-link">04_WA</Link>
              <Link to="/memory" className="dropdown-link">05_MEM</Link>
              <Link to="/factory" className="dropdown-link">06_FAC</Link>
            </div>
          </div>
          
          {/* Labs Dropdown */}
          <div className="agent-nav-dropdown">
            <span className={`agent-nav-dropdown-trigger ${isLabActive ? 'active' : ''}`}>🧪 LABS <span className="arrow">▼</span></span>
            <div className="agent-nav-dropdown-content">
              <Link to="/amlazr" className="dropdown-link">07_AMLAZR</Link>
              <Link to="/yace19" className="dropdown-link">08_YACE19</Link>
              <Link to="/azirem" className="dropdown-link">09_AZIREM</Link>
            </div>
          </div>
        </div>

        {/* Right side items: Language switcher & grid menu to align with Light Layout */}
        <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Language Switcher */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontWeight: '600',
            fontSize: '11px',
            color: '#FAF8F4',
            letterSpacing: '1px',
            cursor: 'pointer',
            padding: '6px 12px',
            background: 'rgba(198, 161, 90, 0.06)',
            borderRadius: '100px',
            border: '1px solid rgba(198, 161, 90, 0.12)'
          }}>
            <span>FR</span>
            <span style={{ color: '#C6A15A', fontSize: '9px' }}>▼</span>
          </div>

          {/* Menu Grid Icon */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            background: 'rgba(198, 161, 90, 0.06)',
            border: '1px solid rgba(198, 161, 90, 0.12)'
          }} onClick={() => window.location.href = "/"}>
            <div style={{ display: 'flex', gap: '3px' }}>
              <div style={{ width: '4px', height: '4px', background: '#FAF8F4', borderRadius: '50%' }} />
              <div style={{ width: '4px', height: '4px', background: '#FAF8F4', borderRadius: '50%' }} />
              <div style={{ width: '4px', height: '4px', background: '#FAF8F4', borderRadius: '50%' }} />
            </div>
            <div style={{ display: 'flex', gap: '3px' }}>
              <div style={{ width: '4px', height: '4px', background: '#FAF8F4', borderRadius: '50%' }} />
              <div style={{ width: '4px', height: '4px', background: '#C6A15A', borderRadius: '50%' }} />
              <div style={{ width: '4px', height: '4px', background: '#FAF8F4', borderRadius: '50%' }} />
            </div>
            <div style={{ display: 'flex', gap: '3px' }}>
              <div style={{ width: '4px', height: '4px', background: '#FAF8F4', borderRadius: '50%' }} />
              <div style={{ width: '4px', height: '4px', background: '#FAF8F4', borderRadius: '50%' }} />
              <div style={{ width: '4px', height: '4px', background: '#FAF8F4', borderRadius: '50%' }} />
            </div>
          </div>
        </div>

        {/* Mobile Toggle Hamburger */}
        <button 
          className="mobile-hamburger-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#d4af37',
            cursor: 'pointer',
            padding: '4px',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
          }}
        >
          {mobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          )}
        </button>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(5, 5, 8, 0.98)',
          backdropFilter: 'blur(30px)',
          zIndex: 1500,
          display: 'flex',
          flexDirection: 'column',
          padding: '100px 32px 32px',
          gap: '24px',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ color: '#6b6b7b', fontSize: '0.65rem', letterSpacing: '2px', fontFamily: 'monospace' }}>MAIN CORE</div>
            <Link to="/vision" className="agent-nav-item" style={{ fontSize: '1.2rem', padding: '8px 0' }} onClick={() => setMobileMenuOpen(false)}>👁️ VISION</Link>
            <Link to="/yace-aura" className="agent-nav-item aura" style={{ fontSize: '1.2rem', padding: '8px 0', color: '#d4af37' }} onClick={() => setMobileMenuOpen(false)}>👑 YACE•AURA</Link>
            <Link to="/credentials" className="agent-nav-item backoffice" style={{ fontSize: '1.2rem', padding: '8px 0', color: '#f59e0b' }} onClick={() => setMobileMenuOpen(false)}>🔒 BACKOFFICE</Link>
            <Link to="/revenue" className="agent-nav-item revenue" style={{ fontSize: '1.2rem', padding: '8px 0', color: '#10b981' }} onClick={() => setMobileMenuOpen(false)}>💰 REVENUE</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            <div style={{ color: '#6b6b7b', fontSize: '0.65rem', letterSpacing: '2px', fontFamily: 'monospace' }}>🛰️ SUBSYSTEMS</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Link to="/orb" className="dropdown-link" style={{ fontSize: '0.8rem', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }} onClick={() => setMobileMenuOpen(false)}>01_ORB</Link>
              <Link to="/orchestration" className="dropdown-link" style={{ fontSize: '0.8rem', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }} onClick={() => setMobileMenuOpen(false)}>02_FLEET</Link>
              <Link to="/media" className="dropdown-link" style={{ fontSize: '0.8rem', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }} onClick={() => setMobileMenuOpen(false)}>03_MEDIA</Link>
              <Link to="/whatsapp" className="dropdown-link" style={{ fontSize: '0.8rem', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }} onClick={() => setMobileMenuOpen(false)}>04_WA</Link>
              <Link to="/memory" className="dropdown-link" style={{ fontSize: '0.8rem', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }} onClick={() => setMobileMenuOpen(false)}>05_MEM</Link>
              <Link to="/factory" className="dropdown-link" style={{ fontSize: '0.8rem', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }} onClick={() => setMobileMenuOpen(false)}>06_FAC</Link>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            <div style={{ color: '#6b6b7b', fontSize: '0.65rem', letterSpacing: '2px', fontFamily: 'monospace' }}>🧪 LABS</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <Link to="/amlazr" className="dropdown-link" style={{ fontSize: '0.75rem', padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', textAlign: 'center' }} onClick={() => setMobileMenuOpen(false)}>07_AMLAZR</Link>
              <Link to="/yace19" className="dropdown-link" style={{ fontSize: '0.75rem', padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', textAlign: 'center' }} onClick={() => setMobileMenuOpen(false)}>08_YACE19</Link>
              <Link to="/azirem" className="dropdown-link" style={{ fontSize: '0.75rem', padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', textAlign: 'center' }} onClick={() => setMobileMenuOpen(false)}>09_AZIREM</Link>
            </div>
          </div>
        </div>
      )}

      {/* Sovereign OS Ambient Cognitive Overlays */}
      <SovereignWorkflowLog />
      <SovereignCommandBar />

      <div className="agent-layout-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
