import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { attachMission, createData, MAX_FILE_BYTES, mergeData, parseData, sealData } from '../utils/primeData.js';
import { openPrimeStorage } from '../utils/primeStorage.js';
import { localFleetRequest, validateMission } from '../utils/localFleet.js';
import './portable-workspace.css';

const download = (contents, filename) => {
  const url = URL.createObjectURL(new Blob([contents], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export default function PortableWorkspace() {
  const { language, t } = useLanguage();
  const [data, setData] = useState(null);
  const [meta, setMeta] = useState({ lastExportAt: null, lastImportAt: null });
  const [backend, setBackend] = useState('');
  const [quota, setQuota] = useState('');
  const [fleet, setFleet] = useState(false);
  const [fleetMessage, setFleetMessage] = useState(t('data.fleetUnavailable'));
  const [offlineReady, setOfflineReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [goalTitle, setGoalTitle] = useState('');
  const [goalId, setGoalId] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskId, setTaskId] = useState('');
  const [taskGoalId, setTaskGoalId] = useState('');
  const [notes, setNotes] = useState('');
  const [pending, setPending] = useState(null);
  const [conflicts, setConflicts] = useState([]);
  const store = useRef(null);
  const lock = useRef(false);
  const current = useRef(null);
  const alive = useRef(true);
  const missionController = useRef(null);

  useEffect(() => {
    alive.current = true;
    let disposed = false;
    let storage;
    const load = async () => {
      try {
        storage = await openPrimeStorage();
        if (disposed) { storage.close(); return; }
        let document = await storage.read();
        if (!document) {
          document = await createData(language);
          if (disposed) { storage.close(); return; }
          await storage.save(document, undefined, null);
        }
        const metadata = await storage.metadata();
        if (disposed) { storage.close(); return; }
        store.current = storage;
        current.current = document;
        setData(document);
        setNotes(document.workspace.notes.text);
        setMeta(metadata);
        setBackend(storage.backend);
        if (navigator.storage?.estimate) {
          const estimate = await navigator.storage.estimate();
          if (!disposed) setQuota(`${Math.round((estimate.usage || 0) / 1024)} KiB / ${Math.round((estimate.quota || 0) / 1048576)} MiB`);
        }
      } catch (failure) { if (!disposed) setError(`${t('data.storageError')} ${failure.message}`); }
    };
    load();
    return () => { disposed = true; alive.current = false; storage?.close(); missionController.current?.abort(); };
    // Stored language is initialized once; changing UI language must not reset local data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    localFleetRequest('health', { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(8000)]) })
      .then(health => {
        if (controller.signal.aborted) return;
        const ready = health.service === 'prime-local-fleet' && health.ready === true;
        setFleet(ready);
        setFleetMessage(ready ? t('data.fleetReady') : t('data.fleetUnavailable'));
      })
      .catch(() => { if (!controller.signal.aborted) { setFleet(false); setFleetMessage(t('data.fleetUnavailable')); } });
    const updateOfflineStatus = () => {
      if (!controller.signal.aborted) setOfflineReady(Boolean(navigator.serviceWorker?.controller));
    };
    updateOfflineStatus();
    navigator.serviceWorker?.addEventListener('controllerchange', updateOfflineStatus);
    navigator.serviceWorker?.ready.then(updateOfflineStatus)
      .catch(failure => { if (!controller.signal.aborted) setError(failure.message); });
    return () => {
      controller.abort();
      navigator.serviceWorker?.removeEventListener('controllerchange', updateOfflineStatus);
    };
  }, [language, t]);

  const operate = async action => {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError('');
    setNotice('');
    try { await action(); }
    catch (failure) { if (alive.current) setError(failure.message); }
    finally { lock.current = false; if (alive.current) setBusy(false); }
  };
  const persist = async (next, metadata = meta) => {
    const sealed = await sealData(next);
    await store.current.save(sealed, metadata, current.current.checksum);
    current.current = sealed;
    if (alive.current) { setData(sealed); setMeta(metadata); }
    return sealed;
  };
  const saveGoal = event => {
    event.preventDefault();
    operate(async () => {
      const now = new Date().toISOString();
      const record = { id: goalId || crypto.randomUUID(), title: goalTitle.trim(), updatedAt: now };
      const previous = current.current;
      await persist({ ...previous, workspace: { ...previous.workspace, goals: [...previous.workspace.goals.filter(goal => goal.id !== record.id), record] } });
      setGoalTitle(''); setGoalId(''); setTaskGoalId(record.id); setNotice(t('data.saved'));
    });
  };
  const saveTask = event => {
    event.preventDefault();
    operate(async () => {
      const previous = current.current;
      const task = { id: taskId || crypto.randomUUID(), goalId: taskGoalId, title: taskTitle.trim(), status: previous.workspace.tasks.find(task => task.id === taskId)?.status || 'todo', updatedAt: new Date().toISOString() };
      await persist({ ...previous, workspace: { ...previous.workspace, tasks: [...previous.workspace.tasks.filter(entry => entry.id !== task.id), task] } });
      setTaskTitle(''); setTaskId(''); setNotice(t('data.saved'));
    });
  };
  const importFile = event => {
    const file = event.target.files[0];
    event.target.value = '';
    if (!file) return;
    operate(async () => {
      if (notes !== current.current.workspace.notes.text || goalTitle || taskTitle) throw new Error(t('data.saveDrafts'));
      if (file.size > MAX_FILE_BYTES) throw new Error(t('data.fileTooLarge'));
      const incoming = await parseData(await file.text());
      const result = await mergeData(current.current, incoming);
      setPending({ ...result, baseChecksum: current.current.checksum });
      setConflicts(result.conflicts);
      setNotice(`${t('data.importPreview')} ${result.conflicts.length} ${t('data.conflicts')}`);
    });
  };
  const runMission = goal => operate(async () => {
    const controller = new AbortController();
    missionController.current = controller;
    const signal = () => AbortSignal.any([controller.signal, AbortSignal.timeout(10000)]);
    let record = validateMission(await localFleetRequest('missions', { goal: goal.title, signal: signal() }));
    await persist(await attachMission(current.current, goal.id, record));
    const deadline = Date.now() + 390000;
    while (!['completed', 'failed'].includes(record.status)) {
      if (alive.current) setNotice(`${t('data.missionProgress')} ${record.status} · ${record.steps.map(step => `${step.role}: ${step.status}`).join(', ')}`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      if (controller.signal.aborted || Date.now() > deadline) throw new Error(t('data.missionPending'));
      record = validateMission(await localFleetRequest(`missions/${record.id}`, { signal: signal() }));
      await persist(await attachMission(current.current, goal.id, record));
    }
    if (record.status === 'failed') throw new Error(record.error?.message || t('data.missionFailed'));
    setNotice(t('data.missionComplete'));
  });
  const refreshSnapshot = snapshot => operate(async () => {
    const record = validateMission(await localFleetRequest(`missions/${snapshot.id}`));
    await persist(await attachMission(current.current, snapshot.goalId, record));
    setNotice(t('data.saved'));
  });

  return (
    <section className="portable-workspace" aria-labelledby="portable-title">
      <h2 id="portable-title">{t('data.title')}</h2>
      <p>{t('data.description')}</p>
      <dl className="portable-status">
        <div><dt>{t('data.browser')}</dt><dd>{backend || t('data.checking')}{quota && ` · ${quota}`}</dd></div>
        <div><dt>{t('data.localFleet')}</dt><dd>{fleetMessage}</dd></div>
        <div><dt>{t('data.lastExport')}</dt><dd>{meta.lastExportAt || t('data.never')}</dd></div>
        <div><dt>{t('data.lastImport')}</dt><dd>{meta.lastImportAt || t('data.never')}</dd></div>
        <div><dt>{t('data.privateCloud')}</dt><dd>{t('data.noCloud')}</dd></div>
        <div><dt>{t('data.offline')}</dt><dd>{offlineReady ? t('data.offlineReady') : t('data.offlinePreparing')}</dd></div>
      </dl>
      {error && <p className="portable-error" role="alert">{error}</p>}
      {notice && <p role="status" className="portable-notice">{notice}</p>}
      {data && <>
        <div className="portable-actions">
          <button type="button" disabled={busy} onClick={() => operate(async () => {
            if (notes !== current.current.workspace.notes.text || goalTitle || taskTitle) throw new Error(t('data.saveDrafts'));
            const metadata = { ...meta, lastExportAt: new Date().toISOString() };
            await persist(current.current, metadata);
            download(JSON.stringify(current.current), 'workspace.primeai.json');
            setNotice(t('data.exported'));
          })}>{t('data.export')}</button>
          <label className="portable-import">{t('data.import')}<input aria-label={t('data.import')} type="file" accept=".json,.primeai.json,application/json" disabled={busy} onChange={importFile} /></label>
        </div>
        <p className="portable-hint">{t('data.integrity')}</p>
        {pending && <div className="portable-import-preview">
          <h3>{t('data.importPreview')}</h3>
          <p>{pending.data.workspace.goals.length} {t('data.goals')} · {pending.data.workspace.tasks.length} {t('data.tasks')} · {pending.conflicts.length} {t('data.conflicts')}</p>
          <p>{t('data.mergeWarning')}</p>
          <button type="button" disabled={busy} onClick={() => operate(async () => {
            if (current.current.checksum !== pending.baseChecksum) throw new Error(t('data.changedSincePreview'));
            await persist(pending.data, { ...meta, lastImportAt: new Date().toISOString() });
            setNotes(pending.data.workspace.notes.text);
            setPending(null);
            setNotice(t('data.imported'));
          })}>{t('data.confirmImport')}</button>
          <button type="button" disabled={busy} onClick={() => setPending(null)}>{t('data.cancel')}</button>
        </div>}
        {conflicts.length > 0 && <details className="portable-conflicts" open>
          <summary>{conflicts.length} {t('data.conflicts')}</summary>
          <button type="button" onClick={() => download(JSON.stringify(conflicts, null, 2), 'primeai-conflicts.json')}>{t('data.exportConflicts')}</button>
          {conflicts.map(conflict => <details key={`${conflict.collection}-${conflict.id}`}><summary>{conflict.collection} · {conflict.id} · {conflict.winner} ({conflict.reason})</summary><pre>{JSON.stringify(conflict, null, 2)}</pre></details>)}
        </details>}
        <div className="portable-columns">
          <form onSubmit={saveGoal}>
            <h3>{t('data.goals')}</h3>
            <label htmlFor="portable-goal">{t('data.goalLabel')}</label>
            <textarea id="portable-goal" required maxLength={4000} rows={3} value={goalTitle} onChange={event => setGoalTitle(event.target.value)} disabled={busy} />
            <button disabled={busy || !goalTitle.trim()}>{goalId ? t('data.updateGoal') : t('data.addGoal')}</button>
            {goalId && <button type="button" disabled={busy} onClick={() => { setGoalId(''); setGoalTitle(''); }}>{t('data.cancel')}</button>}
          </form>
          <form onSubmit={saveTask}>
            <h3>{t('data.tasks')}</h3>
            <label htmlFor="portable-task-goal">{t('data.taskGoal')}</label>
            <select id="portable-task-goal" value={taskGoalId} onChange={event => setTaskGoalId(event.target.value)} disabled={busy} required>
              <option value="">{t('data.chooseGoal')}</option>
              {data.workspace.goals.map(goal => <option key={goal.id} value={goal.id}>{goal.title}</option>)}
            </select>
            <label htmlFor="portable-task">{t('data.taskLabel')}</label>
            <input id="portable-task" required maxLength={2000} value={taskTitle} onChange={event => setTaskTitle(event.target.value)} disabled={busy} />
            <button disabled={busy || !taskTitle.trim() || !taskGoalId}>{taskId ? t('data.updateTask') : t('data.addTask')}</button>
            {taskId && <button type="button" disabled={busy} onClick={() => { setTaskId(''); setTaskTitle(''); }}>{t('data.cancel')}</button>}
          </form>
        </div>
        <ul className="portable-goals">
          {data.workspace.goals.map(goal => <li key={goal.id}>
            <h3>{goal.title}</h3>
            <button type="button" disabled={busy} onClick={() => { setGoalId(goal.id); setGoalTitle(goal.title); document.getElementById('portable-goal').focus(); }}>{t('data.editGoal')}</button>
            <button type="button" disabled={busy || !fleet} onClick={() => runMission(goal)}>{t('data.runMission')}</button>
            <ul>{data.workspace.tasks.filter(task => task.goalId === goal.id).map(task => <li key={task.id} className="portable-task-row">
              <label htmlFor={`task-${task.id}`}>{task.title}</label>
              <button type="button" disabled={busy} onClick={() => { setTaskId(task.id); setTaskTitle(task.title); setTaskGoalId(task.goalId); document.getElementById('portable-task').focus(); }}>{t('data.editTask')}</button>
              <select id={`task-${task.id}`} value={task.status} disabled={busy} onChange={event => {
                const status = event.target.value;
                operate(async () => {
                  const previous = current.current;
                  await persist({ ...previous, workspace: { ...previous.workspace, tasks: previous.workspace.tasks.map(entry => entry.id === task.id ? { ...entry, status, updatedAt: new Date().toISOString() } : entry) } });
                  setNotice(t('data.saved'));
                });
              }}><option value="todo">{t('data.todo')}</option><option value="doing">{t('data.doing')}</option><option value="done">{t('data.done')}</option></select>
            </li>)}</ul>
            {data.missions.filter(snapshot => snapshot.goalId === goal.id).map(snapshot => <details key={snapshot.id}>
              <summary>{t('data.snapshot')} · {snapshot.record.status} · {snapshot.id}</summary>
              <p>{t('data.snapshotWarning')} · SHA-256: {snapshot.hash}</p>
              <button type="button" disabled={busy || !fleet} onClick={() => refreshSnapshot(snapshot)}>{t('data.refreshSnapshot')}</button>
              {snapshot.record.error && <p role="status">{snapshot.record.error.message}</p>}
              {snapshot.record.steps.map(step => <div key={step.role}><h4>{step.role} · {step.status}</h4><pre>{step.output || step.error?.message || t('data.noOutput')}</pre></div>)}
            </details>)}
          </li>)}
        </ul>
        <form onSubmit={event => { event.preventDefault(); operate(async () => {
          const previous = current.current;
          await persist({ ...previous, workspace: { ...previous.workspace, notes: { id: 'notes', text: notes, updatedAt: new Date().toISOString() } } });
          setNotice(t('data.saved'));
        }); }}>
          <label htmlFor="portable-notes">{t('data.notes')}</label>
          <textarea id="portable-notes" rows={4} maxLength={64000} value={notes} onChange={event => setNotes(event.target.value)} disabled={busy} />
          <button disabled={busy}>{t('data.saveNotes')}</button>
        </form>
        <label htmlFor="portable-language">{t('data.fileLanguage')}</label>
        <select id="portable-language" value={data.workspace.settings.language} disabled={busy} onChange={event => {
          const value = event.target.value;
          operate(async () => {
            const previous = current.current;
            await persist({ ...previous, workspace: { ...previous.workspace, settings: { id: 'settings', language: value, updatedAt: new Date().toISOString() } } });
            setNotice(t('data.saved'));
          });
        }}><option value="en">English</option><option value="fr">Français</option></select>
      </>}
    </section>
  );
}
