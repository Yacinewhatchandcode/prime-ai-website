import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Vision() {
  const [hudScan, setHudScan] = useState(true);
  const [hudLogs, setHudLogs] = useState([
    "Ingesting digital memory nodes... OK",
    "Sync status: 100% synchronized",
    "Cognitive bridge established... OK",
  ]);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // HUD Blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setHudScan(prev => !prev);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Soft random HUD logs update for realism
  useEffect(() => {
    const logs = [
      "Vector index compression completed",
      "Sovereign node validation: 100% Trust",
      "Active agents: 8 online / decentralized",
      "Ambient memory buffer optimized (+120ms)",
      "Local intelligence pipeline active"
    ];
    const logInterval = setInterval(() => {
      const randomLog = logs[Math.floor(Math.random() * logs.length)];
      const timestamp = new Date().toLocaleTimeString('fr-FR', { hour12: false });
      setHudLogs(prev => [
        `[${timestamp}] ${randomLog}`,
        prev[0],
        prev[1]
      ].slice(0, 3));
    }, 4000);
    return () => clearInterval(logInterval);
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setErrorMsg("");
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSubscribed(true);
        setTimeout(() => setSubscribed(false), 3000);
        setEmail("");
      } else {
        setErrorMsg(data.error || "Une erreur est survenue.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Erreur réseau. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'hidden' }}>
      <style>{`
        .prime-button-dark {
          background: #1F1A13;
          color: #FAF8F4;
          border: 1px solid #1F1A13;
          padding: 12px 28px;
          border-radius: 100px;
          font-weight: 600;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          text-decoration: none;
          letter-spacing: 0.5px;
        }
        .prime-button-dark:hover {
          background: #3D3528;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(31, 26, 19, 0.15);
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
        
        .prime-button-gold {
          background: #C6A15A;
          color: #FAF8F4;
          border: none;
          padding: 14px 32px;
          border-radius: 100px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 15px rgba(198, 161, 90, 0.25);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .prime-button-gold:hover {
          background: #B48F47;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(198, 161, 90, 0.4);
        }

        .prime-button-gold-sm {
          background: #C6A15A;
          color: #FAF8F4;
          border: none;
          padding: 10px 20px;
          border-radius: 100px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .prime-button-gold-sm:hover {
          background: #B48F47;
          transform: translateY(-1px);
        }
        
        .feature-card {
          padding: 30px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 16px;
        }
        .feature-card:hover {
          background: rgba(255, 255, 255, 0.6);
          transform: translateY(-4px);
          box-shadow: 0 15px 40px rgba(198, 161, 90, 0.06);
        }

        .ecosystem-card {
          background: rgba(255, 255, 255, 0.4);
          border: 1px solid rgba(198, 161, 90, 0.08);
          border-radius: 20px;
          padding: 28px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .ecosystem-card:hover {
          background: #FFFFFF;
          border-color: rgba(198, 161, 90, 0.25);
          transform: translateY(-6px);
          box-shadow: 0 20px 45px rgba(198, 161, 90, 0.08);
        }

        .hud-log-line {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #6E6860;
          margin-bottom: 6px;
          border-left: 2px solid #C6A15A;
          padding-left: 8px;
        }

        @keyframes rotateMesh {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes rotateMeshReverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes pulseGlow {
          0% { opacity: 0.15; transform: scale(0.95); }
          50% { opacity: 0.35; transform: scale(1.05); }
          100% { opacity: 0.15; transform: scale(0.95); }
        }

        .mesh-rotating {
          animation: rotateMesh 45s linear infinite;
        }
        .mesh-rotating-rev {
          animation: rotateMeshReverse 25s linear infinite;
        }
        .mesh-pulse {
          animation: pulseGlow 4s ease-in-out infinite;
        }

        .glow-temple {
          position: absolute;
          width: 14px;
          height: 14px;
          background: #C6A15A;
          border-radius: 50%;
          box-shadow: 0 0 15px #C6A15A, 0 0 30px #C6A15A;
          z-index: 10;
        }
        .glow-temple-ring {
          position: absolute;
          width: 32px;
          height: 32px;
          border: 1px solid rgba(198, 161, 90, 0.6);
          border-radius: 50%;
          animation: pulseGlow 2s ease-out infinite;
          top: -9px;
          left: -9px;
          pointer-events: none;
        }

        .input-newsletter {
          background: #FCFAF6;
          border: 1px solid rgba(31, 26, 19, 0.12);
          border-radius: 100px;
          padding: 12px 24px;
          font-size: 14px;
          width: 100%;
          max-width: 280px;
          color: #1F1A13;
          outline: none;
          transition: all 0.3s;
        }
        .input-newsletter:focus {
          border-color: #C6A15A;
          box-shadow: 0 0 0 3px rgba(198, 161, 90, 0.15);
        }

        /* Responsive layout queries */
        @media (max-width: 1024px) {
          .hero-split { flex-direction: column-reverse !important; gap: 40px !important; }
          .hero-left { text-align: center !important; }
          .hero-left .btn-container { justify-content: center !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .feature-card { text-align: center !important; border-right: none !important; border-bottom: 1px solid rgba(198, 161, 90, 0.12) !important; }
          .feature-card:last-child { border-bottom: none !important; }
          .feature-icon-wrapper { margin: 0 auto 16px !important; }
          .aug-split { flex-direction: column !important; text-align: center !important; }
          .aug-link { justify-content: center !important; }
          .ecosystem-grid { grid-template-columns: 1fr 1fr !important; }
          .newsletter-split { flex-direction: column !important; gap: 40px !important; text-align: center !important; }
          .newsletter-inputs { justify-content: center !important; }
        }

        @media (max-width: 640px) {
          .ecosystem-grid { grid-template-columns: 1fr !important; }
          .main-heading { font-size: 38px !important; }
        }
      `}</style>

      {/* ── HERO SECTION ─────────────────────────────────── */}
      <section style={{
        padding: 'clamp(40px, 6vw, 60px) clamp(16px, 5vw, 60px) clamp(60px, 10vw, 100px)',
        maxWidth: '1300px',
        margin: '0 auto',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '5%',
          width: '50%',
          height: '110%',
          backgroundImage: 'radial-gradient(circle, rgba(198, 161, 90, 0.03) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          maskImage: 'radial-gradient(circle, black, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle, black, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="hero-split" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '80px',
          position: 'relative',
        }}>
          {/* Hero Left Content */}
          <div className="hero-left" style={{ flex: '1.1', zIndex: 10 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px',
            }}>
              <span style={{ width: '6px', height: '6px', background: '#C6A15A', borderRadius: '50%' }} />
              <span style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: '700',
                fontSize: '11px',
                color: '#C6A15A',
                letterSpacing: '3px',
                textTransform: 'uppercase'
              }}>
                INFRASTRUCTURE COGNITIVE SOUVERAINE
              </span>
            </div>

            <h1 className="main-heading" style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '56px',
              fontWeight: '800',
              lineHeight: '1.12',
              color: '#1F1A13',
              marginBottom: '28px',
              letterSpacing: '-1.5px',
            }}>
              Intelligence,<br />
              <span style={{
                background: 'linear-gradient(90deg, #C6A15A 0%, #E6C587 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '800',
              }}>conçue pour penser avec vous.</span>
            </h1>

            <p style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '16px',
              lineHeight: '1.65',
              color: '#656059',
              marginBottom: '40px',
              maxWidth: '520px',
            }}>
              PRIME-AI orchestre des systèmes multi-agents souverains pour amplifier votre cognition et développer votre impact.
            </p>

            <div className="btn-container" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Link to="/technologie" className="prime-button-dark">
                Découvrir PRIME-AI <span style={{ fontSize: '16px' }}>→</span>
              </Link>
            </div>
          </div>

          {/* Hero Right Visuals */}
          <div className="hero-right" style={{
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}>
            <div style={{
              position: 'relative',
              width: '380px',
              height: '380px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div className="mesh-pulse" style={{
                position: 'absolute',
                width: '340px',
                height: '340px',
                background: 'radial-gradient(circle, rgba(198, 161, 90, 0.08) 0%, transparent 70%)',
                borderRadius: '50%',
              }} />

              <svg className="mesh-rotating" width="360" height="360" viewBox="0 0 360 360" style={{ position: 'absolute', opacity: 0.25 }}>
                <circle cx="180" cy="180" r="160" fill="none" stroke="#C6A15A" strokeWidth="1" strokeDasharray="30 20 10 40 100 20" />
                <circle cx="180" cy="180" r="140" fill="none" stroke="#C6A15A" strokeWidth="0.5" strokeDasharray="10 10" />
              </svg>

              <svg className="mesh-rotating-rev" width="360" height="360" viewBox="0 0 360 360" style={{ position: 'absolute', opacity: 0.15 }}>
                <circle cx="180" cy="180" r="150" fill="none" stroke="#C6A15A" strokeWidth="1" strokeDasharray="10 30 15 15" />
                <circle cx="180" cy="180" r="120" fill="none" stroke="#1F1A13" strokeWidth="0.75" strokeDasharray="2 6" />
              </svg>

              <div style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: '#FCFAF6',
                border: '1.5px solid rgba(198, 161, 90, 0.3)',
                boxShadow: '0 10px 30px rgba(198, 161, 90, 0.1), inset 0 2px 10px rgba(198, 161, 90, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 2,
              }}>
                <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 15L85 75H70L50 40L30 75H15L50 15Z" fill="url(#gradient-emblem)" />
                  <path d="M50 35L62 58H38L50 35Z" fill="#1F1A13" opacity="0.8" />
                  <defs>
                    <linearGradient id="gradient-emblem" x1="50" y1="15" x2="50" y2="75" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#C6A15A" />
                      <stop offset="1" stopColor="#9C7730" />
                    </linearGradient>
                  </defs>
                </svg>

                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '1px solid rgba(198, 161, 90, 0.1)',
                  animation: 'rotateMesh 12s linear infinite'
                }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    background: '#C6A15A',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    boxShadow: '0 0 8px #C6A15A'
                  }} />
                </div>
              </div>
            </div>

            <div style={{
              background: '#FFFFFF',
              border: '1px solid rgba(198, 161, 90, 0.2)',
              boxShadow: '0 12px 35px rgba(198, 161, 90, 0.07)',
              borderRadius: '12px',
              padding: '16px 20px',
              width: '280px',
              marginTop: '-20px',
              position: 'relative',
              zIndex: 10,
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(198, 161, 90, 0.1)',
                paddingBottom: '8px',
                marginBottom: '10px'
              }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: '700',
                  fontSize: '9px',
                  letterSpacing: '1px',
                  color: '#1F1A13'
                }}>COGNITIVE_HUD_v2.0</span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '9px',
                    fontWeight: '700',
                    color: '#C6A15A'
                  }}>SCAN</span>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    background: '#C6A15A',
                    borderRadius: '50%',
                    display: 'inline-block',
                    opacity: hudScan ? 1 : 0.2,
                    transition: 'opacity 0.2s',
                    boxShadow: '0 0 6px #C6A15A'
                  }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {hudLogs.map((log, i) => (
                  <div key={i} className="hud-log-line" style={{
                    opacity: 1 - i * 0.25,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRIPLE CORE FEATURES ROW ─────────────────────── */}
      <section style={{
        borderTop: '1px solid rgba(198, 161, 90, 0.15)',
        borderBottom: '1px solid rgba(198, 161, 90, 0.15)',
        background: 'rgba(255, 255, 255, 0.25)',
      }}>
        <div className="features-grid" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
        }}>
          <div className="feature-card" style={{ borderRight: '1px solid rgba(198, 161, 90, 0.12)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div className="feature-icon-wrapper" style={{
                width: '42px', height: '42px', borderRadius: '50%',
                background: 'rgba(198, 161, 90, 0.08)', border: '1px solid rgba(198, 161, 90, 0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C6A15A',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <span style={{ fontWeight: '700', fontSize: '13px', letterSpacing: '2px', color: '#1F1A13', textTransform: 'uppercase' }}>✦ MEMORY</span>
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#656059' }}>Cognition persistante. Sauvegarde sémantique autonome.</p>
          </div>

          <div className="feature-card" style={{ borderRight: '1px solid rgba(198, 161, 90, 0.12)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div className="feature-icon-wrapper" style={{
                width: '42px', height: '42px', borderRadius: '50%',
                background: 'rgba(198, 161, 90, 0.08)', border: '1px solid rgba(198, 161, 90, 0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C6A15A',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                  <path d="M19 13a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                  <path d="M5 13a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                  <line x1="12" y1="8" x2="19" y2="13" />
                  <line x1="12" y1="8" x2="5" y2="13" />
                  <line x1="5" y1="16" x2="19" y2="16" />
                </svg>
              </div>
              <span style={{ fontWeight: '700', fontSize: '13px', letterSpacing: '2px', color: '#1F1A13', textTransform: 'uppercase' }}>✦ ORCHESTRATION</span>
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#656059' }}>Des systèmes qui pensent ensemble. Multi-agents collaboratifs synchrones.</p>
          </div>

          <div className="feature-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div className="feature-icon-wrapper" style={{
                width: '42px', height: '42px', borderRadius: '50%',
                background: 'rgba(198, 161, 90, 0.08)', border: '1px solid rgba(198, 161, 90, 0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C6A15A',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <span style={{ fontWeight: '700', fontSize: '13px', letterSpacing: '2px', color: '#1F1A13', textTransform: 'uppercase' }}>✦ TRUST</span>
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#656059' }}>Votre infrastructure. Votre intelligence. Privacy by design sans compromis.</p>
          </div>
        </div>
      </section>

      {/* ── AUGMENTED HUMAN SECTION ──────────────────────── */}
      <section style={{ padding: 'clamp(50px, 10vw, 100px) clamp(16px, 5vw, 60px)', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="aug-split" style={{ display: 'flex', alignItems: 'center', gap: '80px' }}>
          <div style={{ flex: '1.2' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <span style={{ width: '6px', height: '6px', background: '#C6A15A', borderRadius: '50%' }} />
              <span style={{ fontWeight: '700', fontSize: '11px', color: '#C6A15A', letterSpacing: '3px', textTransform: 'uppercase' }}>AUGMENTED HUMAN</span>
            </div>

            <h2 style={{ fontSize: '44px', fontWeight: '800', lineHeight: '1.2', color: '#1F1A13', marginBottom: '24px', letterSpacing: '-1px' }}>
              Votre cognition.<br /><span style={{ color: '#C6A15A' }}>Augmentée.</span>
            </h2>

            <p style={{ fontSize: '15px', lineHeight: '1.65', color: '#656059', marginBottom: '32px', maxWidth: '460px' }}>
              Libérez votre esprit des contraintes d'exécution. PRIME-AI gère la complexité technique, l'alignement des modèles et les pipelines de traitement de données en arrière-plan.
            </p>

            <Link to="/memory" className="aug-link" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#1F1A13', fontWeight: '700', fontSize: '14px', textDecoration: 'none', transition: 'color 0.3s'
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#C6A15A'}
              onMouseLeave={e => e.currentTarget.style.color = '#1F1A13'}
            >
              En savoir plus <span style={{ fontSize: '18px' }}>→</span>
            </Link>
          </div>

          <div style={{ flex: '1', display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div className="mesh-pulse" style={{
              position: 'absolute', width: '420px', height: '420px', background: 'radial-gradient(circle, rgba(198, 161, 90, 0.05) 0%, transparent 70%)', top: '-60px', borderRadius: '50%', pointerEvents: 'none'
            }} />

            <div style={{
              position: 'relative', width: '320px', height: '380px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(31, 26, 19, 0.08)', border: '4px solid #FFFFFF', background: '#EAE5DB'
            }}>
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600"
                alt="Augmented Human Cognition"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.3) sepia(0.15) contrast(1.05)', opacity: 0.95, transform: 'scaleX(-1)' }}
              />

              <div className="glow-temple" style={{ top: '40%', left: '62%' }}>
                <div className="glow-temple-ring" />
                <svg width="60" height="60" style={{ position: 'absolute', top: '-20px', left: '-20px', pointerEvents: 'none', opacity: 0.8 }}>
                  <path d="M 27 27 L 10 10 L 0 10" fill="none" stroke="#C6A15A" strokeWidth="1" strokeDasharray="3 3" />
                  <path d="M 27 27 L 45 45" fill="none" stroke="#C6A15A" strokeWidth="1" />
                  <circle cx="10" cy="10" r="2.5" fill="#C6A15A" />
                  <circle cx="45" cy="45" r="2" fill="#C6A15A" />
                </svg>
              </div>

              <div style={{
                position: 'absolute', bottom: '0', left: '0', right: '0', background: 'linear-gradient(to top, rgba(31,26,19,0.7) 0%, rgba(31,26,19,0) 100%)', padding: '24px', color: '#FAF8F4'
              }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '1px', color: '#C6A15A', textTransform: 'uppercase', marginBottom: '4px' }}>INTERFACE COGNITIVE v1.8</div>
                <div style={{ fontWeight: '600', fontSize: '13px', opacity: 0.9 }}>Synchronisation neuronale active</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ECOSYSTEM SECTION ────────────────────────────── */}
      <section style={{
        background: 'rgba(198, 161, 90, 0.03)', padding: 'clamp(50px, 10vw, 100px) clamp(16px, 5vw, 60px)', borderTop: '1px solid rgba(198, 161, 90, 0.1)', borderBottom: '1px solid rgba(198, 161, 90, 0.1)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ width: '6px', height: '6px', background: '#C6A15A', borderRadius: '50%' }} />
              <span style={{ fontWeight: '700', fontSize: '11px', color: '#C6A15A', letterSpacing: '3px', textTransform: 'uppercase' }}>ÉCOSYSTEME PRIME-AI</span>
            </div>
            <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#1F1A13', letterSpacing: '-0.5px' }}>Une intelligence présente partout où vous avancez.</h2>
          </div>

          <div className="ecosystem-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            <div className="ecosystem-card">
              <div style={{ color: '#C6A15A', marginBottom: '20px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <h3 style={{ fontWeight: '700', fontSize: '15px', marginBottom: '10px', color: '#1F1A13' }}>MAC / WINDOWS</h3>
              <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#6E6860' }}>Desktop App.<br />Sovereign desktop integration.</p>
            </div>

            <div className="ecosystem-card">
              <div style={{ color: '#C6A15A', marginBottom: '20px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
              <h3 style={{ fontWeight: '700', fontSize: '15px', marginBottom: '10px', color: '#1F1A13' }}>MOBILE</h3>
              <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#6E6860' }}>iOS / Android.<br />Real-time voice and cognitive bridge.</p>
            </div>

            <div className="ecosystem-card">
              <div style={{ color: '#C6A15A', marginBottom: '20px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="4 17 10 11 4 5" />
                  <line x1="12" y1="19" x2="20" y2="19" />
                </svg>
              </div>
              <h3 style={{ fontWeight: '700', fontSize: '15px', marginBottom: '10px', color: '#1F1A13' }}>PRIME-CLI</h3>
              <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#6E6860' }}>Local & Remote Control.<br />Direct prompt-to-terminal interface.</p>
            </div>

            <div className="ecosystem-card">
              <div style={{ color: '#C6A15A', marginBottom: '20px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 10v4" />
                  <path d="M12 18h.01" />
                  <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
                  <rect x="9" y="14" width="6" height="6" rx="1" />
                </svg>
              </div>
              <h3 style={{ fontWeight: '700', fontSize: '15px', marginBottom: '10px', color: '#1F1A13' }}>PRIVATE CLOUD</h3>
              <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#6E6860' }}>Sovereign Infrastructure.<br />Encrypted hosting and local pipelines.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SYSTEM BRIEFING & NEWSLETTER BAR ──────────────── */}
      <section style={{ padding: 'clamp(40px, 8vw, 80px) clamp(16px, 5vw, 60px)', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="newsletter-split" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '60px' }}>
          <div style={{ flex: '1', maxWidth: '420px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(198, 161, 90, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C6A15A'
              }}>
                <span style={{ fontWeight: '800', fontSize: '13px' }}>▲</span>
              </div>
              <span style={{ fontWeight: '800', fontSize: '15px', letterSpacing: '2px', color: '#1F1A13' }}>PRIME-AI</span>
            </div>

            <p style={{ fontSize: '20px', fontWeight: '600', lineHeight: '1.4', color: '#1F1A13', marginBottom: '32px' }}>
              PRIME-AI n'est pas un outil.<br /><span style={{ color: '#C6A15A' }}>C'est votre avantage cognitif.</span>
            </p>

            <Link to="/ecosysteme" className="prime-button-dark">
              Rejoindre l'écosystème <span style={{ fontSize: '16px' }}>→</span>
            </Link>
          </div>

          <div style={{
            flex: '1.2', background: '#FFFFFF', border: '1px solid rgba(198, 161, 90, 0.15)', borderRadius: '24px', padding: '36px', boxShadow: '0 15px 40px rgba(198, 161, 90, 0.04)'
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ width: '6px', height: '6px', background: '#C6A15A', borderRadius: '50%' }} />
              <span style={{ fontWeight: '700', fontSize: '10px', color: '#C6A15A', letterSpacing: '2px', textTransform: 'uppercase' }}>SYSTEM BRIEFING</span>
            </div>

            <h3 style={{ fontWeight: '700', fontSize: '15px', color: '#1F1A13', marginBottom: '10px' }}>Stay ahead of the curve.</h3>
            <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#6E6860', marginBottom: '28px' }}>Get notified about new sovereign updates, autonomous features, and exclusive architecture briefs.</p>

            <form onSubmit={handleSubscribe} className="newsletter-inputs" style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="email" placeholder="satoshi@example.com" value={email} onChange={e => setEmail(e.target.value)} className="input-newsletter" disabled={submitting} required
              />
              <button type="submit" className="prime-button-gold-sm" disabled={submitting}>
                {submitting ? "Envoi..." : subscribed ? "Inscrit !" : "Subscribe"}
              </button>
            </form>
            {errorMsg && (
              <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px', fontFamily: 'monospace' }}>
                ⚠️ {errorMsg}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── LOWER BANNER SECTION ─────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #1F1A13 0%, #3D3528 100%)', color: '#FAF8F4', padding: 'clamp(40px, 8vw, 80px) clamp(16px, 5vw, 60px)', position: 'relative', overflow: 'hidden'
      }}>
        <div className="mesh-pulse" style={{
          position: 'absolute', width: '500px', height: '500px', border: '1px solid rgba(250, 248, 244, 0.03)', borderRadius: '50%', top: '-150px', right: '-150px', pointerEvents: 'none'
        }} />

        <div style={{
          maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '40px', position: 'relative', zIndex: 10
        }}>
          <div style={{ maxWidth: '600px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px', letterSpacing: '-0.5px' }}>Deploy Your Sovereign Fleet Today.</h2>
            <p style={{ fontSize: '14px', lineHeight: '1.65', opacity: 0.7 }}>AI is not a SaaS vendor lock-in. It is a secure, decentralized infrastructure. Own your intelligence.</p>
          </div>

          <div>
            <a href="#deploy" className="prime-button-gold" onClick={(e) => { e.preventDefault(); alert("Fleet dispatching initialisé."); }}>
              Deploy Sovereign Intelligence <span style={{ fontSize: '18px' }}>→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
