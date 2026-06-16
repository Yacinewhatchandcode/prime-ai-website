import { useState } from 'react';
import { Code, GitBranch, Terminal, Play, Pause, RefreshCw, FileCode, FolderGit, CheckCircle, AlertCircle, Cpu, Zap, Eye, Layers, ChevronRight } from 'lucide-react';

const ACTIVE_PROJECTS = [
  { id: 'amlazr-fe', name: 'Amlazr Frontend', lang: 'React/TypeScript', branch: 'main', lastCommit: '3m ago', status: 'building', linesChanged: 847, color: '#3b82f6' },
  { id: 'yace-engine', name: 'Yace19 ML Engine', lang: 'Python/PyTorch', branch: 'evolve-v4', lastCommit: '12m ago', status: 'passing', linesChanged: 2341, color: '#10b981' },
  { id: 'prime-api', name: 'Prime-AI Gateway', lang: 'Rust/Axum', branch: 'sovereign-v2', lastCommit: '28m ago', status: 'passing', linesChanged: 516, color: '#d4af37' },
  { id: 'content-gen', name: 'Content Generator', lang: 'Python/LangChain', branch: 'multi-channel', lastCommit: '1h ago', status: 'testing', linesChanged: 1203, color: '#8b5cf6' },
];

const CODE_STREAM = [
  { file: 'src/arena/consensus.ts', action: 'Modified', agent: 'Azirem-Alpha', description: 'Refactored consensus scoring algorithm for 3x throughput' },
  { file: 'ml/rl/policy.py', action: 'Created', agent: 'Azirem-Beta', description: 'New multi-agent reward shaping policy for adversarial debates' },
  { file: 'api/handlers/fleet.rs', action: 'Modified', agent: 'Azirem-Alpha', description: 'Added P2P mesh handshake verification endpoint' },
  { file: 'content/generators/instagram.py', action: 'Created', agent: 'Azirem-Gamma', description: 'Autonomous 10-slide carousel generator with brand voice injection' },
  { file: 'tests/integration/arena_flow.test.ts', action: 'Created', agent: 'Azirem-Beta', description: 'End-to-end test: human input → 5-agent deliberation → consensus output' },
];

function AziremCoder() {
  const [isAutonomous, setIsAutonomous] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', color: '#fcfcfc', position: 'relative', overflowY: 'auto' }}>
      <div style={{ padding: '48px', flex: 1, display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '24px' }}>
          <div>
            <h1 style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 300, fontSize: '2rem', letterSpacing: '2px', margin: 0 }}>
              AZIREM <span style={{ color: '#8b5cf6' }}>AUTONOMOUS CODER</span>
            </h1>
            <p style={{ color: '#6b6b7b', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '8px 0 0' }}>
              Self-Coding Agent × Multi-Project Orchestration
            </p>
          </div>
          <button onClick={() => setIsAutonomous(!isAutonomous)} style={{ background: isAutonomous ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${isAutonomous ? '#8b5cf6' : 'rgba(255,255,255,0.1)'}`, color: isAutonomous ? '#c084fc' : '#6b6b7b', padding: '10px 20px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: '"JetBrains Mono", monospace' }}>
            {isAutonomous ? <><Zap size={16} /> AUTONOMOUS MODE</> : <><Pause size={16} /> SUPERVISED MODE</>}
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {[
            { label: 'Active Projects', value: ACTIVE_PROJECTS.length, icon: FolderGit, color: '#3b82f6' },
            { label: 'Commits Today', value: 47, icon: GitBranch, color: '#10b981' },
            { label: 'Lines Written', value: '4,907', icon: FileCode, color: '#8b5cf6' },
            { label: 'Tests Passing', value: '98.2%', icon: CheckCircle, color: '#d4af37' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <s.icon size={18} color={s.color} style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{s.value}</div>
              <div style={{ color: '#6b6b7b', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Active Projects */}
        <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ color: '#8b5cf6', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '16px', fontFamily: '"JetBrains Mono", monospace', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Code size={14} /> ACTIVE CODEBASES
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {ACTIVE_PROJECTS.map(p => (
              <div key={p.id} style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${p.color}20`, borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: p.color, fontSize: '0.95rem', fontWeight: 'bold' }}>{p.name}</span>
                  <span style={{ background: p.status === 'passing' ? '#10b98120' : p.status === 'building' ? '#f59e0b20' : '#3b82f620', color: p.status === 'passing' ? '#10b981' : p.status === 'building' ? '#f59e0b' : '#3b82f6', padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{p.status}</span>
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.7rem', color: '#94a3b8' }}>
                  <span>{p.lang}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><GitBranch size={12} /> {p.branch}</span>
                  <span>+{p.linesChanged} lines</span>
                </div>
                <div style={{ color: '#6b6b7b', fontSize: '0.7rem' }}>Last commit: {p.lastCommit}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Code Stream */}
        <div style={{ background: 'rgba(5,5,10,0.8)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ background: 'rgba(139,92,246,0.08)', padding: '12px 20px', borderBottom: '1px solid rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', color: '#c084fc' }}>
            <Terminal size={14} /> LIVE CODE STREAM
            {isAutonomous && <span style={{ marginLeft: 'auto', color: '#10b981', fontSize: '0.65rem' }}>● AUTONOMOUS</span>}
          </div>
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem' }}>
            {CODE_STREAM.map((entry, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <span style={{ color: entry.action === 'Created' ? '#10b981' : '#f59e0b', fontSize: '0.65rem', fontWeight: 'bold', minWidth: '60px' }}>{entry.action.toUpperCase()}</span>
                <span style={{ color: '#60a5fa', minWidth: '240px' }}>{entry.file}</span>
                <span style={{ color: '#6b6b7b', flex: 1 }}>{entry.description}</span>
                <span style={{ color: '#8b5cf6', fontSize: '0.65rem', flexShrink: 0 }}>{entry.agent}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AziremCoder;
