import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { classifyText, keywordGroups, searchReplica } from '../src/utils/replicaRetrieval.js';

test('all production keywords and all component content have source evidence', async () => {
  const data = JSON.parse(await readFile(new URL('../public/replica-data/semantic-index.json', import.meta.url)));
  assert.equal(data.metadataKeywords.length, 8);
  assert.equal(data.records.length, 24);
  assert.equal(data.records.filter(record => record.source === 'Public production metadata').length, 8);
  assert.equal(new Set(data.records.map(record => record.id)).size, 24);
  for (const record of data.records) {
    assert(record.evidence.capturedAt);
    assert(record.evidence.kind);
    assert(record.title && record.text);
    assert(record.groups.every(id => keywordGroups.some(group => group.id === id)));
  }
  for (const term of data.metadataKeywords) assert(searchReplica(data.records, term).length > 0, `Missing keyword ${term}`);
  assert(searchReplica(data.records, 'mémoire').some(record => record.title === 'Memory'));
  assert(searchReplica(data.records, 'M4').some(record => record.title === 'Mac'));
  assert(searchReplica(data.records, 'DSPy').some(record => record.title === 'Teleprompter'));
  assert.deepEqual(searchReplica(data.records, 'unicorn-wombat-987'), []);
  assert.equal(searchReplica(data.records, '').length, 24);
  assert(searchReplica(data.records, '', 'memory').every(record => record.groups.includes('memory')));
});

test('classification normalizes accents and uses whole concept phrases', () => {
  assert(classifyText('Mémoire souveraine').includes('memory'));
  assert(classifyText('Mémoire souveraine').includes('sovereign-ai'));
  assert(classifyText('local-first macOS infrastructure').includes('edge-ai'));
  assert(!classifyText('trustworthy imaginary macaron').includes('trust'));
});
