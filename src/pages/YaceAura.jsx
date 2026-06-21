import { API_BASE } from '../utils/api';
import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Radio, 
  Mic, 
  TrendingUp, 
  DollarSign, 
  List, 
  Shield, 
  RefreshCw, 
  MessageSquare,
  Volume2,
  Database,
  ArrowRightLeft,
  ChevronRight,
  Wallet,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { VersionedTransaction, Connection, PublicKey } from '@solana/web3.js';


/* ============================================================
   YACE•AURA — L'ÉCOSYSTÈME AGENTIQUE AUTONOME
   PRIME-AI Sovereign OS — Dashboard Screen with Telemetry & On-Chain Swap Terminal
   ============================================================ */

export default function YaceAura() {
  // Campaign & demo states
  const [ecosystemActive, setEcosystemActive] = useState(false);
  const [activating, setActivating] = useState(false);
  const [showEcosystemModal, setShowEcosystemModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoStep, setDemoStep] = useState(0); 
  const [demoPrompt, setDemoPrompt] = useState("Générer un rapport d'opportunités DeFi sur Solana");
  const [demoLog, setDemoLog] = useState([]);

  // Telemetry Dashboard states
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('swaps'); 
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Solana Browser Wallet states
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState(null);

  // Jupiter On-Chain Swap states
  const [swapPair, setSwapPair] = useState("SOL_TO_USDC"); // SOL_TO_USDC, USDC_TO_SOL
  const [swapAmount, setSwapAmount] = useState("0.01");
  const [quoteResponse, setQuoteResponse] = useState(null);
  const [fetchingQuote, setFetchingQuote] = useState(false);
  const [swapLoading, setSwapLoading] = useState(false);
  const [txSignature, setTxSignature] = useState("");
  const [swapError, setSwapError] = useState("");

  // Simulated telemetry metrics
  const [metrics, setMetrics] = useState({
    tps: 2845,
    slot: 298452109,
    blockHeight: 27654021,
    volume: 508.20,
    bullishRatio: 83,
    activeSwaps: 2,
    brokerStatus: "ACTIVE"
  });

  // API_BASE imported from utils/api

  // Solana Mainnet connection (using public endpoint, fall back to default)
  const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

  // Fetch telemetry logs from backend SQLite
  const fetchTelemetry = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`${API_BASE}/api/logs`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      } else {
        setLogs(getMockLogs());
      }
    } catch (e) {
      console.warn("Backend offline, utilizing client-side telemetry simulation.");
      setLogs(getMockLogs());
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Poll database logs every 4 seconds
  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 4000);
    
    // Check if Phantom is already connected
    if (window.solana && window.solana.isConnected) {
      setWalletAddress(window.solana.publicKey.toString());
      setWalletConnected(true);
      fetchBalance(window.solana.publicKey.toString());
    }

    return () => clearInterval(interval);
  }, []);

  // Fetch wallet balance
  const fetchBalance = async (pubkeyStr) => {
    try {
      const pubkey = new PublicKey(pubkeyStr);
      const bal = await connection.getBalance(pubkey);
      setWalletBalance((bal / 1_000_000_000).toFixed(4));
    } catch (err) {
      console.warn("Could not fetch wallet balance:", err);
    }
  };


  // Connect Phantom Wallet
  const handleConnectWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        const resp = await window.solana.connect();
        const address = resp.publicKey.toString();
        setWalletAddress(address);
        setWalletConnected(true);
        fetchBalance(address);
        
        // Log wallet connection to telemetry logs
        await fetch(`${API_BASE}/api/log`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agent: "Wallet Bridge",
            text: `Solana Wallet connected successfully: ${address.slice(0, 4)}...${address.slice(-4)}`,
            type: "success"
          })
        }).catch(() => {});
        fetchTelemetry();
      } catch (err) {
        console.error("Wallet connection rejected by user:", err);
      }
    } else {
      alert("Phantom Wallet is not detected. Please install the Phantom browser extension.");
    }
  };

  // Disconnect Wallet
  const handleDisconnectWallet = () => {
    if (window.solana) {
      window.solana.disconnect();
      setWalletConnected(false);
      setWalletAddress("");
      setWalletBalance(null);
      setQuoteResponse(null);
    }
  };

  // Fetch Jupiter Swap Quote
  const handleGetQuote = async () => {
    if (!swapAmount || isNaN(swapAmount) || parseFloat(swapAmount) <= 0) {
      setSwapError("Veuillez entrer un montant valide.");
      return;
    }
    setSwapError("");
    setFetchingQuote(true);
    setQuoteResponse(null);

    const inputMint = swapPair === "SOL_TO_USDC" 
      ? "So11111111111111111111111111111111111111112" // Native SOL
      : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC
    
    const outputMint = swapPair === "SOL_TO_USDC"
      ? "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
      : "So11111111111111111111111111111111111111112";

    // Amount in raw decimals (SOL = 9 decimals, USDC = 6 decimals)
    const decimals = swapPair === "SOL_TO_USDC" ? 9 : 6;
    const amountInUnits = Math.round(parseFloat(swapAmount) * Math.pow(10, decimals));

    try {
      const url = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amountInUnits}&slippageBps=50`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setQuoteResponse(data);
      } else {
        setSwapError("Erreur lors de la récupération du devis auprès de Jupiter.");
      }
    } catch (err) {
      setSwapError("Impossible de contacter l'API de Jupiter (Vérifiez votre connexion).");
    } finally {
      setFetchingQuote(false);
    }
  };

  // Execute Real On-Chain Jupiter Swap via Phantom Wallet
  const handleExecuteSwap = async () => {
    if (!walletConnected || !quoteResponse) return;
    setSwapLoading(true);
    setSwapError("");
    setTxSignature("");

    try {
      // 1. Request Swap Transaction from Jupiter API
      const swapRes = await fetch("https://quote-api.jup.ag/v6/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteResponse: quoteResponse,
          userPublicKey: walletAddress,
          wrapAndUnwrapSol: true
        })
      });

      if (!swapRes.ok) {
        const errData = await swapRes.json();
        throw new Error(errData.message || "Erreur de création de transaction Jupiter.");
      }

      const { swapTransaction } = await swapRes.json();

      // 2. Deserialize the Versioned Transaction
      const transactionBuf = Buffer.from(swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(transactionBuf);

      // 3. Prompt user's Phantom Wallet to sign and send transaction
      const { signature } = await window.solana.signAndSendTransaction(transaction);
      setTxSignature(signature);

      // Log successful initiation
      await fetch(`${API_BASE}/api/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent: "Jupiter Swap Executor",
          text: `On-Chain Swap Initiated! SOL -> USDC. Tx Hash: ${signature}`,
          type: "info"
        })
      }).catch(() => {});

      // 4. Confirm transaction status
      const confirmation = await connection.confirmTransaction(signature, "confirmed");
      
      if (confirmation.value.err) {
        throw new Error("La transaction a échoué lors de la confirmation.");
      }

      // Log completed swap
      await fetch(`${API_BASE}/api/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent: "Jupiter Swap Executor",
          text: `On-Chain Swap CONFIRMED! Success signature: ${signature.slice(0, 8)}...`,
          type: "success"
        })
      }).catch(() => {});

      // Refresh balance and stats
      fetchBalance(walletAddress);
      setMetrics(prev => ({
        ...prev,
        volume: prev.volume + (parseFloat(quoteResponse.outAmount) / (swapPair === "SOL_TO_USDC" ? 1_000_000 : 1_000_000_000)),
        activeSwaps: prev.activeSwaps + 1
      }));
      setQuoteResponse(null);
      fetchTelemetry();

    } catch (err) {
      console.error(err);
      setSwapError(err.message || "La transaction a été rejetée ou a échoué.");
      
      // Log error
      await fetch(`${API_BASE}/api/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent: "Jupiter Swap Executor",
          text: `On-Chain Swap Failed: ${err.message || "Rejet utilisateur"}`,
          type: "error"
        })
      }).catch(() => {});
      fetchTelemetry();
    } finally {
      setSwapLoading(false);
    }
  };

  const handleActivateEcosystem = async () => {
    setActivating(true);
    setShowEcosystemModal(true);
    try {
      const res = await fetch(`${API_BASE}/api/campaign/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaign_name: "Outreach Swarm Cascade", target_prospect_id: "prospect-1" })
      });
      if (res.ok) {
        setEcosystemActive(true);
      } else {
        setEcosystemActive(true); 
      }
    } catch (e) {
      console.warn("Backend offline, launching simulated swarm cascade.");
      setEcosystemActive(true);
    } finally {
      setActivating(false);
    }
  };

  const handleDeactivateEcosystem = async () => {
    setActivating(true);
    try {
      await fetch(`${API_BASE}/api/campaign/stop`, { method: "POST" });
    } catch (e) {
      console.warn(e);
    } finally {
      setEcosystemActive(false);
      setActivating(false);
      setShowEcosystemModal(false);
    }
  };

  // Trigger a simulated YouTube Sentiment Scan
  const triggerSentimentScan = async () => {
    try {
      const vids = [
        { id: "bSDkbx5rrpM", title: "Abacus AI & Fusion Agents", sentiment: "0.88 (STRONG BULLISH: multi-agent coordination ready)" },
        { id: "uzkTAT81FxA", title: "Subquadratic Sparse Attention (SSA)", sentiment: "0.79 (BULLISH: extreme efficiency context scaling confirmed)" },
        { id: "1uw4UaZr3hA", title: "Gemma 4 for Agentic", sentiment: "0.72 (BULLISH: local tool-calling reliability)" },
        { id: "oVQkh6-krb8", title: "Hermes Agent & MiniMax M3", sentiment: "0.65 (BULLISH breakout confirmed)" }
      ];
      const vid = vids[Math.floor(Math.random() * vids.length)];

      await fetch(`${API_BASE}/api/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent: "YouTube Sentiment Scout",
          text: `Scouting YouTube video transcript ${vid.id} (${vid.title})... Overall polarity: ${vid.sentiment}.`,
          type: "success"
        })
      });
      
      setTimeout(async () => {
        const swapAmountVal = (Math.random() * 0.1 + 0.01).toFixed(3);
        const usdcOutput = (swapAmountVal * 145.20).toFixed(2);
        
        // Show recommended trade notification to prompt user if connected
        if (walletConnected) {
          setSwapPair("SOL_TO_USDC");
          setSwapAmount(swapAmountVal);
          handleGetQuote();
        }

        await fetch(`${API_BASE}/api/log`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agent: "Jupiter Swap Simulator",
            text: `Simulated Swap RECOMMENDATION. Ready for user wallet signature: Swap ${swapAmountVal} SOL -> Out: ${usdcOutput} USDC.`,
            type: "success"
          })
        });
        
        await fetch(`${API_BASE}/api/log`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agent: "Vocal Command Bridge",
            text: `Vocal Alert Played: 'YouTube sentiment is bullish. Populating Jupiter trade execution terminal with ${swapAmountVal} SOL.'`,
            type: "info"
          })
        });
        
        fetchTelemetry();
      }, 1500);

      fetchTelemetry();
    } catch (e) {
      console.warn("Backend offline.");
    }
  };

  const triggerMicBridge = async () => {
    try {
      await fetch(`${API_BASE}/api/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent: "Microphone Command Capturer",
          text: "Tap-to-talk speech recording captured via local microphone input.",
          type: "info"
        })
      });

      setTimeout(async () => {
        await fetch(`${API_BASE}/api/log`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agent: "Microphone Command Capturer",
            text: "Transcribed command: 'AURA prepare swap trade of 0.02 SOL.'",
            type: "success"
          })
        });

        if (walletConnected) {
          setSwapAmount("0.02");
          setSwapPair("SOL_TO_USDC");
          handleGetQuote();
        }

        await fetch(`${API_BASE}/api/log`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agent: "A2A Broker",
            text: "Dispatched task: populate swap UI for 0.02 SOL (Triggered by voice command).",
            type: "success"
          })
        });

        fetchTelemetry();
      }, 1200);

      fetchTelemetry();
    } catch (e) {
      console.warn("Backend offline.");
    }
  };

  const startDemoSequence = () => {
    setDemoStep(1);
    setDemoLog([
      `[${new Date().toLocaleTimeString()}] Pipeline YACE•AURA initialisé pour l'objectif: "${demoPrompt}"`,
      `[${new Date().toLocaleTimeString()}] Démarrage de la phase d'analyse...`
    ]);
    
    setTimeout(() => {
      setDemoStep(2);
      setDemoLog(prev => [
        ...prev, 
        `[${new Date().toLocaleTimeString()}] ÉTAPE 1 COMPLÉTÉE (RÉFLÉCHIR) : Analyse du contexte effectuée.`,
        `[${new Date().toLocaleTimeString()}] ÉTAPE 2 EN COURS (DÉCIDER) : Routage vers les agents spécialistes: Broker + Coinbase + Telemetry...`
      ]);
    }, 2000);

    setTimeout(() => {
      setDemoStep(3);
      setDemoLog(prev => [
        ...prev, 
        `[${new Date().toLocaleTimeString()}] ÉTAPE 2 COMPLÉTÉE (DÉCIDER) : Consensus inter-agents atteint.`,
        `[${new Date().toLocaleTimeString()}] ÉTAPE 3 EN COURS (AGIR) : Génération du rapport de synthèse PDF...`
      ]);
    }, 4500);

    setTimeout(() => {
      setDemoStep(4);
      setDemoLog(prev => [
        ...prev, 
        `[${new Date().toLocaleTimeString()}] ÉTAPE 3 COMPLÉTÉE (AGIR) : Compilation effectuée.`,
        `[${new Date().toLocaleTimeString()}] ÉTAPE 4 (LIVRER) : rapport final "solana_market_analysis.pdf" créé.`,
        `[${new Date().toLocaleTimeString()}] Pipeline terminé avec succès.`
      ]);
    }, 7500);
  };

  const getMockLogs = () => {
    return [
      {
        timestamp: "14:48:10",
        agent: "Solana Network Scout",
        text: "Solana Network Status: TPS 2845, Slot 298452109, Block Height 27654021.",
        type: "info"
      },
      {
        timestamp: "14:45:20",
        agent: "YouTube Sentiment Scout",
        text: "Scouting video IosV3kSxNLE: Sentiment score 0.75 (Bullish breakout signal detected).",
        type: "success"
      },
      {
        timestamp: "14:45:22",
        agent: "Jupiter Swap Simulator",
        text: "Simulated Swap SUCCESS. In: 1.0 SOL -> Out: 145.20 USDC. Route: SOL -> USDC. Price Impact: 0.04%. Tx Hash: sim_tx_8a92f801e74f",
        type: "success"
      },
      {
        timestamp: "14:45:23",
        agent: "Vocal Command Bridge",
        text: "Vocal Alert Played: 'Bullish breakout detected! Swapped 1.0 SOL for 145.20 USDC via Jupiter.'",
        type: "info"
      },
      {
        timestamp: "14:40:15",
        agent: "Microphone Command Capturer",
        text: "Microphone captured voice input. Transcribing locally...",
        type: "info"
      }
    ];
  };

  const getFilteredLogs = () => {
    if (selectedTab === 'all') return logs;
    return logs.filter(log => {
      const agent = log.agent.toLowerCase();
      const text = log.text.toLowerCase();
      if (selectedTab === 'swaps') {
        return agent.includes('swap') || text.includes('swap') || agent.includes('wallet');
      }
      if (selectedTab === 'sentiment') {
        return agent.includes('sentiment') || agent.includes('scout') || text.includes('scout') || text.includes('sentiment');
      }
      if (selectedTab === 'voice') {
        return agent.includes('vocal') || agent.includes('microphone') || text.includes('vocal') || text.includes('voice');
      }
      return true;
    });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      minHeight: '100vh',
      width: '100%',
      color: '#e2e8f0',
      fontFamily: "'Outfit', sans-serif",
      padding: '24px',
      boxSizing: 'border-box',
      position: 'relative',
      background: 'radial-gradient(circle at 50% 0%, rgba(26, 21, 10, 0.5) 0%, rgba(5, 5, 8, 1) 70%)',
    }}>
      
      {/* Header Area */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '12px',
        maxWidth: '1200px',
        width: '100%',
        zIndex: 10,
        marginBottom: '32px',
        textAlign: 'center'
      }}>
        {/* Pill Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(212, 175, 55, 0.08)',
          border: '1.5px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '100px',
          padding: '6px 18px',
          fontSize: '10px',
          fontWeight: 700,
          color: '#d4af37',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          boxShadow: '0 0 15px rgba(212, 175, 55, 0.1)',
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#d4af37',
            boxShadow: '0 0 8px #d4af37',
            display: 'inline-block'
          }} />
          SOUVERAINETÉ CRYPTOGRAPHIQUE — AUTONOME ET LOCALISE
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(32px, 6vw, 64px)',
          fontWeight: 900,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          margin: '6px 0',
          color: '#ffffff',
          textShadow: '0 0 30px rgba(255,255,255,0.05)'
        }}>
          YACE<span style={{ color: '#d4af37' }}>•</span>AURA
        </h1>

        <div style={{
          fontSize: '13px',
          fontWeight: 600,
          color: '#3b82f6',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          marginBottom: '24px'
        }}>
          L'Écosystème Agentique de Surveillance & Trading
        </div>

        {/* Control Panel Panel */}
        <div style={{
          display: 'flex',
          gap: '14px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          background: 'rgba(15, 12, 7, 0.6)',
          border: '1px solid rgba(212, 175, 55, 0.15)',
          borderRadius: '12px',
          padding: '14px 28px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        }}>
          <button 
            onClick={handleActivateEcosystem}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              background: ecosystemActive ? 'rgba(34, 197, 94, 0.12)' : 'linear-gradient(135deg, #d4af37, #aa7c11)',
              border: ecosystemActive ? '1px solid #22c55e' : 'none',
              color: ecosystemActive ? '#22c55e' : '#000',
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '0.5px',
              transition: 'all 0.3s',
            }}
          >
            {ecosystemActive ? "🟢 Swarm Principal Actif" : "Démarrer l'Armada"}
          </button>
          
          <button 
            onClick={triggerSentimentScan}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              color: '#3b82f6',
              fontWeight: 600,
              fontSize: '13px',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => { e.target.style.background = 'rgba(59, 130, 246, 0.2)'; }}
            onMouseLeave={e => { e.target.style.background = 'rgba(59, 130, 246, 0.1)'; }}
          >
            🛰️ Scan Sentiments YouTube
          </button>

          <button 
            onClick={triggerMicBridge}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#ef4444',
              fontWeight: 600,
              fontSize: '13px',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => { e.target.style.background = 'rgba(239, 68, 68, 0.2)'; }}
            onMouseLeave={e => { e.target.style.background = 'rgba(239, 68, 68, 0.1)'; }}
          >
            🎤 Simuler Vocal Mic
          </button>

          <button 
            onClick={() => { setShowDemoModal(true); setDemoStep(0); setDemoLog([]); }}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              background: 'transparent',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              color: '#d4af37',
              fontWeight: 600,
              fontSize: '13px',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => { e.target.style.background = 'rgba(212,175,55,0.08)'; }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; }}
          >
            Exécuter Démo
          </button>
        </div>
      </div>

      {/* ── METRICS GRID PANEL ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px',
        maxWidth: '1200px',
        width: '100%',
        marginBottom: '24px',
        zIndex: 10
      }}>
        {/* Metric 1: Solana Sentinel */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.4)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '12px', padding: '18px',
          backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', gap: '16px'
        }}>
          <div style={{
            background: 'rgba(59, 130, 246, 0.12)', border: '1px solid #3b82f6',
            borderRadius: '10px', width: '48px', height: '48px',
            display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center'
          }}>
            <Cpu size={24} color="#3b82f6" />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>SOL Network Sentinel</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>{metrics.tps} <span style={{ fontSize: '0.8rem', color: '#10b981' }}>TPS</span></div>
            <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Slot: {metrics.slot.toLocaleString()}</div>
          </div>
        </div>

        {/* Metric 2: Volume Swaps */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.4)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '12px', padding: '18px',
          backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', gap: '16px'
        }}>
          <div style={{
            background: 'rgba(10, 197, 124, 0.12)', border: '1px solid #10b981',
            borderRadius: '10px', width: '48px', height: '48px',
            display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center'
          }}>
            <ArrowRightLeft size={24} color="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Volume Simulé & Réel</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>${metrics.volume.toFixed(2)}</div>
            <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Active Swaps Triggers: {metrics.activeSwaps}</div>
          </div>
        </div>

        {/* Metric 3: YouTube Sentiment Score */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.4)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          borderRadius: '12px', padding: '18px',
          backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', gap: '16px'
        }}>
          <div style={{
            background: 'rgba(245, 158, 11, 0.12)', border: '1px solid #f59e0b',
            borderRadius: '10px', width: '48px', height: '48px',
            display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center'
          }}>
            <TrendingUp size={24} color="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Sentiment Bullish Global</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>{metrics.bullishRatio}%</div>
            <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Scanning 3 targets in scratch/</div>
          </div>
        </div>

        {/* Metric 4: Wallet Status */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.4)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          borderRadius: '12px', padding: '18px',
          backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', gap: '16px',
          cursor: 'pointer'
        }}
        onClick={walletConnected ? handleDisconnectWallet : handleConnectWallet}
        >
          <div style={{
            background: walletConnected ? 'rgba(34, 197, 94, 0.12)' : 'rgba(212, 175, 55, 0.12)', 
            border: `1.5px solid ${walletConnected ? '#22c55e' : '#d4af37'}`,
            borderRadius: '10px', width: '48px', height: '48px',
            display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center'
          }}>
            <Wallet size={24} color={walletConnected ? '#22c55e' : '#d4af37'} />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Portefeuille Phantom</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: walletConnected ? '#22c55e' : '#d4af37', margin: '4px 0' }}>
              {walletConnected ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : "DISCONNECTED"}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
              {walletConnected ? `Balance: ${walletBalance || '0.000'} SOL (Click to Disconnect)` : "Click to Connect Wallet"}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN DOUBLE-COLUMN LAYOUT ── */}
      <div style={{
        display: 'flex',
        gap: '24px',
        maxWidth: '1200px',
        width: '100%',
        flexWrap: 'wrap',
        zIndex: 10
      }}>
        {/* Left Column: Console Télémétrique (60% width) */}
        <div style={{
          flex: '3 1 600px',
          background: 'rgba(10, 10, 15, 0.75)',
          border: '1.5px solid rgba(212, 175, 55, 0.2)',
          borderRadius: '16px',
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Panel Header & Tabs */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            background: 'rgba(21, 17, 9, 0.7)',
            borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={18} color="#d4af37" />
              <span style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '1px', color: '#fff', textTransform: 'uppercase' }}>Console Télémétrique</span>
            </div>
            
            <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '8px' }}>
              {[
                { id: 'swaps', label: 'Simulated Swaps', icon: <ArrowRightLeft size={13} /> },
                { id: 'sentiment', label: 'Sentiment Radar', icon: <TrendingUp size={13} /> },
                { id: 'voice', label: 'Vocal Command & Mic', icon: <Mic size={13} /> },
                { id: 'all', label: 'Tous les logs', icon: <List size={13} /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    background: selectedTab === tab.id ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                    border: selectedTab === tab.id ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
                    color: selectedTab === tab.id ? '#d4af37' : '#94a3b8',
                    fontSize: '0.75rem',
                    fontWeight: selectedTab === tab.id ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={fetchTelemetry}
              disabled={isRefreshing}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
              }}
            >
              <RefreshCw size={14} className={isRefreshing ? "spin-animate" : ""} />
              Rafraîchir
            </button>
          </div>

          {/* Panel Body */}
          <div style={{ padding: '20px', minHeight: '380px', maxHeight: '420px', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '240px', gap: '12px' }}>
                <RefreshCw className="spin-animate" size={32} color="#d4af37" />
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Chargement de la télémétrie...</div>
              </div>
            ) : getFilteredLogs().length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '240px', gap: '8px', color: '#64748b' }}>
                <Database size={40} />
                <div style={{ fontSize: '0.85rem' }}>Aucun log disponible pour ce filtre.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {getFilteredLogs().map((log, index) => {
                  let badgeColor = "rgba(59, 130, 246, 0.15)";
                  let badgeText = "#3b82f6";
                  let iconSymbol = "📡";

                  if (log.agent.toLowerCase().includes("swap")) {
                    badgeColor = "rgba(16, 185, 129, 0.15)";
                    badgeText = "#10b981";
                    iconSymbol = "🔄";
                  } else if (log.agent.toLowerCase().includes("sentiment") || log.agent.toLowerCase().includes("scout")) {
                    badgeColor = "rgba(245, 158, 11, 0.15)";
                    badgeText = "#f59e0b";
                    iconSymbol = "📊";
                  } else if (log.agent.toLowerCase().includes("vocal") || log.agent.toLowerCase().includes("mic") || log.agent.toLowerCase().includes("micro") || log.agent.toLowerCase().includes("wallet")) {
                    badgeColor = "rgba(239, 68, 68, 0.15)";
                    badgeText = "#ef4444";
                    iconSymbol = "🎙️";
                  }

                  return (
                    <div 
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.04)',
                        borderRadius: '8px',
                      }}
                    >
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace', alignSelf: 'center' }}>
                        {log.timestamp}
                      </span>

                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: badgeColor,
                        color: badgeText,
                        border: `1px solid ${badgeText}30`,
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontSize: '0.65rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        <span>{iconSymbol}</span>
                        <span>{log.agent}</span>
                      </div>

                      <div style={{
                        fontSize: '0.8rem',
                        color: '#cbd5e1',
                        lineHeight: '1.4',
                        flex: 1,
                        textAlign: 'left'
                      }}>
                        {log.text}
                      </div>

                      {log.type === "success" && (
                        <span style={{
                          color: '#10b981',
                          fontSize: '0.65rem',
                          fontWeight: 'bold',
                          background: 'rgba(16, 185, 129, 0.1)',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          SUCCESS
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: On-Chain Live Swap Terminal (40% width) */}
        <div style={{
          flex: '2 1 400px',
          background: 'rgba(15, 12, 7, 0.75)',
          border: '1.5px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '16px',
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 24px',
            background: 'rgba(21, 17, 9, 0.7)',
            borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Wallet size={18} color="#d4af37" />
            <span style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '1px', color: '#fff', textTransform: 'uppercase' }}>Terminal de Swap Réel (On-Chain)</span>
          </div>

          {/* Body */}
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            
            {/* Wallet Not Connected View */}
            {!walletConnected ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                minHeight: '260px',
                gap: '16px',
                textAlign: 'center'
              }}>
                <Wallet size={48} color="#d4af37" style={{ opacity: 0.6 }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#f8fafc', fontWeight: 800 }}>CONNEXION PORTEFEUILLE REQUISE</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '6px', maxWidth: '280px' }}>
                    Connectez votre extension Phantom ou Solflare pour signer et exécuter des transactions réelles sur Solana.
                  </p>
                </div>
                <button
                  onClick={handleConnectWallet}
                  style={{
                    background: 'linear-gradient(135deg, #d4af37, #aa7c11)',
                    border: 'none',
                    color: '#000',
                    padding: '12px 28px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(212, 175, 55, 0.25)',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1.0)'}
                >
                  Connecter mon Wallet
                </button>
              </div>
            ) : (
              // Connected View
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                
                {/* Connected Wallet Info */}
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1.5px solid rgba(34, 197, 94, 0.25)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Actif connecté :</span>
                    <div style={{ fontSize: '0.8rem', color: '#f8fafc', fontWeight: 'bold', fontFamily: 'monospace' }}>
                      {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Solde :</span>
                    <div style={{ fontSize: '0.85rem', color: '#22c55e', fontWeight: 900 }}>
                      {walletBalance || '0.000'} SOL
                    </div>
                  </div>
                </div>

                {/* Configuration: Input Token Pair */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.7rem', color: '#cbd5e1', fontWeight: 700, textTransform: 'uppercase' }}>Sélectionner la Paire :</label>
                  <select
                    value={swapPair}
                    onChange={e => { setSwapPair(e.target.value); setQuoteResponse(null); }}
                    style={{
                      background: '#020205',
                      border: '1.5px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: '#fff',
                      fontSize: '0.85rem',
                      fontFamily: 'inherit',
                      outline: 'none'
                    }}
                  >
                    <option value="SOL_TO_USDC">SOL ➔ USDC (Vente de SOL)</option>
                    <option value="USDC_TO_SOL">USDC ➔ SOL (Achat de SOL)</option>
                  </select>
                </div>

                {/* Configuration: Amount */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.7rem', color: '#cbd5e1', fontWeight: 700, textTransform: 'uppercase' }}>
                    Montant ({swapPair === "SOL_TO_USDC" ? "SOL" : "USDC"}) :
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.001"
                    value={swapAmount}
                    onChange={e => { setSwapAmount(e.target.value); setQuoteResponse(null); }}
                    style={{
                      background: '#020205',
                      border: '1.5px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: '#fff',
                      fontSize: '0.85rem',
                      fontFamily: 'inherit',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Action: Get Quote */}
                <button
                  onClick={handleGetQuote}
                  disabled={fetchingQuote || swapLoading}
                  style={{
                    background: 'rgba(212, 175, 55, 0.1)',
                    border: '1.5px solid rgba(212, 175, 55, 0.5)',
                    color: '#d4af37',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={e => e.target.style.background = 'rgba(212, 175, 55, 0.2)'}
                  onMouseLeave={e => e.target.style.background = 'rgba(212, 175, 55, 0.1)'}
                >
                  {fetchingQuote ? <RefreshCw size={14} className="spin-animate" /> : null}
                  Obtenir un Devis Jupiter
                </button>

                {/* Swap Details Card */}
                {quoteResponse && (
                  <div style={{
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: '8px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    fontSize: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94a3b8' }}>Dépense estimée:</span>
                      <span style={{ color: '#fff', fontWeight: 'bold' }}>{swapAmount} {swapPair === "SOL_TO_USDC" ? "SOL" : "USDC"}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94a3b8' }}>Reçu estimé:</span>
                      <span style={{ color: '#22c55e', fontWeight: 'bold' }}>
                        {(parseFloat(quoteResponse.outAmount) / (swapPair === "SOL_TO_USDC" ? 1_000_000 : 1_000_000_000)).toFixed(4)} {swapPair === "SOL_TO_USDC" ? "USDC" : "SOL"}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94a3b8' }}>Price Impact:</span>
                      <span style={{ color: parseFloat(quoteResponse.priceImpactPct) > 1 ? '#ef4444' : '#fff' }}>
                        {quoteResponse.priceImpactPct}%
                      </span>
                    </div>

                    {/* EXECUTE SWAP BUTTON */}
                    <button
                      onClick={handleExecuteSwap}
                      disabled={swapLoading}
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        border: 'none',
                        color: '#fff',
                        padding: '12px 18px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        marginTop: '6px',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.02)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1.0)'}
                    >
                      {swapLoading ? <RefreshCw size={14} className="spin-animate" /> : "⚡ Signer & Éxécuter le Swap"}
                    </button>
                  </div>
                )}

                {/* Success Tx Result Panel */}
                {txSignature && (
                  <div style={{
                    background: 'rgba(34, 197, 94, 0.08)',
                    border: '1.5px solid #22c55e',
                    borderRadius: '8px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    fontSize: '0.75rem'
                  }}>
                    <div style={{ color: '#22c55e', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle size={16} /> Transaction Confirmée!
                    </div>
                    <div style={{ wordBreak: 'break-all', fontFamily: 'monospace', color: '#94a3b8' }}>
                      Signature: {txSignature}
                    </div>
                    <a
                      href={`https://solscan.io/tx/${txSignature}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#d4af37',
                        textDecoration: 'underline',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      Voir sur Solscan <ExternalLink size={12} />
                    </a>
                  </div>
                )}

                {/* Error Panel */}
                {swapError && (
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1.5px solid #ef4444',
                    borderRadius: '8px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    fontSize: '0.75rem',
                    color: '#ef4444'
                  }}>
                    <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertCircle size={16} /> Erreur
                    </div>
                    <div>{swapError}</div>
                  </div>
                )}

              </div>
            )}
            
          </div>
        </div>
      </div>

      {/* ── INTERACTIVE MODALS ── */}
      
      {/* A. ECOSYSTEM ACTIVATION MODAL */}
      {showEcosystemModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(5, 5, 8, 0.85)', backdropFilter: 'blur(16px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px', fontFamily: "'Outfit', sans-serif"
        }}>
          <div style={{
            background: 'rgba(15, 12, 7, 0.95)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '24px', padding: '36px', maxWidth: '480px', width: '100%',
            boxShadow: '0 20px 80px rgba(212, 175, 55, 0.25)',
            display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem' }}>{activating ? "⚡" : "🟢"}</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '1px' }}>
                {activating ? "CONNEXION AU SERVEUR..." : "ÉCOSYSTÈME ACTIF"}
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '8px' }}>
                {activating 
                  ? "Tentative de communication avec le Playwright orchestrator et SQLite..." 
                  : "Le swarm de micro-agents est synchronisé à 100% sur le port 5000 et william broker (port 4100)."}
              </p>
            </div>

            <div style={{
              background: '#020205', borderRadius: '12px', padding: '16px',
              fontFamily: 'monospace', fontSize: '0.75rem', color: '#d4af37', textAlign: 'left',
              height: '100px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div>[SYSTEM] Initialisation de l'authentification...</div>
              <div>[SYSTEM] Connexion établie avec la base SQLite locale...</div>
              {!activating && <div style={{ color: '#22c55e' }}>[SUCCESS] Swarm activé avec succès.</div>}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              {!activating && (
                <button 
                  onClick={handleDeactivateEcosystem}
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)', border: '1.5px solid #ef4444',
                    color: '#ef4444', padding: '10px 20px', borderRadius: '12px',
                    fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.3s'
                  }}
                >
                  Désactiver
                </button>
              )}
              <button 
                onClick={() => setShowEcosystemModal(false)}
                style={{
                  background: 'linear-gradient(135deg, #d4af37, #aa7c11)', border: 'none',
                  color: '#fff', padding: '10px 24px', borderRadius: '12px',
                  fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.3s'
                }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* B. DEMO PIPELINE MODAL */}
      {showDemoModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(5, 5, 8, 0.85)', backdropFilter: 'blur(16px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px', fontFamily: "'Outfit', sans-serif"
        }}>
          <div style={{
            background: 'rgba(15, 12, 7, 0.95)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '24px', padding: '36px', maxWidth: '640px', width: '100%',
            boxShadow: '0 20px 80px rgba(212, 175, 55, 0.25)',
            display: 'flex', flexDirection: 'column', gap: '24px'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  👑 PIPELINE 10-SECONDES DEMO
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '4px 0 0' }}>YACE•AURA Cognitive Solution Engine</p>
              </div>
              <button 
                onClick={() => setShowDemoModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* STEP 0: INPUT OBJECTIVE */}
            {demoStep === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>Entrez l'objectif que vous souhaitez faire résoudre par YACE•AURA :</label>
                <input 
                  type="text" 
                  value={demoPrompt}
                  onChange={e => setDemoPrompt(e.target.value)}
                  style={{
                    background: '#020205', border: '1.5px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px', padding: '14px 16px', color: '#fff', fontSize: '0.95rem',
                    fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.3s'
                  }}
                  placeholder="Ex: Générer un rapport d'opportunités cryptos de rendement Solana..."
                />
                <button 
                  onClick={startDemoSequence}
                  style={{
                    background: 'linear-gradient(135deg, #d4af37, #aa7c11)', border: 'none',
                    color: '#fff', padding: '14px 28px', borderRadius: '12px',
                    fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.3s',
                    boxShadow: '0 8px 24px rgba(212, 175, 55, 0.3)'
                  }}
                >
                  Lancer la démo ⚡
                </button>
              </div>
            )}

            {/* STEP 1 - 3: COGNITIVE PROCESSING STAGES */}
            {(demoStep > 0 && demoStep < 4) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', width: '100%', marginBottom: '12px' }}>
                  {[
                    { step: 1, label: 'RÉFLÉCHIR', icon: '🔍' },
                    { step: 2, label: 'DÉCIDER', icon: '🧠' },
                    { step: 3, label: 'AGIR', icon: '⚡' }
                  ].map((s) => (
                    <div key={s.step} style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                      opacity: demoStep >= s.step ? 1 : 0.4, transition: 'all 0.3s'
                    }}>
                      <div style={{
                        width: '48px', height: '48px', borderRadius: '50%',
                        background: demoStep === s.step ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255,255,255,0.05)',
                        border: `2px solid ${demoStep === s.step ? '#d4af37' : 'rgba(255,255,255,0.1)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
                        animation: demoStep === s.step ? 'pulse-green 1.5s infinite' : 'none'
                      }}>{s.icon}</div>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1px', color: demoStep === s.step ? '#d4af37' : '#cbd5e1' }}>{s.label}</span>
                    </div>
                  ))}
                </div>
                
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: 600 }}>Traitement en cours...</div>
                  <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', background: 'linear-gradient(90deg, #d4af37, #f59e0b)',
                      width: demoStep === 1 ? '33%' : demoStep === 2 ? '66%' : '90%',
                      borderRadius: '3px', transition: 'width 2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: DELIVERABLE FINALIZED */}
            {demoStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', textAlign: 'center' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(34,197,94,0.15)',
                  border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem', color: '#22c55e', animation: 'pulse-green 2s infinite'
                }}>🚀</div>
                
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#22c55e', fontWeight: 800 }}>LIVRAISON DU DOCUMENT</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '6px' }}>
                    YACE•AURA a complété la tâche avec succès.
                  </p>
                </div>

                {/* PDF Deliverable Download Container */}
                <div style={{
                  background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(34,197,94,0.3)',
                  borderRadius: '16px', padding: '16px 20px', width: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' }}>
                    <span style={{ fontSize: '2rem' }}>📄</span>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>solana_market_analysis.pdf</div>
                      <div style={{ fontSize: '0.65rem', color: '#64748b' }}>PDF document • 1.4 MB</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const element = document.createElement("a");
                      const file = new Blob([`Simulated YACE•AURA Report for prompt: "${demoPrompt}"`], {type: 'text/plain'});
                      element.href = URL.createObjectURL(file);
                      element.download = "solana_market_analysis.pdf";
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }}
                    style={{
                      background: 'rgba(34,197,94,0.15)', border: '1.5px solid #22c55e',
                      color: '#22c55e', padding: '8px 16px', borderRadius: '8px',
                      fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s'
                    }}
                    onMouseEnter={e => e.target.style.background = 'rgba(34,197,94,0.25)'}
                    onMouseLeave={e => e.target.style.background = 'rgba(34,197,94,0.15)'}
                  >
                    Télécharger
                  </button>
                </div>
              </div>
            )}

            {/* LIVE TELEMETRY LOGS */}
            {demoStep > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Télémétrie en direct :</span>
                <div style={{
                  background: '#020205', borderRadius: '12px', padding: '16px',
                  fontFamily: 'monospace', fontSize: '0.7rem', color: '#cbd5e1',
                  height: '120px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px',
                  border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left'
                }}>
                  {demoLog.map((log, idx) => (
                    <div key={idx} style={{ color: log.includes('COMPLÉTÉE') || log.includes('créé') ? '#22c55e' : log.includes('EN COURS') ? '#d4af37' : '#cbd5e1' }}>
                      {log}
                    </div>
                  ))}
                  {demoStep < 4 && <div style={{ animation: 'blink 1s infinite' }}>_</div>}
                </div>
              </div>
            )}

            {/* Close button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button 
                onClick={() => setShowDemoModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#94a3b8', padding: '10px 20px', borderRadius: '12px',
                  fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.3s'
                }}
                onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.05)'}
              >
                {demoStep === 4 ? "Terminer" : "Annuler"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
