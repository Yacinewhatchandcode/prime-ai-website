import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Ecosysteme() {
  const [activeNode, setActiveNode] = useState(null);

  const nodes = [
    {
      id: 'desktop',
      title: "PRIME-Desktop (macOS / Windows)",
      platform: "Application native multi-plateforme",
      description: "L'épine dorsale de votre workflow quotidien. Capturez, organisez et raisonnez en continu avec une synchronisation locale transparente avec votre système de fichiers.",
      specs: ["Superposition d'interface HUD", "Intégration d'outils système", "Base de données vectorielle intégrée"],
      color: "#C6A15A"
    },
    {
      id: 'mobile',
      title: "PRIME-Mobile (iOS / Android)",
      platform: "Pont cognitif vocal",
      description: "Votre compagnon d'intelligence nomade. Accès vocal ultra-rapide en temps réel, transcription automatique chiffrée et synchronisation asynchrone des sessions de réflexion.",
      specs: ["Synthèse/Reconnaissance vocale locale", "Chiffrement AES-256", "Notifications push d'action"],
      color: "#3D3528"
    },
    {
      id: 'cli',
      title: "PRIME-CLI",
      platform: "Interface développeurs",
      description: "Pour les ingénieurs et administrateurs. Contrôlez votre flotte d'agents souverains directement depuis votre terminal ou intégrez-les à vos scripts d'automatisation.",
      specs: ["Support du JSON-RPC", "Mode batch parallèle", "Gestionnaire de profils configurables"],
      color: "#1F1A13"
    },
    {
      id: 'cloud',
      title: "PRIME-Private Cloud",
      platform: "Infrastructure d'entreprise",
      description: "Votre cloud privé entièrement autonome. Hébergez vos serveurs d'inférence, de messagerie sécurisée et de traitement de données lourdes sans dépendre d'Amazon ou Google.",
      specs: ["Cluster Kubernetes souverain", "Gestion de clés cryptographiques", "monitoring de télémétrie local"],
      color: "#E6C587"
    }
  ];

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
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

        .eco-card {
          background: #FFFFFF;
          border: 1px solid rgba(198, 161, 90, 0.15);
          border-radius: 20px;
          padding: 32px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }
        .eco-card:hover {
          transform: translateY(-5px);
          border-color: #C6A15A;
          box-shadow: 0 15px 40px rgba(198, 161, 90, 0.08);
        }
        .eco-card.active {
          border-color: #C6A15A;
          background: rgba(198, 161, 90, 0.03);
          box-shadow: 0 15px 40px rgba(198, 161, 90, 0.08);
        }

        @keyframes pulseDot {
          0% { transform: scale(0.9); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.5; }
        }
        .pulse-dot {
          animation: pulseDot 3s ease-in-out infinite;
        }

        @media (max-width: 1024px) {
          .eco-grid { grid-template-columns: 1fr !important; }
          .detail-split { flex-direction: column !important; }
        }
      `}</style>

      {/* ── HEADER HERO ─────────────────────────────────── */}
      <section style={{
        padding: 'clamp(40px, 8vw, 80px) clamp(16px, 5vw, 60px) 40px',
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        textAlign: 'center'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <span style={{ width: '6px', height: '6px', background: '#C6A15A', borderRadius: '50%' }} />
          <span style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: '700',
            fontSize: '11px',
            color: '#C6A15A',
            letterSpacing: '3px',
            textTransform: 'uppercase'
          }}>
            L'ÉCOSYSTEME GLOBAL PRIME-AI
          </span>
        </div>

        <h1 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '46px',
          fontWeight: '800',
          lineHeight: '1.2',
          color: '#1F1A13',
          marginBottom: '24px',
          letterSpacing: '-1px'
        }}>
          Une Flotte d'Agents Déployée<br />
          <span style={{
            background: 'linear-gradient(90deg, #C6A15A 0%, #E6C587 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Partout où vous créez et décidez.</span>
        </h1>

        <p style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '16px',
          lineHeight: '1.65',
          color: '#656059',
          marginBottom: '50px',
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          Du bureau jusqu'au cloud souverain de votre entreprise, PRIME-AI maintient une synchronisation de votre contexte et de votre mémoire à 100% de manière autonome.
        </p>
      </section>

      {/* ── INTERACTIVE GRID & MAP ─────────────────────── */}
      <section style={{
        padding: '0 clamp(16px, 5vw, 60px) clamp(40px, 8vw, 80px)',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div className="eco-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '24px',
          marginBottom: '50px'
        }}>
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`eco-card ${activeNode === node.id ? 'active' : ''}`}
              onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                  color: '#C6A15A',
                  fontWeight: '700'
                }}>
                  {node.platform}
                </span>
                <span className="pulse-dot" style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: node.color,
                  boxShadow: `0 0 10px ${node.color}`
                }} />
              </div>

              <h2 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#1F1A13',
                marginBottom: '12px'
              }}>
                {node.title}
              </h2>

              <p style={{
                fontSize: '14px',
                lineHeight: '1.55',
                color: '#6E6860',
                marginBottom: '20px'
              }}>
                {node.description}
              </p>

              {activeNode === node.id && (
                <div style={{
                  borderTop: '1px solid rgba(198, 161, 90, 0.15)',
                  paddingTop: '16px',
                  marginTop: '16px'
                }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#1F1A13', marginBottom: '8px' }}>Fonctionnalités Clés :</h4>
                  <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '13px', color: '#656059', lineHeight: '1.6' }}>
                    {node.specs.map((spec, index) => (
                      <li key={index} style={{ marginBottom: '4px' }}>{spec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/yace-aura" className="prime-button-dark">
            Consulter l'Infrastructure Centrale (Console OS) <span style={{ marginLeft: '6px' }}>⚡</span>
          </Link>
        </div>
      </section>

      {/* ── SOVEREIGN FLEET PROTOCOLS ───────────────────── */}
      <section style={{
        background: '#FAF8F4',
        borderTop: '1px solid rgba(198, 161, 90, 0.15)',
        padding: '80px 60px'
      }}>
        <div className="detail-split" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '60px', alignItems: 'center' }}>
          <div style={{ flex: '1.2' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#1F1A13', marginBottom: '20px', letterSpacing: '-0.5px' }}>
              Comment fonctionne la synchronisation asynchrone ?
            </h2>
            <p style={{ fontSize: '15px', lineHeight: '1.65', color: '#6E6860', marginBottom: '24px' }}>
              Grâce à notre protocole P2P crypté, chaque nœud de votre écosystème conserve un cache local optimisé. Lorsque vous connectez votre mobile ou votre client desktop, les deltas de modifications sémantiques sont échangés de manière sécurisée sans jamais passer par un serveur cloud public centralisé.
            </p>
            <p style={{ fontSize: '15px', lineHeight: '1.65', color: '#6E6860' }}>
              Cela vous assure une indépendance absolue et un temps d'accès record, même en mode hors ligne complet.
            </p>
          </div>

          <div style={{ flex: '1', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid rgba(198, 161, 90, 0.25)',
              borderRadius: '24px',
              padding: '30px',
              width: '100%',
              maxWidth: '380px',
              boxShadow: '0 15px 45px rgba(198, 161, 90, 0.04)'
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                color: '#C6A15A',
                fontWeight: 'bold',
                marginBottom: '16px',
                borderBottom: '1px solid rgba(198, 161, 90, 0.15)',
                paddingBottom: '8px'
              }}>
                SYNCHRONIZATION_SCHEDULER
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: "Nœud Bureau (macOS)", status: "Synchronisé", color: "#10b981" },
                  { label: "Nœud Mobile (iOS)", status: "Synchronisé", color: "#10b981" },
                  { label: "Nœud CLI local", status: "Synchronisé", color: "#10b981" },
                  { label: "Cloud Privé", status: "En attente de ping (veille)", color: "#f59e0b" }
                ].map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#1F1A13' }}>{item.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.color }} />
                      <span style={{ fontSize: '11px', color: '#6E6860', fontFamily: "'JetBrains Mono', monospace" }}>{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
