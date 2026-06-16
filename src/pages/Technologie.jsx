import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Technologie() {
  const [activeTab, setActiveTab] = useState('mesh');
  const [hudScan, setHudScan] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setHudScan(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const technologies = {
    mesh: {
      title: "Réseau de Neurones Décentralisé",
      description: "Notre architecture de communication en maillage P2P permet aux agents cognitifs de délibérer de manière distribuée sans point de défaillance unique.",
      features: [
        "Consensus synchrone décentralisé",
        "Zéro dépendance vis-à-vis des serveurs tiers",
        "Routage adaptatif à ultra-faible latence"
      ],
      metric: "Consensus 99.999% convergent"
    },
    inference: {
      title: "Moteurs d'Inférence Locaux",
      description: "Exécution locale optimisée de modèles ouverts (Llama, Gemma, Mistral) sur votre matériel propriétaire avec isolation complète des données.",
      features: [
        "Quantification avancée sans perte de précision",
        "Orchestration dynamique CPU / GPU / NPU",
        "Chiffrement matériel de bout en bout"
      ],
      metric: "< 12ms premier-token latence"
    },
    alignment: {
      title: "Alignement Cognitif Souverain",
      description: "Protocoles avancés de guidage et d'alignement éthique personnalisés. Votre intelligence artificielle pense selon vos valeurs et règles métier.",
      features: [
        "Supervision constitutionnelle en temps réel",
        "Filtrage sémantique des données sensibles",
        "Mémoire sémantique persistante cryptée"
      ],
      metric: "100% aligné sur vos directives"
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

        .tech-tab {
          padding: 14px 28px;
          border-radius: 100px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s;
          border: 1px solid rgba(198, 161, 90, 0.15);
          background: rgba(255, 255, 255, 0.5);
          color: #656059;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .tech-tab.active {
          background: #1F1A13;
          color: #FAF8F4;
          border-color: #1F1A13;
          box-shadow: 0 8px 20px rgba(31, 26, 19, 0.1);
        }

        .tech-card {
          background: #FFFFFF;
          border: 1px solid rgba(198, 161, 90, 0.2);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 15px 40px rgba(198, 161, 90, 0.04);
          transition: all 0.4s;
        }

        @keyframes rotateMesh {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .mesh-rotating {
          animation: rotateMesh 50s linear infinite;
        }

        @media (max-width: 1024px) {
          .tech-split { flex-direction: column !important; gap: 40px !important; }
          .tech-tabs { justify-content: center !important; }
        }
      `}</style>

      {/* ── HEADER HERO ─────────────────────────────────── */}
      <section style={{
        padding: 'clamp(40px, 8vw, 80px) clamp(16px, 5vw, 60px) 60px',
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
            TECHNOLOGIE PRIME-AI
          </span>
        </div>

        <h1 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '48px',
          fontWeight: '800',
          lineHeight: '1.2',
          color: '#1F1A13',
          marginBottom: '24px',
          letterSpacing: '-1px'
        }}>
          La Puissance de l'IA Souveraine.<br />
          <span style={{
            background: 'linear-gradient(90deg, #C6A15A 0%, #E6C587 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Contrôlée, Privée et Performante.</span>
        </h1>

        <p style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '16px',
          lineHeight: '1.65',
          color: '#656059',
          marginBottom: '40px',
          maxWidth: '680px',
          margin: '0 auto 40px'
        }}>
          PRIME-AI repense l'architecture d'intelligence artificielle. Plus besoin de dépendre d'API centralisées opaques : déployez vos propres cerveaux numériques.
        </p>

        {/* Tab Selectors */}
        <div className="tech-tabs" style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '60px', flexWrap: 'wrap' }}>
          <button className={`tech-tab ${activeTab === 'mesh' ? 'active' : ''}`} onClick={() => setActiveTab('mesh')}>
            Réseau Multi-Agent
          </button>
          <button className={`tech-tab ${activeTab === 'inference' ? 'active' : ''}`} onClick={() => setActiveTab('inference')}>
            Inférence Locale
          </button>
          <button className={`tech-tab ${activeTab === 'alignment' ? 'active' : ''}`} onClick={() => setActiveTab('alignment')}>
            Alignement Souverain
          </button>
        </div>
      </section>

      {/* ── CORE TECH DETAILS ───────────────────────────── */}
      <section style={{
        padding: '0 clamp(16px, 5vw, 60px) clamp(60px, 10vw, 100px)',
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative'
      }}>
        <div className="tech-split" style={{ display: 'flex', gap: '60px', alignItems: 'center' }}>
          {/* Visual Area */}
          <div style={{ flex: '1', display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div style={{
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(198, 161, 90, 0.05) 0%, transparent 70%)',
              position: 'absolute'
            }} />

            <svg className="mesh-rotating" width="300" height="300" viewBox="0 0 300 300" style={{ opacity: 0.3 }}>
              <circle cx="150" cy="150" r="130" fill="none" stroke="#C6A15A" strokeWidth="1" strokeDasharray="20 15 5 25" />
              <circle cx="150" cy="150" r="100" fill="none" stroke="#C6A15A" strokeWidth="0.5" strokeDasharray="5 5" />
              <line x1="150" y1="20" x2="150" y2="280" stroke="rgba(198, 161, 90, 0.15)" strokeWidth="1" />
              <line x1="20" y1="150" x2="280" y2="150" stroke="rgba(198, 161, 90, 0.15)" strokeWidth="1" />
            </svg>

            <div style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '2px solid #C6A15A',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(198, 161, 90, 0.1)',
              position: 'relative',
              zIndex: 5
            }}>
              <span style={{ fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: '#C6A15A', fontWeight: 'bold' }}>METRIC</span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#1F1A13', textAlign: 'center', padding: '0 10px', marginTop: '4px' }}>
                {technologies[activeTab].metric}
              </span>
            </div>
          </div>

          {/* Details Area */}
          <div style={{ flex: '1.2' }}>
            <div className="tech-card">
              <h2 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '28px',
                fontWeight: '700',
                color: '#1F1A13',
                marginBottom: '20px'
              }}>
                {technologies[activeTab].title}
              </h2>

              <p style={{
                fontSize: '15px',
                lineHeight: '1.65',
                color: '#656059',
                marginBottom: '30px'
              }}>
                {technologies[activeTab].description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '35px' }}>
                {technologies[activeTab].features.map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: 'rgba(198, 161, 90, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#C6A15A',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}>✓</div>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1F1A13' }}>{feat}</span>
                  </div>
                ))}
              </div>

              <Link to="/yace-aura" className="prime-button-dark">
                Tester le Système ⚡
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TECHNICAL SPECIFICATION GRID ────────────────── */}
      <section style={{
        background: '#FAF8F4',
        borderTop: '1px solid rgba(198, 161, 90, 0.15)',
        padding: '80px 60px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1F1A13' }}>Spécifications de l'Architecture Cognitive</h2>
            <p style={{ fontSize: '14px', color: '#6E6860', marginTop: '8px' }}>Notre stack technologique repose sur des bases cryptographiques et sémantiques strictes.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              { title: "Zéro Partage de Données", desc: "Vos prompts, logs de raisonnement et mémoires locales ne transitent jamais par des services cloud tiers." },
              { title: "Adaptative Model Swarm", desc: "Routage dynamique intelligent entre modèles légers ultra-rapides et modèles de raisonnement profonds." },
              { title: "Structure Graph Semantics", desc: "Indexation vectorielle hiérarchique et graphe de connaissances locales connectant en continu toutes vos données." }
            ].map((spec, i) => (
              <div key={i} style={{ background: '#FFFFFF', border: '1px solid rgba(198, 161, 90, 0.12)', borderRadius: '16px', padding: '28px' }}>
                <h3 style={{ fontWeight: '700', fontSize: '16px', color: '#1F1A13', marginBottom: '10px' }}>{spec.title}</h3>
                <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#6E6860' }}>{spec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
