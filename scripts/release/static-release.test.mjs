import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import {
  MANIFEST_NAME, main, parseRoutes, assertNotPullRequest, assertSha, diskGuard, extractTree, postdeployCheck, prepareArtifact, publish,
  sha256, validateArtifact, verifyArtifact, verifySource, writeManifest,
} from './static-release.mjs';

const tmp = prefix => fs.mkdtempSync(path.join(os.tmpdir(), prefix));
const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@example.invalid', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@example.invalid' } }).trim();
const bare = (dir, ...args) => git(os.tmpdir(), `--git-dir=${dir}`, ...args);
const INDEX = '<!doctype html><html><head><script type="module" src="/assets/index-abc.js"></script><link rel="stylesheet" href="/assets/index-abc.css"></head><body></body></html>';

function site(files = {}) {
  const dir = tmp('site-');
  const all = { 'index.html': INDEX, 'assets/index-abc.js': 'console.log(1)', 'assets/index-abc.css': 'body{}', 'CNAME': 'prime-ai.fr\n', '.nojekyll': '', ...files };
  for (const [rel, content] of Object.entries(all)) {
    if (content === null) continue;
    fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), content);
  }
  return dir;
}

function pagesRemote() {
  const origin = tmp('origin-');
  git(origin, 'init', '-q', '--bare', '-b', 'gh-pages');
  const seed = tmp('seed-');
  git(seed, 'init', '-q', '-b', 'gh-pages');
  fs.writeFileSync(path.join(seed, 'index.html'), '<html>old</html>');
  fs.writeFileSync(path.join(seed, 'CNAME'), 'prime-ai.fr');
  git(seed, 'add', '-A');
  git(seed, 'commit', '-q', '-m', 'legacy');
  git(seed, 'push', '-q', origin, 'gh-pages');
  const work = tmp('work-');
  git(work, 'clone', '-q', '-b', 'gh-pages', origin, '.');
  return { origin, work, legacySha: git(seed, 'rev-parse', 'HEAD') };
}

test('assertSha accepts only full lowercase SHAs', () => {
  assert.equal(assertSha('a'.repeat(40)), 'a'.repeat(40));
  for (const bad of ['main', 'abc123', 'A'.repeat(40), '', undefined, `${'a'.repeat(40)}\n`]) assert.throws(() => assertSha(bad), /40-character/);
});

test('publishing is refused for pull_request events', () => {
  assert.throws(() => assertNotPullRequest('pull_request'), /refusing/);
  assert.throws(() => assertNotPullRequest('pull_request_target'), /refusing/);
  assert.doesNotThrow(() => assertNotPullRequest('workflow_dispatch'));
});

test('disk guard fails closed below threshold', () => {
  assert.ok(diskGuard(os.tmpdir(), 0).freeGiB >= 0);
  assert.throws(() => diskGuard(os.tmpdir(), 1e9), /GiB required/);
});

test('verifySource binds exact SHA reachable from approved ref', () => {
  const repo = tmp('src-');
  git(repo, 'init', '-q', '-b', 'main');
  fs.writeFileSync(path.join(repo, 'a'), '1');
  git(repo, 'add', '-A'); git(repo, 'commit', '-q', '-m', 'one');
  const approved = git(repo, 'rev-parse', 'HEAD');
  assert.deepEqual(verifySource({ repoDir: repo, sha: approved, approvedRef: 'main' }), { sha: approved, approvedRef: 'main' });
  git(repo, 'checkout', '-q', '-b', 'feature');
  fs.writeFileSync(path.join(repo, 'a'), '2');
  git(repo, 'commit', '-q', '-am', 'two');
  const unapproved = git(repo, 'rev-parse', 'HEAD');
  assert.throws(() => verifySource({ repoDir: repo, sha: unapproved, approvedRef: 'main' }), /not reachable/);
  assert.throws(() => verifySource({ repoDir: repo, sha: approved, approvedRef: 'main' }), /differs from approved/);
  git(repo, 'checkout', '-q', approved);
  fs.writeFileSync(path.join(repo, 'a'), 'dirty');
  assert.throws(() => verifySource({ repoDir: repo, sha: approved, approvedRef: 'main' }), /tracked modifications/);
});

test('prepare enforces CNAME, adds .nojekyll and optional SPA 404', () => {
  const dir = site({ CNAME: null, '.nojekyll': null });
  prepareArtifact(dir, { cname: 'prime-ai.fr', spa404: true });
  assert.equal(fs.readFileSync(path.join(dir, 'CNAME'), 'utf8'), 'prime-ai.fr\n');
  assert.ok(fs.existsSync(path.join(dir, '.nojekyll')));
  assert.equal(fs.readFileSync(path.join(dir, '404.html'), 'utf8'), INDEX);
  assert.throws(() => prepareArtifact(site({ CNAME: 'evil.example' }), { cname: 'prime-ai.fr' }), /CNAME/);
});

test('validator accepts a clean site and is deterministic', () => {
  const a = validateArtifact(site(), { cname: 'prime-ai.fr' });
  const b = validateArtifact(site(), { cname: 'prime-ai.fr' });
  assert.equal(a.artifactSha256, b.artifactSha256);
  assert.equal(a.fileCount, 5);
  assert.equal(validateArtifact(site({ 'prime_credentials_en.mp4': 'video' })).fileCount, 6, 'media names are not secrets');
  assert.notEqual(validateArtifact(site({ 'assets/index-abc.js': 'console.log(2)' })).artifactSha256, a.artifactSha256);
});

test('validator rejects disallowed paths, secrets and policy violations', () => {
  const cases = [
    [{ '.env': 'X=1' }, /hidden path|sensitive/],
    [{ 'assets/.git/config': 'x' }, /hidden path/],
    [{ 'run.sh': 'echo' }, /extension not allowlisted/],
    [{ 'assets/app.js.map': '{}' }, /extension not allowlisted/],
    [{ 'fleet-token.json': '{}' }, /sensitive-looking/],
    [{ 'secrets.txt': 'x' }, /sensitive-looking/],
    [{ 'assets/x.js': `const k="ghp_${'a'.repeat(36)}"` }, /github-token/],
    [{ 'assets/x.js': `const k="sk-proj-${'a'.repeat(40)}"` }, /openai/],
    [{ 'a.txt': '-----BEGIN OPENSSH PRIVATE KEY-----' }, /private-key/],
    [{ 'index.html': null }, /required file missing: index.html/],
    [{ CNAME: 'other.example' }, /CNAME is "other.example"/],
  ];
  for (const [files, pattern] of cases) assert.throws(() => validateArtifact(site(files), { cname: 'prime-ai.fr' }), pattern, JSON.stringify(files));
  assert.throws(() => validateArtifact(site({ 'big.png': Buffer.alloc(2048) }), { maxFileBytes: 1024 }), /too large/);
  const linked = site();
  fs.symlinkSync('/etc/hosts', path.join(linked, 'hosts.txt'));
  assert.throws(() => validateArtifact(linked), /symlink/);
});

test('manifest binds source SHA to artifact digest and detects tampering', () => {
  const dir = site();
  const sourceSha = 'b'.repeat(40);
  const { artifactSha256 } = validateArtifact(dir);
  writeManifest(dir, { sourceSha, artifactSha256 });
  assert.equal(verifyArtifact(dir, { expectedDigest: artifactSha256, expectedSourceSha: sourceSha }).manifest.sourceSha, sourceSha);
  assert.throws(() => verifyArtifact(dir, { expectedDigest: artifactSha256, expectedSourceSha: 'c'.repeat(40) }), /sourceSha/);
  assert.throws(() => verifyArtifact(dir, { expectedDigest: undefined }), /approved/);
  fs.writeFileSync(path.join(dir, 'assets/index-abc.js'), 'tampered');
  assert.throws(() => verifyArtifact(dir, { expectedDigest: artifactSha256 }), /digest/);
});

test('publish fast-forwards with saved rollback tag and never force-pushes', () => {
  const { origin, work, legacySha } = pagesRemote();
  const dir = site();
  writeManifest(dir, { sourceSha: 'b'.repeat(40) });
  const plan = publish({ repoDir: work, artifactDir: dir, cname: 'prime-ai.fr', message: 'release', rollbackTag: 'pages-rollback/prime/1-1', dryRun: true });
  assert.equal(plan.status, 'planned');
  assert.equal(bare(origin, 'rev-parse', 'gh-pages'), legacySha, 'dry-run must not push');
  const prev = process.env.GITHUB_EVENT_NAME;
  process.env.GITHUB_EVENT_NAME = 'workflow_dispatch';
  try {
    const r = publish({ repoDir: work, artifactDir: dir, cname: 'prime-ai.fr', message: 'release', rollbackTag: 'pages-rollback/prime/1-1' });
    assert.equal(r.status, 'published');
    assert.equal(r.previousSha, legacySha);
    assert.equal(bare(origin, 'rev-parse', 'gh-pages'), r.newSha);
    assert.equal(bare(origin, 'rev-parse', 'gh-pages^'), legacySha, 'new commit must descend from previous tip');
    assert.equal(bare(origin, 'rev-parse', 'refs/tags/pages-rollback/prime/1-1'), legacySha);
    assert.equal(bare(origin, 'show', 'gh-pages:.nojekyll'), '');
    assert.match(bare(origin, 'show', `gh-pages:${MANIFEST_NAME}`), /bbbb/);
    assert.equal(publish({ repoDir: work, artifactDir: dir, cname: 'prime-ai.fr', message: 'again', rollbackTag: 'pages-rollback/prime/2-1' }).status, 'unchanged');
    assert.throws(() => publish({ repoDir: work, artifactDir: site({ 'x.txt': 'x' }), cname: 'prime-ai.fr', message: 'dup', rollbackTag: 'pages-rollback/prime/1-1' }), /already exists/);
    assert.throws(() => publish({ repoDir: work, artifactDir: dir, cname: 'other.example', message: 'm', rollbackTag: 'pages-rollback/prime/3-1' }), /refusing domain change/);
    process.env.GITHUB_EVENT_NAME = 'pull_request';
    assert.throws(() => publish({ repoDir: work, artifactDir: site({ 'y.txt': 'y' }), cname: 'prime-ai.fr', message: 'm', rollbackTag: 'pages-rollback/prime/4-1' }), /refusing to publish/);
  } finally {
    if (prev === undefined) delete process.env.GITHUB_EVENT_NAME; else process.env.GITHUB_EVENT_NAME = prev;
  }
});

test('publish fails explicitly when the remote branch moved after fetch (no overwrite)', () => {
  const { origin, work } = pagesRemote();
  const racer = tmp('racer-');
  git(racer, 'clone', '-q', '-b', 'gh-pages', origin, '.');
  const hookPath = path.join(origin, 'hooks', 'pre-receive');
  fs.writeFileSync(hookPath, '#!/bin/sh\nwhile read old new ref; do case "$ref" in refs/heads/*) echo "simulated race" >&2; exit 1;; esac; done\n');
  fs.chmodSync(hookPath, 0o755);
  const prev = process.env.GITHUB_EVENT_NAME;
  process.env.GITHUB_EVENT_NAME = 'workflow_dispatch';
  try {
    assert.throws(() => publish({ repoDir: work, artifactDir: site(), cname: 'prime-ai.fr', message: 'm', rollbackTag: 'pages-rollback/prime/9-1' }), /non-force push rejected/);
  } finally {
    if (prev === undefined) delete process.env.GITHUB_EVENT_NAME; else process.env.GITHUB_EVENT_NAME = prev;
  }
});

test('restore extracts only trees from allowed history and republishes forward', () => {
  const { origin, work, legacySha } = pagesRemote();
  const prev = process.env.GITHUB_EVENT_NAME;
  process.env.GITHUB_EVENT_NAME = 'workflow_dispatch';
  try {
    publish({ repoDir: work, artifactDir: site(), cname: 'prime-ai.fr', message: 'bad release', rollbackTag: 'pages-rollback/prime/5-1' });
    git(work, 'fetch', '-q', 'origin', '+refs/heads/gh-pages:refs/remotes/origin/gh-pages');
    const out = tmp('restore-');
    const r = extractTree({ repoDir: work, sha: legacySha, allowedRef: 'refs/remotes/origin/gh-pages', outDir: out });
    assert.equal(fs.readFileSync(path.join(out, 'index.html'), 'utf8'), '<html>old</html>');
    const back = publish({ repoDir: work, artifactDir: out, cname: 'prime-ai.fr', message: 'restore', rollbackTag: 'pages-rollback/prime/6-1' });
    assert.equal(back.tree, bare(origin, 'rev-parse', `${legacySha}^{tree}`));
    assert.equal(bare(origin, 'rev-parse', 'gh-pages^'), bare(origin, 'rev-parse', 'refs/tags/pages-rollback/prime/6-1'));
    assert.throws(() => extractTree({ repoDir: work, sha: 'f'.repeat(40), allowedRef: 'refs/remotes/origin/gh-pages', outDir: tmp('x-') }), /not a known commit/);
  } finally {
    if (prev === undefined) delete process.env.GITHUB_EVENT_NAME; else process.env.GITHUB_EVENT_NAME = prev;
  }
});

test('postdeploy check verifies home, manifest and assets, and fails explicitly', async () => {
  const manifest = { sourceSha: 'b'.repeat(40), artifactSha256: 'd'.repeat(64) };
  let missing = 'assets/index-abc.css';
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    if (url.pathname === '/') return res.end(INDEX);
    if (url.pathname === `/${MANIFEST_NAME}`) return res.end(JSON.stringify(manifest));
    if (url.pathname.startsWith('/assets/') && url.pathname !== `/${missing}`) return res.end('ok');
    res.statusCode = 404; res.end();
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  try {
    await assert.rejects(postdeployCheck({ baseUrl: url, expectedManifest: manifest, timeoutMs: 50, intervalMs: 10 }), /index-abc.css returned HTTP 404/);
    missing = null;
    const ok = await postdeployCheck({ baseUrl: url, expectedIndexSha256: sha256(INDEX), expectedManifest: manifest, timeoutMs: 1000, intervalMs: 10 });
    assert.equal(ok.ok, true);
    assert.equal(ok.assets.length, 2);
    await assert.rejects(postdeployCheck({ baseUrl: url, expectedManifest: { ...manifest, sourceSha: 'c'.repeat(40) }, timeoutMs: 50, intervalMs: 10 }), /live sourceSha/);
    await assert.rejects(postdeployCheck({ baseUrl: url, expectedIndexSha256: 'e'.repeat(64), timeoutMs: 50, intervalMs: 10 }), /does not match/);
  } finally {
    server.close();
  }
});

test('required routes must exist as index.html in the artifact', async () => {
  assert.deepEqual(parseRoutes(' /replica/, responsive-preview ,legacy'), ['replica', 'responsive-preview', 'legacy']);
  assert.throws(() => parseRoutes('../etc'), /invalid route/);
  const dir = site({ 'replica/index.html': INDEX });
  const out = path.join(tmp('out-'), 'r.json');
  const write = process.stdout.write;
  process.stdout.write = () => true;
  try {
    await main(['validate', '--dir', dir, '--site-id', 'prime-ai', '--source-sha', 'b'.repeat(40), '--cname', 'prime-ai.fr', '--required-routes', 'replica', '--out', out]);
    await assert.rejects(main(['validate', '--dir', dir, '--site-id', 'prime-ai', '--source-sha', 'b'.repeat(40), '--required-routes', 'replica,legacy']), /required file missing: legacy\/index.html/);
  } finally {
    process.stdout.write = write;
  }
  assert.match(JSON.parse(fs.readFileSync(out, 'utf8')).artifact_sha256, /^[0-9a-f]{64}$/);
});

test('postdeploy checks required route pages and their assets', async () => {
  const routeHtml = '<html><script src="/assets/route-x.js"></script></html>';
  let routeStatus = 404;
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    if (url.pathname === '/') return res.end(INDEX);
    if (url.pathname === '/replica/') { res.statusCode = routeStatus; return res.end(routeHtml); }
    if (url.pathname.startsWith('/assets/')) return res.end('ok');
    res.statusCode = 404; res.end();
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  try {
    await assert.rejects(postdeployCheck({ baseUrl: url, paths: ['replica'], timeoutMs: 50, intervalMs: 10 }), /route \/replica\/ returned HTTP 404/);
    routeStatus = 200;
    const ok = await postdeployCheck({ baseUrl: url, paths: ['replica'], timeoutMs: 1000, intervalMs: 10 });
    assert.deepEqual(ok.routes, [{ path: 'replica/', status: 200 }]);
    assert.ok(ok.assets.some(a => a.path === 'assets/route-x.js'));
  } finally {
    server.close();
  }
});
