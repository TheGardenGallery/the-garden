/**
 * Build-time visual-identity embeddings for the Split Logic series.
 *
 * Each sl-*.mp4 is sampled at FRAMES_PER_PIECE timestamps with
 * ffmpeg-static; each frame is encoded with CLIP-ViT-B/32 via
 * transformers.js (local ONNX inference, no API). The 10 per-frame
 * embeddings are mean-pooled into one piece embedding and L2-
 * normalised so cosine similarity reduces to dot product.
 *
 * Output: data/sl-embeddings.json — array of { wedgeId, embedding }.
 * The runtime uses these to refine within-bucket sort (pieces ranked
 * by visual similarity to the bucket archetype, not just dominant
 * hue alignment). Re-run when videos change:
 *   npm run build-sl-embeddings
 */

import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";

import ffmpegStatic from "ffmpeg-static";

const FRAMES_PER_PIECE = 10;
const WORKS_DIR = path.join(
  process.cwd(),
  "public/images/ricky-retouch/works",
);
const OUTPUT_PATH = path.join(process.cwd(), "data/sl-embeddings.json");

const ffmpegBin = (ffmpegStatic as unknown as string) || "ffmpeg";

async function probeDuration(file: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegBin, ["-i", file], {
      stdio: ["ignore", "ignore", "pipe"],
    });
    let stderr = "";
    proc.stderr.on("data", (c) => (stderr += c.toString()));
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

async function extractFramePng(
  file: string,
  timestampSec: number,
): Promise<Buffer> {
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

async function main() {
  // Dynamic import so the heavy ML deps only load when this script
  // runs — they don't belong in the Next.js bundle.
  const { pipeline, RawImage, env } = await import("@xenova/transformers");
  // Cache models locally under .cache/transformers — kept out of the
  // bundle by .gitignore. Local-only inference, no API.
  env.cacheDir = path.join(process.cwd(), ".cache/transformers");
  env.allowLocalModels = true;
  env.allowRemoteModels = true;

  console.log("Loading CLIP-ViT-B/32 (first run downloads ~150MB)…");
  const t0 = Date.now();
  const extractor = await pipeline(
    "image-feature-extraction",
    "Xenova/clip-vit-base-patch32",
  );
  console.log(`  ✓ loaded in ${((Date.now() - t0) / 1000).toFixed(1)}s`);

  type Entry = { wedgeId: string; embedding: number[] };
  const entries: Entry[] = [];
  const total = 100;

  for (let idx = 0; idx < total; idx++) {
    const n = String(idx + 1).padStart(3, "0");
    const pieceId = `sl-${n}`;
    const videoPath = path.join(WORKS_DIR, `${pieceId}.mp4`);
    const tStart = Date.now();
    try {
      const duration = await probeDuration(videoPath);
      const t0 = duration * 0.05;
      const tN = duration * 0.95;
      const timestamps = Array.from(
        { length: FRAMES_PER_PIECE },
        (_, i) => t0 + ((tN - t0) * i) / (FRAMES_PER_PIECE - 1),
      );

      const perFrame: number[][] = [];
      for (const t of timestamps) {
        const png = await extractFramePng(videoPath, t);
        // RawImage.fromBlob accepts a Blob; wrap the PNG buffer.
        const blob = new Blob([new Uint8Array(png)], { type: "image/png" });
        const image = await RawImage.fromBlob(blob);
        // Cast: transformers.js accepts pooling/normalize at runtime
        // but the public typings are too narrow. Cast through any
        // since this is a build-time script — the runtime accepts
        // both fields and that's been verified end-to-end.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const out = await (extractor as any)(image, {
          pooling: "mean",
          normalize: true,
        });
        const arr = Array.from(out.data as Float32Array);
        perFrame.push(arr);
      }

      // Mean-pool across frames, then L2-normalise so similarity is
      // cosine via dot product downstream.
      const dim = perFrame[0].length;
      const mean = new Array<number>(dim).fill(0);
      for (const v of perFrame) for (let i = 0; i < dim; i++) mean[i] += v[i];
      for (let i = 0; i < dim; i++) mean[i] /= perFrame.length;
      let norm = 0;
      for (const v of mean) norm += v * v;
      norm = Math.sqrt(norm) || 1;
      for (let i = 0; i < dim; i++) mean[i] /= norm;

      entries.push({ wedgeId: pieceId, embedding: mean });
      const elapsed = ((Date.now() - tStart) / 1000).toFixed(1);
      console.log(`  [${idx + 1}/${total}] ${pieceId} ${elapsed}s`);
    } catch (err) {
      console.error(`  ✗ ${pieceId}:`, (err as Error).message);
      entries.push({ wedgeId: pieceId, embedding: [] });
    }
  }

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(entries));
  console.log(
    `\n✓ Wrote ${entries.length} embeddings to ${path.relative(process.cwd(), OUTPUT_PATH)}`,
  );

  // Cluster the embeddings into K visual-identity groups. Pieces in
  // the same cluster share composition, motif, and colour treatment
  // — far better correspondence with how a curator groups than
  // pure-hue clustering. K is bar-sized (white + rainbow are
  // separate specials, so 7 chromatic clusters mirror the prior
  // hue-based bar width).
  const K = 7;
  const validEntries = entries.filter((e) => e.embedding.length > 0);
  const palettePath = path.join(process.cwd(), "data/sl-palette.json");
  const palette = JSON.parse(await fs.readFile(palettePath, "utf8")) as Array<{
    wedgeId: string;
    dominant?: { L: number; C: number; h: number } | null;
  }>;
  const dominantByPiece = new Map(
    palette.map((p) => [p.wedgeId, p.dominant ?? null]),
  );

  const RAINBOW_IDS = new Set([
    "sl-001","sl-002","sl-003","sl-004","sl-094","sl-095","sl-096",
  ]);
  const MONO_C_MAX = 0.10;
  const MONO_BRIGHT_L_MIN = 0.65;

  function isWhitePalette(wedgeId: string): boolean {
    const p = palette.find((x) => x.wedgeId === wedgeId);
    if (!p) return false;
    const top = (p as { clusters?: Array<{ lch: { L: number; C: number; h: number }; weight: number }> }).clusters?.reduce(
      (acc: { lch: { L: number; C: number; h: number }; weight: number } | null, c) =>
        !acc || c.weight > acc.weight ? c : acc,
      null,
    );
    return !!top && top.lch.L >= MONO_BRIGHT_L_MIN && top.lch.C < MONO_C_MAX;
  }

  // Only cluster the *chromatic* pieces — white pieces and rainbow
  // pieces have their own bar slots and don't compete for a
  // chromatic centroid.
  const chromaticEntries = validEntries.filter(
    (e) => !RAINBOW_IDS.has(e.wedgeId) && !isWhitePalette(e.wedgeId),
  );
  console.log(
    `\nClustering ${chromaticEntries.length} chromatic pieces into K=${K} visual groups…`,
  );

  // k-means on unit-norm 512-d embeddings (cosine distance).
  function cosineDist(a: number[], b: number[]): number {
    let d = 0;
    for (let i = 0; i < a.length; i++) d += a[i] * b[i];
    return 1 - d;
  }

  function kmeansCosine(
    points: number[][],
    k: number,
    iters = 60,
  ): { centroids: number[][]; assignments: number[] } {
    const n = points.length;
    const dim = points[0].length;
    // k-means++ seeding for stability
    const centroidIdxs: number[] = [Math.floor(Math.random() * n)];
    while (centroidIdxs.length < k) {
      const dists = points.map((p) => {
        let min = Infinity;
        for (const ci of centroidIdxs) {
          const d = cosineDist(p, points[ci]);
          if (d < min) min = d;
        }
        return min;
      });
      const sum = dists.reduce((a, b) => a + b, 0);
      let r = Math.random() * sum;
      let next = 0;
      for (let i = 0; i < n; i++) {
        r -= dists[i];
        if (r <= 0) { next = i; break; }
      }
      if (!centroidIdxs.includes(next)) centroidIdxs.push(next);
      else centroidIdxs.push(Math.floor(Math.random() * n));
    }
    let centroids = centroidIdxs.map((i) => points[i].slice());
    const assignments = new Array<number>(n).fill(0);
    for (let iter = 0; iter < iters; iter++) {
      let changed = false;
      for (let i = 0; i < n; i++) {
        let best = 0;
        let bestD = Infinity;
        for (let c = 0; c < k; c++) {
          const d = cosineDist(points[i], centroids[c]);
          if (d < bestD) { bestD = d; best = c; }
        }
        if (assignments[i] !== best) { assignments[i] = best; changed = true; }
      }
      // Recompute centroids (mean) + L2-normalise so cosine == dot.
      const sums = Array.from({ length: k }, () => new Array<number>(dim).fill(0));
      const counts = new Array<number>(k).fill(0);
      for (let i = 0; i < n; i++) {
        const c = assignments[i];
        counts[c]++;
        const p = points[i];
        const s = sums[c];
        for (let d = 0; d < dim; d++) s[d] += p[d];
      }
      for (let c = 0; c < k; c++) {
        if (counts[c] === 0) {
          // Re-seed empty centroid from a random point
          centroids[c] = points[Math.floor(Math.random() * n)].slice();
          continue;
        }
        const s = sums[c];
        for (let d = 0; d < dim; d++) s[d] /= counts[c];
        let norm = 0;
        for (const v of s) norm += v * v;
        norm = Math.sqrt(norm) || 1;
        for (let d = 0; d < dim; d++) s[d] /= norm;
        centroids[c] = s;
      }
      if (!changed && iter > 4) break;
    }
    return { centroids, assignments };
  }

  // Deterministic seed via a fixed Math.random shim — repeated builds
  // give the same clusters so the bar order doesn't drift across
  // production rebuilds.
  let _seed = 1234567;
  const origRandom = Math.random;
  Math.random = () => {
    _seed = (_seed * 1664525 + 1013904223) & 0xffffffff;
    return (_seed >>> 0) / 4294967296;
  };
  const points = chromaticEntries.map((e) => e.embedding);
  const { centroids, assignments } = kmeansCosine(points, K);
  Math.random = origRandom;

  // For each cluster: list of pieceIds + mean dominant hue (for
  // the bar's button colour) + size.
  const clusterInfo = Array.from({ length: K }, () => ({
    pieceIds: [] as string[],
    sumCos: 0,
    sumSin: 0,
    hueWeight: 0,
  }));
  for (let i = 0; i < chromaticEntries.length; i++) {
    const cIdx = assignments[i];
    const pid = chromaticEntries[i].wedgeId;
    clusterInfo[cIdx].pieceIds.push(pid);
    const dom = dominantByPiece.get(pid);
    if (dom) {
      const w = dom.C * dom.C;
      clusterInfo[cIdx].sumCos += Math.cos(dom.h) * w;
      clusterInfo[cIdx].sumSin += Math.sin(dom.h) * w;
      clusterInfo[cIdx].hueWeight += w;
    }
  }
  const clusters = clusterInfo.map((c, i) => ({
    idx: i,
    centroid: centroids[i],
    pieceIds: c.pieceIds,
    meanHue:
      c.hueWeight > 0
        ? Math.atan2(c.sumSin / c.hueWeight, c.sumCos / c.hueWeight)
        : 0,
  }));
  // Sort clusters by mean hue (rainbow order on the bar).
  clusters.sort((a, b) => {
    const ha = (a.meanHue + 2 * Math.PI) % (2 * Math.PI);
    const hb = (b.meanHue + 2 * Math.PI) % (2 * Math.PI);
    return ha - hb;
  });
  // Renumber so cluster 0 is reddest, 6 is most violet/magenta.
  clusters.forEach((c, newIdx) => { c.idx = newIdx; });

  const clusterAssignments: Record<string, number | "white" | "rainbow"> = {};
  for (const p of palette) {
    if (RAINBOW_IDS.has(p.wedgeId)) {
      clusterAssignments[p.wedgeId] = "rainbow";
    } else if (isWhitePalette(p.wedgeId)) {
      clusterAssignments[p.wedgeId] = "white";
    } else {
      const c = clusters.find((cl) => cl.pieceIds.includes(p.wedgeId));
      clusterAssignments[p.wedgeId] = c ? c.idx : "white";
    }
  }
  const clustersOut = {
    k: K,
    clusters: clusters.map((c) => ({
      idx: c.idx,
      meanHue: c.meanHue,
      pieceIds: c.pieceIds,
      centroid: c.centroid,
    })),
    assignments: clusterAssignments,
  };
  const clustersPath = path.join(process.cwd(), "data/sl-clusters.json");
  await fs.writeFile(clustersPath, JSON.stringify(clustersOut));
  console.log(`✓ Wrote clusters to ${path.relative(process.cwd(), clustersPath)}`);
  for (const c of clusters) {
    const deg = ((c.meanHue * 180) / Math.PI + 360) % 360;
    console.log(`  cluster ${c.idx}: hue=${deg.toFixed(0)}° size=${c.pieceIds.length} sample=[${c.pieceIds.slice(0, 4).join(", ")}…]`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
