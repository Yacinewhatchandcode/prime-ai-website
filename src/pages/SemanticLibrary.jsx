import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Download, Search } from 'lucide-react';
import { searchReplica } from '../utils/replicaRetrieval';
import './semantic-library.css';

export default function SemanticLibrary() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('');
  useEffect(() => {
    document.title = 'PRIME-AI — Semantic keyword library';
    const controller = new AbortController();
    fetch('/replica-data/semantic-index.json', { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error(`Index returned HTTP ${response.status}`);
        const index = await response.json();
        if (index.version !== 1 || !Array.isArray(index.records) || !Array.isArray(index.groups)) throw new Error('Invalid semantic index.');
        setData(index);
      }).catch(failure => { if (!controller.signal.aborted) setError(failure.message); });
    return () => controller.abort();
  }, []);
  const results = data ? searchReplica(data.records, query, group) : [];
  return <main className="semantic-library">
    <header><a href="/replica"><ArrowLeft size={16} />Back to PRIME-AI</a><nav aria-label="Library navigation"><a href="/responsive-preview">Paired preview<ArrowUpRight size={14} /></a><a href="/replica-image">Full replica images<ArrowUpRight size={14} /></a></nav></header>
    <p className="library-eyebrow">PRIME-AI · Source-backed retrieval</p><h1>Every concept.<br /><span>Connected to its source.</span></h1>
    <p className="library-intro">Search the complete bounded keyword inventory from public production metadata, all seven replica sections, and all nine foundation/platform details. Concept aliases connect related terms; this is local keyword retrieval, not an embedding model or live fleet memory.</p>
    {error && <p role="alert" className="library-error">Unable to load the local index: {error}</p>}
    {!data && !error && <p role="status">Loading local keyword index…</p>}
    {data && <>
      <div className="library-summary"><span><strong>{data.metadataKeywords.length}</strong> public metadata keywords</span><span><strong>{data.records.length}</strong> traceable content records</span><span><strong>{data.groups.length}</strong> concept groups</span><a href="/replica-data/semantic-index.json" download><Download size={16} />Download source index</a></div>
      <form className="library-search" onSubmit={event => event.preventDefault()} role="search"><label><Search size={22} aria-hidden="true" /><span className="replica-sr-only">Search semantic keywords</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Try: sovereign AI, mémoire, M4, trust, fleet…" type="search" /></label><label><span className="replica-sr-only">Concept group</span><select value={group} onChange={event => setGroup(event.target.value)}><option value="">Every concept</option>{data.groups.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label></form>
      <div className="library-tags" aria-label="Public production keywords">{data.metadataKeywords.map(keyword => <button type="button" key={keyword} onClick={() => { setQuery(keyword); setGroup(''); }}>{keyword}</button>)}</div>
      <p className="library-result-count" role="status">{results.length} matching records</p>
      {results.length === 0 && <p className="library-empty">No indexed content matches this query. Try a listed keyword or clear the concept filter.</p>}
      <section className="library-results" aria-label="Retrieved content">{results.map(record => <article key={record.id}>
        <div className="library-record-top"><span>{record.source}</span><small>{record.matchedBy}</small></div><h2><a href={record.url}>{record.title}<ArrowUpRight size={17} /></a></h2><p>{record.text}</p>
        <div className="library-record-tags">{record.groups.map(id => <span key={id}>{data.groups.find(item => item.id === id)?.label}</span>)}</div>
        <details><summary>Source evidence</summary><dl><dt>Source type</dt><dd>{record.evidence.kind}</dd><dt>Captured</dt><dd>{record.evidence.capturedAt}</dd>{record.evidence.origin && <><dt>Public origin</dt><dd>{record.evidence.origin}</dd><dt>SHA-256</dt><dd>{record.evidence.sha256}</dd></>}{record.evidence.selector && <><dt>Component selector</dt><dd>{record.evidence.selector}</dd></>}</dl></details>
      </article>)}</section>
      <footer>Public snapshot: {data.sourceSnapshot.capturedAt}. Scope is bounded and explicit; no authenticated content, private repositories, newsletter submissions, or unrelated crawl.</footer>
    </>}
  </main>;
}
