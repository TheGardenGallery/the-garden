// One-off video re-encode. CRF 24, preset slow, libx264, preserves audio
// via -c:a copy, adds +faststart for streaming. Replaces source only if
// the new file is smaller — videos that were already at or below CRF 24
// quality stay untouched so we never trade away fidelity. Logs each
// per-file delta and a total at the end.
//
// Run: node scripts/compress-videos.mjs

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "public", "images");

// ffmpeg-static is CJS; require via createRequire so this ESM script can use it.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const ffmpeg = require("ffmpeg-static");

function findMp4s(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...findMp4s(p));
    else if (e.isFile() && p.toLowerCase().endsWith(".mp4")) out.push(p);
  }
  return out;
}

const files = findMp4s(ROOT).sort();
console.log(`Found ${files.length} MP4 files in ${ROOT}\n`);

let processed = 0;
let kept = 0;
let errors = 0;
let totalOld = 0;
let totalNew = 0;
let totalSavings = 0;

const fmt = (b) => (b / 1024 / 1024).toFixed(2);

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  const rel = path.relative(ROOT, file);
  const oldSize = fs.statSync(file).size;
  const tmpOut = file + ".compressed.mp4";

  process.stdout.write(`[${i + 1}/${files.length}] ${rel} ... `);

  const r = spawnSync(
    ffmpeg,
    [
      "-y",
      "-i", file,
      "-c:v", "libx264",
      "-crf", "24",
      "-preset", "slow",
      "-pix_fmt", "yuv420p",
      "-c:a", "copy",
      "-movflags", "+faststart",
      "-loglevel", "error",
      tmpOut,
    ],
    { stdio: ["ignore", "ignore", "pipe"] }
  );

  if (r.status !== 0) {
    console.log(`FAIL (code ${r.status})`);
    if (r.stderr) console.log("  " + r.stderr.toString().trim().split("\n").slice(-3).join("\n  "));
    if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut);
    errors++;
    continue;
  }

  const newSize = fs.statSync(tmpOut).size;

  if (newSize >= oldSize) {
    fs.unlinkSync(tmpOut);
    console.log(`KEEP (${fmt(oldSize)} MB, would have been ${fmt(newSize)} MB)`);
    kept++;
    continue;
  }

  fs.renameSync(tmpOut, file);
  const saved = oldSize - newSize;
  totalOld += oldSize;
  totalNew += newSize;
  totalSavings += saved;
  processed++;
  console.log(`${fmt(oldSize)} → ${fmt(newSize)} MB (-${((1 - newSize / oldSize) * 100).toFixed(0)}%)`);
}

console.log(`\n=== Done ===`);
console.log(`Compressed:   ${processed}`);
console.log(`Kept as-is:   ${kept}`);
console.log(`Errors:       ${errors}`);
if (processed > 0) {
  console.log(`Source bytes:   ${fmt(totalOld)} MB`);
  console.log(`Compressed:     ${fmt(totalNew)} MB`);
  console.log(`Saved:          ${fmt(totalSavings)} MB (-${((1 - totalNew / totalOld) * 100).toFixed(1)}%)`);
}
