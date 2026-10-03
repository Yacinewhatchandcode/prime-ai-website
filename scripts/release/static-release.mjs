#!/usr/bin/env node
// Guarded static-site release tooling for GitHub Pages branches (legacy `gh-pages` source).
// Never force-pushes, never edits DNS, never publishes from pull_request events.
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const MANIFEST_NAME = 'release-manifest.json';
export const SHA_RE = /^[0-9a-f]{40}$/;
const MiB = 1024 * 1024;
const GiB = 1024 * MiB;

export const DEFAULT_POLICY = Object.freeze({
  allowedExtensions: ['.html', '.js', '.mjs', '.css', '.json', '.webmanifest', '.txt', '.svg', '.png', '.jpg', '.jpeg',
    '.gif', '.webp', '.avif', '.ico', '.mp4', '.webm', '.mp3', '.woff', '.woff2', '.ttf', '.otf', '.xml', '.pdf'],
  allowedBasenames: ['CNAME', '.nojekyll'],
  requiredFiles: ['index.html', 'CNAME', '.nojekyll'],
  maxFileBytes: 95 * MiB,
  maxTotalBytes: 900 * MiB,
  cname: null,
});

const TEXT_EXTENSIONS = new Set(['.html', '.js', '.mjs', '.css', '.json', '.webmanifest', '.txt', '.svg', '.xml', '']);
export const SECRET_PATTERNS = [
  ['private-key', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['aws-access-key', /\bAKIA[0-9A-Z]{16}\b/],
  ['github-token', /\bgh[pousr]_[A-Za-z0-9]{36,}\b/],
  ['github-pat', /\bgithub_pat_[A-Za-z0-9_]{50,}\b/],
  ['openai-anthropic-key', /(?<![A-Za-z0-9])sk-(?:proj-|ant-)?[A-Za-z0-9_-]{32,}/],
  ['slack-token', /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/],
  ['google-api-key', /\bAIza[0-9A-Za-z_-]{35}\b/],
  ['resend-key', /\bre_[A-Za-z0-9]{8,}_[A-Za-z0-9]{16,}\b/],
  ['bearer-literal', /\bBearer\s+[A-Za-z0-9._~+/-]{32,}={0,2}/],
];
const FORBIDDEN_NAME = /(^\.env)|(\.pem$)|(\.key$)|(^id_[rd]sa)|token|secret|credential|\.sqlite$|\.db$/i;

export class ReleaseError extends Error {
  constructor(stage, message) { super(`[${stage}] ${message}`); this.stage = stage; }
}

export const sha256 = data => createHash('sha256').update(data).digest('hex');

export function assertSha(value, label = 'sha') {
  if (!SHA_RE.test(String(value ?? ''))) throw new ReleaseError('input', `${label} must be a full 40-character lowercase commit SHA, got "${value}"`);
  return value;
}

export function assertNotPullRequest(eventName = process.env.GITHUB_EVENT_NAME) {
  if (/^pull_request/.test(eventName ?? '')) throw new ReleaseError('guard', `refusing to publish from event "${eventName}"`);
}

const git = (cwd, args, opts = {}) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], maxBuffer: 64 * MiB, ...opts }).trim();
const gitOk = (cwd, args) => { try { git(cwd, args); return true; } catch { return false; } };

export function verifySource({ repoDir, sha, approvedRef }) {
  assertSha(sha, 'source_sha');
  if (git(repoDir, ['cat-file', '-t', sha]) !== 'commit') throw new ReleaseError('source', `${sha} is not a commit`);
  const head = git(repoDir, ['rev-parse', 'HEAD']);
  if (head !== sha) throw new ReleaseError('source', `checked-out HEAD ${head} differs from approved ${sha}`);
  if (approvedRef && !gitOk(repoDir, ['merge-base', '--is-ancestor', sha, approvedRef])) {
    throw new ReleaseError('source', `${sha} is not reachable from approved ref ${approvedRef}`);
  }
  const dirty = git(repoDir, ['status', '--porcelain', '--untracked-files=no']);
  if (dirty) throw new ReleaseError('source', `source checkout has tracked modifications:\n${dirty}`);
  return { sha, approvedRef: approvedRef ?? null };
}

export function diskGuard(dir, minGiB) {
  const s = fs.statfsSync(dir);
  const free = s.bavail * s.bsize;
  if (free < minGiB * GiB) throw new ReleaseError('disk', `only ${(free / GiB).toFixed(2)} GiB free at ${dir}; ${minGiB} GiB required`);
  return { freeGiB: Number((free / GiB).toFixed(2)) };
}

export function prepareArtifact(dir, { cname, spa404 = false } = {}) {
  if (!fs.existsSync(path.join(dir, 'index.html'))) throw new ReleaseError('prepare', `${dir}/index.html missing`);
  if (cname) {
    const file = path.join(dir, 'CNAME');
    const existing = fs.existsSync(file) ? fs.readFileSync(file, 'utf8').trim() : null;
    if (existing !== null && existing !== cname) throw new ReleaseError('prepare', `build CNAME "${existing}" != expected "${cname}"`);
    fs.writeFileSync(file, `${cname}\n`);
  }
  fs.writeFileSync(path.join(dir, '.nojekyll'), '');
  if (spa404) fs.copyFileSync(path.join(dir, 'index.html'), path.join(dir, '404.html'));
  fs.rmSync(path.join(dir, MANIFEST_NAME), { force: true });
}

function walk(root, rel = '', out = []) {
  for (const entry of fs.readdirSync(path.join(root, rel), { withFileTypes: true })) {
    const relPath = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.isSymbolicLink()) throw new ReleaseError('validate', `symlink not allowed: ${relPath}`);
    if (entry.isDirectory()) walk(root, relPath, out);
    else if (entry.isFile()) out.push(relPath);
    else throw new ReleaseError('validate', `unsupported file type: ${relPath}`);
  }
  return out;
}

export const artifactDigest = files => sha256(files.map(f => `${f.sha256}  ${f.path}\n`).join(''));

export function validateArtifact(dir, policyOverrides = {}) {
  const policy = { ...DEFAULT_POLICY, ...policyOverrides };
  const errors = [];
  const files = [];
  let totalBytes = 0;
  const all = walk(dir).filter(p => p !== MANIFEST_NAME).sort();
  for (const rel of all) {
    const segments = rel.split('/');
    const base = segments.at(-1);
    const ext = path.extname(base).toLowerCase();
    const rootAllowed = segments.length === 1 && policy.allowedBasenames.includes(base);
    if (/[\\\u0000-\u001f]/.test(rel) || segments.includes('..')) errors.push(`unsafe path: ${rel}`);
    if (!rootAllowed && segments.some(s => s.startsWith('.'))) errors.push(`hidden path not allowed: ${rel}`);
    if (!rootAllowed && !policy.allowedExtensions.includes(ext)) errors.push(`extension not allowlisted: ${rel}`);
    if (TEXT_EXTENSIONS.has(ext) && FORBIDDEN_NAME.test(base)) errors.push(`sensitive-looking filename: ${rel}`);
    const buf = fs.readFileSync(path.join(dir, rel));
    if (buf.length > policy.maxFileBytes) errors.push(`file too large (${buf.length} bytes): ${rel}`);
    totalBytes += buf.length;
    if (TEXT_EXTENSIONS.has(ext)) {
      const text = buf.toString('utf8');
      for (const [name, re] of SECRET_PATTERNS) if (re.test(text)) errors.push(`possible secret (${name}) in ${rel}`);
    }
    files.push({ path: rel, bytes: buf.length, sha256: sha256(buf) });
  }
  if (totalBytes > policy.maxTotalBytes) errors.push(`artifact too large: ${totalBytes} bytes`);
  for (const req of policy.requiredFiles) if (!all.includes(req)) errors.push(`required file missing: ${req}`);
  if (policy.cname) {
    const cnameFile = path.join(dir, 'CNAME');
    const actual = fs.existsSync(cnameFile) ? fs.readFileSync(cnameFile, 'utf8').trim() : null;
    if (actual !== policy.cname) errors.push(`CNAME is "${actual}", expected "${policy.cname}"`);
  }
  if (errors.length) throw new ReleaseError('validate', `artifact rejected:\n - ${errors.join('\n - ')}`);
  return { files, fileCount: files.length, totalBytes, artifactSha256: artifactDigest(files) };
}

export function writeManifest(dir, data) {
  const manifest = { schema: 'static-release/v1', ...data };
  fs.writeFileSync(path.join(dir, MANIFEST_NAME), `${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
}

export function verifyArtifact(dir, { expectedDigest, expectedSourceSha, policy = {} }) {
  const manifestPath = path.join(dir, MANIFEST_NAME);
  if (!fs.existsSync(manifestPath)) throw new ReleaseError('verify', `${MANIFEST_NAME} missing from artifact`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const result = validateArtifact(dir, policy);
  if (!expectedDigest || result.artifactSha256 !== expectedDigest) throw new ReleaseError('verify', `artifact digest ${result.artifactSha256} != approved ${expectedDigest}`);
  if (manifest.artifactSha256 !== result.artifactSha256) throw new ReleaseError('verify', 'manifest digest does not match artifact contents');
  if (expectedSourceSha && manifest.sourceSha !== expectedSourceSha) throw new ReleaseError('verify', `manifest sourceSha ${manifest.sourceSha} != ${expectedSourceSha}`);
  if (manifest.indexSha256 && manifest.indexSha256 !== sha256(fs.readFileSync(path.join(dir, 'index.html')))) {
    throw new ReleaseError('verify', 'manifest indexSha256 does not match index.html');
  }
  return { manifest, ...result };
}

export function extractTree({ repoDir, sha, allowedRef, outDir }) {
  assertSha(sha, 'restore_from_sha');
  if (!gitOk(repoDir, ['cat-file', '-e', `${sha}^{commit}`])) throw new ReleaseError('restore', `${sha} is not a known commit`);
  if (!gitOk(repoDir, ['merge-base', '--is-ancestor', sha, allowedRef])) throw new ReleaseError('restore', `${sha} is not in the history of ${allowedRef}`);
  fs.mkdirSync(outDir, { recursive: true });
  const tar = execFileSync('git', ['archive', '--format=tar', sha], { cwd: repoDir, maxBuffer: 2 * GiB });
  execFileSync('tar', ['-x', '-C', outDir], { input: tar, maxBuffer: 64 * MiB });
  return { sha, tree: git(repoDir, ['rev-parse', `${sha}^{tree}`]) };
}

export function publish({ repoDir, artifactDir, branch = 'gh-pages', remote = 'origin', cname, message, rollbackTag, dryRun = false,
  author = { name: 'github-actions[bot]', email: '41898282+github-actions[bot]@users.noreply.github.com' } }) {
  if (!dryRun) assertNotPullRequest();
  if (!rollbackTag || !/^[A-Za-z0-9._/-]+$/.test(rollbackTag)) throw new ReleaseError('input', `invalid rollback tag "${rollbackTag}"`);
  if (!message) throw new ReleaseError('input', 'commit message required');
  git(repoDir, ['fetch', '--no-tags', remote, `+refs/heads/${branch}:refs/remotes/${remote}/${branch}`]);
  const previousSha = git(repoDir, ['rev-parse', `refs/remotes/${remote}/${branch}`]);
  if (cname) {
    const live = gitOk(repoDir, ['cat-file', '-e', `${previousSha}:CNAME`]) ? git(repoDir, ['show', `${previousSha}:CNAME`]) : null;
    if (live !== cname) throw new ReleaseError('guard', `live ${branch} CNAME "${live}" != expected "${cname}"; refusing domain change`);
  }
  const gitDir = git(repoDir, ['rev-parse', '--absolute-git-dir']);
  const workTree = path.resolve(artifactDir);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'release-index-'));
  const env = { ...process.env, GIT_INDEX_FILE: path.join(tmp, 'index'), GIT_DIR: gitDir, GIT_WORK_TREE: workTree,
    GIT_AUTHOR_NAME: author.name, GIT_AUTHOR_EMAIL: author.email, GIT_COMMITTER_NAME: author.name, GIT_COMMITTER_EMAIL: author.email };
  let tree;
  try {
    git(workTree, ['add', '--all', '--force', '.'], { env });
    tree = git(workTree, ['write-tree'], { env });
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  const previousTree = git(repoDir, ['rev-parse', `${previousSha}^{tree}`]);
  const base = { branch, previousSha, previousTree, tree, rollbackTag };
  if (tree === previousTree) return { ...base, status: 'unchanged', newSha: previousSha, pushed: false };
  const { GIT_WORK_TREE: _wt, GIT_INDEX_FILE: _ix, ...commitEnv } = env;
  const newSha = git(repoDir, ['commit-tree', tree, '-p', previousSha, '-m', message], { env: commitEnv });
  if (dryRun) return { ...base, status: 'planned', newSha, pushed: false };
  if (git(repoDir, ['ls-remote', '--tags', remote, `refs/tags/${rollbackTag}`])) throw new ReleaseError('rollback', `rollback tag ${rollbackTag} already exists`);
  git(repoDir, ['push', remote, `${previousSha}:refs/tags/${rollbackTag}`]);
  const savedRollback = git(repoDir, ['ls-remote', '--tags', remote, `refs/tags/${rollbackTag}`]).split(/\s+/)[0];
  if (savedRollback !== previousSha) throw new ReleaseError('rollback', `rollback tag not saved (${savedRollback})`);
  try {
    git(repoDir, ['push', remote, `${newSha}:refs/heads/${branch}`]);
  } catch (error) {
    throw new ReleaseError('publish', `non-force push rejected (branch moved or protected); nothing overwritten.\n${error.stderr ?? error.message}`);
  }
  const remoteSha = git(repoDir, ['ls-remote', '--heads', remote, `refs/heads/${branch}`]).split(/\s+/)[0];
  if (remoteSha !== newSha) throw new ReleaseError('publish', `remote ${branch} is ${remoteSha}, expected ${newSha}`);
  return { ...base, status: 'published', newSha, pushed: true };
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export async function postdeployCheck({ baseUrl, expectedIndexSha256, expectedManifest, paths = [], timeoutMs = 900_000, intervalMs = 15_000, fetchImpl = fetch }) {
  const root = baseUrl.replace(/\/+$/, '');
  const deadline = Date.now() + timeoutMs;
  let lastError = 'not attempted';
  for (let attempt = 1; ; attempt++) {
    try {
      const bust = `cb=${Date.now()}-${attempt}`;
      const home = await fetchImpl(`${root}/?${bust}`, { redirect: 'follow', cache: 'no-store' });
      if (home.status !== 200) throw new Error(`home returned HTTP ${home.status}`);
      const html = await home.text();
      if (!/<html/i.test(html)) throw new Error('home is not HTML');
      if (expectedIndexSha256 && sha256(html) !== expectedIndexSha256) throw new Error('home HTML does not match released index.html yet');
      if (expectedManifest) {
        const res = await fetchImpl(`${root}/${MANIFEST_NAME}?${bust}`, { cache: 'no-store' });
        if (res.status !== 200) throw new Error(`${MANIFEST_NAME} returned HTTP ${res.status}`);
        const live = await res.json();
        for (const key of ['sourceSha', 'artifactSha256']) {
          if (live[key] !== expectedManifest[key]) throw new Error(`live ${key} ${live[key]} != ${expectedManifest[key]}`);
        }
      }
      const pages = [html];
      const routeResults = [];
      for (const route of paths) {
        const res = await fetchImpl(`${root}/${route}/?${bust}`, { redirect: 'follow', cache: 'no-store' });
        const body = await res.text();
        if (res.status !== 200 || !/<html/i.test(body)) throw new Error(`route /${route}/ returned HTTP ${res.status}`);
        pages.push(body);
        routeResults.push({ path: `${route}/`, status: res.status });
      }
      const assets = [...new Set(pages.flatMap(page => [...page.matchAll(/(?:src|href)="(\/?assets\/[^"?#]+)"/g)].map(m => m[1].replace(/^\//, ''))))];
      if (!assets.length) throw new Error('home references no /assets/ files');
      const assetResults = [];
      for (const asset of assets) {
        const res = await fetchImpl(`${root}/${asset}?${bust}`, { cache: 'no-store' });
        await res.arrayBuffer();
        if (res.status !== 200) throw new Error(`asset ${asset} returned HTTP ${res.status}`);
        assetResults.push({ path: asset, status: res.status });
      }
      return { ok: true, attempts: attempt, home: 200, routes: routeResults, assets: assetResults };
    } catch (error) {
      lastError = error.message;
    }
    if (Date.now() + intervalMs > deadline) throw new ReleaseError('postdeploy', `failed after ${attempt} attempts: ${lastError}`);
    await sleep(intervalMs);
  }
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (!key.startsWith('--')) throw new ReleaseError('input', `unexpected argument ${key}`);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) args[key.slice(2)] = true;
    else { args[key.slice(2)] = next; i++; }
  }
  return args;
}

const required = (args, key) => {
  if (args[key] === undefined || args[key] === '' || args[key] === true) throw new ReleaseError('input', `--${key} is required`);
  return args[key];
};
const bool = value => value === true || value === 'true';
const emit = (args, data) => {
  const text = `${JSON.stringify(data, null, 2)}\n`;
  if (args.out) fs.writeFileSync(args.out, text);
  process.stdout.write(text);
  if (process.env.GITHUB_OUTPUT && args['github-output']) {
    for (const [k, v] of Object.entries(data)) if (typeof v !== 'object') fs.appendFileSync(process.env.GITHUB_OUTPUT, `${k}=${v}\n`);
  }
};
export function parseRoutes(value) {
  const routes = String(value ?? '').split(',').map(s => s.trim().replace(/^\/+|\/+$/g, '')).filter(Boolean);
  for (const route of routes) if (!/^[a-z0-9][a-z0-9-]*(\/[a-z0-9][a-z0-9-]*)*$/.test(route)) throw new ReleaseError('input', `invalid route "${route}"`);
  return routes;
}
const policyFrom = args => ({
  ...(args.cname ? { cname: args.cname } : {}),
  ...(args['max-file-mib'] ? { maxFileBytes: Number(args['max-file-mib']) * MiB } : {}),
  requiredFiles: [...DEFAULT_POLICY.requiredFiles, ...parseRoutes(args['required-routes']).map(route => `${route}/index.html`)],
});

export async function main(argv = process.argv.slice(2)) {
  const [command, ...rest] = argv;
  const args = parseArgs(rest);
  switch (command) {
    case 'check-sha': return emit(args, { sha: assertSha(required(args, 'sha'), args.label ?? 'sha') });
    case 'disk-guard': return emit(args, diskGuard(required(args, 'dir'), Number(args['min-gib'] ?? 3)));
    case 'verify-source': return emit(args, verifySource({ repoDir: required(args, 'repo'), sha: required(args, 'sha'), approvedRef: args['approved-ref'] }));
    case 'prepare': prepareArtifact(required(args, 'dir'), { cname: args.cname, spa404: bool(args['spa-404']) }); return emit(args, { prepared: true });
    case 'validate': {
      const dir = required(args, 'dir');
      const result = validateArtifact(dir, policyFrom(args));
      const manifest = writeManifest(dir, {
        siteId: required(args, 'site-id'), sourceRepository: args['source-repository'] ?? null,
        sourceSha: assertSha(required(args, 'source-sha'), 'source_sha'), toolingSha: args['tooling-sha'] ?? null,
        runId: args['run-id'] ?? null, builtAt: new Date().toISOString(), indexSha256: sha256(fs.readFileSync(path.join(dir, 'index.html'))),
        artifactSha256: result.artifactSha256, fileCount: result.fileCount, totalBytes: result.totalBytes,
      });
      return emit(args, { artifact_sha256: result.artifactSha256, index_sha256: manifest.indexSha256, file_count: result.fileCount, total_bytes: result.totalBytes });
    }
    case 'verify-artifact': {
      const r = verifyArtifact(required(args, 'dir'), { expectedDigest: required(args, 'expected-digest'), expectedSourceSha: args['source-sha'], policy: policyFrom(args) });
      return emit(args, { artifact_sha256: r.artifactSha256, source_sha: r.manifest.sourceSha, index_sha256: r.manifest.indexSha256 });
    }
    case 'extract-tree': {
      const outDir = required(args, 'out-dir');
      const r = extractTree({ repoDir: required(args, 'repo'), sha: required(args, 'sha'), allowedRef: required(args, 'allowed-ref'), outDir });
      const v = validateArtifact(outDir, policyFrom(args));
      return emit(args, { restore_sha: r.sha, restore_tree: r.tree, artifact_sha256: v.artifactSha256,
        index_sha256: sha256(fs.readFileSync(path.join(outDir, 'index.html'))) });
    }
    case 'publish': {
      const r = publish({ repoDir: required(args, 'repo'), artifactDir: required(args, 'dir'), branch: args.branch ?? 'gh-pages',
        cname: args.cname, message: required(args, 'message'), rollbackTag: required(args, 'rollback-tag'), dryRun: bool(args['dry-run']) });
      return emit(args, { status: r.status, previous_sha: r.previousSha, new_sha: r.newSha, rollback_tag: r.rollbackTag, pushed: r.pushed, tree: r.tree });
    }
    case 'postdeploy': {
      const manifest = args.manifest ? JSON.parse(fs.readFileSync(args.manifest, 'utf8')) : null;
      const r = await postdeployCheck({ baseUrl: required(args, 'url'), expectedIndexSha256: args['index-sha256'], expectedManifest: manifest,
        paths: parseRoutes(args.paths), timeoutMs: Number(args['timeout-sec'] ?? 900) * 1000, intervalMs: Number(args['interval-sec'] ?? 15) * 1000 });
      return emit(args, r);
    }
    default: throw new ReleaseError('input', `unknown command "${command}"`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main().catch(error => { console.error(`::error::${error.message.replace(/\n/g, '%0A')}`); process.exit(1); });
}
