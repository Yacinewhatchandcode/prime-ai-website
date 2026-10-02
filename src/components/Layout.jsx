import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import SovereignCommandBar from './SovereignCommandBar';
import SovereignWorkflowLog from './SovereignWorkflowLog';
import { useLanguage } from '../context/LanguageContext';
import useNavigationMenu from './useNavigationMenu';
import SkipLink from './SkipLink';

function Layout() {
  const { mobileMenuOpen, setMobileMenuOpen, toggleRef, menuRef } = useNavigationMenu();
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const path = location.pathname;

  const isSubsystemActive = ['/orb', '/orchestration', '/media', '/whatsapp', '/memory', '/factory', '/fleet-command'].includes(path);
  const isLabActive = ['/amlazr', '/azirem', '/yace19'].includes(path);

  return (
    <div className="agent-app-container">
      <SkipLink />
      <div className="agent-bg-glow"></div>
      <div className="cyber-grid"></div>
      
      {/* Sovereign Global Navigation */}
      <nav className="agent-global-nav" aria-label="Primary navigation" style={{ zIndex: mobileMenuOpen ? 1600 : undefined }}>
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
            PRIME <span style={{ color: '#C6A15A' }}>-</span> AI <span className="desktop-only" style={{ color: 'rgba(255,255,255,0.4)', fontWeight: '300' }}> // SOVEREIGN OS</span>
          </span>
        </Link>
        
        {/* Desktop Links */}
        <div className="agent-nav-links desktop-only">
          <Link to="/vision" className={`agent-nav-item ${path === '/vision' || path === '/' ? 'active' : ''}`}>👁️ VISION</Link>
          <Link to="/technologie" className={`agent-nav-item ${path === '/technologie' ? 'active' : ''}`}>🔬 TECHNOLOGIE</Link>
          <Link to="/ecosysteme" className={`agent-nav-item ${path === '/ecosysteme' ? 'active' : ''}`}>🌐 ÉCOSYSTÈME</Link>
          <Link to="/yace-aura" className={`agent-nav-item aura ${path === '/yace-aura' ? 'active' : ''}`}>👑 YACE•AURA</Link>
          <Link to="/credentials" className={`agent-nav-item backoffice ${path === '/credentials' ? 'active' : ''}`}>🔒 BACKOFFICE</Link>
          <Link to="/revenue" className={`agent-nav-item revenue ${path === '/revenue' ? 'active' : ''}`}>💰 REVENUE</Link>
          
          {/* Subsystems Dropdown */}
          <details className="agent-nav-dropdown">
            <summary className={`agent-nav-dropdown-trigger ${isSubsystemActive ? 'active' : ''}`}>🛰️ SUBSYSTEMS <span className="arrow">▼</span></summary>
            <div className="agent-nav-dropdown-content">
              <Link to="/orb" className="dropdown-link">01_ORB</Link>
              <Link to="/orchestration" className="dropdown-link">02_FLEET</Link>
              <Link to="/media" className="dropdown-link">03_MEDIA</Link>
              <Link to="/whatsapp" className="dropdown-link">04_WA</Link>
              <Link to="/memory" className="dropdown-link">05_MEM</Link>
              <Link to="/factory" className="dropdown-link">06_FAC</Link>
              <Link to="/fleet-command" className="dropdown-link">09_FLEET_CMD</Link>
            </div>
          </details>
          
          {/* Labs Dropdown */}
          <details className="agent-nav-dropdown">
            <summary className={`agent-nav-dropdown-trigger ${isLabActive ? 'active' : ''}`}>🧪 LABS <span className="arrow">▼</span></summary>
            <div className="agent-nav-dropdown-content">
              <Link to="/amlazr" className="dropdown-link">07_AMLAZR</Link>
              <Link to="/azirem" className="dropdown-link">08_AZIREM</Link>
              <Link to="/yace19" className="dropdown-link">10_YACE19_LAB</Link>
            </div>
          </details>
        </div>

        {/* Right side items: Language switcher & grid menu to align with Light Layout */}
        <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Language Switcher */}
          <button type="button" aria-label="Change language"
            onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
            style={{
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
            }}
          >
            <span>{language.toUpperCase()}</span>
            <span style={{ color: '#C6A15A', fontSize: '9px' }}>▼</span>
          </button>

          {/* Menu Grid Icon */}
          <button type="button" aria-label="Go to home" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            background: 'rgba(198, 161, 90, 0.06)',
            border: '1px solid rgba(198, 161, 90, 0.12)'
          }} onClick={() => navigate("/")}>
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
          </button>
        </div>

        {/* Mobile Toggle Hamburger */}
        <button 
          className="mobile-hamburger-btn"
          type="button"
          ref={toggleRef}
          aria-label="Navigation menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="dark-mobile-navigation"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#d4af37',
            cursor: 'pointer',
            padding: '4px',
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
        <div ref={menuRef} id="dark-mobile-navigation" role="dialog" aria-modal="true" aria-label="Navigation menu" style={{
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
            <Link to="/technologie" className="agent-nav-item" style={{ fontSize: '1.2rem', padding: '8px 0', color: '#c084fc' }} onClick={() => setMobileMenuOpen(false)}>🔬 TECHNOLOGIE</Link>
            <Link to="/ecosysteme" className="agent-nav-item" style={{ fontSize: '1.2rem', padding: '8px 0', color: '#60a5fa' }} onClick={() => setMobileMenuOpen(false)}>🌐 ÉCOSYSTÈME</Link>
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
              <Link to="/fleet-command" className="dropdown-link" style={{ fontSize: '0.8rem', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }} onClick={() => setMobileMenuOpen(false)}>09_CMD</Link>
            </div>
            <button type="button" className="agent-nav-item" onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}>Change language: {language.toUpperCase()}</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            <div style={{ color: '#6b6b7b', fontSize: '0.65rem', letterSpacing: '2px', fontFamily: 'monospace' }}>🧪 LABS</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <Link to="/amlazr" className="dropdown-link" style={{ fontSize: '0.75rem', padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', textAlign: 'center' }} onClick={() => setMobileMenuOpen(false)}>07_AMLAZR</Link>
              <Link to="/azirem" className="dropdown-link" style={{ fontSize: '0.75rem', padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', textAlign: 'center' }} onClick={() => setMobileMenuOpen(false)}>08_AZIREM</Link>
              <Link to="/yace19" className="dropdown-link" style={{ fontSize: '0.75rem', padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', textAlign: 'center' }} onClick={() => setMobileMenuOpen(false)}>10_YACE19</Link>
            </div>
          </div>
        </div>
      )}

      {/* Sovereign OS Ambient Cognitive Overlays */}
      {path !== '/fleet-command' && <SovereignWorkflowLog />}
      {path !== '/fleet-command' && <SovereignCommandBar />}

      <main className={`agent-layout-content ${path === '/fleet-command' ? 'live-fleet-content' : ''}`} id="main-content" tabIndex={-1}>
        <p className="console-preview-notice">{path === '/fleet-command'
          ? 'Local advisory runtime: readiness and persisted mission results are read from the local backend. No remote device control or automatic tool execution.'
          : 'Console preview: illustrative metrics and simulations are not verified live fleet status. Backend-dependent panels report connection errors separately.'}</p>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
