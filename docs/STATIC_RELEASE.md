# Guarded static release pipeline

Replaces the legacy `GOLIVEPRIMEAI.cmd` procedure (`git push -f … main:gh-pages`) with a
manual, approval-gated, non-force GitHub Actions release to the legacy Pages branch.

| File | Role |
| --- | --- |
| `.github/workflows/static-release.yml` | Reusable `workflow_call` pipeline (repos with a dedicated legacy Pages branch) |
| `.github/workflows/prime-ai-release.yml` | `workflow_dispatch` caller for prime-ai.fr (`gh-pages`, CNAME `prime-ai.fr`) |
| `.github/workflows/static-release-ci.yml` | PR-only checks: tooling unit tests, actionlint, PRIME dry-run build (read-only token) |
| `scripts/release/static-release.mjs` | Tooling CLI: SHA/source checks, disk guard, artifact validation, manifest, publish, restore, post-deploy |
| `scripts/release/static-release.test.mjs` | `node --test` suite (local bare-repo origin, local HTTP server; no network) |

## Guarantees

1. **Approved immutable source**: `source_sha` must be a full 40-character SHA. It must equal the
   checked-out HEAD, be reachable from `approved_ref` (default `main`), and have no tracked
   modifications.
2. **Targeted tests and build** run only in dry-run mode on GitHub runners after a disk guard
   (`min_free_gib`, default 3). Publish never installs dependencies or rebuilds.
3. **Artifact validation** enforces:
   - an extension and path allowlist: no dotfiles except a root `.nojekyll`, no symlinks, no source maps
   - per-file and total size limits
   - a scan for sensitive filenames and secret patterns
   - the required files `index.html`, `CNAME`, `.nojekyll` and `<route>/index.html` for each
     `required_routes` entry
   - an exact CNAME match
4. **Source to artifact binding**: `release-manifest.json` is served publicly and contains no
   secrets. It records `sourceSha`, `toolingSha`, the run id, `indexSha256` and `artifactSha256`
   (SHA-256 over the sorted `sha256  path` lines). The artifact is stored with
   `actions/upload-artifact`. Publish requires explicit `reviewed_run_id`, `reviewed_artifact_id`
   and `reviewed_artifact_sha256`. Preflight verifies the successful manual PRIME dry-run on
   `main`, repository, workflow identity, source in its run title, artifact ID, expiry, run
   attempt and immutable archive digest. The deploy job downloads that exact artifact ID,
   repeats the metadata checks after approval, verifies the manifest's source/repository/site/
   validation tooling/run binding, and re-hashes the downloaded files. Any mismatch fails closed.
5. **Manual approval**: publish and restore require the GitHub Environment `prime-ai-production`
   with **required reviewers**. Preflight fails closed if the environment is missing or has no
   reviewers. Production modes are refused for `pull_request*` events. They must be dispatched from
   `main` with `confirm_sha` re-typed.
6. **Serialized deployment**: the deploy job uses the concurrency group
   `static-release-pages-<owner/repo>-<pages_branch>` with `cancel-in-progress: false`. The caller
   adds the group `prime-ai-release`. External drivers may hold their own lock around a dispatch.
   They must never push the Pages branch outside this workflow.
7. **Rollback saved first**: the tag `pages-rollback/<site_id>/<run_id>-<attempt>` is pushed at the
   previous Pages tip and verified before the branch moves. Tags are never overwritten.
8. **No force-push**: the new commit's parent is the fetched tip. If the branch moved, the plain
   push is rejected and the run fails without overwriting anything. The live CNAME must equal
   `cname`, so the domain cannot change. DNS is never touched.
9. **Post-deployment checks**: the job polls `site_url` with cache-busting until all of these pass:
   - home returns HTTP 200
   - the home HTML hash equals the released `index.html`
   - each required route `/<route>/` returns HTML with HTTP 200 (publish only)
   - every referenced `/assets/*` file returns HTTP 200
   - the live `release-manifest.json` matches `sourceSha` and `artifactSha256` (publish only)

   A timeout fails the run explicitly.
10. **Result manifest**: the `static-release-result-<site>-<run>-<attempt>` artifact and the job
    summary are written on success and on failure. They record stage outcomes, the previous and new
    Pages SHAs, and the rollback tag.

Nothing is scheduled. A new iteration happens only when an operator, or an external scheduler that
holds the shared lock, dispatches a run with a newly approved source SHA. The pipeline never
generates content, sends mail, creates accounts or enables runtime services.

## Invocation contract (prime-ai.fr)

```sh
# Dry run (no approval needed): build, test, validate, plan the gh-pages commit.
gh workflow run prime-ai-release.yml --ref main -f mode=dry-run -f source_sha=<40-char main SHA>

# Publish (waits for prime-ai-production reviewers):
gh workflow run prime-ai-release.yml --ref main -f mode=publish \
  -f source_sha=<SHA> -f confirm_sha=<SHA> \
  -f reviewed_run_id=<successful-dry-run-id> -f reviewed_artifact_id=<immutable-artifact-id> \
  -f reviewed_artifact_sha256=<reviewed-tree-digest>

# Rollback / restore a known-good Pages tree as a new forward commit:
gh workflow run prime-ai-release.yml --ref main -f mode=restore \
  -f restore_from_sha=<pages SHA> -f confirm_sha=<pages SHA> -f restore_allowed_ref=gh-pages
# Known-good gold build (source 712e825, Pages run 37075302054), preserved on gh-pages-gold-backup:
#   restore_from_sha=369fc4d21c113e7ebd3dac99513975a9a17ac7e8 restore_allowed_ref=gh-pages-gold-backup
# Current live legacy tree: restore_from_sha=76cbf79f2fe1bf9a3fccf06c15988e0d8e1e9ddd restore_allowed_ref=gh-pages
# After any publish, roll back with restore_from_sha=<previous_sha from the result manifest>
# (also tagged pages-rollback/prime-ai/<run>-<attempt>), restore_allowed_ref=gh-pages.
```

To follow a run, use `gh run watch <id>`. To get the result, use
`gh run download <id> -n static-release-result-prime-ai-<id>-<attempt>`. The run fails, and is not
successful, unless publishing and every post-deployment check pass.

### Validating an unmerged source (dry-run only)

`source_ref` names the branch that `source_sha` must be reachable from. Dry-run accepts any
branch, for example a PR head; publish and restore require `source_ref=main`. A dry-run runs the
full PRIME gate (tests, build, Playwright, artifact policy, required routes, publish plan) and
never publishes:

```sh
gh workflow run prime-ai-release.yml --ref main -f mode=dry-run \
  -f source_ref=<PR head branch> -f source_sha=<PR head SHA> -f correlation_id=<id>
```

Pull requests to `main` also run `static-release CI` automatically (dry-run of the PR head,
read-only token, required routes not enforced).

### Exact run correlation for external drivers

Pass a unique `correlation_id` (`[A-Za-z0-9._:-]`, at most 64 characters). The run title is then
exactly `prime-ai <mode> <source_sha|restore_from_sha> cid=<correlation_id>`. Find the run with
`gh run list -w prime-ai-release.yml -e workflow_dispatch --json databaseId,displayTitle,headSha,createdAt`
and require exactly one run whose `displayTitle` matches and whose `headSha` is the tooling commit on
`main` that you dispatched against. Never select the latest run blindly. The id is also written to
the result manifest as `correlationId`.

### Result manifest `static-release-result/v1`

Only publish and restore runs produce `result.json` (artifact
`static-release-result-<site>-<runId>-<runAttempt>`, file `release-result.json`, 90-day retention).
It is written even when an earlier deploy step fails; if the run fails before the deploy job
(preflight, build, gate, or rejected approval), there is no result artifact and the driver must
treat the run conclusion as `failed`. Dry-runs only produce the build artifact
`static-release-<site>-<runId>-<runAttempt>`, which contains `release-manifest.json`, and a
`planned` publish status in the job log.

| Field | Meaning |
|---|---|
| `schema` | `"static-release-result/v1"` |
| `status` | `succeeded` (publish/restore plus all post-deploy checks passed, or tree `unchanged`) or `failed` |
| `mode`, `site`, `url`, `repository` | Inputs and context |
| `run`, `runId`, `runAttempt` | Run URL, id and attempt (strings) |
| `correlationId` | Caller id or `null` |
| `sourceSha` / `restoreFromSha` | Released source commit (publish) or republished Pages commit (restore); the other is `null` |
| `toolingSha` | Pinned release tooling commit |
| `artifactSha256` | Digest of the deployed tree, excluding `release-manifest.json` |
| `branch` | Pages branch (`gh-pages`) |
| `rollbackTag` | `pages-rollback/<site>/<runId>-<runAttempt>` when a push happened, else `null` |
| `publish` | `null` or `{status: published, unchanged or planned; previous_sha; new_sha; rollback_tag; pushed; tree}` |
| `postdeploy` | `null` or `{ok, attempts, home, routes:[{path,status}], assets:[{path,status}]}` |
| `stages` | `{publish, postdeploy}`, each `success`, `failure` or `skipped` |
| `finishedAt` | ISO timestamp |

Post-deploy SHA marker: after publish, the live `/release-manifest.json` must report the released
`sourceSha` and `artifactSha256`, and the live home HTML must hash to the released `indexSha256`.
Restore checks only the home hash (legacy trees carry no manifest). To roll back, dispatch
`mode=restore` with `restore_from_sha=publish.previous_sha`.

The PRIME caller requires the replica route pages
`replica,responsive-preview,semantic-library,replica-image,convergence,legacy`. A source SHA
without them, such as the current `main` `712e825`, is rejected at validation.

### Reviewing and consuming an immutable artifact

The dry-run summary includes the immutable artifact ID and tree digest. Inspect/download the
artifact before authorizing publish. You can also list its metadata with:

```sh
gh api repos/Yacinewhatchandcode/prime-ai-website/actions/runs/<dry-run-id>/artifacts
```

The Actions archive `digest` is different from the tree digest in `release-manifest.json`;
`reviewed_artifact_sha256` must be the latter. The selected run must be a completed successful
manual `prime-ai-release.yml` dry-run dispatched from `main`. PR CI artifacts and artifacts
built using unmerged tooling are not eligible. The source must be reachable from `main` at
publish time. An artifact built from a PR head can be consumed only if that exact source SHA
is subsequently reachable from `main`; if a squash/rebase changes the SHA, validate the new SHA.
The artifact name must match `static-release-<site>-<run>-<attempt>`, preventing a previous
attempt's artifact from being selected after a rerun. Deleted/expired artifacts require a new
dry-run and a fresh review; publish has no rebuild fallback.

The result manifest adds `review` (or `null` for restore/failed verification), containing
`validationRunId`, `validationRunAttempt`, `artifactId`, `artifactSha256`,
`validationToolingSha` and `artifactArchiveDigest`. Preserve this raw evidence separately from
the ORB normalized all-sites receipt. Reviewer approval, rollback and deployment locks remain
mandatory unless the explicitly selected single-owner policy below applies.

The live `release-manifest.json` retains the original dry-run identity: `toolingSha` must match
`review.validationToolingSha`, and its `runId` is exactly
`<review.validationRunId>-<review.validationRunAttempt>`. The result's top-level `toolingSha`,
`runId` and `runAttempt` identify the later production dispatch, not the original validation.
Do not compare the live marker's run/tooling identity to the production dispatch fields.

### Explicit single-owner policy

The default is still `approval_policy=required-reviewers/v1`; missing reviewers never trigger
an automatic fallback. An owner can explicitly enable `single-owner/v1` for reviewed publish:

- The repository must belong to a **User**, and both the original dispatch actor and rerun
  initiator must be that repository owner.
- Repository variable `STATIC_RELEASE_APPROVAL_POLICY` must be exactly `single-owner/v1`.
- The production Environment must use custom branch policies with **exactly one branch `main`**,
  no wildcard, tag or extra branch. Existing required reviewers, if present, are not removed.
- Dispatch must explicitly select `approval_policy=single-owner/v1` and provide
  `policy_approval=single-owner/v1:<repository>:<source_sha>:<tree_sha256>:<validation_run_id>:<artifact_id>`.
- All immutable artifact verification, source-main ancestry, routes, disk guard, concurrency,
  rollback-before-push, non-force update and live checks remain unchanged. Publish never rebuilds.

```sh
gh workflow run prime-ai-release.yml --ref main -f mode=publish \
  -f source_sha=<SHA> -f confirm_sha=<SHA> -f reviewed_run_id=<RUN> \
  -f reviewed_artifact_id=<ID> -f reviewed_artifact_sha256=<TREE_DIGEST> \
  -f approval_policy=single-owner/v1 \
  -f policy_approval=single-owner/v1:<REPOSITORY>:<SHA>:<TREE_DIGEST>:<RUN>:<ID>
```

The policy is checked in preflight and again before deployment. The result adds optional
`approval: {policy, actor, production, policyApproval}`. This is explicit owner authorization,
**not independent review**. Single-owner restore is not supported by this release consent
contract; restore continues to require reviewer approval. This option does not create branch
protection or grant permissions to nonowners, bots, organizations, PR events or other repositories.

This reviewed-publish contract currently trusts the PRIME manual validation workflow in the
same repository. Other repositories must supply an equivalent approved validation workflow;
do not treat a same-named artifact from arbitrary CI as approved evidence.

## Reusing for another site

```yaml
jobs:
  release:
    uses: Yacinewhatchandcode/prime-ai-website/.github/workflows/static-release.yml@<tooling SHA>
    with:
      site_id: example
      site_url: https://example.com
      cname: example.com
      mode: ${{ inputs.mode }}
      source_sha: ${{ inputs.source_sha }}
      tooling_sha: <same tooling SHA>
      test_command: npm test
      environment: example-production
    # caller permissions: contents: write, pages: write, actions: read
```

Only **legacy branch-sourced Pages** with a dedicated build branch (such as `gh-pages`) is
supported. Some sites need a different publisher:
- sites whose Pages source is the source branch itself, such as amlazr.com (`main` at `/`)
- sites that use Actions `build_type: workflow`, such as yace19ai.com

Never point `pages_branch` at a source branch.

## Owner configuration required before the first production run

Create the Environment **`prime-ai-production`** in Settings → Environments. Give it at least one
required reviewer and, ideally, a deployment-branch rule limited to `main`. Until then, publish and
restore fail closed at preflight. Dry-run works without it.
