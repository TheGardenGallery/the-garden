// Focused palette patcher for the three swapped artworks (sl-011,
// sl-019, sl-075). The full build-sl-palette.ts uses sharp for the
// PNG → raw-RGB resize step; sharp's native binding can't load on
// this iCloud-corrupted laptop. ffmpeg can output raw RGB at the
// target size in one call, so this script bypasses sharp entirely
// and only touches the three entries the user actually changed.
//
// Math is identical to build-sl-palette.ts. The full script remains
// the canonical builder on a working machine; this is the patch tool
// for a one-off three-piece refresh.
//
//   node scripts/patch-sl-palette-3pieces.mjs

import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import ffmpegStatic from "ffmpeg-static";

import {
  colorDistance,
  hexToOklch,
  kmeansWeighted,
  newSignatureAccumulator,
} from "../lib/split-logic-color.ts";

const FRAMES_PER_PIECE = 10;
const SAMPLE = 128;
const VIBRANCE_THRESHOLD = 0.12;
const PER_IMAGE_CLUSTERS = 5;
const WORKS_DIR = path.join(process.cwd(), "public/images/ricky-retouch/works");
const OUTPUT_PATH = path.join(process.cwd(), "data/sl-palette.json");

// Re-extract the swapped pieces AND their pairing anchors so every
// entry has the chromaticFraction field needed by the new pastel-
// chromatic override in isWhitePiece. Without it, anchors stay
// classified by stale data and the pairings end up in different
// buckets from the swapped pieces.
const PIECES = ["sl-011", "sl-019", "sl-075", "sl-077", "sl-097", "sl-015"];
const ffmpegBin = ffmpegStatic ?? "ffmpeg";

const DOMINANT_HUE_BINS = 72;
const DOMINANT_BIN_WIDTH = (2 * Math.PI) / DOMINANT_HUE_BINS;

function dominantHueFromPixels(pixels) {
  if (pixels.length === 0) return null;
  const hist = new Array(DOMINANT_HUE_BINS).fill(0);
  let totalWeight = 0;
  for (const p of pixels) {
    if (p.C < 0.06) continue;
    const h = ((p.h % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const bin = Math.min(DOMINANT_HUE_BINS - 1, Math.floor(h / DOMINANT_BIN_WIDTH));
    const w = p.C * p.C;
    hist[bin] += w;
    totalWeight += w;
  }
  if (totalWeight === 0) return null;
  const smooth = new Array(DOMINANT_HUE_BINS).fill(0);
  for (let i = 0; i < DOMINANT_HUE_BINS; i++) {
    const prev = (i - 1 + DOMINANT_HUE_BINS) % DOMINANT_HUE_BINS;
    const next = (i + 1) % DOMINANT_HUE_BINS;
    smooth[i] = (hist[prev] + hist[i] + hist[next]) / 3;
  }
  let peak = 0, peakIdx = -1;
  for (let i = 0; i < DOMINANT_HUE_BINS; i++) {
    if (smooth[i] > peak) { peak = smooth[i]; peakIdx = i; }
  }
  if (peakIdx < 0 || peak <= 0) return null;
  const bandIdxs = [];
  for (let off = -1; off <= 1; off++) {
    bandIdxs.push((peakIdx + off + DOMINANT_HUE_BINS) % DOMINANT_HUE_BINS);
  }
  const bandIdxSet = new Set(bandIdxs);
  let bandMass = 0;
  for (const i of bandIdxs) bandMass += hist[i];
  const strength = bandMass / totalWeight;
  let sumW = 0, sumL = 0, sumC = 0, sumCos = 0, sumSin = 0;
  for (const p of pixels) {
    if (p.C < 0.06) continue;
    const h = ((p.h % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const bin = Math.floor(h / DOMINANT_BIN_WIDTH);
    if (!bandIdxSet.has(bin)) continue;
    const w = p.C * p.C;
    sumW += w;
    sumL += p.L * w;
    sumC += p.C * w;
    sumCos += Math.cos(p.h) * w;
    sumSin += Math.sin(p.h) * w;
  }
  if (sumW === 0) return null;
  return {
    lch: {
      L: sumL / sumW,
      C: sumC / sumW,
      h: Math.atan2(sumSin / sumW, sumCos / sumW),
    },
    strength,
  };
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

function probeDuration(file) {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegBin, ["-i", file], { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    proc.stderr.on("data", (c) => (stderr += c.toString()));
    proc.on("close", () => {
      const m = stderr.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
      if (!m) return reject(new Error(`no duration in ${file}`));
      const [, h, mn, s] = m;
      resolve(Number(h) * 3600 + Number(mn) * 60 + Number(s));
    });
    proc.on("error", reject);
  });
}

// Single ffmpeg call: seek → 1 frame → scale to SAMPLE×SAMPLE with
// nearest-neighbour (preserves pure pixels, matches the original
// sharp `kernel: "nearest"`) → raw rgb24. Output buffer is
// SAMPLE*SAMPLE*3 bytes of R,G,B triplets.
function extractFrameRgb(file, t) {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      ffmpegBin,
      [
        "-loglevel", "error",
        "-ss", t.toFixed(3),
        "-i", file,
        "-vframes", "1",
        "-vf", `scale=${SAMPLE}:${SAMPLE}:flags=neighbor`,
        "-f", "rawvideo",
        "-pix_fmt", "rgb24",
        "-",
      ],
      { stdio: ["ignore", "pipe", "pipe"] },
    );
    const chunks = [];
    proc.stdout.on("data", (c) => chunks.push(c));
    let stderr = "";
    proc.stderr.on("data", (c) => (stderr += c.toString()));
    proc.on("close", (code) => {
      if (code !== 0) return reject(new Error(`ffmpeg exit ${code}: ${stderr}`));
      resolve(Buffer.concat(chunks));
    });
    proc.on("error", reject);
  });
}

async function extractPalette(pieceId) {
  const videoPath = path.join(WORKS_DIR, `${pieceId}.mp4`);
  const duration = await probeDuration(videoPath);
  const t0 = duration * 0.05;
  const tN = duration * 0.95;
  const timestamps = Array.from({ length: FRAMES_PER_PIECE }, (_, i) =>
    FRAMES_PER_PIECE === 1 ? t0 : t0 + (tN - t0) * (i / (FRAMES_PER_PIECE - 1)),
  );

  const chromaticLchs = [];
  let sumR = 0, sumG = 0, sumB = 0, sumW = 0;
  const sig = newSignatureAccumulator();

  for (const t of timestamps) {
    const buf = await extractFrameRgb(videoPath, t);
    for (let i = 0; i < buf.length; i += 3) {
      const r = buf[i], g = buf[i + 1], b = buf[i + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const sat = max === 0 ? 0 : (max - min) / max;
      const val = max / 255;
      const v = sat * val;
      if (v < VIBRANCE_THRESHOLD) continue;
      sumR += r * v;
      sumG += g * v;
      sumB += b * v;
      sumW += v;
      const lch = hexToOklch(rgbToHex(r, g, b));
      sig.addPixel(lch.L, lch.C, lch.h, v);
      chromaticLchs.push(lch);
    }
  }

  const characteristic = sumW > 0
    ? rgbToHex(
        Math.round(sumR / sumW),
        Math.round(sumG / sumW),
        Math.round(sumB / sumW),
      )
    : "#808080";

  const clusters = [];
  if (chromaticLchs.length >= PER_IMAGE_CLUSTERS) {
    const centroids = kmeansWeighted(
      chromaticLchs.map((lch) => ({ lch, weight: 1 })),
      PER_IMAGE_CLUSTERS,
    );
    const populations = new Array(centroids.length).fill(0);
    const chromaSum = new Array(centroids.length).fill(0);
    for (const lch of chromaticLchs) {
      let nearest = 0;
      let minD = Infinity;
      for (let i = 0; i < centroids.length; i++) {
        const d = colorDistance(lch, centroids[i]);
        if (d < minD) { minD = d; nearest = i; }
      }
      populations[nearest]++;
      chromaSum[nearest] += lch.C;
    }
    for (let i = 0; i < centroids.length; i++) {
      const pop = populations[i];
      if (pop === 0) continue;
      const meanC = chromaSum[i] / pop;
      clusters.push({ lch: centroids[i], weight: pop * (meanC + 0.05) });
    }
  } else if (chromaticLchs.length > 0) {
    for (const lch of chromaticLchs) clusters.push({ lch, weight: lch.C + 0.05 });
  }

  const dom = dominantHueFromPixels(chromaticLchs);
  const totalSampled = FRAMES_PER_PIECE * SAMPLE * SAMPLE;
  return {
    wedgeId: pieceId,
    characteristic,
    palette: [characteristic],
    signature: sig.finalize(),
    clusters,
    dominant: dom ? dom.lch : null,
    dominantStrength: dom ? dom.strength : 0,
    chromaticFraction: chromaticLchs.length / totalSampled,
  };
}

async function main() {
  const raw = await fs.readFile(OUTPUT_PATH, "utf8");
  const existing = JSON.parse(raw);
  if (!Array.isArray(existing)) throw new Error("expected an array in sl-palette.json");

  console.log(`Patching ${PIECES.length} entries…`);
  for (const pieceId of PIECES) {
    const t0 = Date.now();
    const entry = await extractPalette(pieceId);
    const idx = existing.findIndex((e) => e.wedgeId === pieceId);
    if (idx < 0) {
      console.warn(`  ${pieceId} — not in JSON, appending`);
      existing.push(entry);
    } else {
      existing[idx] = entry;
    }
    console.log(`  ${pieceId} — ${entry.characteristic}  (dom=${entry.dominant ? `h=${(entry.dominant.h * 180 / Math.PI).toFixed(1)}°` : "none"}, strength=${entry.dominantStrength.toFixed(3)}, χ=${entry.chromaticFraction.toFixed(3)}) — ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  }

  await fs.writeFile(OUTPUT_PATH, JSON.stringify(existing, null, 2) + "\n");
  console.log(`\n✓ wrote ${OUTPUT_PATH}`);
}

await main();
