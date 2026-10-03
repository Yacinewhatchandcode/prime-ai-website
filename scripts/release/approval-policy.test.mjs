import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { verifyApproval } from './approval-policy.mjs';

const sourceSha = 'a'.repeat(40), digest = 'b'.repeat(64);
function fixture() {
  return { policy: 'single-owner/v1', mode: 'publish', event: 'workflow_dispatch', ref: 'refs/heads/main',
    actor: 'owner', repository: 'owner/prime', repo: { full_name: 'owner/prime', owner: { type: 'User', login: 'owner' } },
    configuredPolicy: 'single-owner/v1', approval: `single-owner/v1:owner/prime:${sourceSha}:${digest}:12:34`,
    sourceSha, digest, runId: '12', artifactId: '34',
    environment: { protection_rules: [], deployment_branch_policy: { protected_branches: false, custom_branch_policies: true } },
    branchPolicies: { total_count: 1, branch_policies: [{ name: 'main', type: 'branch' }] } };
}
test('explicit owner approval accepted without pretending to have reviewers', () => {
  assert.equal(verifyApproval(fixture()).policy, 'single-owner/v1');
});
test('default remains required reviewers regardless of owner opt-in', () => {
  const f = fixture();
  delete f.policy;
  assert.throws(() => verifyApproval(f), /no required reviewers/);
  f.environment.protection_rules = [{ type: 'required_reviewers', reviewers: [{ type: 'User', reviewer: { login: 'reviewer' } }] }];
  assert.equal(verifyApproval(f).policy, 'required-reviewers/v1');
});
const rejected = [
  ['missing repository opt-in', f => { f.configuredPolicy = ''; }],
  ['wrong policy opt-in', f => { f.configuredPolicy = 'required-reviewers/v1'; }],
  ['organization', f => { f.repo.owner.type = 'Organization'; }],
  ['non-owner actor', f => { f.actor = 'collaborator'; }],
  ['bot actor', f => { f.actor = 'github-actions[bot]'; }],
  ['non-owner rerun', f => { f.triggeringActor = 'collaborator'; }],
  ['wrong repository', f => { f.repo.full_name = 'other/repo'; }],
  ['PR event', f => { f.event = 'pull_request'; }],
  ['push event', f => { f.event = 'push'; }],
  ['branch dispatch', f => { f.ref = 'refs/heads/feature'; }],
  ['missing approval', f => { f.approval = ''; }],
  ['different source', f => { f.sourceSha = 'c'.repeat(40); }],
  ['different digest', f => { f.digest = 'c'.repeat(64); }],
  ['different run', f => { f.runId = '13'; }],
  ['different artifact', f => { f.artifactId = '35'; }],
  ['invalid digest', f => { f.digest = 'x'; }],
  ['invalid ID', f => { f.runId = '../12'; }],
  ['restore without distinct approval contract', f => { f.mode = 'restore'; }],
  ['unsupported policy', f => { f.policy = 'allow-all'; }],
  ['unrestricted environment', f => { f.environment.deployment_branch_policy = null; }],
  ['protected-branches wildcard', f => { f.environment.deployment_branch_policy.protected_branches = true; }],
  ['missing branch policy', f => { f.branchPolicies.total_count = 0; }],
  ['extra branch policy', f => { f.branchPolicies.total_count = 2; }],
  ['wildcard', f => { f.branchPolicies.branch_policies[0].name = '*'; }],
  ['main tag', f => { f.branchPolicies.branch_policies[0].type = 'tag'; }],
];
for (const [name, mutate] of rejected) test(`rejects ${name}`, () => {
  const f = fixture();
  mutate(f);
  assert.throws(() => verifyApproval(f), /approval policy:/);
});

test('workflow checks policy before approval and again before any artifact/push mutation', () => {
  const workflow = fs.readFileSync(new URL('../../.github/workflows/static-release.yml', import.meta.url), 'utf8');
  const preflight = workflow.split('\n  preflight:')[1].split('\n  build:')[0];
  const deploy = workflow.split('\n  deploy:')[1];
  const build = workflow.split('\n  build:')[1].split('\n  deploy:')[0];
  assert.match(workflow, /approval_policy: \{ type: string, default: "required-reviewers\/v1"/);
  assert.match(preflight, /Verify explicit approval policy/);
  assert.match(deploy, /Recheck approval policy before deployment/);
  assert.doesNotMatch(build, /approval-policy\.mjs/);
  assert.ok(deploy.indexOf('approval-policy.mjs') < deploy.indexOf('Checkout Pages branch'));
  assert.match(deploy, /CONFIGURED_APPROVAL_POLICY: \$\{\{ vars\.STATIC_RELEASE_APPROVAL_POLICY \}\}/);
  assert.match(deploy, /approval: read/);
});
