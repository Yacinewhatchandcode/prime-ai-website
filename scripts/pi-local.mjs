import { spawnSync } from 'node:child_process';
import { existsSync, statfsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const binary = path.join(root, '.tools/pi/node_modules/.bin/pi');
const agent = path.join(root, '.tools/pi/agent');
const mode = process.argv[2] || 'check';

if (!['check', 'review'].includes(mode)) throw new Error('Usage: node scripts/pi-local.mjs [check|review]');
if (!existsSync(binary) || !existsSync(path.join(agent, 'models.json'))) {
  throw new Error('Local Pi runtime/configuration missing. No automatic installation or global configuration change performed.');
}
const flags = ['--offline', '--no-extensions', '--no-skills', '--no-prompt-templates', '--no-context-files', '--no-approve'];
if (mode === 'review') {
  const disk = statfsSync(root);
  if (Number(disk.bavail) * Number(disk.bsize) < 3 * 1024 ** 3) {
    throw new Error('LOCAL_MODEL_DISK_RESERVE_LOW: Pi inference requires at least 3 GiB free.');
  }
  flags.push('--no-session', '--tools', 'read', '--provider', 'ollama', '--model', 'qwen3:8b', '--print',
    'Read only public/prime-trinity.svg. Report its triangle count and colored strokes, distinguishing the navy outline from the blue stroke. Do not change files or claim deployment. Keep answer under 60 words. Your answer is model-generated and must be independently verified.');
} else flags.push('--list-models', 'qwen3');

const result = spawnSync(binary, flags, {
  cwd: root,
  env: { ...process.env, PI_CODING_AGENT_DIR: agent },
  encoding: 'utf8',
  timeout: 120000,
  maxBuffer: 512 * 1024,
});
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.error) throw result.error;
if (result.status !== 0) throw new Error(`Pi ${mode} failed with exit code ${result.status ?? 'unknown'}.`);
if (mode === 'review') console.log('Generated review only: this is not release approval, QA acceptance or production evidence.');
