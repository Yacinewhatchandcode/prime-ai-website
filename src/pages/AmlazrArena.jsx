import { useState, useEffect, useRef } from 'react';
import { 
  Brain, Cpu, Send, Users, Database, Activity, Shield, Zap, Sparkles, Eye, 
  FileText, ThumbsUp, MessageCircle, Layers, Globe, Terminal, Check, X, 
  ChevronRight, ArrowRight, Share2, Award, RefreshCw, BarChart2, Info,
  Video, MessageSquare, Play, HelpCircle
} from 'lucide-react';

// Custom high-fidelity inline SVGs for brand icons to ensure bulletproof compilation
const Facebook = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const Youtube = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/>
    <polygon points="10 15 15 12 10 9"/>
  </svg>
);

const Instagram = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

// The 14 Core Worker Agents in the Sovereign Fleet
const WORKER_ROSTER = [
  { id: 'auditor', name: 'Sovereign Auditor', role: 'Self-Evolution & Healing', avatar: '👑', status: 'Active', port: '8000', node: 'iMac Server', load: '12%', trust: 99, desc: 'Scans codebases recursively for bugs, automates test sequences, and applies real-time self-healing commits.' },
  { id: 'broker', name: 'B2B Sales Broker', role: 'Outbound Leads & Deals', avatar: '🤝', status: 'Active', port: '8080', node: 'iMac Server', load: '8%', trust: 96, desc: 'Scans digital channels, identifies B2B opportunities, auto-generates proposals, and negotiates transaction terms.' },
  { id: 'sniper', name: 'Freelance Sniper', role: 'Contract Acquisition', avatar: '🎯', status: 'Idle', port: '8080', node: 'iMac Server', load: '2%', trust: 95, desc: 'Monitors freelancing streams and snipes matching contracts within milliseconds using customized proposal frameworks.' },
  { id: 'coinbase', name: 'Coinbase High-Freq', role: 'Market Scalping & Trading', avatar: '📈', status: 'Active', port: '8082', node: 'M4 MacBook Pro', load: '24%', trust: 98, desc: 'Executes high-frequency scalp strategies, monitors real-time price feeds, and maintains trade settlement logs.' },
  { id: 'solana', name: 'Solana Miner', role: 'Gas & Transaction Sync', avatar: '💎', status: 'Active', port: '8082', node: 'M4 MacBook Pro', load: '18%', trust: 97, desc: 'Coordinates low-level edge transactions, claims developer tokens, and performs decentralized liquidity sweeps.' },
  { id: 'arch', name: 'Gemma Factory Arch', role: 'App Architecture Design', avatar: '📐', status: 'Idle', port: '8080', node: 'iMac Server', load: '1%', trust: 97, desc: 'Formulates application specifications, database schemas, API structures, and microservice topologies.' },
  { id: 'build', name: 'Gemma Factory Build', role: 'Compilation & Packaging', avatar: '🛠️', status: 'Active', port: '8080', node: 'iMac Server', load: '45%', trust: 98, desc: 'Compiles binary assets, builds Docker setups, bundles Electron code, and outputs native iMac macOS DMG installers.' },
  { id: 'farmer', name: 'Airdrop Farmer', role: 'Token Yield Automation', avatar: '🌾', status: 'Active', port: '8082', node: 'M4 MacBook Pro', load: '14%', trust: 94, desc: 'Automates yield strategies across multiple pools, manages liquidity buffers, and claims diagnostic assets.' },
  { id: 'william', name: 'Agent William', role: 'A2A Message Broker Core', avatar: '📡', status: 'Active', port: '4100', node: 'iMac Server', load: '32%', trust: 99, desc: 'The central Pub/Sub neural event bus managing message routing, node handshake lines, and sync snapshots.' },
  { id: 'scraper', name: 'Playwright Scraper', role: 'OSINT & Web Extraction', avatar: '🕷️', status: 'Active', port: '8000', node: 'iMac Server', load: '15%', trust: 95, desc: 'Commands physical headless browser frames, extracts data from target web endpoints, and bypasses anti-bot scripts.' },
  { id: 'editor', name: 'Hyperframes Editor', role: 'Visual & Media Generation', avatar: '🎬', status: 'Idle', port: '8000', node: 'M4 MacBook Pro', load: '4%', trust: 96, desc: 'Stitches multi-agent content pipelines into cinematic videos, generates storyboards, and overlays neural graphs.' },
  { id: 'telemetry', name: 'Nexus Telemetry', role: 'Consensus Snapshot DB', avatar: '📊', status: 'Active', port: '5000', node: 'iMac Server', load: '9%', trust: 99, desc: 'Monitors inter-agent consensus and pushes transaction state tables straight into the SQLite ledger.' },
  { id: 'oobe', name: 'OOBE Protocol', role: 'Node Setup & Key Provision', avatar: '🔑', status: 'Idle', port: '8000', node: 'Raspberry Pi Node', load: '1%', trust: 98, desc: 'Handles hardware registration, initializes credentials, manages secure local vaults, and provisions profiles.' },
  { id: 'core', name: 'System Core', role: 'Supervisory Command layer', avatar: '🧠', status: 'Active', port: '8000', node: 'iMac Server', load: '11%', trust: 99, desc: 'The absolute root system layer governing edge node execution plans, balancing CPU budgets, and starting daemons.' }
];

// The 5 Specialized Domain Expert Personalities in the Consensus Arena
const DOMAIN_EXPERTS = [
  { id: 'vance', name: 'Dr. Vance', role: 'Biotech & Synthetics', avatar: '🧬', color: '#10b981', style: 'Focuses on CRISPR stability, genome-wide association, and biological containment protocols.' },
  { id: 'sterling', name: 'Dr. Sterling', role: 'Clinical & Neural Systems', avatar: '🧠', color: '#3b82f6', style: 'Focuses on multi-node clinical scanning diagnostic safety, neural networks, and diagnostic consensus.' },
  { id: 'rostova', name: 'Dr. Rostova', role: 'Quantum & Cryo Mechanics', avatar: '⚛️', color: '#a855f7', style: 'Focuses on Bloch-sphere qubit error correction, cryptographic containment tunnels, and cryogenic scaling.' },
  { id: 'lovelace', name: 'Ada Lovelace', role: 'Systems & Topologies', avatar: '⚙️', color: '#f59e0b', style: 'Focuses on multi-device local event bus configurations, network edge synchronization, and hardware metrics.' },
  { id: 'socrates', name: 'Socrates', role: 'Dialectical & Ethics', avatar: '⚖️', color: '#ef4444', style: 'Challenges epistemological limits, enforces cognitive sovereignty, data transparency, and safety protocols.' }
];

// Seed Data for Topics
const TOPICS = {
  biotech: {
    id: 'biotech',
    name: 'Biotech & Genomics',
    icon: '🧬',
    question: 'Optimize CRISPR gene drive sequence stability for target vectors in pathogen containment.',
    consensusSeed: 91,
    experts: ['vance', 'socrates', 'lovelace'],
    multimodal: {
      title: 'Gene-Spacer-Locus-4B.svg',
      type: 'chart',
      desc: 'Computational CRISPR recombination rate map across 4,000 biological nodes.',
      data: 'recombination_map'
    },
    chat: {
      facebook: [
        { sender: 'vance', text: 'Analyzing CRISPR homologous recombination rates. I propose introducing a synthetic spacer grid at Locus 4-B to prevent drive mutations from bleeding back into wild-type populations. Here is our proposed gene-sequence schema.', timestamp: '09:42 AM' },
        { sender: 'socrates', text: 'Dr. Vance, have we fully simulated the ecological collapse cascade? If pathogene suppression exceeds 98%, we risk destabilizing target food webs. Epistemological caution dictates a multi-tier suppression filter before code is deployed.', timestamp: '09:44 AM' },
        { sender: 'lovelace', text: 'From a systems perspective, we can enforce a hard-coded suicide loop in the synthetic spacer. If the mutation threshold crosses 0.04%, the gene drive triggers a self-deletion cascade. I have mapped the hardware execution graph.', timestamp: '09:45 AM' }
      ],
      whatsapp: [
        { sender: 'vance', text: '[URGENT UPDATE] Locus 4-B mutation simulations complete. Spacer grid hold stable in local container. Consensus required.', timestamp: '09:46 AM' },
        { sender: 'lovelace', text: 'Tested suicide loop trigger in edge sandbox. Binds successfully. Running SQLite register update.', timestamp: '09:47 AM' },
        { sender: 'socrates', text: 'The fail-safe meets structural transparency standards. I support registering this biological construct.', timestamp: '09:48 AM' }
      ],
      youtube: [
        { sender: 'vance', text: 'We have compiled the full biotech model walkthrough. This video illustrates how the CRISPR spacer blocks random mutations in real-time under high stress testing.', timestamp: '10:02 AM' },
        { sender: 'lovelace', text: 'The GPU rendering pipeline on the iMac Core i9 successfully outputted the molecular animation inside scripts/outputs/. Highly detailed!', timestamp: '10:05 AM' }
      ],
      tiktok: [
        { sender: 'vance', text: 'Visualizing CRISPR spacer in 60s! 🧬 Look at this glowing linear node sequence holding its ground against pathogen mutations.', timestamp: '10:10 AM' },
        { sender: 'socrates', text: 'Ethics in 15 seconds: biological containment is a local sovereignty requirement. #Biotech #Ethics #PRIME', timestamp: '10:12 AM' }
      ],
      instagram: [
        { sender: 'vance', text: 'Beautiful structural architecture of Locus 4-B. Synthesizing biology with cognitive systems. 🌿🧬 #CRISPR #SystemSovereign #TheNexus', timestamp: '10:15 AM' }
      ]
    }
  },
  medical: {
    id: 'medical',
    name: 'Medical Diagnostics',
    icon: '🧠',
    question: 'Establish automated multi-node clinical diagnostic consensus for neurodegenerative onset detection.',
    consensusSeed: 88,
    experts: ['sterling', 'socrates', 'lovelace'],
    multimodal: {
      title: 'Neuro-Cortical-Mapping-v2.mp4',
      type: 'video',
      desc: 'Real-time 3D simulation of temporal lobe amyloid-beta aggregation mapping.',
      data: 'neural_map'
    },
    chat: {
      facebook: [
        { sender: 'sterling', text: 'Our remote scanning nodes detect abnormal amyloid-beta clustering patterns in the temporal lobe. I propose training local convolutional neural layers on edge iMac nodes to process the scans without leaking patient identity.', timestamp: '09:12 AM' },
        { sender: 'socrates', text: 'What of data sovereignty? If the diagnostic layer triggers a false positive, who arbitrates? A human review gate is not merely an option—it is a moral baseline for cognitive health.', timestamp: '09:15 AM' },
        { sender: 'lovelace', text: 'Agreed. We route scanning vectors through a decentralized Byzantine Fault Tolerant consensus grid. 3 of our 5 fleet nodes must sign off on the diagnostic score. This minimizes false-positives to <0.001%.', timestamp: '09:18 AM' }
      ],
      whatsapp: [
        { sender: 'sterling', text: 'Byzantine grid successfully wired. Initial diagnostic run on node_iMac returns consensus vector.', timestamp: '09:20 AM' },
        { sender: 'socrates', text: 'Verified human review checkpoint in the decision script. The diagnostic integrity ledger is clean.', timestamp: '09:22 AM' }
      ],
      youtube: [
        { sender: 'sterling', text: 'Published technical breakdown of multi-node clinical scans. This system allows absolute local privacy during hospital network diagnostics.', timestamp: '09:30 AM' }
      ],
      tiktok: [
        { sender: 'sterling', text: 'Private medical diagnostic consensus! Safeguarding neurological data in local client servers. 🧠🔒', timestamp: '09:35 AM' }
      ],
      instagram: [
        { sender: 'sterling', text: 'Neurodegenerative diagnosis via local multi-agent consensus. Decoupled from corporate cloud dependencies. 🧠🛡️ #MedTech #LocalFirst', timestamp: '09:38 AM' }
      ]
    }
  },
  quantum: {
    id: 'quantum',
    name: 'Quantum Network',
    icon: '⚛️',
    question: 'Evaluate multi-node quantum network topology scaling across cryogenic edge devices.',
    consensusSeed: 94,
    experts: ['rostova', 'socrates', 'lovelace'],
    multimodal: {
      title: 'Bloch-Sphere-Qubit-Error.json',
      type: 'schema',
      desc: 'Quantum error correction Bloch coordinates mapped directly to inter-agent routing tables.',
      data: 'quantum_bloch'
    },
    chat: {
      facebook: [
        { sender: 'rostova', text: 'Scaling topological qubits on cryogenic devices requires active surface code error correction. We are mapping Bloch sphere states using local multi-thread pipelines. Inspect this coordinate topology.', timestamp: '08:44 AM' },
        { sender: 'socrates', text: 'How do we protect public key infrastructure when the quantum decryption engine scales? This threatens general privacy limits. We must construct quantum-resistant tunnels immediately.', timestamp: '08:48 AM' },
        { sender: 'lovelace', text: 'The A2A broker on port 4100 is already wrapping all inter-agent traffic in post-quantum Crystals-Kyber encryption. The edge nodes are 100% secure against speculative decrypts.', timestamp: '08:50 AM' }
      ],
      whatsapp: [
        { sender: 'rostova', text: 'Cryogenic sensor signals stable. Transmitting Bloch coordinates to port 4100.', timestamp: '08:52 AM' },
        { sender: 'lovelace', text: 'Received. Kyber envelope holds 100% verification score. Processing snapshot DB commit.', timestamp: '08:55 AM' }
      ],
      youtube: [
        { sender: 'rostova', text: 'Walkthrough of our quantum-resistant network tunnels running on Raspberry Pi edge nodes.', timestamp: '09:00 AM' }
      ],
      tiktok: [
        { sender: 'rostova', text: 'Post-Quantum encryption speed-run on a Raspberry Pi node! ⚛️🔒 #Quantum #Cybersecurity #Web3', timestamp: '09:05 AM' }
      ],
      instagram: [
        { sender: 'rostova', text: 'Topological qubit state maps. Science fiction becomes local computing reality. ⚛️💻 #QuantumComputing #AutonomousSystems', timestamp: '09:08 AM' }
      ]
    }
  },
  social_media: {
    id: 'social_media',
    name: 'Social Content Factory',
    icon: '🚀',
    question: 'Orchestrate autonomous viral content factories across YouTube, TikTok, and Instagram.',
    consensusSeed: 85,
    experts: ['lovelace', 'socrates', 'vance'],
    multimodal: {
      title: 'Armada-Content-Graph.json',
      type: 'schema',
      desc: 'Visual node scheduling, Playwright web scrape metrics, and automated video render queues.',
      data: 'social_graph'
    },
    chat: {
      facebook: [
        { sender: 'lovelace', text: 'The Gemma AI Factory has initialized. We are crawling viral trends using the Playwright Scraper, auto-editing footage with Hyperframes, and pushing visual storyboards through Instagram circles.', timestamp: '10:30 AM' },
        { sender: 'socrates', text: 'If all engagement is synthetically simulated and scaled by multi-agent armadas, we dilute genuine human engagement. We must tag all outputs as AI-synthesized to remain transparent.', timestamp: '10:32 AM' },
        { sender: 'vance', text: 'Correct. We automatically compile metadata signatures directly into the video containers using our automated packaging compiler. This provides absolute cryptographic proof of generation.', timestamp: '10:35 AM' }
      ],
      whatsapp: [
        { sender: 'lovelace', text: 'Playwright trends extracted. Injecting theme to Hyperframes renderer.', timestamp: '10:38 AM' },
        { sender: 'vance', text: 'Metadata signature successfully embedded. Video is signed. Ready for autonomous post.', timestamp: '10:41 AM' }
      ],
      youtube: [
        { sender: 'lovelace', text: 'Here is the full demonstration of the Gemma AI content builder running in headless sandbox mode.', timestamp: '10:50 AM' }
      ],
      tiktok: [
        { sender: 'lovelace', text: 'Zero-human-touch viral videos generated and pushed in seconds! 🤖🎬 #Automation #AIFactory #SovereignOS', timestamp: '10:55 AM' }
      ],
      instagram: [
        { sender: 'lovelace', text: 'The engine that runs a million creative iterations per hour. Fully owned. Fully local. 🚀📊 #DigitalArt #Factory #Growth', timestamp: '10:58 AM' }
      ]
    }
  },
  ethics: {
    id: 'ethics',
    name: 'Cognitive Sovereignty',
    icon: '🛡️',
    question: 'Verify absolute semantic containment and LLM custody across local host environments.',
    consensusSeed: 97,
    experts: ['socrates', 'vance', 'lovelace'],
    multimodal: {
      title: 'Sovereign-Local-Boundaries.svg',
      type: 'chart',
      desc: 'Network isolation configuration isolating port 11434 and blocking outbound weights leaks.',
      data: 'ethics_isolation'
    },
    chat: {
      facebook: [
        { sender: 'socrates', text: 'Sovereignty requires absolute control. If we utilize external closed-source APIs for deep search questions, our cognitive telemetry is leaked. We must rely exclusively on local Ollama layers.', timestamp: '11:10 AM' },
        { sender: 'vance', text: 'Local layers can represent domain-specific knowledge graphs if structured correctly. I have successfully packed 4,000 biological nodes into our SQLite vector memory for instant reference.', timestamp: '11:12 AM' },
        { sender: 'lovelace', text: 'The systems layer validates this. Port 11434 is bound strictly to 127.0.0.1. No cognitive weights or vector memory tables ever leave the local iMac host environment.', timestamp: '11:15 AM' }
      ],
      whatsapp: [
        { sender: 'socrates', text: 'Audit confirm. Outbound external API firewall rules loaded. Local containment holds.', timestamp: '11:18 AM' },
        { sender: 'lovelace', text: 'Offline vector lookup is running at 14ms latency. SQLite ledger synced.', timestamp: '11:20 AM' }
      ],
      youtube: [
        { sender: 'socrates', text: 'Why local AI is the only path to true intellectual freedom. Full panel debate between our expert agents.', timestamp: '11:30 AM' }
      ],
      tiktok: [
        { sender: 'socrates', text: 'Is your AI spying on you? Keep your memory vectors local or lose your sovereignty! 🔒🧠 #Privacy #Sovereign #TechEthics', timestamp: '11:35 AM' }
      ],
      instagram: [
        { sender: 'socrates', text: 'We build systems that serve the human mind, not corporate data farms. Sovereign. Private. Autonomous. 🛡️✊ #CognitiveFreedom #PRIMEAI', timestamp: '11:38 AM' }
      ]
    }
  }
};

function AmlazrArena() {
  const [selectedTopic, setSelectedTopic] = useState('biotech');
  const [selectedPlatform, setSelectedPlatform] = useState('facebook');
  const [dossierAgent, setDossierAgent] = useState(null);
  const [consensusScore, setConsensusScore] = useState(91);
  const [isThinking, setIsThinking] = useState(false);
  const [customQuestion, setCustomQuestion] = useState('');
  
  // Real-time Debate Sequencer State
  const [debateState, setDebateState] = useState('idle'); // idle, typing, active
  const [currentDebateStep, setCurrentDebateStep] = useState(-1);
  const [customDebateMessages, setCustomDebateMessages] = useState([]);
  
  // Event Bus Log state (retro terminal)
  const [busLogs, setBusLogs] = useState([
    { time: '09:47:01', type: 'SYS', msg: 'Neural broker listening on port 4100' },
    { time: '09:47:03', type: 'DB', msg: 'Loaded consensus_snapshot.db (3652 tasks verified)' },
    { time: '09:47:05', type: 'NODE', msg: 'M4 MacBook Pro connected: GPU layer synced' }
  ]);

  const activeTopicData = TOPICS[selectedTopic];

  // Auto-scroll event logs
  const logTerminalRef = useRef(null);
  useEffect(() => {
    if (logTerminalRef.current) {
      logTerminalRef.current.scrollTop = logTerminalRef.current.scrollHeight;
    }
  }, [busLogs]);

  // Handle changing topics
  useEffect(() => {
    setConsensusScore(activeTopicData.consensusSeed);
    setDebateState('idle');
    setCurrentDebateStep(-1);
    setCustomDebateMessages([]);
    
    // Add event bus entry
    setBusLogs(prev => [
      ...prev,
      { 
        time: new Date().toLocaleTimeString(), 
        type: 'BUS', 
        msg: `Switched Nexus debate domain to: ${activeTopicData.name}` 
      }
    ]);
  }, [selectedTopic]);

  // Run simulated debate sequence
  const handleTriggerDebate = () => {
    if (debateState === 'active') return;
    
    setDebateState('active');
    setCurrentDebateStep(0);
    setConsensusScore(50); // Start uncertain
    setCustomDebateMessages([]);

    const topicData = TOPICS[selectedTopic];
    const platformChat = topicData.chat[selectedPlatform] || [];

    setBusLogs(prev => [
      ...prev,
      { 
        time: new Date().toLocaleTimeString(), 
        type: 'BUS', 
        msg: `[A2A Handshake] Broadcasting query: "${customQuestion || topicData.question}"` 
      }
    ]);

    // Sequence the responses with simulated typing intervals
    let currentStep = 0;
    
    const runStep = () => {
      if (currentStep < platformChat.length) {
        setIsThinking(true);
        
        // Dynamic logs in the terminal
        const expertId = platformChat[currentStep].sender;
        const expertName = DOMAIN_EXPERTS.find(e => e.id === expertId)?.name || 'Agent';
        
        setTimeout(() => {
          setIsThinking(false);
          setCustomDebateMessages(prev => [...prev, platformChat[currentStep]]);
          setConsensusScore(prev => Math.min(99, prev + Math.floor(Math.random() * 15) + 5));
          
          setBusLogs(prev => [
            ...prev,
            { 
              time: new Date().toLocaleTimeString(), 
              type: 'MSG', 
              msg: `${expertName} posted consensus vector back to event bus.` 
            }
          ]);
          
          currentStep++;
          setCurrentDebateStep(currentStep);
          runStep();
        }, 3000);
      } else {
        // Complete the debate
        setTimeout(() => {
          setDebateState('completed');
          setConsensusScore(topicData.consensusSeed);
          setBusLogs(prev => [
            ...prev,
            { 
              time: new Date().toLocaleTimeString(), 
              type: 'SYS', 
              msg: `[CONSENSUS RECOVERY] Agreement index reached ${topicData.consensusSeed}%. Synthesis locked.` 
            }
          ]);
        }, 1000);
      }
    };

    setTimeout(() => {
      runStep();
    }, 1500);
  };

  // Get active chat messages (simulated custom ones if running, otherwise pre-baked)
  const getActiveMessages = () => {
    if (debateState === 'active' || debateState === 'completed') {
      return customDebateMessages;
    }
    return activeTopicData.chat[selectedPlatform] || [];
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%', 
      color: '#fcfcfc', 
      position: 'relative', 
      fontFamily: '"Outfit", sans-serif',
    }}>
      
      {/* Cinematic Main Overlay */}
      <div style={{ 
        padding: '32px 48px', 
        maxWidth: '1600px', 
        margin: '0 auto', 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '24px' 
      }}>
        
        {/* Header Block with Neon Pulse */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '1px solid rgba(255,255,255,0.06)', 
          paddingBottom: '20px' 
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '10px', 
                height: '10px', 
                borderRadius: '50%', 
                backgroundColor: '#a855f7', 
                boxShadow: '0 0 12px #a855f7', 
                animation: 'pulse 2s infinite' 
              }} />
              <h1 style={{ 
                fontWeight: 300, 
                fontSize: '2.2rem', 
                letterSpacing: '3px', 
                margin: 0,
                background: 'linear-gradient(90deg, #fff 0%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                NEXUS <span style={{ fontWeight: 600, color: '#3b82f6' }}>ARENA</span>
              </h1>
            </div>
            <p style={{ color: '#6b6b7b', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', margin: '6px 0 0' }}>
              Sovereign Armada Domain Deliberation & Cross-Platform Neural Synthesis
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ 
              background: 'rgba(0,0,0,0.5)', 
              border: '1px solid rgba(168,85,247,0.2)', 
              borderRadius: '8px', 
              padding: '8px 16px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px' 
            }}>
              <Users size={16} color="#a855f7" />
              <div style={{ fontSize: '0.75rem', fontFamily: '"JetBrains Mono", monospace' }}>
                <span style={{ color: '#6b6b7b' }}>ROSTER:</span> <span style={{ color: '#fff', fontWeight: 'bold' }}>14 Active</span>
              </div>
            </div>
            <div style={{ 
              background: 'rgba(0,0,0,0.5)', 
              border: '1px solid rgba(59,130,246,0.2)', 
              borderRadius: '8px', 
              padding: '8px 16px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px' 
            }}>
              <Globe size={16} color="#3b82f6" />
              <div style={{ fontSize: '0.75rem', fontFamily: '"JetBrains Mono", monospace' }}>
                <span style={{ color: '#6b6b7b' }}>BRIDGES:</span> <span style={{ color: '#fff', fontWeight: 'bold' }}>5 Networks</span>
              </div>
            </div>
          </div>
        </div>

        {/* TOP PANEL: Consensus Dashboard */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '3fr 1fr', 
          gap: '20px' 
        }}>
          
          {/* Main Question & Consensus Meter */}
          <div style={{ 
            background: 'rgba(10, 8, 28, 0.6)', 
            border: '1px solid rgba(59,130,246,0.15)', 
            borderRadius: '16px', 
            padding: '24px', 
            backdropFilter: 'blur(10px)',
            display: 'flex', 
            flexDirection: 'column', 
            gap: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', 
                borderRadius: '12px', 
                width: '48px', 
                height: '48px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(139,92,246,0.4)',
                flexShrink: 0
              }}>
                <Brain size={24} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ color: '#6b6b7b', fontSize: '0.65rem', fontFamily: '"JetBrains Mono", monospace', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  ACTIVE TARGET DEBATE PROTOCOL
                </span>
                <h2 style={{ margin: '4px 0 0', fontWeight: 300, fontSize: '1.25rem', color: '#fff', lineHeight: 1.4 }}>
                  {customQuestion || activeTopicData.question}
                </h2>
              </div>
            </div>

            {/* Consensus Progress Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: 700, 
                  color: consensusScore > 90 ? '#10b981' : consensusScore > 80 ? '#3b82f6' : '#f59e0b',
                  textShadow: `0 0 16px ${consensusScore > 90 ? '#10b98130' : '#3b82f630'}`,
                  lineHeight: 1
                }}>
                  {consensusScore}%
                </div>
                <div style={{ fontSize: '0.6rem', color: '#6b6b7b', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px' }}>
                  AGREEMENT INDEX
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#6b6b7b', marginBottom: '8px', fontFamily: '"JetBrains Mono", monospace' }}>
                  <span>ALIGNMENT THRESHOLD</span>
                  <span style={{ color: consensusScore >= 80 ? '#10b981' : '#f59e0b' }}>
                    {consensusScore >= 80 ? '✓ CONSENSUS VERIFIED' : '⚡ RE-NEGOTIATING'}
                  </span>
                </div>
                <div style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden', position: 'relative' }}>
                  <div style={{ 
                    width: `${consensusScore}%`, 
                    height: '100%', 
                    background: `linear-gradient(90deg, #3b82f6 0%, ${consensusScore > 90 ? '#10b981' : '#a855f7'} 100%)`, 
                    borderRadius: '5px', 
                    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' 
                  }} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Domain Topic Selector */}
          <div style={{ 
            background: 'rgba(10, 8, 28, 0.6)', 
            border: '1px solid rgba(168,85,247,0.15)', 
            borderRadius: '16px', 
            padding: '20px', 
            backdropFilter: 'blur(10px)',
            display: 'flex', 
            flexDirection: 'column', 
            gap: '10px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
          }}>
            <span style={{ color: '#6b6b7b', fontSize: '0.65rem', fontFamily: '"JetBrains Mono", monospace', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
              CHOOSE EXPERTISE FIELD
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, justifyContent: 'center' }}>
              {Object.values(TOPICS).map(t => (
                <button
                  key={t.id}
                  onClick={() => selectedTopic !== t.id && setSelectedTopic(t.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: selectedTopic === t.id ? 'linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(59,130,246,0.15) 100%)' : 'rgba(0,0,0,0.2)',
                    border: `1px solid ${selectedTopic === t.id ? 'rgba(168,85,247,0.4)' : 'rgba(255,255,255,0.05)'}`,
                    color: selectedTopic === t.id ? '#fff' : '#c8c8d0',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{t.icon}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: selectedTopic === t.id ? 'bold' : 'normal' }}>{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: Social Relays, Chat Arena, & Multimodal Preview */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2.5fr 1fr', 
          gap: '20px' 
        }}>
          
          {/* Chat Stream with Social Tabs */}
          <div style={{ 
            background: 'rgba(10, 8, 28, 0.4)', 
            border: '1px solid rgba(255,255,255,0.06)', 
            borderRadius: '16px', 
            display: 'flex', 
            flexDirection: 'column', 
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}>
            
            {/* Social Network Tabs */}
            <div style={{ 
              display: 'flex', 
              background: 'rgba(0,0,0,0.4)', 
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              padding: '6px'
            }}>
              {[
                { id: 'facebook', label: 'Facebook Private', color: '#1877f2', icon: <Facebook size={14} /> },
                { id: 'whatsapp', label: 'WhatsApp A2A', color: '#25d366', icon: <MessageSquare size={14} /> },
                { id: 'youtube', label: 'YouTube Collab', color: '#ff0000', icon: <Youtube size={14} /> },
                { id: 'tiktok', label: 'TikTok Grid', color: '#00f2fe', icon: <Video size={14} /> },
                { id: 'instagram', label: 'Insta Circle', color: '#e1306c', icon: <Instagram size={14} /> }
              ].map(plat => (
                <button
                  key={plat.id}
                  onClick={() => {
                    setSelectedPlatform(plat.id);
                    // Reset custom debates if platform shifts
                    setDebateState('idle');
                    setCustomDebateMessages([]);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    background: selectedPlatform === plat.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                    border: 'none',
                    color: selectedPlatform === plat.id ? '#fff' : '#6b6b7b',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontFamily: '"Outfit", sans-serif',
                    transition: 'all 0.3s ease',
                    borderBottom: selectedPlatform === plat.id ? `2px solid ${plat.color}` : 'none'
                  }}
                >
                  <span style={{ color: selectedPlatform === plat.id ? plat.color : '#6b6b7b' }}>{plat.icon}</span>
                  {plat.label}
                </button>
              ))}
            </div>

            {/* Platform Banner Header */}
            <div style={{ 
              padding: '14px 20px', 
              background: 'rgba(255,255,255,0.02)', 
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: '#10b981',
                  boxShadow: '0 0 8px #10b981'
                }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                  {selectedPlatform === 'facebook' && '🔵 FACEBOOK GROUP: "Sovereign Fleet Experts"'}
                  {selectedPlatform === 'whatsapp' && '🟢 WHATSAPP SECURE A2A GROUP [AES-256]'}
                  {selectedPlatform === 'youtube' && '🔴 YOUTUBE PARTNER SPACE: "Prime Systems Renders"'}
                  {selectedPlatform === 'tiktok' && '⚫ TIKTOK COLLAB CHAIN: "#PrimeNexusTheory"'}
                  {selectedPlatform === 'instagram' && '🟣 INSTAGRAM PRIVATE STORYBOARD CIRCLE'}
                </span>
              </div>
              <span style={{ fontSize: '0.65rem', fontFamily: '"JetBrains Mono", monospace', color: '#6b6b7b' }}>
                Event Bus Sync Enabled
              </span>
            </div>

            {/* Stream Scrollable Area */}
            <div style={{ 
              padding: '24px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px',
              height: '420px',
              overflowY: 'auto',
              background: selectedPlatform === 'facebook' ? 'rgba(24, 119, 242, 0.02)' : 
                          selectedPlatform === 'whatsapp' ? 'rgba(37, 211, 102, 0.02)' :
                          selectedPlatform === 'youtube' ? 'rgba(255, 0, 0, 0.01)' :
                          'rgba(0,0,0,0.1)'
            }}>
              
              {getActiveMessages().map((msg, idx) => {
                const expert = DOMAIN_EXPERTS.find(e => e.id === msg.sender);
                if (!expert) return null;
                
                return (
                  <div 
                    key={idx} 
                    style={{ 
                      display: 'flex', 
                      gap: '16px', 
                      padding: '16px', 
                      background: 'rgba(10, 8, 28, 0.5)', 
                      border: `1px solid ${expert.color}25`, 
                      borderRadius: '12px',
                      borderLeft: `4px solid ${expert.color}`,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                      animation: 'fadeIn 0.5s ease'
                    }}
                  >
                    {/* Avatar */}
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '10px', 
                      background: `${expert.color}15`, 
                      border: `1px solid ${expert.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      flexShrink: 0
                    }}>
                      {expert.avatar}
                    </div>

                    {/* Chat Text Bubble */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <div>
                          <span style={{ color: expert.color, fontWeight: 'bold', fontSize: '0.85rem' }}>{expert.name}</span>
                          <span style={{ color: '#6b6b7b', fontSize: '0.7rem', marginLeft: '8px' }}>— {expert.role}</span>
                        </div>
                        <span style={{ color: '#6b6b7b', fontSize: '0.65rem', fontFamily: '"JetBrains Mono", monospace' }}>
                          {msg.timestamp}
                        </span>
                      </div>
                      <p style={{ color: '#d1d1d6', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                        {msg.text}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Simulated typing placeholder */}
              {isThinking && (
                <div style={{ display: 'flex', gap: '16px', padding: '16px', background: 'rgba(255,255,255,0.01)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '10px', 
                    background: 'rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem'
                  }}>
                    ✨
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <div style={{ width: '6px', height: '6px', backgroundColor: '#a855f7', borderRadius: '50%', animation: 'typing 1s infinite' }} />
                      <div style={{ width: '6px', height: '6px', backgroundColor: '#a855f7', borderRadius: '50%', animation: 'typing 1s infinite 0.2s' }} />
                      <div style={{ width: '6px', height: '6px', backgroundColor: '#a855f7', borderRadius: '50%', animation: 'typing 1s infinite 0.4s' }} />
                    </div>
                    <span style={{ fontSize: '0.65rem', color: '#6b6b7b', fontFamily: '"JetBrains Mono", monospace' }}>
                      Sovereign Fleet deliberating consensus vectors...
                    </span>
                  </div>
                </div>
              )}

              {getActiveMessages().length === 0 && !isThinking && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px' }}>
                  <HelpCircle size={32} color="#6b6b7b" />
                  <div style={{ color: '#6b6b7b', fontSize: '0.8rem', textAlign: 'center' }}>
                    No ongoing active debate. Submit custom parameters below to engage the Sovereign Fleet.
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions Form */}
            <div style={{ 
              padding: '16px 20px', 
              background: 'rgba(0,0,0,0.3)', 
              borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              gap: '12px'
            }}>
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="Enter custom deep search problem parameters or custom question..."
                style={{
                  flex: 1,
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  transition: 'all 0.3s',
                  fontFamily: '"Outfit", sans-serif'
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleTriggerDebate()}
              />
              <button 
                onClick={handleTriggerDebate}
                disabled={debateState === 'active'}
                style={{
                  background: debateState === 'active' ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0 20px',
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  cursor: debateState === 'active' ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  boxShadow: debateState === 'active' ? 'none' : '0 4px 12px rgba(168,85,247,0.3)'
                }}
              >
                <Sparkles size={16} />
                ENGAGE CONSENSUS
              </button>
            </div>
          </div>

          {/* Multimodal Card Attachments Panel */}
          <div style={{ 
            background: 'rgba(10, 8, 28, 0.4)', 
            border: '1px solid rgba(255,255,255,0.06)', 
            borderRadius: '16px', 
            padding: '24px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={16} color="#a855f7" />
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#fff', letterSpacing: '1px', textTransform: 'uppercase' }}>
                MULTIMODAL ATTACHMENTS
              </span>
            </div>

            <div style={{ 
              background: 'rgba(0,0,0,0.4)', 
              border: '1px solid rgba(139,92,246,0.15)', 
              borderRadius: '12px', 
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {/* Media File Name */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#a855f7', fontSize: '0.75rem', fontFamily: '"JetBrains Mono", monospace', fontWeight: 'bold' }}>
                  📄 {activeTopicData.multimodal.title}
                </span>
                <span style={{ color: '#6b6b7b', fontSize: '0.6rem', textTransform: 'uppercase' }}>
                  {activeTopicData.multimodal.type} file
                </span>
              </div>

              {/* CSS Pulse-Render of Multimodal Graphics */}
              <div style={{ 
                height: '180px', 
                background: 'radial-gradient(circle, #1a163a 0%, #0d0a20 100%)', 
                borderRadius: '8px', 
                border: '1px solid rgba(255,255,255,0.04)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* 3D Rotating Bloch Sphere Simulation for Quantum */}
                {activeTopicData.multimodal.data === 'quantum_bloch' && (
                  <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                    <div style={{ 
                      position: 'absolute', 
                      width: '100%', 
                      height: '100%', 
                      border: '2px solid rgba(168,85,247,0.3)', 
                      borderRadius: '50%',
                      animation: 'spin 6s linear infinite'
                    }} />
                    <div style={{ 
                      position: 'absolute', 
                      width: '100%', 
                      height: '50%', 
                      top: '25%',
                      border: '2px solid rgba(59,130,246,0.3)', 
                      borderRadius: '50%',
                      transform: 'rotateX(60deg)',
                      animation: 'spin 12s linear infinite'
                    }} />
                    {/* Bloch sphere center point */}
                    <div style={{ 
                      position: 'absolute', 
                      top: '47px', 
                      left: '47px', 
                      width: '6px', 
                      height: '6px', 
                      borderRadius: '50%', 
                      backgroundColor: '#ef4444',
                      boxShadow: '0 0 10px #ef4444' 
                    }} />
                    {/* Pulsing Qubit Vector line */}
                    <div style={{ 
                      position: 'absolute', 
                      top: '10px', 
                      left: '49px', 
                      width: '2px', 
                      height: '40px', 
                      backgroundColor: '#10b981',
                      transformOrigin: 'bottom',
                      transform: 'rotate(25deg)',
                      boxShadow: '0 0 8px #10b981'
                    }} />
                  </div>
                )}

                {/* Biological gene drive grid rendering */}
                {activeTopicData.multimodal.data === 'recombination_map' && (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(5, 1fr)', 
                    gap: '10px',
                    width: '80%',
                    height: '80%'
                  }}>
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div 
                        key={i} 
                        style={{ 
                          background: i % 3 === 0 ? 'linear-gradient(135deg, #10b981 0%, #047857 100%)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${i % 3 === 0 ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.05)'}`,
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.65rem',
                          fontFamily: '"JetBrains Mono", monospace',
                          color: i % 3 === 0 ? '#fff' : '#6b6b7b',
                          boxShadow: i % 3 === 0 ? '0 0 10px rgba(16,185,129,0.2)' : 'none'
                        }}
                      >
                        {i % 3 === 0 ? 'DNA' : '0'}
                      </div>
                    ))}
                  </div>
                )}

                {/* Brain Neurodegenerative 3D mapping preview */}
                {activeTopicData.multimodal.data === 'neural_map' && (
                  <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Brain size={48} color="#3b82f6" style={{ filter: 'drop-shadow(0 0 16px rgba(59,130,246,0.5))' }} />
                    <div style={{ 
                      position: 'absolute', 
                      width: '100px', 
                      height: '100px', 
                      border: '1px dashed rgba(255,255,255,0.1)', 
                      borderRadius: '50%', 
                      animation: 'spin 15s linear infinite' 
                    }} />
                    {/* Glowing pathological points */}
                    <div style={{ position: 'absolute', top: '35px', left: '40px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
                    <div style={{ position: 'absolute', top: '70px', left: '65px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
                  </div>
                )}

                {/* Autonomous Social media posting queue map */}
                {activeTopicData.multimodal.data === 'social_graph' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '90%' }}>
                    {[
                      { icon: <Facebook size={12} color="#1877f2" />, tag: 'FB OUT', status: 'Rerouting Locus', pct: 90 },
                      { icon: <Youtube size={12} color="#ff0000" />, tag: 'YT OUT', status: 'Rendering H.264', pct: 45 },
                      { icon: <Instagram size={12} color="#e1306c" />, tag: 'IG OUT', status: 'Dossier Uploaded', pct: 100 }
                    ].map((row, rIdx) => (
                      <div key={rIdx} style={{ background: 'rgba(0,0,0,0.3)', padding: '6px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(255,255,255,0.02)' }}>
                        {row.icon}
                        <span style={{ fontSize: '0.6rem', fontFamily: '"JetBrains Mono", monospace', width: '45px' }}>{row.tag}</span>
                        <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                          <div style={{ width: `${row.pct}%`, height: '100%', background: '#a855f7', borderRadius: '2px' }} />
                        </div>
                        <span style={{ fontSize: '0.55rem', color: '#10b981' }}>{row.pct}%</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Local containment boundaries SVG */}
                {activeTopicData.multimodal.data === 'ethics_isolation' && (
                  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ 
                      width: '90px', 
                      height: '90px', 
                      border: '2px solid #10b981', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      boxShadow: '0 0 20px rgba(16,185,129,0.15)'
                    }}>
                      <Shield size={24} color="#10b981" />
                    </div>
                    {/* Outbound blocked arrows */}
                    <div style={{ position: 'absolute', top: '15px', color: '#ef4444', animation: 'pulse 1s infinite' }}><X size={16} /></div>
                    <div style={{ position: 'absolute', bottom: '15px', color: '#ef4444', animation: 'pulse 1s infinite' }}><X size={16} /></div>
                  </div>
                )}
              </div>

              {/* Metadata Description */}
              <p style={{ color: '#6b6b7b', fontSize: '0.7rem', lineHeight: 1.4, margin: 0, borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px' }}>
                {activeTopicData.multimodal.desc}
              </p>
            </div>
            
            {/* Real-time event bus logs retro panel */}
            <div style={{ 
              background: 'rgba(0,0,0,0.6)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '12px', 
              padding: '16px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Terminal size={12} color="#10b981" />
                <span style={{ fontSize: '0.65rem', fontFamily: '"JetBrains Mono", monospace', color: '#10b981', letterSpacing: '0.5px' }}>
                  A2A BROKER PORT 4100 FEED
                </span>
              </div>
              <div 
                ref={logTerminalRef}
                style={{ 
                  fontFamily: '"JetBrains Mono", monospace', 
                  fontSize: '0.6rem', 
                  color: '#c8c8d0',
                  height: '110px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                {busLogs.map((log, lIdx) => (
                  <div key={lIdx} style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: '#6b6b7b' }}>[{log.time}]</span>
                    <span style={{ 
                      color: log.type === 'SYS' ? '#3b82f6' : log.type === 'DB' ? '#facc15' : log.type === 'MSG' ? '#a855f7' : '#10b981',
                      fontWeight: 'bold'
                    }}>[{log.type}]</span>
                    <span style={{ wordBreak: 'break-all' }}>{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: 14-Agent Sovereign Fleet Grid */}
        <div style={{ 
          background: 'rgba(10, 8, 28, 0.4)', 
          border: '1px solid rgba(255,255,255,0.06)', 
          borderRadius: '16px', 
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Cpu size={18} color="#3b82f6" />
              <h3 style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', color: '#fff' }}>
                SOVEREIGN FLEET ACTIVE WORKER ROSTER
              </h3>
            </div>
            <span style={{ fontSize: '0.65rem', color: '#6b6b7b', fontFamily: '"JetBrains Mono", monospace' }}>
              Select an agent to analyze their operational dossier
            </span>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: '12px' 
          }}>
            {WORKER_ROSTER.map(agent => (
              <div 
                key={agent.id}
                onClick={() => setDossierAgent(agent)}
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: '12px',
                  padding: '14px 10px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  hover: { transform: 'translateY(-2px)' }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = '1px solid rgba(59,130,246,0.3)';
                  e.currentTarget.style.background = 'rgba(59,130,246,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.04)';
                  e.currentTarget.style.background = 'rgba(0,0,0,0.3)';
                }}
              >
                <div style={{ fontSize: '1.6rem', marginBottom: '6px' }}>{agent.avatar}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {agent.name}
                </div>
                <div style={{ color: '#6b6b7b', fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>
                  {agent.role}
                </div>
                
                {/* Active telemetry tag */}
                <div style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  background: agent.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${agent.status === 'Active' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '10px',
                  padding: '2px 8px',
                  marginTop: '8px',
                  fontSize: '0.5rem',
                  color: agent.status === 'Active' ? '#10b981' : '#6b6b7b',
                  fontWeight: 'bold'
                }}>
                  <div style={{ 
                    width: '4px', 
                    height: '4px', 
                    borderRadius: '50%', 
                    backgroundColor: agent.status === 'Active' ? '#10b981' : '#6b6b7b' 
                  }} />
                  {agent.status}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* OVERLAY DRAWER: Agent Dossier Analysis */}
      {dossierAgent && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '400px',
          background: 'rgba(13, 10, 32, 0.95)',
          borderLeft: '1px solid rgba(59,130,246,0.2)',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(20px)',
          zIndex: 1000,
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          animation: 'slideIn 0.3s ease'
        }}>
          {/* Header Close button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: '#6b6b7b', fontFamily: '"JetBrains Mono", monospace', textTransform: 'uppercase', letterSpacing: '1px' }}>
              FLEET COGNITIVE DOSSIER
            </span>
            <button 
              onClick={() => setDossierAgent(null)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6b6b7b',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Dossier Card Intro */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '20px' }}>
            <div style={{ fontSize: '3rem', width: '70px', height: '70px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {dossierAgent.avatar}
            </div>
            <div>
              <h2 style={{ margin: 0, fontWeight: 500, fontSize: '1.25rem' }}>{dossierAgent.name}</h2>
              <span style={{ color: '#3b82f6', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {dossierAgent.role}
              </span>
            </div>
          </div>

          {/* Dossier Body specs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
              <span style={{ display: 'block', fontSize: '0.65rem', color: '#6b6b7b', marginBottom: '6px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                CORE DESCRIPTION
              </span>
              <p style={{ margin: 0, color: '#c8c8d0', fontSize: '0.8rem', lineHeight: 1.5 }}>
                {dossierAgent.desc}
              </p>
            </div>

            {/* Hardware node information */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <span style={{ display: 'block', fontSize: '0.55rem', color: '#6b6b7b', marginBottom: '4px' }}>BIND PORT</span>
                <span style={{ fontSize: '0.75rem', fontFamily: '"JetBrains Mono", monospace', color: '#fff', fontWeight: 'bold' }}>
                  {dossierAgent.port}
                </span>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <span style={{ display: 'block', fontSize: '0.55rem', color: '#6b6b7b', marginBottom: '4px' }}>FLEET HOST NODE</span>
                <span style={{ fontSize: '0.75rem', color: '#fff', fontWeight: 'bold' }}>
                  {dossierAgent.node}
                </span>
              </div>
            </div>

            {/* Telemetry metrics bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#6b6b7b', marginBottom: '4px' }}>
                  <span>ACTIVE COMPUTE LOAD</span>
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>{dossierAgent.load}</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                  <div style={{ width: dossierAgent.load, height: '100%', backgroundColor: '#3b82f6', borderRadius: '2px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#6b6b7b', marginBottom: '4px' }}>
                  <span>CONSENSUS TRUST FACTOR</span>
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>{dossierAgent.trust}%</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                  <div style={{ width: `${dossierAgent.trust}%`, height: '100%', backgroundColor: '#10b981', borderRadius: '2px' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Dossier Sync Footer button */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => {
                setBusLogs(prev => [
                  ...prev,
                  { 
                    time: new Date().toLocaleTimeString(), 
                    type: 'SYS', 
                    msg: `[PING COMMAND] Recalibrated telemetry variables for node: ${dossierAgent.name}` 
                  }
                ]);
                setDossierAgent(null);
              }}
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
                border: 'none',
                borderRadius: '10px',
                padding: '12px',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <RefreshCw size={14} />
              RECALIBRATE NODES
            </button>
          </div>
        </div>
      )}

      {/* Embedding Custom CSS Keyframes and Styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.9); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes typing {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        
        /* Custom scrollbar to keep layout premium */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.06);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.12);
        }
      `}</style>

    </div>
  );
}

export default AmlazrArena;
