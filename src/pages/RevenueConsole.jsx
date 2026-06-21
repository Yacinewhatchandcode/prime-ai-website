import React, { useState, useEffect } from 'react';
import { Shield, Lock, Play, Square, RefreshCw, Send, CheckCircle, Database, Server, UserCheck, DollarSign, CreditCard, ArrowUpRight, Upload } from 'lucide-react';

import { API_BASE } from '../utils/api';

export default function RevenueConsole() {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    total_volume: 0.0,
    stripe_volume: 0.0,
    revolut_volume: 0.0,
    crypto_volume: 0.0,
    total_count: 0,
    reconciled_count: 0,
    reconciliation_ratio: 0.0
  });
  const [credentials, setCredentials] = useState({
    stripe_configured: true,
    revolut_configured: false,
    revolut_api_token: "Not Set",
    stripe_api_token: "Not Set (Mock active)",
    rpc_endpoint: "Helius Mainnet Default"
  });

  // Manual Trigger Form
  const [simAmount, setSimAmount] = useState('149.00');
  const [simType, setSimType] = useState('revolut');
  const [simDesc, setSimDesc] = useState('B2B SaaS Attributed Invoice #1044');
  
  // CSV upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(''); // '', 'loading', 'success', 'error'
  const [uploadMsg, setUploadMsg] = useState('');
  
  // Loading status
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      // 1. Fetch Stats
      const resStats = await fetch(`${API_BASE}/api/revenue/stats`);
      if (resStats.ok) {
        const dataStats = await resStats.json();
        setStats(dataStats);
      }

      // 2. Fetch Ledger
      const resLedger = await fetch(`${API_BASE}/api/revenue`);
      if (resLedger.ok) {
        const dataLedger = await resLedger.json();
        setTransactions(dataLedger);
      }

      // 3. Fetch Credentials
      const resCreds = await fetch(`${API_BASE}/api/revenue/credentials`);
      if (resCreds.ok) {
        const dataCreds = await resCreds.json();
        setCredentials(dataCreds);
      }
      setLoading(false);
    } catch (e) {
      console.error("Revenue telemetry service unavailable", e);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulatePayment = async (e) => {
    e.preventDefault();
    if (!simAmount || !simDesc) return;
    
    try {
      const res = await fetch(`${API_BASE}/api/revenue/trigger-mock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(simAmount),
          type: simType,
          description: simDesc
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setSimAmount('149.00');
          setSimDesc(`B2B SWARM Service: ${simType.toUpperCase()} attribution test`);
          loadData();
        }
      }
    } catch (err) {
      console.error("Simulation failed", err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCsvUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploadStatus('loading');
    setUploadMsg('Parsing and Reconciling statement rows...');
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch(`${API_BASE}/api/revenue/upload-csv`, {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      if (data.success) {
        setUploadStatus('success');
        setUploadMsg(data.message + ` Reconciled ${data.reconciled} transactions.`);
        setSelectedFile(null);
        // Clear input element
        document.getElementById('csv-file-input').value = '';
        loadData();
      } else {
        setUploadStatus('error');
        setUploadMsg(data.error || 'Failed to parse CSV statement.');
      }
    } catch (err) {
      setUploadStatus('error');
      setUploadMsg('Error uploading file to dashboard server.');
    }
  };

  const getSourceBadge = (source) => {
    switch (source) {
      case 'stripe':
        return { bg: 'rgba(99,102,241,0.15)', border: '#6366f1', text: 'Stripe' };
      case 'revolut':
        return { bg: 'rgba(59,130,246,0.15)', border: '#3b82f6', text: 'Revolut' };
      case 'crypto':
        return { bg: 'rgba(16,185,129,0.15)', border: '#10b981', text: 'Crypto' };
      default:
        return { bg: 'rgba(107,114,128,0.15)', border: '#9ca3af', text: source };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', color: '#fcfcfc', position: 'relative' }}>
      <div style={{ padding: 'clamp(16px, 5vw, 48px)', flex: 1, display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 300, fontSize: '2rem', letterSpacing: '2px', marginBottom: '8px', margin: 0 }}>
              💰 PAYMENT & REVENUE CONSOLE
            </h1>
            <p style={{ color: '#6b6b7b', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '8px 0 0' }}>
              Revolut & Stripe Economic Bridge Telemetry // Consensus Attributions
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={loadData}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#fff',
                padding: '10px 16px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s'
              }}
            >
              <RefreshCw size={14} />
              SYNCHRONISER
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Card 1: Total volume */}
          <div style={{ background: 'linear-gradient(135deg, rgba(25,25,30,0.85) 0%, rgba(15,15,18,0.95) 100%)', border: '1px solid rgba(198,161,90,0.15)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#8b8b9b', fontWeight: '600', fontFamily: 'monospace' }}>VOLUME TOTAL</span>
              <DollarSign size={18} color="#C6A15A" />
            </div>
            <div style={{ fontSize: '2.2rem', fontFamily: '"Outfit", sans-serif', fontWeight: 600, color: '#C6A15A' }}>
              {stats.total_volume.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#6b6b7b', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
              <span>Transactions totales:</span>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>{stats.total_count}</span>
            </div>
          </div>

          {/* Card 2: Breakdowns */}
          <div style={{ background: 'linear-gradient(135deg, rgba(25,25,30,0.85) 0%, rgba(15,15,18,0.95) 100%)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justify: 'space-between', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#8b8b9b', fontWeight: '600', fontFamily: 'monospace' }}>BREAKDOWN DES RÉSULTATS</span>
              <CreditCard size={18} color="#3b82f6" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: '#6366f1' }}>Stripe:</span>
                <span style={{ fontWeight: 'bold' }}>{stats.stripe_volume.toFixed(2)} €</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: '#3b82f6' }}>Revolut:</span>
                <span style={{ fontWeight: 'bold' }}>{stats.revolut_volume.toFixed(2)} €</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: '#10b981' }}>Crypto:</span>
                <span style={{ fontWeight: 'bold' }}>{stats.crypto_volume.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* Card 3: Reconciliation Ratio */}
          <div style={{ background: 'linear-gradient(135deg, rgba(25,25,30,0.85) 0%, rgba(15,15,18,0.95) 100%)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#8b8b9b', fontWeight: '600', fontFamily: 'monospace' }}>RATIO DE RÉCONCILIATION</span>
              <Database size={18} color="#10b981" />
            </div>
            <div style={{ fontSize: '2.2rem', fontFamily: '"Outfit", sans-serif', fontWeight: 600, color: '#10b981' }}>
              {(stats.reconciliation_ratio * 100).toFixed(1)} %
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#6b6b7b', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
              <span>Attribuées au consensus:</span>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>{stats.reconciled_count} / {stats.total_count}</span>
            </div>
          </div>
        </div>

        {/* Credentials and File Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '24px' }}>
          
          {/* Active Credentials Panel */}
          <div style={{ background: 'rgba(15,15,18,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={20} color="#C6A15A" />
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontFamily: '"Outfit", sans-serif', fontWeight: 500 }}>
                STATUT DES MODULES DE REVENU (LIVE / MOCK)
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ color: '#8b8b9b' }}>API Revolut Business:</span>
                <span style={{ color: credentials.revolut_configured ? '#10b981' : '#f59e0b', fontWeight: 'bold' }}>
                  {credentials.revolut_configured ? "🔴 ACTIF (Live API)" : "🟡 NON CONFIGURÉ (Simulé)"}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ color: '#8b8b9b' }}>Passerelle Stripe Merchant:</span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>🟢 SIMULATEUR ECONOMIC BRIDGE ACTIF</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ color: '#8b8b9b' }}>Endpoint Helius Solana RPC:</span>
                <span style={{ color: '#3b82f6', fontFamily: 'monospace', fontSize: '0.75rem' }}>{credentials.rpc_endpoint.split('?')[0]}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: '#8b8b9b' }}>Attribution Consensus:</span>
                <span style={{ color: '#fff', fontWeight: '600' }}>Heuristique DAG Workflow</span>
              </div>
            </div>
          </div>

          {/* Upload Revolut CSV exports */}
          <div style={{ background: 'rgba(15,15,18,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Upload size={20} color="#3b82f6" />
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontFamily: '"Outfit", sans-serif', fontWeight: 500 }}>
                IMPORTER EXPORT REVOLUT (.CSV)
              </h3>
            </div>
            <p style={{ color: '#8b8b9b', fontSize: '0.75rem', lineHeight: 1.5, margin: 0 }}>
              Vous pouvez importer des relevés bancaires exportés directement depuis Revolut Business. Les transactions seront analysées et réconciliées en temps réel avec le grand livre du consensus local.
            </p>
            
            <form onSubmit={handleCsvUpload} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
              <input 
                id="csv-file-input"
                type="file" 
                accept=".csv"
                onChange={handleFileChange}
                style={{ 
                  background: 'rgba(0,0,0,0.2)', 
                  border: '1px dashed rgba(255,255,255,0.15)', 
                  borderRadius: '8px', 
                  padding: '12px', 
                  color: '#fff', 
                  fontSize: '0.8rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
              <button 
                type="submit"
                disabled={!selectedFile || uploadStatus === 'loading'}
                style={{
                  background: selectedFile ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${selectedFile ? '#3b82f6' : 'rgba(255,255,255,0.08)'}`,
                  color: selectedFile ? '#3b82f6' : '#6b6b7b',
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  cursor: selectedFile ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <ArrowUpRight size={16} />
                LANCER LA RÉCONCILIATION
              </button>
            </form>

            {uploadStatus && (
              <div style={{ 
                background: uploadStatus === 'success' ? 'rgba(16,185,129,0.1)' : uploadStatus === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${uploadStatus === 'success' ? '#10b981' : uploadStatus === 'error' ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '0.75rem',
                color: uploadStatus === 'success' ? '#10b981' : uploadStatus === 'error' ? '#ef4444' : '#fff'
              }}>
                {uploadMsg}
              </div>
            )}
          </div>
        </div>

        {/* Simulation / Manual Injection Panel */}
        <div style={{ background: 'rgba(15,15,18,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Play size={20} color="#10b981" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontFamily: '"Outfit", sans-serif', fontWeight: 500 }}>
              SIMULER UNE TRANSACTION EN DIRECT
            </h3>
          </div>
          
          <form onSubmit={handleSimulatePayment} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr auto', gap: '16px', alignItems: 'end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.75rem', color: '#6b6b7b', fontWeight: 'bold' }}>Montant (€)</label>
              <input 
                type="number" 
                step="0.01"
                value={simAmount} 
                onChange={(e) => setSimAmount(e.target.value)} 
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.75rem', color: '#6b6b7b', fontWeight: 'bold' }}>Source</label>
              <select 
                value={simType} 
                onChange={(e) => setSimType(e.target.value)}
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
              >
                <option value="stripe">Stripe</option>
                <option value="revolut">Revolut</option>
                <option value="crypto">Crypto</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.75rem', color: '#6b6b7b', fontWeight: 'bold' }}>Description / Attribution</label>
              <input 
                type="text" 
                value={simDesc} 
                onChange={(e) => setSimDesc(e.target.value)} 
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>

            <button 
              type="submit"
              style={{
                background: 'rgba(16,185,129,0.15)',
                border: '1px solid #10b981',
                color: '#10b981',
                padding: '11px 20px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              INJECTER
            </button>
          </form>
        </div>

        {/* Ledger Table */}
        <div style={{ background: 'rgba(15,15,18,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontFamily: '"Outfit", sans-serif', fontWeight: 500 }}>
              LE LIVRE DES COMPTES DU REVENUE D'ORCHESTRATION
            </h3>
            <span style={{ color: '#8b8b9b', fontSize: '0.75rem', fontFamily: 'monospace' }}>Mise à jour toutes les 5s</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#8b8b9b' }}>
                  <th style={{ padding: '12px 8px', fontWeight: 600 }}>TRANSACTION ID</th>
                  <th style={{ padding: '12px 8px', fontWeight: 600 }}>MONTANT</th>
                  <th style={{ padding: '12px 8px', fontWeight: 600 }}>SOURCE</th>
                  <th style={{ padding: '12px 8px', fontWeight: 600 }}>DESCRIPTION</th>
                  <th style={{ padding: '12px 8px', fontWeight: 600 }}>RÉCONCILIÉ VIA</th>
                  <th style={{ padding: '12px 8px', fontWeight: 600 }}>STATUT</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#6b6b7b' }}>
                      Aucune transaction détectée dans revenue.db
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => {
                    const badge = getSourceBadge(tx.type);
                    return (
                      <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', hover: { background: 'rgba(255,255,255,0.02)' } }}>
                        <td style={{ padding: '12px 8px', fontFamily: 'monospace', color: '#FAF8F4' }}>{tx.id}</td>
                        <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{tx.amount.toFixed(2)} €</td>
                        <td style={{ padding: '12px 8px' }}>
                          <span style={{ background: badge.bg, border: `1px solid ${badge.border}40`, color: badge.border, padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600' }}>
                            {badge.text.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '12px 8px', color: '#8b8b9b' }}>{tx.source}</td>
                        <td style={{ padding: '12px 8px', fontFamily: 'monospace', fontSize: '0.75rem', color: tx.reconciled ? '#10b981' : '#6b6b7b' }}>
                          {tx.attribution}
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <span style={{ 
                            color: tx.reconciled ? '#10b981' : '#f59e0b',
                            background: tx.reconciled ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                            border: `1px solid ${tx.reconciled ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`,
                            padding: '4px 8px', 
                            borderRadius: '6px', 
                            fontSize: '0.7rem', 
                            fontWeight: 'bold' 
                          }}>
                            {tx.reconciled ? 'RÉCONCILIÉ' : 'EN ATTENTE'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
