/**
 * Cluster the precomputed Split Logic embeddings into visual-
 * identity groups. Reads data/sl-embeddings.json + data/sl-palette.json,
 * runs k-means k=7 with k-means++ seeding under a deterministic
 * RNG (so rebuilds produce the same bar order), assigns each piece
 * to a cluster, and writes data/sl-clusters.json.
 *
 * Separated from build-sl-embeddings.ts so we don't pay the CLIP-
 * inference cost just to retune k or the seed.
 *
 * Run: npm run build-sl-clusters
 */

import { promises as fs } from "node:fs";
import path from "node:path";

const K = 7;
const RAINBOW_IDS = new Set([
  "sl-001", "sl-002", "sl-003", "sl-004", "sl-094", "sl-095", "sl-096",
]);
const MONO_C_MAX = 0.10;
const MONO_BRIGHT_L_MIN = 0.65;

type Embedding = { wedgeId: string; embedding: number[] };
type Cluster = {
  lch: { L: number; C: number; h: number };
  weight: number;
};
type PaletteEntry = {
  wedgeId: string;
  dominant?: { L: number; C: number; h: number } | null;
  clusters: Cluster[];
};

function cosineDist(a: number[], b: number[]): number {
  let d = 0;
  for (let i = 0; i < a.length; i++) d += a[i] * b[i];
  return 1 - d;
}

function makePrng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 4294967296;
  };
}

function kmeansCosine(
  points: number[][],
  k: number,
  rand: () => number,
  iters = 80,
): { centroids: number[][]; assignments: number[] } {
  const n = points.length;
  const dim = points[0].length;
  // k-means++ seeding for stability.
  const centroidIdxs: number[] = [Math.floor(rand() * n)];
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
    let r = rand() * sum;
    let next = 0;
    for (let i = 0; i < n; i++) {
      r -= dists[i];
      if (r <= 0) { next = i; break; }
    }
    if (!centroidIdxs.includes(next)) centroidIdxs.push(next);
    else centroidIdxs.push(Math.floor(rand() * n));
  }
  const centroids = centroidIdxs.map((i) => points[i].slice());
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
        centroids[c] = points[Math.floor(rand() * n)].slice();
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

async function main() {
  const root = process.cwd();
  const embPath = path.join(root, "data/sl-embeddings.json");
  const palettePath = path.join(root, "data/sl-palette.json");
  const embeddings = JSON.parse(
    await fs.readFile(embPath, "utf8"),
  ) as Embedding[];
  const palette = JSON.parse(
    await fs.readFile(palettePath, "utf8"),
  ) as PaletteEntry[];

  const dominantByPiece = new Map(
    palette.map((p) => [p.wedgeId, p.dominant ?? null]),
  );

  // No pre-classification by "pure white over pure black" — let the
  // CLIP embedding space decide what's visually similar. White-on-
  // black diagnostic-UI pieces naturally form their own cluster
  // (shared motif + low chromatic content), so a "white" button
  // emerges organically without a threshold heuristic that would
  // either over-pull (legit chromatic pieces with bright pastel
  // grounds) or under-pull (white grid on black where the top
  // cluster is the black ground).
  const chromaticEntries = embeddings.filter(
    (e) => e.embedding.length > 0 && !RAINBOW_IDS.has(e.wedgeId),
  );
  // Silence unused-symbol lints from prior version — kept for callers
  // of the same file (these constants may seed future filters).
  void MONO_C_MAX;
  void MONO_BRIGHT_L_MIN;

  console.log(
    `Clustering ${chromaticEntries.length} chromatic pieces into K=${K} visual groups…`,
  );

  const rand = makePrng(1234567);
  const points = chromaticEntries.map((e) => e.embedding);
  const { centroids, assignments } = kmeansCosine(points, K, rand);

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
  clusters.sort((a, b) => {
    const ha = (a.meanHue + 2 * Math.PI) % (2 * Math.PI);
    const hb = (b.meanHue + 2 * Math.PI) % (2 * Math.PI);
    return ha - hb;
  });
  clusters.forEach((c, newIdx) => { c.idx = newIdx; });

  const clusterAssignments: Record<string, number | "rainbow"> = {};
  for (const p of palette) {
    if (RAINBOW_IDS.has(p.wedgeId)) {
      clusterAssignments[p.wedgeId] = "rainbow";
      continue;
    }
    const c = clusters.find((cl) => cl.pieceIds.includes(p.wedgeId));
    if (c) clusterAssignments[p.wedgeId] = c.idx;
  }

  const out = {
    k: K,
    clusters: clusters.map((c) => ({
      idx: c.idx,
      meanHue: c.meanHue,
      pieceIds: c.pieceIds,
      centroid: c.centroid,
    })),
    assignments: clusterAssignments,
  };
  const clustersPath = path.join(root, "data/sl-clusters.json");
  await fs.writeFile(clustersPath, JSON.stringify(out));
  console.log(`✓ Wrote ${path.relative(root, clustersPath)}`);
  for (const c of clusters) {
    const deg = ((c.meanHue * 180) / Math.PI + 360) % 360;
    const sample = c.pieceIds.slice(0, 6).join(", ");
    console.log(
      `  cluster ${c.idx}: hue=${deg.toFixed(0)}° size=${c.pieceIds.length} [${sample}${c.pieceIds.length > 6 ? ", …" : ""}]`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
