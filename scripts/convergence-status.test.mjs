import test from 'node:test';
import assert from 'node:assert/strict';
import { convergenceMilestones, summarizeMilestones } from '../src/utils/convergenceStatus.js';

test('progress counts documented milestones, not agent activity or elapsed time', () => {
  assert.equal(new Set(convergenceMilestones.map(item => item.id)).size, 10);
  assert.deepEqual(summarizeMilestones(convergenceMilestones), { completed: 3, remaining: 7, total: 10, percent: 30 });
  for (const id of ['publish', 'merge', 'julia', 'gmail', 'bytebot', 'security', 'iphone']) {
    assert.equal(convergenceMilestones.find(item => item.id === id).complete, false);
  }
  assert.deepEqual(summarizeMilestones([]), { completed: 0, remaining: 0, total: 0, percent: 0 });
  assert.equal(summarizeMilestones([{ complete: true }, { complete: true }]).percent, 100);
});
