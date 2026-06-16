import { useState } from 'react';
import { Video, Camera, Music2, Tv, Send, Zap, RefreshCw, Clock, TrendingUp, Eye, Heart, MessageCircle, Share2, Calendar, FileText, ChevronRight, Play } from 'lucide-react';

const CHANNELS = [
  { id: 'instagram', name: 'Instagram', icon: Camera, color: '#E1306C', handle: '@prime.ai.sovereign', followers: '12.4K', posts: 87 },
  { id: 'tiktok', name: 'TikTok', icon: Music2, color: '#00f2ea', handle: '@primeai_os', followers: '34.1K', posts: 142 },
  { id: 'youtube', name: 'YouTube', icon: Tv, color: '#FF0000', handle: 'PRIME AI', followers: '8.7K', posts: 45 },
  { id: 'facebook', name: 'Facebook', icon: Share2, color: '#1877F2', handle: 'PrimeAISovereign', followers: '5.2K', posts: 63 },
];

const DOMAINS = [
  { id: 'prime-ai', domain: 'prime-ai.fr', role: 'Sovereign Hub', color: '#d4af37', status: 'LIVE', description: 'Central Cognitive OS & Fleet Command' },
  { id: 'azirem', domain: 'Azirem', role: 'Self-Coding Agent', color: '#8b5cf6', status: 'BUILDING', description: 'Autonomous self-coding application engine' },
  { id: 'amlazr', domain: 'Amlazr.com', role: 'Human Consensus Arena', color: '#3b82f6', status: 'BUILDING', description: 'Agent arena for human input consensus — agents think out loud' },
  { id: 'yace19ai', domain: 'Yace19ai.com', role: 'Research Lab', color: '#10b981', status: 'BUILDING', description: 'Self-evolving research arena powering Amlazr' },
];

const CONTENT_QUEUE = [
  { id: 1, type: 'carousel', channel: 'instagram', title: '5 UX UI Mistakes That Hurt Conversions', slides: 10, status: 'ready', scheduled: '20:00 Today' },
  { id: 2, type: 'reel', channel: 'tiktok', title: 'How AI Agents Build Software Autonomously', duration: '60s', status: 'rendering', scheduled: '21:30 Today' },
  { id: 3, type: 'video', channel: 'youtube', title: 'Sovereign AI OS — Full Demo Walkthrough', duration: '12:40', status: 'editing', scheduled: 'Tomorrow 14:00' },
  { id: 4, type: 'post', channel: 'facebook', title: 'Multi-Agent Consensus: How Amlazr Works', slides: 1, status: 'draft', scheduled: 'Tomorrow 10:00' },
  { id: 5, type: 'carousel', channel: 'instagram', title: 'Build Your Own AI Agent Fleet in 2026', slides: 8, status: 'generating', scheduled: 'Wed 18:00' },
];

function StatusBadge({ status }) {
  const colors = { ready: '#10b981', rendering: '#f59e0b', editing: '#3b82f6', draft: '#6b7280', generating: '#8b5cf6', LIVE: '#10b981', BUILDING: '#f59e0b' };
  return (
    <span style={{ background: `${colors[status] || '#6b7280'}20`, color: colors[status] || '#6b7280', padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      {status}
    </span>
  );
}

function MediaCommandCenter() {
  const [activeTab, setActiveTab] = useState('overview');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', color: '#fcfcfc', position: 'relative', overflowY: 'auto' }}>
      <div style={{ padding: '48px', flex: 1, display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '24px' }}>
          <div>
            <h1 style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 300, fontSize: '2rem', letterSpacing: '2px', marginBottom: '8px', margin: 0 }}>
              MEDIA COMMAND CENTER
            </h1>
            <p style={{ color: '#6b6b7b', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '8px 0 0' }}>
              Multi-Channel Content Orchestration × Sovereign Fleet MCP
            </p>
          </div>
          <button onClick={handleGenerate} style={{ background: generating ? 'rgba(139,92,246,0.2)' : 'rgba(212,175,55,0.15)', border: `1px solid ${generating ? '#8b5cf6' : '#d4af37'}`, color: generating ? '#c084fc' : '#d4af37', padding: '10px 20px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s', fontFamily: '"JetBrains Mono", monospace' }}>
            {generating ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Zap size={16} />}
            {generating ? 'AGENTS GENERATING...' : 'GENERATE ALL CHANNELS'}
          </button>
        </div>

        {/* Tab Row */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['overview', 'channels', 'domains', 'queue'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: activeTab === tab ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${activeTab === tab ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.06)'}`, color: activeTab === tab ? '#d4af37' : '#6b6b7b', padding: '8px 20px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: '"JetBrains Mono", monospace' }}>
              {tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
            {/* Channel Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {CHANNELS.map(ch => (
                <div key={ch.id} style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <ch.icon size={20} color={ch.color} />
                    <span style={{ color: '#10b981', fontSize: '0.65rem', fontWeight: 'bold' }}>● LINKED</span>
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{ch.followers}</div>
                  <div style={{ color: '#6b6b7b', fontSize: '0.7rem' }}>{ch.handle}</div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.7rem', color: '#94a3b8' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FileText size={12} /> {ch.posts}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><TrendingUp size={12} color="#10b981" /> +12%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Domains Ecosystem */}
            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px' }}>
              <div style={{ color: '#d4af37', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '16px', fontFamily: '"JetBrains Mono", monospace' }}>
                DOMAIN ECOSYSTEM — SOVEREIGN FLEET
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {DOMAINS.map(d => (
                  <div key={d.id} style={{ background: 'rgba(0,0,0,0.5)', border: `1px solid ${d.color}30`, borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: d.color, fontSize: '0.85rem', fontWeight: 'bold' }}>{d.domain}</span>
                      <StatusBadge status={d.status} />
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{d.role}</div>
                    <div style={{ color: '#6b6b7b', fontSize: '0.7rem', lineHeight: 1.4 }}>{d.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* CHANNELS TAB */}
        {activeTab === 'channels' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {CHANNELS.map(ch => (
              <div key={ch.id} style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${ch.color}30`, borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${ch.color}15`, border: `1px solid ${ch.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ch.icon size={24} color={ch.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{ch.name}</div>
                    <div style={{ color: '#6b6b7b', fontSize: '0.75rem' }}>{ch.handle}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  {[{ label: 'Followers', val: ch.followers, icon: Eye }, { label: 'Engagement', val: '4.2%', icon: Heart }, { label: 'Posts', val: ch.posts, icon: FileText }, { label: 'Scheduled', val: CONTENT_QUEUE.filter(c => c.channel === ch.id).length, icon: Calendar }].map((s, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ color: '#6b6b7b', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}><s.icon size={10} /> {s.label}</div>
                      <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{s.val}</div>
                    </div>
                  ))}
                </div>
                <button style={{ background: `${ch.color}15`, border: `1px solid ${ch.color}40`, color: ch.color, padding: '8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <Play size={14} /> GENERATE CONTENT
                </button>
              </div>
            ))}
          </div>
        )}

        {/* DOMAINS TAB */}
        {activeTab === 'domains' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {DOMAINS.map(d => (
              <div key={d.id} style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${d.color}30`, borderRadius: '16px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: d.color, fontSize: '1.2rem', fontWeight: 'bold' }}>{d.domain}</span>
                    <StatusBadge status={d.status} />
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>{d.role}</div>
                  <div style={{ color: '#6b6b7b', fontSize: '0.8rem', lineHeight: 1.5, maxWidth: '600px' }}>{d.description}</div>
                </div>
                <ChevronRight size={20} color="#6b6b7b" />
              </div>
            ))}
          </div>
        )}

        {/* QUEUE TAB */}
        {activeTab === 'queue' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '16px', padding: '12px 16px', color: '#6b6b7b', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: '"JetBrains Mono", monospace', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span>Content</span><span>Channel</span><span>Type</span><span>Status</span><span>Scheduled</span>
            </div>
            {CONTENT_QUEUE.map(item => {
              const ch = CHANNELS.find(c => c.id === item.channel);
              return (
                <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '16px', padding: '16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>{item.title}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}>
                    {ch && <ch.icon size={14} color={ch.color} />} {ch?.name}
                  </span>
                  <span style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>{item.type}</span>
                  <StatusBadge status={item.status} />
                  <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {item.scheduled}</span>
                </div>
              );
            })}
          </div>
        )}

      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default MediaCommandCenter;
