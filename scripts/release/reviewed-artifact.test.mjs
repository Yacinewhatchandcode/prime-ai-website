import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { verifyReview } from './reviewed-artifact.mjs';
import { main, verifyArtifact, writeManifest } from './static-release.mjs';

function fixture() {
  const source = 'a'.repeat(40), tooling = 'b'.repeat(40), digest = 'c'.repeat(64);
  return {
    repository: 'owner/prime', site: 'prime-ai', sourceSha: source, runId: '12', artifactId: '34', digest,
    workflowPath: '.github/workflows/prime-ai-release.yml',
    workflow: { id: 56, path: '.github/workflows/prime-ai-release.yml' },
    run: { id: 12, workflow_id: 56, repository: { full_name: 'owner/prime' },
      head_repository: { full_name: 'owner/prime' }, event: 'workflow_dispatch', status: 'completed',
      conclusion: 'success', head_sha: tooling, head_branch: 'main', run_attempt: 2,
      display_title: `prime-ai dry-run ${source} cid=test` },
    artifact: { id: 34, name: 'static-release-prime-ai-12-2', expired: false,
      expires_at: '2030-01-01T00:00:00Z', digest: `sha256:${'d'.repeat(64)}`,
      workflow_run: { id: 12, head_sha: tooling } },
    manifest: { schema: 'static-release/v1', siteId: 'prime-ai', sourceRepository: 'owner/prime',
      sourceSha: source, toolingSha: tooling, runId: '12-2', artifactSha256: digest, indexSha256: 'e'.repeat(64) },
    now: Date.parse('2026-01-01'),
  };
}

test('accepts exactly bound successful immutable artifact including rerun attempt', () => {
  assert.equal(verifyReview(fixture()).artifactId, '34');
  const f = fixture();
  delete f.manifest;
  assert.equal(verifyReview(f).validationToolingSha, 'b'.repeat(40));
});

const rejects = [
  ['failed run', f => { f.run.conclusion = 'failure'; }],
  ['incomplete run', f => { f.run.status = 'in_progress'; }],
  ['PR run', f => { f.run.event = 'pull_request'; }],
  ['untrusted branch tooling', f => { f.run.head_branch = 'unreviewed-tooling'; }],
  ['publish run', f => { f.run.display_title = f.run.display_title.replace('dry-run', 'publish'); }],
  ['different source', f => { f.sourceSha = 'e'.repeat(40); }],
  ['different workflow', f => { f.run.workflow_id = 57; }],
  ['different workflow path', f => { f.workflow.path = 'other.yml'; }],
  ['different repository', f => { f.run.repository.full_name = 'other/repo'; }],
  ['fork run', f => { f.run.head_repository.full_name = 'fork/repo'; }],
  ['different run ID', f => { f.run.id = 13; }],
  ['different artifact ID', f => { f.artifact.id = 35; }],
  ['expired artifact', f => { f.artifact.expired = true; }],
  ['expired by timestamp', f => { f.artifact.expires_at = '2020-01-01'; }],
  ['missing expiry', f => { delete f.artifact.expires_at; }],
  ['previous rerun artifact', f => { f.artifact.name = 'static-release-prime-ai-12-1'; }],
  ['artifact from another run', f => { f.artifact.workflow_run.id = 13; }],
  ['artifact from other tooling', f => { f.artifact.workflow_run.head_sha = 'e'.repeat(40); }],
  ['missing archive digest', f => { delete f.artifact.digest; }],
  ['manifest from other source', f => { f.manifest.sourceSha = 'e'.repeat(40); }],
  ['manifest from other tooling', f => { f.manifest.toolingSha = 'e'.repeat(40); }],
  ['manifest from other run', f => { f.manifest.runId = '13'; }],
  ['manifest missing run attempt', f => { f.manifest.runId = '12'; }],
  ['manifest from earlier attempt', f => { f.manifest.runId = '12-1'; }],
  ['manifest from other repository', f => { f.manifest.sourceRepository = 'other/repo'; }],
  ['manifest from other site', f => { f.manifest.siteId = 'other'; }],
  ['manifest digest mismatch', f => { f.manifest.artifactSha256 = 'e'.repeat(64); }],
  ['missing index binding', f => { delete f.manifest.indexSha256; }],
  ['invalid source', f => { f.sourceSha = 'main'; }],
  ['invalid digest', f => { f.digest = '123'; }],
  ['invalid IDs', f => { f.artifactId = '../34'; }],
];
for (const [name, mutate] of rejects) {
  test(`rejects ${name}`, () => {
    const f = fixture();
    mutate(f);
    assert.throws(() => verifyReview(f), /reviewed artifact:/);
  });

}

test('workflow publishes only downloaded reviewed bytes, with existing approval and no build', () => {
    const workflow = fs.readFileSync(new URL('../../.github/workflows/static-release.yml', import.meta.url), 'utf8');
    const build = workflow.split('\n  build:')[1].split('\n  deploy:')[0];
    const deploy = workflow.split('\n  deploy:')[1];
    assert.match(build, /if: inputs\.mode == 'dry-run'/);
    assert.match(workflow, /has no required reviewers/);
    assert.match(deploy, /artifact-ids: \$\{\{ inputs\.reviewed_artifact_id \}\}/);
    assert.match(deploy, /run-id: \$\{\{ inputs\.reviewed_run_id \}\}/);
    assert.match(deploy, /merge-multiple: true/);
    assert.match(deploy, /DIGEST: \$\{\{ inputs\.reviewed_artifact_sha256 \}\}/);
    assert.match(deploy, /verify-source/);
    assert.match(deploy, /reviewed-artifact\.mjs/);
    assert.doesNotMatch(deploy, /needs\.build\.outputs|npm ci|npm run build/);
    assert.ok(deploy.indexOf('reviewed-artifact.mjs') < deploy.indexOf('Save rollback tag'));
    assert.ok(deploy.indexOf('verify-artifact') < deploy.indexOf('Save rollback tag'));
});

test('consumption verifies actual validation CLI manifest and refuses rebuilt or tampered bytes', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'review-consumption-'));
  try {
    const html = '<html><script src="/assets/original.js"></script></html>';
    fs.mkdirSync(path.join(dir, 'assets'));
    fs.writeFileSync(path.join(dir, 'index.html'), html);
    fs.writeFileSync(path.join(dir, 'assets/original.js'), 'console.log("reviewed")');
    fs.writeFileSync(path.join(dir, 'CNAME'), 'prime-ai.fr\n');
    fs.writeFileSync(path.join(dir, '.nojekyll'), '');
    const f = fixture();
    await main(['validate', '--dir', dir, '--cname', 'prime-ai.fr', '--site-id', f.site,
      '--source-repository', f.repository, '--source-sha', f.sourceSha,
      '--tooling-sha', f.run.head_sha, '--run-id', `${f.runId}-${f.run.run_attempt}`]);
    f.manifest = JSON.parse(fs.readFileSync(path.join(dir, 'release-manifest.json'), 'utf8'));
    f.digest = f.manifest.artifactSha256;
    verifyReview(f);
    assert.equal(verifyArtifact(dir, { expectedDigest: f.digest, expectedSourceSha: f.sourceSha,
      policy: { cname: 'prime-ai.fr' } }).artifactSha256, f.digest);
    writeManifest(dir, { ...f.manifest, indexSha256: 'e'.repeat(64) });
    assert.throws(() => verifyArtifact(dir, { expectedDigest: f.digest,
      expectedSourceSha: f.sourceSha, policy: { cname: 'prime-ai.fr' } }), /indexSha256/);
    writeManifest(dir, f.manifest);
    fs.writeFileSync(path.join(dir, 'assets/original.js'), 'console.log("rebuilt")');
    assert.throws(() => verifyArtifact(dir, { expectedDigest: f.digest,
      expectedSourceSha: f.sourceSha, policy: { cname: 'prime-ai.fr' } }), /digest|sha256/i);
  } finally { fs.rmSync(dir, { recursive: true }); }
});
