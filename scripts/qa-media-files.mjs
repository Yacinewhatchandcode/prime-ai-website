import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const phase = process.argv[2];
if (!['before', 'after'].includes(phase)) throw new Error('Usage: node scripts/qa-media-files.mjs before|after');
const output = path.resolve('qa-evidence/media-upgrade', phase);
await mkdir(output, { recursive: true });
const report = { phase, sampling: '2 fps; scaled to 320px; blank = signalstats YMAX < 120', files: [] };
for (const stem of ['macro', 'yace', 'tech', 'fleet', 'credentials']) {
  for (const language of ['en', 'fr']) {
    const file = `prime_${stem}_${language}.mp4`;
    const input = path.resolve('public', file);
    const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_name,width,height', '-of', 'json', input], { encoding: 'utf8', timeout: 10000 }));
    const stats = execFileSync('ffmpeg', ['-v', 'error', '-i', input, '-vf', 'fps=2,scale=320:-1,signalstats,metadata=print:key=lavfi.signalstats.YMAX:file=-', '-f', 'null', '-'], { encoding: 'utf8', timeout: 60000, maxBuffer: 4 * 1024 * 1024 });
    const values = [...stats.matchAll(/lavfi\.signalstats\.YMAX=(\d+(?:\.\d+)?)/g)].map(match => Number(match[1]));
    if (!values.length) throw new Error(`No frame measurements for ${file}`);
    const blank = values.filter(value => value < 120).length;
    const sheet = `${file}.contact.png`;
    const samples = [];
    for (let index = 0; index < 8; index++) {
      const frame = path.join(output, `${file}.frame-${String(index).padStart(2, '0')}.png`);
      const timestamp = Number(probe.format.duration) * index / 8;
      execFileSync('ffmpeg', ['-v', 'error', '-ss', timestamp.toFixed(3), '-i', input, '-vf', 'scale=480:-1', '-frames:v', '1', '-y', frame], { timeout: 10000, stdio: 'pipe' });
      samples.push({ frame, timestamp });
    }
    execFileSync('ffmpeg', ['-v', 'error', ...samples.flatMap(sample => ['-i', sample.frame]), '-filter_complex',
      'xstack=inputs=8:layout=0_0|w0_0|w0+w1_0|w0+w1+w2_0|0_h0|w0_h0|w0+w1_h0|w0+w1+w2_h0',
      '-frames:v', '1', '-y', path.join(output, sheet)], { timeout: 10000, stdio: 'pipe' });
    await writeFile(path.join(output, `${file}.signalstats.txt`), stats);
    const result = { file, duration: Number(probe.format.duration), streams: probe.streams, frames: values.length, blank, blankRatio: blank / values.length, contactSheet: sheet, sampleTimes: samples.map(sample => sample.timestamp), caption: 'Eight independently decoded frames from start to 7/8 duration; visual inspection is separate from numeric thresholds.' };
    report.files.push(result);
    await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
    console.log(`${file}: ${result.duration}s; blank ${blank}/${values.length} (${(100 * result.blankRatio).toFixed(1)}%)`);
    if (phase === 'after' && result.blankRatio > 0.1) process.exitCode = 1;
  }
}
