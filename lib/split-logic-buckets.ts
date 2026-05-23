// Bucket derivation for Split Logic. Pure function used both server-
// side (to pre-compute archetype similarities so we don't ship the
// 1MB embeddings file to the client) and client-side inside
// SplitLogicSystem (to drive the colour-bar UI + sort comparator).
// Single source of truth — drift between the two would mean the
// server's pre-computed similarities reference a different bucket
// assignment than the client renders.

import {
  colorDistance,
  isUnsuitableForBar,
  kmeansWeighted,
  oklchToHex,
  signatureFromHex,
  type Oklch,
  type WedgeCell,
  type WeightedSample,
} from "@/lib/split-logic-color";

// Rainbow pieces — multi-colour tile mosaics that span every hue
// family at once. They have small amounts of every colour and would
// leak into every locked-zone view if sorted by colour-similarity,
// which destroys grid cohesion. Hardcoded list is the source of
// truth (heuristics undercount pieces whose ground colour dominates
// over their multi-colour accent strip — e.g. sl-096).
export const RAINBOW_IDS = new Set([
  "sl-001",
  "sl-002",
  "sl-003",
  "sl-004",
  "sl-094",
  "sl-095",
  "sl-096",
]);

export type PieceAssignment = "white" | "rainbow" | number;

const CHROMATIC_BUTTON_COUNT = 4;
const MIN_WHITE_PIECES = 3;
const MIN_CHROMATIC_BUCKET = 2;
const MONO_BRIGHT_L_MIN = 0.65;
const MONO_C_MAX = 0.1;

const BUTTON_L_TARGET = 0.7;
const BUTTON_C_FLOOR = 0.2;
const BUTTON_C_CAP = 0.28;
const WHITE_BUTTON_L = 0.94;
const WHITE_BUTTON_C = 0.015;

const TWO_PI = Math.PI * 2;
const normHue = (h: number) => ((h % TWO_PI) + TWO_PI) % TWO_PI;

function findTopCluster(
  clusters: { lch: Oklch; weight: number }[],
): Oklch | null {
  let bestW = -Infinity;
  let bestLch: Oklch | null = null;
  for (const c of clusters) {
    if (c.weight > bestW) {
      bestW = c.weight;
      bestLch = c.lch;
    }
  }
  return bestLch;
}

function findDominantChromatic(
  clusters: { lch: Oklch; weight: number }[],
): Oklch | null {
  let bestScore = -Infinity;
  let bestLch: Oklch | null = null;
  for (const c of clusters) {
    if (c.lch.C < 0.1) continue;
    const score = c.lch.C * c.weight;
    if (score > bestScore) {
      bestScore = score;
      bestLch = c.lch;
    }
  }
  if (bestLch) return bestLch;
  for (const c of clusters) {
    if (c.lch.C < 0.04) continue;
    const score = c.lch.C * c.weight;
    if (score > bestScore) {
      bestScore = score;
      bestLch = c.lch;
    }
  }
  return bestLch;
}

// Hard-lock bucket assignment: each entry maps a piece that should
// IGNORE the colour-clustering algorithm and instead copy whichever
// bucket its anchor piece lands in. Curator-directed: when a swapped
// artwork's new visual visually belongs alongside a specific other
// piece, this map pins them to the same bucket regardless of what
// palette/embedding similarity would otherwise compute.
const BUCKET_OVERRIDE: Record<string, string> = {
  "sl-011": "sl-077", // 11 next to 77
  "sl-019": "sl-097", // 19 after 97
  "sl-075": "sl-015", // 75 leads 15
};

function isWhitePiece(
  clusters: { lch: Oklch; weight: number }[],
): boolean {
  const top = findTopCluster(clusters);
  return !!top && top.L >= MONO_BRIGHT_L_MIN && top.C < MONO_C_MAX;
}

function designButtonLch(centroid: Oklch): Oklch {
  // Yellow band is fussy — raw centroid often lands olive/highlighter.
  // Snap into buttery sweet spot (~100°) with raised L/C.
  const deg = ((centroid.h * 180) / Math.PI + 360) % 360;
  const isYellowBand = deg >= 80 && deg < 115;
  if (isYellowBand) {
    const yellowDeg = Math.max(95, Math.min(105, deg));
    return { h: (yellowDeg * Math.PI) / 180, L: 0.88, C: 0.18 };
  }
  const L = BUTTON_L_TARGET;
  const C = Math.min(BUTTON_C_CAP, Math.max(BUTTON_C_FLOOR, centroid.C));
  return { h: centroid.h, L, C };
}

export type BucketResult = {
  zoneCells: WedgeCell[];
  zoneKeys: PieceAssignment[];
  pieceAssignment: PieceAssignment[];
  centroids: Oklch[];
};

export function computeSplitLogicBuckets(cells: WedgeCell[]): BucketResult {
  const assignment: PieceAssignment[] = new Array(cells.length);
  const chromaticIdx: number[] = [];
  const chromaticDom: Oklch[] = [];

  // Pieces in BUCKET_OVERRIDE are excluded from the natural
  // classification (and from k-means centroid sampling) so their
  // signatures don't perturb the rest of the clustering. After the
  // algorithm assigns every other piece, the override pass below
  // copies each target's anchor assignment verbatim.
  const overrideTargets = new Set(Object.keys(BUCKET_OVERRIDE));

  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    if (overrideTargets.has(cell.wedgeId)) continue;
    if (RAINBOW_IDS.has(cell.wedgeId)) {
      assignment[i] = "rainbow";
      continue;
    }
    if (isWhitePiece(cell.clusters)) {
      assignment[i] = "white";
      continue;
    }
    const dom = cell.dominant ?? findDominantChromatic(cell.clusters);
    if (dom) {
      chromaticIdx.push(i);
      chromaticDom.push(dom);
    } else {
      assignment[i] = "white";
    }
  }

  const samples: WeightedSample[] = chromaticDom.map((lch) => ({
    lch,
    weight: lch.C,
  }));
  const k = Math.min(CHROMATIC_BUTTON_COUNT, samples.length);
  const rawCentroids: Oklch[] = k > 0 ? kmeansWeighted(samples, k) : [];

  const order = Array.from({ length: rawCentroids.length }, (_, i) => i).sort(
    (a, b) => normHue(rawCentroids[a].h) - normHue(rawCentroids[b].h),
  );
  const sortedCentroids = order.map((i) => rawCentroids[i]);

  for (let j = 0; j < chromaticIdx.length; j++) {
    const dom = chromaticDom[j];
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let c = 0; c < sortedCentroids.length; c++) {
      const d = colorDistance(dom, sortedCentroids[c]);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = c;
      }
    }
    assignment[chromaticIdx[j]] = bestIdx;
  }

  // Apply curator-locked bucket overrides AFTER the algorithm has
  // finished classifying every other piece. Each target copies its
  // anchor's assignment verbatim — chromatic bucket index, "white",
  // or "rainbow" — so it lands wherever the anchor lands without
  // its own signature influencing the result.
  for (let i = 0; i < cells.length; i++) {
    const sourceId = BUCKET_OVERRIDE[cells[i].wedgeId];
    if (!sourceId) continue;
    const srcIdx = cells.findIndex((c) => c.wedgeId === sourceId);
    if (srcIdx >= 0 && assignment[srcIdx] !== undefined) {
      assignment[i] = assignment[srcIdx];
    } else {
      // Anchor missing — fall back to white so the piece still
      // renders rather than crashing the bucket counters below.
      assignment[i] = "white";
    }
  }

  let whiteCount = 0;
  let rainbowCount = 0;
  const chromCounts = new Array<number>(sortedCentroids.length).fill(0);
  for (const a of assignment) {
    if (a === "white") whiteCount++;
    else if (a === "rainbow") rainbowCount++;
    else chromCounts[a]++;
  }
  // isUnsuitableForBar is imported but used inside the original SplitLogicSystem
  // for primary-hue derivation, not bucket assignment — keeping the import
  // here to preserve type linkage in case future refactors need it.
  void isUnsuitableForBar;

  const zc: WedgeCell[] = [];
  const zk: PieceAssignment[] = [];

  if (whiteCount >= MIN_WHITE_PIECES) {
    const lch: Oklch = { L: WHITE_BUTTON_L, C: WHITE_BUTTON_C, h: 0 };
    const hex = oklchToHex(lch);
    zc.push({
      hex,
      palette: [hex],
      signature: signatureFromHex(hex),
      clusters: [{ lch, weight: 1 }],
      wedgeId: "category-white",
    });
    zk.push("white");
  }

  for (let i = 0; i < sortedCentroids.length; i++) {
    if (chromCounts[i] < MIN_CHROMATIC_BUCKET) continue;
    const lch = designButtonLch(sortedCentroids[i]);
    const hex = oklchToHex(lch);
    zc.push({
      hex,
      palette: [hex],
      signature: signatureFromHex(hex),
      clusters: [{ lch, weight: 1 }],
      wedgeId: `category-chrom-${i}`,
    });
    zk.push(i);
  }

  if (rainbowCount >= 1) {
    let peakScore = -Infinity;
    let peakHue = 0;
    for (let i = 0; i < cells.length; i++) {
      if (assignment[i] !== "rainbow") continue;
      for (const c of cells[i].clusters) {
        if (c.lch.C < 0.1) continue;
        const s = c.lch.C * c.weight;
        if (s > peakScore) {
          peakScore = s;
          peakHue = c.lch.h;
        }
      }
    }
    const lch: Oklch =
      peakScore > 0
        ? designButtonLch({ L: BUTTON_L_TARGET, C: BUTTON_C_FLOOR, h: peakHue })
        : { L: 0.55, C: 0.08, h: 0 };
    const hex = oklchToHex(lch);
    zc.push({
      hex,
      palette: [hex],
      signature: signatureFromHex(hex),
      clusters: [{ lch, weight: 1 }],
      wedgeId: "category-rainbow",
    });
    zk.push("rainbow");
  }

  return {
    zoneCells: zc,
    zoneKeys: zk,
    pieceAssignment: assignment,
    centroids: sortedCentroids,
  };
}

/**
 * For each piece in a chromatic bucket, the cosine similarity of its
 * embedding to its bucket's archetype (the L2-normalised mean of
 * every member's embedding). Pre-computed server-side so the 1MB
 * embeddings file never ships to the browser — the client only needs
 * the resulting single-float-per-piece value to drive the within-
 * bucket sort tiebreak.
 *
 * Returns a Record keyed by wedgeId. White/rainbow pieces and pieces
 * without an embedding are omitted (their sort path never reaches the
 * embedding tiebreak).
 */
export function computeArchetypeSimilarities(
  cells: WedgeCell[],
  pieceAssignment: PieceAssignment[],
  embeddings: Record<string, number[]>,
): Record<string, number> {
  const numBuckets = pieceAssignment.reduce<number>(
    (max, a) => (typeof a === "number" ? Math.max(max, a) : max),
    -1,
  );
  if (numBuckets < 0) return {};

  const archetypes: (number[] | null)[] = [];
  for (let c = 0; c <= numBuckets; c++) {
    let dim = 0;
    for (let i = 0; i < cells.length; i++) {
      if (pieceAssignment[i] === c) {
        const e = embeddings[cells[i].wedgeId];
        if (e) {
          dim = e.length;
          break;
        }
      }
    }
    if (dim === 0) {
      archetypes.push(null);
      continue;
    }
    const sum = new Array<number>(dim).fill(0);
    let count = 0;
    for (let i = 0; i < cells.length; i++) {
      if (pieceAssignment[i] !== c) continue;
      const e = embeddings[cells[i].wedgeId];
      if (!e) continue;
      for (let d = 0; d < dim; d++) sum[d] += e[d];
      count++;
    }
    if (count === 0) {
      archetypes.push(null);
      continue;
    }
    for (let d = 0; d < dim; d++) sum[d] /= count;
    let norm = 0;
    for (const v of sum) norm += v * v;
    norm = Math.sqrt(norm) || 1;
    for (let d = 0; d < dim; d++) sum[d] /= norm;
    archetypes.push(sum);
  }

  const out: Record<string, number> = {};
  for (let i = 0; i < cells.length; i++) {
    const a = pieceAssignment[i];
    if (typeof a !== "number") continue;
    const archetype = archetypes[a];
    const e = embeddings[cells[i].wedgeId];
    if (!archetype || !e) continue;
    let s = 0;
    const n = Math.min(archetype.length, e.length);
    for (let d = 0; d < n; d++) s += archetype[d] * e[d];
    out[cells[i].wedgeId] = s;
  }
  return out;
}
