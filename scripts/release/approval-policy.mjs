import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const fail = message => { throw new Error(`approval policy: ${message}`); };

export function verifyApproval({ policy = 'required-reviewers/v1', mode, event, ref, actor, triggeringActor = actor,
  repository, repo, environment, branchPolicies, configuredPolicy, approval,
  sourceSha, digest, runId, artifactId }) {
  if (mode === 'dry-run') return { policy, actor, production: false };
  if (event !== 'workflow_dispatch' || ref !== 'refs/heads/main') fail('production requires manual dispatch from main');
  if (repo.full_name !== repository) fail('repository identity mismatch');
  if (policy === 'required-reviewers/v1') {
    if (!environment.protection_rules?.some(rule => rule.type === 'required_reviewers' && rule.reviewers?.length > 0)) {
      fail('environment has no required reviewers');
    }
  } else if (policy === 'single-owner/v1') {
    if (mode !== 'publish') fail('single-owner policy supports reviewed publish only; restore requires reviewer policy');
    if (repo.owner?.type !== 'User' || actor !== repo.owner.login || triggeringActor !== actor ||
        repository.split('/')[0] !== actor) fail('single-owner requires the user repository owner as actor and rerun initiator');
    if (configuredPolicy !== policy) fail('repository has not explicitly enabled single-owner/v1');
    if (!/^[0-9a-f]{40}$/.test(sourceSha ?? '') || !/^[0-9a-f]{64}$/.test(digest ?? '') ||
        !/^[1-9][0-9]*$/.test(runId ?? '') || !/^[1-9][0-9]*$/.test(artifactId ?? '')) fail('invalid immutable approval binding');
    const expected = `${policy}:${repository}:${sourceSha}:${digest}:${runId}:${artifactId}`;
    if (approval !== expected) fail('policy_approval does not match the exact reviewed release');
    const deployment = environment.deployment_branch_policy;
    if (deployment?.protected_branches !== false || deployment?.custom_branch_policies !== true ||
        branchPolicies?.total_count !== 1 || branchPolicies.branch_policies?.length !== 1 ||
        branchPolicies.branch_policies[0].name !== 'main' || branchPolicies.branch_policies[0].type !== 'branch') {
      fail('single-owner environment must allow exactly branch main, not tags or patterns');
    }
  } else {
    fail(`unsupported policy ${policy}`);
  }
  return { policy, actor, production: true, policyApproval: policy === 'single-owner/v1' ? approval : null };
}

export function checkApproval(env = process.env, api = endpoint =>
  JSON.parse(execFileSync('gh', ['api', endpoint], { encoding: 'utf8' }))) {
  const repository = env.GITHUB_REPOSITORY;
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository ?? '')) fail('invalid repository');
  if (!env.RELEASE_ENVIRONMENT) fail('production environment is required');
  const prefix = `repos/${repository}`;
  const environmentPath = `${prefix}/environments/${encodeURIComponent(env.RELEASE_ENVIRONMENT)}`;
  const result = verifyApproval({
    policy: env.APPROVAL_POLICY, mode: env.RELEASE_MODE, event: env.GITHUB_EVENT_NAME,
    ref: env.GITHUB_REF, actor: env.GITHUB_ACTOR, triggeringActor: env.GITHUB_TRIGGERING_ACTOR,
    repository, repo: api(prefix),
    environment: api(environmentPath),
    branchPolicies: env.APPROVAL_POLICY === 'single-owner/v1' ? api(`${environmentPath}/deployment-branch-policies`) : undefined,
    configuredPolicy: env.CONFIGURED_APPROVAL_POLICY, approval: env.POLICY_APPROVAL,
    sourceSha: env.RELEASE_SOURCE_SHA, digest: env.REVIEW_DIGEST, runId: env.REVIEW_RUN_ID,
    artifactId: env.REVIEW_ARTIFACT_ID,
  });
  if (env.APPROVAL_OUT) fs.writeFileSync(env.APPROVAL_OUT, JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result, null, 2));
  return result;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  try { checkApproval(); }
  catch (error) { console.error(`::error::${error.message.replace(/\n/g, '%0A')}`); process.exitCode = 1; }
}
