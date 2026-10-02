import { useEffect, useRef, useState } from 'react';
import { localFleetRequest, validateMission } from '../utils/localFleet';
import { useLanguage } from '../context/LanguageContext';

export default function LocalFleetPanel({ onReadiness, compact = false }) {
  const { language } = useLanguage();
  const say = (en, fr) => language === 'fr' ? fr : en;
  const [snapshot, setSnapshot] = useState(null);
  const [missions, setMissions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [mission, setMission] = useState(null);
  const [goal, setGoal] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [notice, setNotice] = useState('');
  const [refresh, setRefresh] = useState(0);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let timer;
    const poll = async () => {
      try {
        const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(10000)]);
        const [health, status, memory, records] = await Promise.all(
          ['health', 'status', 'memory', 'missions'].map(endpoint => localFleetRequest(endpoint, { signal }))
        );
        if (health?.service !== 'prime-local-fleet' || typeof health.ready !== 'boolean' ||
            !status?.runtime || typeof status.runtime.ready !== 'boolean' || !Array.isArray(status.roles) ||
            memory?.backend !== 'filesystem' || !memory.counts || typeof memory.counts !== 'object' ||
            Object.values(memory.counts).some(count => !Number.isInteger(count) || count < 0) || !Array.isArray(records)) {
          throw new Error('Local fleet returned invalid readiness or memory data.');
        }
        records.forEach(validateMission);
        const id = selectedId || records[0]?.id;
        const detail = id ? validateMission(await localFleetRequest(`missions/${id}`, { signal })) : null;
        if (controller.signal.aborted) return;
        setSnapshot({ health, status, memory, checkedAt: new Date().toISOString() });
        setMissions(records);
        setMission(detail);
        setError('');
        onReadiness(health.ready && status.runtime.ready);
      } catch (failure) {
        if (controller.signal.aborted) return;
        setError(`Local fleet unavailable: ${failure.message} Last successful data, if any, is stale.`);
        onReadiness(false);
      } finally {
        if (!controller.signal.aborted) timer = setTimeout(poll, 3000);
      }
    };
    poll();
    return () => { controller.abort(); clearTimeout(timer); };
  }, [selectedId, refresh, onReadiness]);

  const submit = async event => {
    event.preventDefault();
    if (!goal.trim() || submitting) return;
    setSubmitting(true);
    setSubmitError('');
    setNotice('');
    try {
      const record = validateMission(await localFleetRequest('missions', { goal: goal.trim() }));
      if (!mounted.current) return;
      setMission(record);
      setSelectedId(record.id);
      setGoal('');
      setNotice(`Mission ${record.id} accepted as ${record.status}. Completion must be confirmed by role results.`);
      setRefresh(value => value + 1);
    } catch (failure) {
      if (mounted.current) setSubmitError(`Mission submission failed: ${failure.message} Goal preserved; verify the mission list before retrying.`);
    } finally {
      if (mounted.current) setSubmitting(false);
    }
  };
  const ready = !error && snapshot?.health.ready && snapshot?.status.runtime.ready;
  return (
    <section className="local-fleet-panel" aria-labelledby="local-fleet-title">
      <div className="local-fleet-heading">
        <h2 id="local-fleet-title">{say('Local advisory missions', 'Missions consultatives locales')}</h2>
        <button type="button" className="wire-orb-btn" onClick={() => setRefresh(value => value + 1)}>{say('Refresh readiness', 'Actualiser la disponibilité')}</button>
      </div>
      <p>{say('Three sequential local roles: planner, analyst, reviewer. Advisory only; no tools, web research, deployment or acceptance verification.',
        'Trois rôles locaux séquentiels : planification, analyse, revue. Conseils uniquement ; aucun outil, recherche web, déploiement ni validation.')}</p>
      <div role="status" className="local-fleet-readiness">
        {error || (snapshot
          ? `Backend ${snapshot.health.ready ? 'ready' : 'not ready'} · Inference ${snapshot.status.runtime.inference?.status || 'unknown'} · Model ${snapshot.status.runtime.inference?.model || 'not selected'} · Checked ${snapshot.checkedAt}. Readiness is a preflight, not proof of a completed inference.`
          : 'Checking local backend readiness…')}
      </div>
      {snapshot?.status.runtime.inference?.error && <p role="status">{snapshot.status.runtime.inference.error.message}</p>}
      {snapshot?.health.storageError && <p role="status">Memory unavailable: {snapshot.health.storageError.message}</p>}
      <form onSubmit={submit} className="local-fleet-form">
        <label htmlFor="local-mission-goal">{say('Advisory goal', 'Objectif consultatif')}</label>
        <textarea id="local-mission-goal" value={goal} onChange={event => setGoal(event.target.value)} maxLength={4000} required rows={3} placeholder="Describe a local planning or analysis task. No automated execution." />
        <button className="wire-orb-btn" type="submit" disabled={!ready || submitting || !goal.trim()}>
          {submitting ? say('Queueing mission…', 'Mise en file…') : say('Create local advisory mission', 'Créer une mission consultative locale')}
        </button>
      </form>
      {(submitError || notice) && <p role="status">{submitError || notice}</p>}
      <div className="local-fleet-columns">
        <div>
          <details open={!compact}><summary>{say('Persistent missions', 'Missions conservées')} ({missions.length})</summary>
          {missions.length === 0 && <p>{snapshot ? 'No retained missions.' : 'Mission history unavailable until connected.'}</p>}
          <ul className="local-mission-list">
            {missions.map(record => <li key={record.id}>
              <button type="button" aria-pressed={mission?.id === record.id} onClick={() => setSelectedId(record.id)}>
                <span>{record.goal}</span><small>{record.status} · {record.id}</small>
              </button>
            </li>)}
          </ul>
          </details>
        </div>
        <div>
          <h3>{say('Actual local memory', 'Mémoire locale réelle')}</h3>
          {snapshot ? <>
            <p>Backend: {snapshot.memory.backend}. Counts from persistent storage; private record text is not exposed.</p>
            <dl className="local-memory-counts">{Object.entries(snapshot.memory.counts).map(([kind, count]) => <div key={kind}><dt>{kind}</dt><dd>{count}</dd></div>)}</dl>
          </> : <p>Memory counts unavailable.</p>}
        </div>
      </div>
      {mission && <article className="local-mission-detail">
        <h3>{say('Mission progress', 'Progression de la mission')}</h3>
        <details className="local-mission-context" open={!compact}>
          <summary>{say('Goal and record', 'Objectif et enregistrement')}</summary>
          <p>{mission.goal}</p>
          <p>Created: {mission.createdAt} · Memory reference: {mission.memoryId || 'not recorded'}</p>
        </details>
        <p role="status">Status: <strong>{mission.status}</strong> · {mission.id}</p>
        {mission.error && <p role="alert">{mission.error.code}: {mission.error.message}</p>}
        {mission.steps.map(step => <section key={step.role} className="local-role-output">
          <h4>{step.role} · {step.status}</h4>
          {step.model && <small>Actual model: {step.model}</small>}
          {step.error && <p role="alert">{step.error.code}: {step.error.message}</p>}
          {step.output ? <details open={!compact}><summary>{say('Full advisory output', 'Résultat consultatif complet')}</summary><pre>{step.output}</pre></details> : <p>{say('No output yet.', 'Aucun résultat pour le moment.')}</p>}
        </section>)}
        <p>Advisory output only. Tools executed: {mission.toolsExecuted === true ? 'reported by backend' : 'none'}. Acceptance verified: {mission.acceptanceVerified === true ? 'reported by backend' : 'no'}.</p>
      </article>}
    </section>
  );
}
