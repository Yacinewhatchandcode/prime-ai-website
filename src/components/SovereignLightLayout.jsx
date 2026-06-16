import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

export default function SovereignLightLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  return (
    <div style={{
      background: '#FAF8F4',
      color: '#1F1A13',
      fontFamily: "'Outfit', sans-serif",
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

        .nav-link {
          color: #5A5550;
          text-decoration: none;
          font-weight: 600;
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          transition: all 0.3s;
          position: relative;
          padding: 6px 0;
        }
        .nav-link:hover {
          color: #C6A15A;
        }
        .nav-link.active {
          color: #C6A15A;
        }
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1.5px;
          background: #C6A15A;
          border-radius: 10px;
        }

        .prime-button-outline {
          background: transparent;
          color: #1F1A13;
          border: 1px solid rgba(31, 26, 19, 0.2);
          padding: 10px 24px;
          border-radius: 100px;
          font-weight: 500;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }
        .prime-button-outline:hover {
          border-color: #C6A15A;
          color: #C6A15A;
          background: rgba(198, 161, 90, 0.04);
          transform: translateY(-1px);
        }

        .mobile-hamburger-btn {
          background: transparent;
          border: none;
          color: #C6A15A;
          cursor: pointer;
          padding: 8px;
          display: none;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        @media (max-width: 1024px) {
          .nav-links-desktop { display: none !important; }
          .header-nav { padding: 16px 20px !important; }
          .header-actions-desktop { display: none !important; }
          .mobile-hamburger-btn { display: flex !important; }
        }
      `}</style>

      {/* ── GLOBAL HEADER NAVIGATION ─────────────────────── */}
      <header className="header-nav" style={{
        padding: '24px 60px',
        height: '80px',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 50,
        background: '#FAF8F4',
        borderBottom: '1px solid rgba(198, 161, 90, 0.06)'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>
          <div style={{
            background: 'linear-gradient(135deg, #1F1A13 0%, #C6A15A 100%)',
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(31, 26, 19, 0.08)'
          }}>
            <span style={{ color: '#FAF8F4', fontWeight: '800', fontSize: '15px' }}>▲</span>
          </div>
          <span style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: '700',
            fontSize: '15px',
            letterSpacing: '3px',
            color: '#1F1A13',
            textTransform: 'uppercase'
          }}>
            PRIME <span style={{ color: '#C6A15A' }}>-</span> AI
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="nav-links-desktop" style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'center',
        }}>
          <Link to="/vision" className={`nav-link ${path === '/vision' ? 'active' : ''}`}>Vision</Link>
          <Link to="/technologie" className={`nav-link ${path === '/technologie' ? 'active' : ''}`}>Technologie</Link>
          <Link to="/ecosysteme" className={`nav-link ${path === '/ecosysteme' ? 'active' : ''}`}>Écosystème</Link>
        </nav>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="header-actions-desktop" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/yace-aura" className="prime-button-outline" style={{ borderColor: '#C6A15A', color: '#C6A15A' }}>
              Console OS <span style={{ marginLeft: '6px' }}>⚡</span>
            </Link>

            {/* Language Switcher */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: '600',
              fontSize: '11px',
              color: '#1F1A13',
              letterSpacing: '1px',
              cursor: 'pointer',
              padding: '6px 12px',
              background: 'rgba(198, 161, 90, 0.06)',
              borderRadius: '100px',
              border: '1px solid rgba(198, 161, 90, 0.1)'
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
              background: 'rgba(31, 26, 19, 0.03)'
            }} onClick={() => navigate("/yace-aura")}>
              <div style={{ display: 'flex', gap: '3px' }}>
                <div style={{ width: '4px', height: '4px', background: '#1F1A13', borderRadius: '50%' }} />
                <div style={{ width: '4px', height: '4px', background: '#1F1A13', borderRadius: '50%' }} />
                <div style={{ width: '4px', height: '4px', background: '#1F1A13', borderRadius: '50%' }} />
              </div>
              <div style={{ display: 'flex', gap: '3px' }}>
                <div style={{ width: '4px', height: '4px', background: '#1F1A13', borderRadius: '50%' }} />
                <div style={{ width: '4px', height: '4px', background: '#C6A15A', borderRadius: '50%' }} />
                <div style={{ width: '4px', height: '4px', background: '#1F1A13', borderRadius: '50%' }} />
              </div>
              <div style={{ display: 'flex', gap: '3px' }}>
                <div style={{ width: '4px', height: '4px', background: '#1F1A13', borderRadius: '50%' }} />
                <div style={{ width: '4px', height: '4px', background: '#1F1A13', borderRadius: '50%' }} />
                <div style={{ width: '4px', height: '4px', background: '#1F1A13', borderRadius: '50%' }} />
              </div>
            </div>
          </div>

          {/* Mobile Toggle Hamburger */}
          <button 
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(250, 248, 244, 0.98)',
          backdropFilter: 'blur(30px)',
          zIndex: 1500,
          display: 'flex',
          flexDirection: 'column',
          padding: '100px 32px 32px',
          gap: '24px',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ color: '#8A8580', fontSize: '0.65rem', letterSpacing: '2px', fontFamily: 'monospace' }}>PRIME CORE</div>
            <Link to="/vision" className="nav-link" style={{ fontSize: '1.2rem', padding: '8px 0' }} onClick={() => setMobileMenuOpen(false)}>Vision</Link>
            <Link to="/technologie" className="nav-link" style={{ fontSize: '1.2rem', padding: '8px 0' }} onClick={() => setMobileMenuOpen(false)}>Technologie</Link>
            <Link to="/ecosysteme" className="nav-link" style={{ fontSize: '1.2rem', padding: '8px 0' }} onClick={() => setMobileMenuOpen(false)}>Écosystème</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px', borderTop: '1px solid rgba(198,161,90,0.15)', paddingTop: '24px' }}>
            <Link to="/yace-aura" className="prime-button-outline" style={{ borderColor: '#C6A15A', color: '#C6A15A', justifyContent: 'center', width: '100%', fontSize: '15px', padding: '12px' }} onClick={() => setMobileMenuOpen(false)}>
              Console OS <span style={{ marginLeft: '6px' }}>⚡</span>
            </Link>
          </div>
        </div>
      )}

      {/* ── CORE PAGE CONTENT ────────────────────────────── */}
      <main style={{ flex: '1', width: '100%' }}>
        <Outlet />
      </main>

      {/* ── GLOBAL FOOTER ────────────────────────────────── */}
      <footer style={{
        padding: '30px 60px',
        background: '#1F1A13',
        color: '#FAF8F4',
        borderTop: '1px solid rgba(250, 248, 244, 0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        fontSize: '11px',
        opacity: 0.8
      }}>
        <span>© {new Date().getFullYear()} PRIME-AI. Infrastructure Cognitive Souveraine.</span>
        <div style={{ display: 'flex', gap: '24px' }}>
          <Link to="/yace-aura" style={{ color: 'inherit', textDecoration: 'none' }}>Sovereign OS</Link>
          <Link to="/vision" style={{ color: '#C6A15A', textDecoration: 'none', fontWeight: 'bold' }}>Vision Node</Link>
          <Link to="/technologie" style={{ color: 'inherit', textDecoration: 'none' }}>Technologie</Link>
          <Link to="/ecosysteme" style={{ color: 'inherit', textDecoration: 'none' }}>Écosystème</Link>
        </div>
      </footer>
    </div>
  );
}
