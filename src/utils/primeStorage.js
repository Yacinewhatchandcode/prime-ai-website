import { MAX_FILE_BYTES, parseData, validateData } from './primeData.js';
const key = 'prime-ai-data-v1';
const metadataKey = 'prime-ai-data-meta-v1';

export async function openPrimeStorage() {
  let database;
  if (globalThis.indexedDB) {
    try {
      database = await new Promise((resolve, reject) => {
        const request = indexedDB.open(key, 1);
        request.onupgradeneeded = () => request.result.createObjectStore('workspace');
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        request.onblocked = () => reject(new Error('Storage upgrade is blocked by another browser tab.'));
      });
    } catch (error) {
      if (!['SecurityError', 'InvalidStateError', 'UnknownError'].includes(error.name)) throw error;
    }
  }
  const transaction = (mode, operation) => new Promise((resolve, reject) => {
    const tx = database.transaction('workspace', mode);
    const request = operation(tx.objectStore('workspace'));
    tx.oncomplete = () => resolve(request.result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('Storage transaction aborted'));
  });
  const read = async () => {
    const entry = database ? null : localStorage.getItem(key);
    const raw = database ? await transaction('readonly', store => store.get(key)) : entry ? JSON.stringify(JSON.parse(entry).data) : null;
    return raw ? parseData(raw) : null;
  };
  const metadata = async () => {
    const entry = database ? null : localStorage.getItem(key);
    const raw = database ? await transaction('readonly', store => store.get(metadataKey)) : entry ? JSON.stringify(JSON.parse(entry).meta) : null;
    if (!raw) return { lastExportAt: null, lastImportAt: null };
    const value = JSON.parse(raw);
    if (!value || Object.keys(value).some(field => !['lastExportAt', 'lastImportAt'].includes(field))) throw new Error('Invalid local transfer metadata');
    return value;
  };
  // Quota and validation errors are surfaced; never switch stores after a failed write.
  const save = async (data, meta, expectedChecksum) => {
    await validateData(data);
    const raw = JSON.stringify(data);
    if (new TextEncoder().encode(raw).length > MAX_FILE_BYTES) throw new Error('Local workspace exceeds 2 MiB');
    if (database) {
      await new Promise((resolve, reject) => {
        const tx = database.transaction('workspace', 'readwrite');
        const store = tx.objectStore('workspace');
        const check = store.get(key);
        let conflict;
        check.onsuccess = () => {
          const checksum = check.result ? JSON.parse(check.result).checksum : null;
          if (expectedChecksum !== undefined && checksum !== expectedChecksum) {
            conflict = new Error('Workspace changed in another tab. Reload before saving; your draft has not been overwritten.');
            tx.abort();
            return;
          }
          store.put(raw, key);
          if (meta) store.put(JSON.stringify(meta), metadataKey);
        };
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(conflict || tx.error || new Error('Workspace save aborted'));
      });
    } else {
      const previous = localStorage.getItem(key);
      if (expectedChecksum !== undefined && (previous ? JSON.parse(previous).data.checksum : null) !== expectedChecksum) throw new Error('Workspace changed in another tab. Reload before saving.');
      localStorage.setItem(key, JSON.stringify({ data, meta: meta || (previous ? JSON.parse(previous).meta : { lastExportAt: null, lastImportAt: null }) }));
    }
  };
  if (!database) {
    const probe = `${key}-probe`;
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
  }
  return { backend: database ? 'IndexedDB' : 'localStorage (2 MiB bound)', read, metadata, save, close: () => database?.close() };
}
