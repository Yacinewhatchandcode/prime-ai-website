/**
 * PrimeAI Remotion — Batch Render Script
 * 
 * Renders all page compositions in both EN and FR.
 * Output goes to ../public/ for direct use in the site.
 * 
 * Usage:
 *   cd remotion
 *   npm ci
 *   node scripts/render-all.mjs
 *   REMOTION_BROWSER_EXECUTABLE=/existing/chromium node scripts/render-all.mjs --only MacroVisionV3-EN,MacroVisionV3-FR
 * 
 * Requires: ffmpeg in PATH
 */

import { execFileSync } from 'child_process';
import { mkdirSync, existsSync, renameSync, rmSync, statfsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const outputDir = resolve(projectRoot, '..', 'public');

// Ensure output directory exists
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

// All composition IDs mapped to output filenames
const compositions = [
  // Light layout pages (gold accent)
  { id: 'Ecosysteme-EN',    file: 'prime_ecosysteme_en.mp4' },
  { id: 'Ecosysteme-FR',    file: 'prime_ecosysteme_fr.mp4' },
  { id: 'SovereignAi-EN',   file: 'prime_sovereign_en.mp4' },
  { id: 'SovereignAi-FR',   file: 'prime_sovereign_fr.mp4' },
  { id: 'Enterprise-EN',    file: 'prime_enterprise_en.mp4' },
  { id: 'Enterprise-FR',    file: 'prime_enterprise_fr.mp4' },

  // Dark layout pages (OS console)
  { id: 'MultiAgent-EN',    file: 'prime_multiagent_en.mp4' },
  { id: 'MultiAgent-FR',    file: 'prime_multiagent_fr.mp4' },
  { id: 'Credentials-EN',   file: 'prime_credentials_en.mp4' },
  { id: 'Credentials-FR',   file: 'prime_credentials_fr.mp4' },
  { id: 'FleetCommand-EN',  file: 'prime_fleet_en.mp4' },
  { id: 'FleetCommand-FR',  file: 'prime_fleet_fr.mp4' },
  { id: 'YaceAura-EN',      file: 'prime_yace_en.mp4' },
  { id: 'YaceAura-FR',      file: 'prime_yace_fr.mp4' },

  // Product card compositions (Ecosysteme page — 15s each)
  { id: 'PrimeDesktop-EN',  file: 'prime_desktop_en.mp4' },
  { id: 'PrimeDesktop-FR',  file: 'prime_desktop_fr.mp4' },
  { id: 'PrimeMobile-EN',   file: 'prime_mobile_en.mp4' },
  { id: 'PrimeMobile-FR',   file: 'prime_mobile_fr.mp4' },
  { id: 'PrimeCLI-EN',      file: 'prime_cli_en.mp4' },
  { id: 'PrimeCLI-FR',      file: 'prime_cli_fr.mp4' },
  { id: 'PrimeCloud-EN',    file: 'prime_cloud_en.mp4' },
  { id: 'PrimeCloud-FR',    file: 'prime_cloud_fr.mp4' },
  { id: 'PrimeGram-EN',     file: 'prime_gram_en.mp4' },
  { id: 'PrimeGram-FR',     file: 'prime_gram_fr.mp4' },
  { id: 'PrimeTeleprompter-EN', file: 'prime_teleprompter_en.mp4' },
  { id: 'PrimeTeleprompter-FR', file: 'prime_teleprompter_fr.mp4' },

  // Technologie page compositions (20s each)
  { id: 'Technology-EN',    file: 'prime_tech_en.mp4' },
  { id: 'Technology-FR',    file: 'prime_tech_fr.mp4' },
  { id: 'ArchSpecs-EN',     file: 'prime_arch_specs_en.mp4' },
  { id: 'ArchSpecs-FR',     file: 'prime_arch_specs_fr.mp4' },
  { id: 'SyncProtocol-EN',  file: 'prime_sync_protocol_en.mp4' },
  { id: 'SyncProtocol-FR',  file: 'prime_sync_protocol_fr.mp4' },

  // Macro Vision V3 — Product Explainer (homepage)
  { id: 'MacroVisionV3-EN', file: 'prime_macro_en.mp4' },
  { id: 'MacroVisionV3-FR', file: 'prime_macro_fr.mp4' },
];
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--only')) throw new Error('Usage: --only comma-separated-composition-IDs');
const requested = args.length ? args[1].split(',') : compositions.map(comp => comp.id);
if (!requested.length || requested.some(id => !compositions.some(comp => comp.id === id))) throw new Error('Unknown composition ID');
const selected = compositions.filter(comp => requested.includes(comp.id));
if (!process.env.REMOTION_BROWSER_EXECUTABLE || !existsSync(process.env.REMOTION_BROWSER_EXECUTABLE)) {
  throw new Error('RENDER_BLOCKED: set REMOTION_BROWSER_EXECUTABLE to an existing Chromium; automatic browser downloads are disabled');
}

console.log('');
console.log('╔══════════════════════════════════════════════════════╗');
console.log('║   PRIME-AI REMOTION — BATCH VIDEO RENDER            ║');
console.log('║   Rendering', selected.length, 'selected compositions   ║');
console.log('╚══════════════════════════════════════════════════════╝');
console.log('');

let success = 0;
let failed = 0;

for (const comp of selected) {
  const disk = statfsSync(outputDir);
  if (disk.bavail * disk.bsize < 3 * 1024 ** 3) throw new Error('RENDER_BLOCKED: less than 3 GiB free disk');
  const outPath = resolve(outputDir, comp.file);
  const temporary = resolve(outputDir, `${comp.file}.rendering.mp4`);
  console.log(`▸ Rendering ${comp.id} → ${comp.file}...`);
  
  try {
    execFileSync(
      'npx', ['--no-install', 'remotion', 'render', 'src/index.jsx', comp.id, temporary,
        '--codec', 'h264', '--concurrency', '2', '--log', 'error',
        '--timeout-in-milliseconds', '30000',
        ...(process.env.REMOTION_BROWSER_EXECUTABLE ? ['--browser-executable', process.env.REMOTION_BROWSER_EXECUTABLE] : [])],
      {
        cwd: projectRoot,
        stdio: 'inherit',
        timeout: 300_000, // 5 min per video
      }
    );
    renameSync(temporary, outPath);
    console.log(`  ✓ ${comp.file} rendered successfully`);
    success++;
  } catch (err) {
    rmSync(temporary, { force: true });
    console.error(`  ✗ FAILED: ${comp.file}`);
    console.error(`    ${err.message}`);
    failed++;
  }
  
  console.log('');
}

console.log('═══════════════════════════════════════════════════════');
console.log(`  Render complete: ${success} succeeded, ${failed} failed`);
console.log(`  Output directory: ${outputDir}`);
console.log('═══════════════════════════════════════════════════════');
console.log('');

if (failed > 0) {
  process.exit(1);
}
