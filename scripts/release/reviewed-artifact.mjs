import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const fail = message => { throw new Error(`reviewed artifact: ${message}`); };

export function verifyReview({ repository, site, sourceSha, runId, artifactId, digest, workflowPath,
  workflow, run, artifact, manifest, now = Date.now() }) {
  if (!/^[0-9a-f]{40}$/.test(sourceSha)) fail('source SHA must be full lowercase hex');
  if (!/^[0-9a-f]{64}$/.test(digest)) fail('tree digest must be SHA-256');
  for (const id of [runId, artifactId]) if (!/^[1-9][0-9]*$/.test(String(id))) fail('run and artifact IDs must be positive integers');
  if (workflow.path !== workflowPath || String(run.workflow_id) !== String(workflow.id)) fail('unexpected validation workflow');
  if (String(run.id) !== String(runId) || run.repository?.full_name !== repository ||
      run.head_repository?.full_name !== repository) fail('run repository or ID mismatch');
  if (run.event !== 'workflow_dispatch' || run.status !== 'completed' || run.conclusion !== 'success') fail('validation run did not succeed as a manual dry-run');
  if (run.head_branch !== 'main') fail('validation tooling must run from main');
  if (!/^[0-9a-f]{40}$/.test(run.head_sha) || !Number.isSafeInteger(run.run_attempt) || run.run_attempt < 1) fail('invalid run tooling SHA or attempt');
  if (!run.display_title?.startsWith(`prime-ai dry-run ${sourceSha} cid=`)) fail('run is not a dry-run of the approved source');
  if (String(artifact.id) !== String(artifactId) || artifact.expired ||
      !Number.isFinite(Date.parse(artifact.expires_at)) || Date.parse(artifact.expires_at) <= now) fail('artifact missing, expired or ID mismatch');
  if (artifact.name !== `static-release-${site}-${runId}-${run.run_attempt}` ||
      String(artifact.workflow_run?.id) !== String(runId) ||
      artifact.workflow_run?.head_sha !== run.head_sha) fail('artifact does not belong to the validation run and attempt');
  if (!/^sha256:[0-9a-f]{64}$/.test(artifact.digest ?? '')) fail('immutable artifact archive digest missing');
  if (manifest && (manifest.schema !== 'static-release/v1' || manifest.siteId !== site ||
      manifest.sourceRepository !== repository || manifest.sourceSha !== sourceSha ||
      manifest.toolingSha !== run.head_sha || String(manifest.runId) !== String(runId) ||
      manifest.artifactSha256 !== digest)) fail('manifest source, tooling, run or tree digest mismatch');
  return { validationRunId: String(runId), validationRunAttempt: String(run.run_attempt),
    artifactId: String(artifactId), artifactSha256: digest, validationToolingSha: run.head_sha,
    artifactArchiveDigest: artifact.digest };
}

export function checkFromEnvironment(env = process.env, api = endpoint =>
  JSON.parse(execFileSync('gh', ['api', endpoint], { encoding: 'utf8' }))) {
  const repository = env.REVIEW_REPOSITORY;
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository ?? '')) fail('invalid repository');
  for (const id of [env.REVIEW_RUN_ID, env.REVIEW_ARTIFACT_ID]) {
    if (!/^[1-9][0-9]*$/.test(id ?? '')) fail('run and artifact IDs must be positive integers');
  }
  const workflowPath = '.github/workflows/prime-ai-release.yml';
  const workflow = api(`repos/${repository}/actions/workflows/prime-ai-release.yml`);
  const run = api(`repos/${repository}/actions/runs/${env.REVIEW_RUN_ID}`);
  const artifact = api(`repos/${repository}/actions/artifacts/${env.REVIEW_ARTIFACT_ID}`);
  const manifest = env.REVIEW_MANIFEST ? JSON.parse(fs.readFileSync(env.REVIEW_MANIFEST, 'utf8')) : undefined;
  const result = verifyReview({ repository, site: env.REVIEW_SITE, sourceSha: env.REVIEW_SOURCE_SHA,
    runId: env.REVIEW_RUN_ID, artifactId: env.REVIEW_ARTIFACT_ID, digest: env.REVIEW_DIGEST,
    workflowPath, workflow, run, artifact, manifest });
  if (env.REVIEW_OUT) fs.writeFileSync(env.REVIEW_OUT, JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result, null, 2));
  return result;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  try { checkFromEnvironment(); }
  catch (error) { console.error(`::error::${error.message.replace(/\n/g, '%0A')}`); process.exitCode = 1; }
}
