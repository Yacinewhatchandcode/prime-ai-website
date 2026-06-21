/**
 * PrimeAI Remotion — Batch Render Script
 * 
 * Renders all page compositions in both EN and FR.
 * Output goes to ../public/ for direct use in the site.
 * 
 * Usage:
 *   cd remotion
 *   npm install
 *   node scripts/render-all.mjs
 * 
 * Requires: ffmpeg in PATH
 */

import { execSync } from 'child_process';
import { mkdirSync, existsSync } from 'fs';
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
];

console.log('');
console.log('╔══════════════════════════════════════════════════════╗');
console.log('║   PRIME-AI REMOTION — BATCH VIDEO RENDER            ║');
console.log('║   Rendering', compositions.length, 'compositions (7 pages × 2 langs)   ║');
console.log('╚══════════════════════════════════════════════════════╝');
console.log('');

let success = 0;
let failed = 0;

for (const comp of compositions) {
  const outPath = resolve(outputDir, comp.file);
  console.log(`▸ Rendering ${comp.id} → ${comp.file}...`);
  
  try {
    execSync(
      `npx remotion render src/index.jsx ${comp.id} "${outPath}" --codec h264`,
      {
        cwd: projectRoot,
        stdio: 'inherit',
        timeout: 300_000, // 5 min per video
      }
    );
    console.log(`  ✓ ${comp.file} rendered successfully`);
    success++;
  } catch (err) {
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
