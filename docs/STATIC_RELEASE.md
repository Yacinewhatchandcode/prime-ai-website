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
2. **Targeted tests and build** run on GitHub runners after a disk guard (`min_free_gib`, default 3).
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
   `actions/upload-artifact`. The deploy job re-hashes the downloaded files and refuses any mismatch.
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
  -f source_sha=<SHA> -f confirm_sha=<SHA>

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

The PRIME caller requires the replica route pages
`replica,responsive-preview,semantic-library,replica-image,convergence,legacy`. A source SHA
without them, such as the current `main` `712e825`, is rejected at validation.

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
