import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown, ChevronUp, MessageCircle, Send, Square } from 'lucide-react';
import { searchReplica } from '../utils/replicaRetrieval';
import { intentRequest, readMissionEvents } from '../utils/intentClient';
import './intent-chat.css';

export default function IntentChat({ identity = 'PRIME', initialExpanded = false }) {
  const id = useId();
  const [expanded, setExpanded] = useState(initialExpanded);
  const [text, setText] = useState('');
  const [localRetrieval, setLocalRetrieval] = useState(false);
  const [index, setIndex] = useState(null);
  const [citations, setCitations] = useState([]);
  const [error, setError] = useState('');
  const [health, setHealth] = useState(null);
  const [connectionError, setConnectionError] = useState('');
  const [target, setTarget] = useState('');
  const [generate, setGenerate] = useState(true);
  const [mission, setMission] = useState(null);
  const [events, setEvents] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [sources, setSources] = useState([]);
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState(false);
  const streamController = useRef(null);
  const input = useRef(null);
  const allowedTargets = Array.isArray(health?.allowedTargets) ? health.allowedTargets.filter(value => typeof value === 'string') : [];
  const connected = health?.state === 'ready';

  const checkConnection = async () => {
    setConnectionError('');
    try {
      const value = await intentRequest('/health', { signal: AbortSignal.timeout(8000) });
      if (value.service !== 'prime-live-intent') throw new Error('Unexpected local intent service.');
      setHealth(value);
      if (value.state !== 'ready') setConnectionError(`Local intent service state: ${value.state}`);
    } catch (failure) {
      setHealth(null);
      setConnectionError(failure.message);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    intentRequest('/health', { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(8000)]) })
      .then(value => {
        if (value.service !== 'prime-live-intent') throw new Error('Unexpected local intent service.');
        setHealth(value);
        if (value.state !== 'ready') setConnectionError(`Local intent service state: ${value.state}`);
      }).catch(failure => { if (!controller.signal.aborted) setConnectionError(failure.message); });
    return () => { controller.abort(); streamController.current?.abort(); };
  }, []);
  const bars = useMemo(() => Array.from({ length: 28 }, (_, position) => {
    if (!text) return 4;
    const character = text.codePointAt(position % text.length) || 0;
    return 5 + (character * (position + 3) + text.length * 7) % 29;
  }), [text]);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/replica-data/semantic-index.json', { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error(`Local retrieval index returned HTTP ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data.records)) throw new Error('Invalid local retrieval index.');
        setIndex(data);
      }).catch(failure => { if (!controller.signal.aborted) setError(failure.message); });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      if (controller.signal.aborted) return;
      setCitations(localRetrieval && index && text.trim() ? searchReplica(index.records, text).slice(0, 3) : []);
    }, 180);
    return () => { controller.abort(); clearTimeout(timer); };
  }, [text, localRetrieval, index]);

  const submit = async event => {
    event.preventDefault();
    setExpanded(true);
    setError('');
    if (!connected) { setError('The local chat backend is not connected. Your message was not sent.'); return; }
    const targetUri = target || allowedTargets[0];
    if (!targetUri || !allowedTargets.includes(targetUri)) { setError('Choose an explicitly allowlisted local target before submitting.'); return; }
    setPending(true);
    setAnswer(null);
    setEvents([]);
    setSources([]);
    try {
      const value = await intentRequest('/missions', {
        body: { intent: text.trim(), targetUri, action: 'retrieve_sources', generate },
        signal: AbortSignal.timeout(15000),
      });
      if (!/^[a-zA-Z0-9_-]{1,80}$/.test(value.missionId) || value.state !== 'awaiting_approval' || !value.plan) throw new Error('Invalid compiled mission response.');
      setMission(value);
      setSources(Array.isArray(value.sources) ? value.sources : []);
      setBusy(true);
      streamController.current?.abort();
      const controller = new AbortController();
      streamController.current = controller;
      void readMissionEvents(value.missionId, controller.signal, incoming => {
        setEvents(previous => [...previous, incoming].slice(-100));
        setMission(previous => ({ ...previous, state: incoming.state || previous.state }));
        if (incoming.type === 'sources.retrieved') setSources(Array.isArray(incoming.data?.sources) ? incoming.data.sources : []);
        if (incoming.type === 'inference.generated') {
          if (incoming.data?.kind === 'generated_inference' && typeof incoming.data.text === 'string') setAnswer(incoming.data);
          else setError('The service returned an invalid generated-inference event.');
        }
        if (['failed', 'blocked', 'interrupted'].includes(incoming.type)) setError(incoming.data?.message || incoming.data?.code || incoming.type);
        if (['completed', 'failed', 'blocked', 'cancelled', 'interrupted'].includes(incoming.type)) setBusy(false);
      }).catch(failure => {
        if (!controller.signal.aborted) { setError(failure.message); setBusy(false); }
      });
    } catch (failure) { setError(failure.message); }
    finally { setPending(false); }
  };

  const controlMission = async action => {
    if (!mission?.missionId) return;
    setError('');
    setPending(true);
    try {
      await intentRequest(`/missions/${mission.missionId}/${action}`, { body: {}, signal: AbortSignal.timeout(15000) });
    } catch (failure) { setError(failure.message); }
    finally { setPending(false); }
  };

  return <section className="intent-chat" aria-label={`${identity} written conversation`}>
    <div className="intent-topline">
      <div className="intent-avatar" aria-hidden="true"><MessageCircle size={18} /></div>
      <div className="intent-identity"><strong>{identity}<span> / written avatar</span></strong><small>You start the conversation.</small></div>
      <div className="intent-spectrum" aria-hidden="true">{bars.map((height, position) => <i key={position} style={{ height: `${height}px`, background: `hsl(${210 + position * 6} 83% 65%)` }} />)}</div>
      <small className="intent-spectrum-label">Decorative · input-reactive</small>
      <span className={`intent-connectivity${connected ? ' intent-connected' : ''}`}>{connected ? 'Local intent service connected' : 'Backend not connected'}</span>
      <button className="intent-expand" type="button" aria-expanded={expanded} aria-controls={`${id}-panel`} aria-label={expanded ? 'Collapse conversation panel' : 'Expand conversation panel'} onClick={() => setExpanded(!expanded)}>{expanded ? <ChevronUp size={19} /> : <ChevronDown size={19} />}</button>
    </div>
    <form className="intent-composer" onSubmit={submit}>
      <label className="intent-input-label"><span className="replica-sr-only">Your message to {identity}</span><textarea ref={input} rows={1} maxLength={4000} value={text} onChange={event => setText(event.target.value)} placeholder="Write your intent. Explore your constellation…" aria-describedby={`${id}-privacy`} /></label>
      <button type="submit" className="intent-send" disabled={!text.trim() || busy || pending} aria-label={`Send message to ${identity}`}><Send size={17} /><span>Send</span></button>
      <button type="button" className="intent-stop" disabled={!busy || pending} onClick={() => controlMission('cancel')} aria-label="Stop streamed response"><Square size={15} /></button>
    </form>
    <div className="intent-privacy" id={`${id}-privacy`}><span>Typing stays on this device. No message sent until you choose Send.</span><label><input type="checkbox" checked={localRetrieval} onChange={event => { setLocalRetrieval(event.target.checked); if (event.target.checked) setExpanded(true); }} />Local matches while typing</label></div>
    <div id={`${id}-panel`} className="intent-panel" hidden={!expanded}>
      <p className="intent-visual-disclosure">The color spectrum reacts to your written input locally. Decorative visualization—not infrared sensing, live model telemetry, or personal profiling.</p>
      <div className="intent-service-controls"><button type="button" onClick={checkConnection}>Check connection</button>{connected && <><label>Allowlisted target<select value={target || allowedTargets[0] || ''} onChange={event => setTarget(event.target.value)}>{allowedTargets.map(uri => <option key={uri} value={uri}>{uri}</option>)}</select></label><label><input type="checkbox" checked={generate} onChange={event => setGenerate(event.target.checked)} />Generate a local-model answer after approval</label><span>Model: {health.model?.name || 'unavailable'} · {health.model?.state || 'unknown'}</span></>}</div>
      {connectionError && <p className="intent-connection-note">{connectionError}</p>}
      {error && <p className="intent-error" role="alert">{error}</p>}
      <section className="intent-citations" aria-label="Retrieved source citations">
        <h2>Retrieved sources <span>not a generated answer</span></h2>
        {!localRetrieval && <p>Enable local matches to retrieve from the 24 source-backed PRIME-AI records as you type. No text leaves the page.</p>}
        {localRetrieval && !index && !error && <p role="status">Loading local source inventory…</p>}
        {localRetrieval && index && citations.length === 0 && <p role="status">{text.trim() ? 'No matching local sources for this wording.' : 'Write a message to find related local sources.'}</p>}
        {citations.map(citation => <article key={citation.id}><a href={citation.url} target="_blank" rel="noreferrer">{citation.title}<ArrowUpRight size={13} /></a><small>{citation.source} · {citation.matchedBy}</small><p>{citation.text.slice(0, 240)}{citation.text.length > 240 ? '…' : ''}</p></article>)}
      </section>
      {sources.length > 0 && <section className="intent-citations" aria-label="Backend retrieved facts"><h2>Backend retrieved facts <span>not generated text</span></h2>{sources.map(source => <article key={source.citationId}><strong>{source.citationId}</strong><small>{source.path}:{source.startLine}–{source.endLine}</small><p>{source.excerpt}</p></article>)}</section>}
      <section className="intent-answer" aria-label="Generated response"><h2>Conversation <span>generated inference is separate from facts</span></h2>{answer ? <><p className="intent-generated">{answer.text}</p><small>Model: {answer.model} · citations verified: {String(answer.citationsVerified === true)}</small></> : <p>{connected ? 'Send your intent, review the compiled mission, then approve. Mission status streams live; the generated answer arrives as one completed event, not token-by-token.' : 'You initiate the conversation. The real local streaming service is not connected yet, so no AI reply is being simulated.'}</p>}</section>
      <section className="intent-mission" aria-label="Mission approval and execution"><h2>Mission control <span>{mission?.state || 'approval required'}</span></h2><p>No actions run while you type. Execution requires a compiled plan, an allowlisted target and explicit approval. Desktop actuation and VPS access are disabled.</p>
        {mission && <details open><summary>Review compiled plan · {mission.missionId}</summary><pre>{JSON.stringify(mission.plan, null, 2)}</pre></details>}
        <div><button type="button" disabled={!mission || mission.state !== 'awaiting_approval' || pending || mission.plan?.mutationRequested || mission.plan?.desktopActuation} onClick={() => controlMission('approve')}>Approve mission</button><button type="button" disabled>Open authorized ByteBot view</button><span>VPS access disabled</span></div>
        {events.length > 0 && <ol className="intent-events" aria-label="Actual backend mission events">{events.map(incoming => <li key={incoming.sequence}><time>{incoming.timestamp}</time><strong>{incoming.type}</strong><span>{incoming.state}</span></li>)}</ol>}
      </section>
    </div>
  </section>;
}
