import { useState, useEffect, useRef } from 'react';
import { Beaker, Dna, GitBranch, Cpu, BarChart3, ArrowRight, Play, Pause, RefreshCw, Zap, Activity, Database, Globe, ChevronRight, Layers } from 'lucide-react';

const RESEARCH_TRACKS = [
  { id: 'nlp', name: 'NLP Consensus Models', domain: 'Language Understanding', progress: 72, status: 'evolving', papers: 14, color: '#3b82f6', description: 'Self-improving language models for Amlazr agent deliberation quality' },
  { id: 'rl', name: 'Multi-Agent RL', domain: 'Reinforcement Learning', progress: 58, status: 'training', papers: 9, color: '#8b5cf6', description: 'Reward-shaping for consensus convergence in adversarial agent debates' },
  { id: 'kg', name: 'Knowledge Graphs', domain: 'Memory Systems', progress: 85, status: 'deployed', papers: 21, color: '#10b981', description: 'Dynamic knowledge graph construction from human input patterns' },
  { id: 'vision', name: 'Visual Reasoning', domain: 'Computer Vision', progress: 41, status: 'exploring', papers: 6, color: '#f59e0b', description: 'Image-to-argument pipelines for visual content consensus' },
  { id: 'ethics', name: 'Alignment Research', domain: 'AI Safety', progress: 63, status: 'evolving', papers: 11, color: '#ef4444', description: 'Ensuring agent consensus aligns with human values and intent' },
];

const EVOLUTION_LOG = [
  { time: '19:42', event: 'NLP Consensus v3.7 outperformed v3.6 by 12% on deliberation coherence', type: 'improvement' },
  { time: '19:38', event: 'Knowledge Graph ingested 2,847 new relationship triples from today\'s arena sessions', type: 'data' },
  { time: '19:31', event: 'Multi-Agent RL training epoch 847 complete — reward plateau detected, mutating policy', type: 'training' },
  { time: '19:24', event: 'Alignment monitor flagged potential value drift in Socrates agent — auto-correcting', type: 'safety' },
  { time: '19:15', event: 'Visual Reasoning module successfully parsed Instagram carousel into argument structure', type: 'improvement' },
  { time: '18:58', event: 'New research paper auto-generated: "Emergent Consensus Patterns in P2P Agent Meshes"', type: 'output' },
];

function Yace19Lab() {
  const [activeTrack, setActiveTrack] = useState(null);
  const [isEvolving, setIsEvolving] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isEvolving) return;
    const interval = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(interval);
  }, [isEvolving]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', color: '#fcfcfc', position: 'relative' }}>
      <div style={{ padding: '48px', flex: 1, display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '24px' }}>
          <div>
            <h1 style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 300, fontSize: '2rem', letterSpacing: '2px', margin: 0 }}>
              YACE19AI <span style={{ color: '#10b981' }}>RESEARCH LAB</span>
            </h1>
            <p style={{ color: '#6b6b7b', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '8px 0 0' }}>
              Self-Evolving Research Engine — Powering Amlazr.com
            </p>
          </div>
          <button onClick={() => setIsEvolving(!isEvolving)} style={{ background: isEvolving ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${isEvolving ? '#10b981' : 'rgba(255,255,255,0.1)'}`, color: isEvolving ? '#10b981' : '#6b6b7b', padding: '10px 20px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: '"JetBrains Mono", monospace' }}>
            {isEvolving ? <><Activity size={16} /> EVOLVING</> : <><Pause size={16} /> PAUSED</>}
          </button>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
          {[
            { label: 'Active Tracks', value: RESEARCH_TRACKS.length, icon: GitBranch, color: '#3b82f6' },
            { label: 'Total Papers', value: RESEARCH_TRACKS.reduce((s, t) => s + t.papers, 0), icon: Layers, color: '#8b5cf6' },
            { label: 'Evolutions Today', value: 23 + tick, icon: Dna, color: '#10b981' },
            { label: 'GPU Hours', value: '847h', icon: Cpu, color: '#f59e0b' },
            { label: 'Feeding Amlazr', value: 'LIVE', icon: Globe, color: '#ef4444' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <s.icon size={18} color={s.color} style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{s.value}</div>
              <div style={{ color: '#6b6b7b', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Research Tracks */}
        <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '20px', fontFamily: '"JetBrains Mono", monospace', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Beaker size={14} /> ACTIVE RESEARCH TRACKS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {RESEARCH_TRACKS.map(track => (
              <div key={track.id} onClick={() => setActiveTrack(activeTrack === track.id ? null : track.id)} style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${activeTrack === track.id ? track.color + '40' : 'rgba(255,255,255,0.04)'}`, borderRadius: '12px', padding: '16px', cursor: 'pointer', transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: track.color, fontSize: '0.9rem', fontWeight: 'bold' }}>{track.name}</span>
                    <span style={{ color: '#6b6b7b', fontSize: '0.7rem' }}>{track.domain}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>{track.papers} papers</span>
                    <span style={{ background: `${track.color}20`, color: track.color, padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{track.status}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(100, track.progress + (isEvolving ? tick % 3 : 0))}%`, height: '100%', background: track.color, borderRadius: '3px', transition: 'width 1s ease' }} />
                  </div>
                  <span style={{ color: track.color, fontSize: '0.8rem', fontWeight: 'bold', minWidth: '36px', textAlign: 'right' }}>{Math.min(100, track.progress + (isEvolving ? tick % 3 : 0))}%</span>
                </div>
                {activeTrack === track.id && (
                  <div style={{ marginTop: '12px', color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.5, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                    {track.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Evolution Log */}
        <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ color: '#8b5cf6', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '16px', fontFamily: '"JetBrains Mono", monospace', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Dna size={14} /> SELF-EVOLUTION LOG
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {EVOLUTION_LOG.map((entry, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', alignItems: 'flex-start' }}>
                <span style={{ color: '#6b6b7b', fontSize: '0.7rem', fontFamily: '"JetBrains Mono", monospace', flexShrink: 0 }}>{entry.time}</span>
                <span style={{ color: entry.type === 'safety' ? '#ef4444' : entry.type === 'improvement' ? '#10b981' : '#94a3b8', fontSize: '0.8rem', lineHeight: 1.4 }}>{entry.event}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Yace19Lab;
