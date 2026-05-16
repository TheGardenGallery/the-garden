/**
 * Build-time palette extraction for the Split Logic series.
 *
 * Every sl-*.mp4 in public/images/ricky-retouch/works/ is sampled at
 * FRAMES_PER_PIECE evenly-spaced timestamps with ffmpeg, the pixels
 * are pooled across frames, vibrance-thresholded, and clustered in
 * OKLCh with the same k-means used at runtime. The result is written
 * to data/sl-palette.json — at request time getSplitLogicFullPalette
 * imports this JSON instead of doing one-frame poster extraction,
 * which was missing the temporal colour identity of generative
 * pieces and causing the bar to surface stray accent hues as if they
 * were the dominant family.
 *
 * Run: npx tsx scripts/build-sl-palette.ts
 */

import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

import ffmpegStatic from "ffmpeg-static";
import sharp from "sharp";

import {
  colorDistance,
  hexToOklch,
  kmeansWeighted,
  newSignatureAccumulator,
  type ColorCluster,
  type ColorSignature,
  type Oklch,
} from "../lib/split-logic-color";

const FRAMES_PER_PIECE: number = 10;
const SAMPLE = 128;
const VIBRANCE_THRESHOLD = 0.12;
const PER_IMAGE_CLUSTERS = 5;
const WORKS_DIR = path.join(
  process.cwd(),
  "public/images/ricky-retouch/works",
);
const OUTPUT_PATH = path.join(process.cwd(), "data/sl-palette.json");

const ffmpegBin = (ffmpegStatic as unknown as string) || "ffmpeg";

type PaletteEntry = {
  wedgeId: string;
  characteristic: string;
  palette: string[];
  signature: ColorSignature;
  clusters: ColorCluster[];
  dominant: Oklch | null;
  dominantStrength: number;
  /**
   * Fraction of sampled pixels that cleared the vibrance threshold
   * (sat × val ≥ 0.12). Range [0, 1]: ~0.8+ for a piece with a
   * saturated full-frame ground, ~0.02 for a piece that's mostly
   * black with a thin white grid (the white-on-black diagnostic-UI
   * family). Used at runtime to classify the piece as monochrome
   * regardless of what hue the rare chromatic noise happened to
   * land on — fixes white-piece leakage into chromatic zones.
   */
  chromaticFraction: number;
};

const DOMINANT_HUE_BINS = 72; // 5° per bin
const DOMINANT_BIN_WIDTH = (2 * Math.PI) / DOMINANT_HUE_BINS;

/**
 * Pick the piece's identity hue independent of pixel count.
 *
 * Builds a chroma²-weighted hue histogram (72 bins × 5°) over the
 * pooled chromatic pixels, smooths it with a 3-bin moving window
 * (so a hue that straddles a bin boundary doesn't get split), and
 * locates the peak. The dominant Oklch is the chroma²-weighted mean
 * of pixels within ±1 bin (≈10°) of the peak — so the answer is
 * always inside a coherent hue band, not the centre of a wide
 * smear.
 *
 * Why chroma²: a piece dominated by 3,000 dim pixels (C=0.04) and
 * 200 saturated pixels (C=0.22) is identity-driven by the saturated
 * 200, not the dim 3,000. Linear chroma weighting gives the dim
 * mass too much credit; squared lets identity colours assert
 * themselves at order-of-magnitude lower population.
 */
function dominantHueFromPixels(
  pixels: Oklch[],
): { lch: Oklch; strength: number } | null {
  if (pixels.length === 0) return null;
  const hist = new Array<number>(DOMINANT_HUE_BINS).fill(0);
  let totalWeight = 0;
  for (const p of pixels) {
    if (p.C < 0.06) continue;
    const h = (((p.h % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI));
    const bin = Math.min(
      DOMINANT_HUE_BINS - 1,
      Math.floor(h / DOMINANT_BIN_WIDTH),
    );
    const w = p.C * p.C;
    hist[bin] += w;
    totalWeight += w;
  }
  if (totalWeight === 0) return null;

  // 3-bin moving average to absorb boundary-straddling hues.
  const smooth = new Array<number>(DOMINANT_HUE_BINS).fill(0);
  for (let i = 0; i < DOMINANT_HUE_BINS; i++) {
    const prev = (i - 1 + DOMINANT_HUE_BINS) % DOMINANT_HUE_BINS;
    const next = (i + 1) % DOMINANT_HUE_BINS;
    smooth[i] = (hist[prev] + hist[i] + hist[next]) / 3;
  }
  let peak = 0;
  let peakIdx = -1;
  for (let i = 0; i < DOMINANT_HUE_BINS; i++) {
    if (smooth[i] > peak) {
      peak = smooth[i];
      peakIdx = i;
    }
  }
  if (peakIdx < 0 || peak <= 0) return null;

  // Sum raw (unsmoothed) histogram across the peak band ±1 — gives
  // the real fraction of chromatic mass in the dominant hue.
  const bandIdxs: number[] = [];
  for (let off = -1; off <= 1; off++) {
    bandIdxs.push(
      (peakIdx + off + DOMINANT_HUE_BINS) % DOMINANT_HUE_BINS,
    );
  }
  const bandIdxSet = new Set(bandIdxs);
  let bandMass = 0;
  for (const i of bandIdxs) bandMass += hist[i];
  const strength = bandMass / totalWeight;

  // Centre-of-mass of pixels in the peak band.
  let sumW = 0, sumL = 0, sumC = 0, sumCos = 0, sumSin = 0;
  for (const p of pixels) {
    if (p.C < 0.06) continue;
    const h = (((p.h % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI));
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

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")
  );
}

async function probeDuration(file: string): Promise<number> {
  // ffmpeg prints duration to stderr in the "Duration: HH:MM:SS.cc" line.
  // We invoke it with no output target so it exits after parsing the
  // header — fastest possible read of the metadata.
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegBin, ["-i", file], { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    proc.stderr.on("data", (chunk) => (stderr += chunk.toString()));
    proc.on("close", () => {
      const m = stderr.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
      if (!m) {
        reject(new Error(`could not parse duration from ${file}`));
        return;
      }
      const [, h, mn, s] = m;
      resolve(Number(h) * 3600 + Number(mn) * 60 + Number(s));
    });
    proc.on("error", reject);
  });
}

async function extractFrameToBuffer(
  file: string,
  timestampSec: number,
): Promise<Buffer> {
  // ffmpeg -ss <t> -i <file> -vframes 1 -f image2pipe -vcodec png -
  // pipes one PNG frame to stdout. Faster than writing to disk and
  // re-reading. -ss before -i is the fast seek (keyframe-accurate
  // enough for sampling purposes).
  return new Promise((resolve, reject) => {
    const proc = spawn(
      ffmpegBin,
      [
        "-loglevel", "error",
        "-ss", timestampSec.toFixed(3),
        "-i", file,
        "-vframes", "1",
        "-f", "image2pipe",
        "-vcodec", "png",
        "-",
      ],
      { stdio: ["ignore", "pipe", "pipe"] },
    );
    const chunks: Buffer[] = [];
    proc.stdout.on("data", (c) => chunks.push(c));
    let stderr = "";
    proc.stderr.on("data", (c) => (stderr += c.toString()));
    proc.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`ffmpeg exit ${code}: ${stderr}`));
        return;
      }
      resolve(Buffer.concat(chunks));
    });
    proc.on("error", reject);
  });
}

async function extractPaletteForPiece(
  pieceId: string,
  videoPath: string,
): Promise<PaletteEntry> {
  const duration = await probeDuration(videoPath);
  // Sample frames at evenly spaced positions inside the duration,
  // skipping the very first and last 5% to avoid title cards / fade-
  // outs that don't represent the piece's visual identity.
  const t0 = duration * 0.05;
  const tN = duration * 0.95;
  const timestamps = Array.from({ length: FRAMES_PER_PIECE }, (_, i) =>
    FRAMES_PER_PIECE === 1
      ? t0
      : t0 + (tN - t0) * (i / (FRAMES_PER_PIECE - 1)),
  );

  // Pool every vibrance-passing pixel across every sampled frame
  // into a single chromatic-pixel array. This is the crucial change
  // — one-frame extraction missed the dominant identity when the
  // poster happened to land on an accent moment.
  const chromaticLchs: Oklch[] = [];
  let sumR = 0, sumG = 0, sumB = 0, sumW = 0;
  const sig = newSignatureAccumulator();

  for (const t of timestamps) {
    const pngBuf = await extractFrameToBuffer(videoPath, t);
    const { data, info } = await sharp(pngBuf)
      .resize(SAMPLE, SAMPLE, { fit: "cover", kernel: "nearest" })
      .raw()
      .toBuffer({ resolveWithObject: true });
    const { channels } = info;
    for (let i = 0; i < data.length; i += channels) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
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

  const characteristic =
    sumW > 0
      ? rgbToHex(
          Math.round(sumR / sumW),
          Math.round(sumG / sumW),
          Math.round(sumB / sumW),
        )
      : "#808080";

  const clusters: ColorCluster[] = [];
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
      clusters.push({
        lch: centroids[i],
        weight: pop * (meanC + 0.05),
      });
    }
  } else if (chromaticLchs.length > 0) {
    for (const lch of chromaticLchs) {
      clusters.push({ lch, weight: lch.C + 0.05 });
    }
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
  const entries: PaletteEntry[] = [];
  const total = 100;
  const concurrency = Math.max(2, Math.min(os.cpus().length - 1, 6));
  console.log(
    `Sampling ${FRAMES_PER_PIECE} frames × ${total} pieces, concurrency ${concurrency}…`,
  );

  let nextIdx = 0;
  let completed = 0;
  const t0 = Date.now();
  async function worker() {
    while (true) {
      const idx = nextIdx++;
      if (idx >= total) return;
      const n = String(idx + 1).padStart(3, "0");
      const pieceId = `sl-${n}`;
      const videoPath = path.join(WORKS_DIR, `${pieceId}.mp4`);
      try {
        const entry = await extractPaletteForPiece(pieceId, videoPath);
        entries[idx] = entry;
      } catch (err) {
        console.error(`  ✗ ${pieceId}:`, (err as Error).message);
        entries[idx] = {
          wedgeId: pieceId,
          characteristic: "#808080",
          palette: ["#808080"],
          signature: newSignatureAccumulator().finalize(),
          clusters: [],
          dominant: null,
          dominantStrength: 0,
          chromaticFraction: 0,
        };
      }
      completed++;
      if (completed % 5 === 0 || completed === total) {
        const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
        console.log(`  [${completed}/${total}] ${elapsed}s`);
      }
    }
  }
  await Promise.all(
    Array.from({ length: concurrency }, () => worker()),
  );

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(entries, null, 2));
  console.log(
    `\n✓ Wrote ${entries.length} entries to ${path.relative(process.cwd(), OUTPUT_PATH)} (${((Date.now() - t0) / 1000).toFixed(1)}s)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
