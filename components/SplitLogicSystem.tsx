"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
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
import { SplitLogicPalette } from "./SplitLogicPalette";
import { PieceGrid, type PieceGridItem } from "./PieceGrid";

const PAGE_SIZE = 12;
// Eight 45° hue bins gives a fuller rainbow without crowding the bar.
// The bar may show fewer cells if a bin is empty (e.g., no purple in
// Ricky's series — better an honest 7-cell rainbow than a padded 8-cell
// one with two near-identical blues).
const TWO_PI = Math.PI * 2;
const normHue = (h: number) => ((h % TWO_PI) + TWO_PI) % TWO_PI;

// Rainbow pieces — multi-colour tile mosaics that span every hue
// family at once. They have small amounts of every colour and would
// leak into every locked-zone view if sorted by colour-similarity,
// which destroys grid cohesion. The right behaviour is to keep them
// as a contiguous block at the end of the grid regardless of sort.
//
// Identified by Ricky / curator. Heuristics (count distinct hue bins
// with ≥10% weight) miss pieces where a single ground colour
// dominates (e.g. sl-096 is mostly red with a multi-colour tile
// strip — only one bin clears 10%, so the heuristic returns false).
// Hardcoded list is the source of truth.
const RAINBOW_IDS = new Set([
  "sl-001",
  "sl-002",
  "sl-003",
  "sl-004",
  "sl-094",
  "sl-095",
  "sl-096",
]);

// Pieces that must always appear adjacent in the grid, regardless of
// sort. Use when two pieces are visually a pair or call-and-response
// and the colour-similarity sort would split them by even a small
// hue drift. After the primary sort runs, the post-pass below moves
// every group member to sit immediately after the group's first
// occurrence, preserving their relative order.
const ADJACENCY_GROUPS: string[][] = [
  ["sl-098", "sl-037", "sl-027", "sl-087", "sl-049"],
  ["sl-093", "sl-013"],
  ["sl-078", "sl-070", "sl-020"],
  ["sl-015", "sl-076", "sl-067", "sl-066", "sl-073", "sl-038", "sl-064", "sl-008", "sl-086", "sl-080"],
  ["sl-036", "sl-033", "sl-034", "sl-044", "sl-028", "sl-092", "sl-058", "sl-018"],
  ["sl-075", "sl-045", "sl-042"],
  ["sl-007", "sl-012", "sl-099", "sl-077", "sl-100", "sl-019", "sl-061", "sl-069", "sl-065", "sl-025", "sl-079", "sl-043", "sl-051", "sl-017", "sl-047", "sl-085"],
  ["sl-009", "sl-056", "sl-053", "sl-014", "sl-090", "sl-068", "sl-084", "sl-048", "sl-023"],
  ["sl-057", "sl-022", "sl-088"],
  ["sl-062", "sl-055", "sl-021", "sl-059", "sl-071", "sl-074", "sl-030", "sl-040", "sl-029", "sl-041", "sl-035", "sl-054", "sl-024"],
  ["sl-097", "sl-089", "sl-083", "sl-039", "sl-031", "sl-032", "sl-081", "sl-082", "sl-091", "sl-026", "sl-052", "sl-072", "sl-005", "sl-006", "sl-011", "sl-010", "sl-060", "sl-046", "sl-050", "sl-063", "sl-016"],
];

// Bar design — two curated specials + four algorithmic centroids:
//   WHITE      surfaces if enough bright-monochrome pieces (top cluster
//              L ≥ MONO_BRIGHT_L_MIN, C < MONO_C_MAX). Always first.
//   CHROMATIC  weighted k-means k=4 over every piece's dominant
//              chromatic cluster (chroma-weighted so saturated pieces
//              pull harder than washed-out ones). The four centroids
//              are sorted by hue and become the four chromatic
//              buttons; centroids adapt to whatever palette the series
//              actually contains rather than being forced into named
//              hue ranges.
//   RAINBOW    surfaces if RAINBOW_IDS has ≥1 match. Always last.
//
// Each piece gets exactly one assignment: "white", "rainbow", or a
// chromatic centroid index (0..k-1, hue-sorted). Default sort respects
// this assignment; locked sort floats matching pieces to the head and
// ranks within them by distance to the centroid so the closest match
// to the clicked button leads.
type PieceAssignment = "white" | "rainbow" | number;

const CHROMATIC_BUTTON_COUNT = 4;
const MIN_WHITE_PIECES = 3;
const MIN_CHROMATIC_BUCKET = 2;
const MONO_BRIGHT_L_MIN = 0.65;
const MONO_C_MAX = 0.10;

// Designed display targets — every chromatic button renders at the
// same L and C floor so the bar reads as a cohesive set rather than
// a row of mismatched saturations. Hue is the only extracted axis;
// L and C are designed for visual energy parity.
const BUTTON_L_TARGET = 0.7;
const BUTTON_C_FLOOR = 0.20;
const BUTTON_C_CAP = 0.28;
const WHITE_BUTTON_L = 0.94;
const WHITE_BUTTON_C = 0.015;

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
  // Strict gate first — pieces with a confidently chromatic dominant
  // (C ≥ 0.10) contribute their actual colour identity. Looser
  // fallback for pieces whose only chromatic content is faint, so
  // dim-tinted pieces still get assigned to a chromatic bucket
  // rather than collapsing into white.
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

function isWhitePiece(
  clusters: { lch: Oklch; weight: number }[],
): boolean {
  const top = findTopCluster(clusters);
  return !!top && top.L >= MONO_BRIGHT_L_MIN && top.C < MONO_C_MAX;
}

function designButtonLch(centroid: Oklch): Oklch {
  // Yellow band (≈ 80°-115° in OKLCh) is fussy — the raw centroid
  // often lands olive/highlighter, which reads pukey on a black bar.
  // Pull the rendered hue into the buttery-yellow sweet spot
  // (≈ 100°) and raise L/C so it reads warm-sunlit rather than
  // green-tinged or acidic.
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

function rankPriority(a: PieceAssignment): number {
  if (a === "white") return 0;
  if (a === "rainbow") return 1e6;
  return 1 + a;
}

function cosineSim(a: number[], b: number[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  let s = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) s += a[i] * b[i];
  return s;
}

function computeSortedIndices(
  pieceAssignment: PieceAssignment[],
  topClusterLch: Oklch[],
  centroids: Oklch[],
  dominantStrength: number[],
  bucketMass: number[],
  pieceEmbeddings: (number[] | null)[],
  bucketArchetypes: (number[] | null)[],
  lockedAssignment: PieceAssignment | null,
): number[] {
  const n = pieceAssignment.length;
  const indices = Array.from({ length: n }, (_, i) => i);

  // Distance to assigned centroid — used as tiebreak only. The
  // primary within-bucket key is dominantStrength so a piece that's
  // wall-to-wall yellow leads the yellow bucket regardless of how
  // its dominant hue offsets from the centroid's exact placement.
  const distToOwn = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) {
    const a = pieceAssignment[i];
    if (typeof a === "number") {
      distToOwn[i] = colorDistance(topClusterLch[i], centroids[a]);
    }
  }

  indices.sort((a, b) => {
    if (lockedAssignment !== null) {
      const am = pieceAssignment[a] === lockedAssignment ? 0 : 1;
      const bm = pieceAssignment[b] === lockedAssignment ? 0 : 1;
      if (am !== bm) return am - bm;
    }
    const pa = rankPriority(pieceAssignment[a]);
    const pb = rankPriority(pieceAssignment[b]);
    if (pa !== pb) return pa - pb;
    const aa = pieceAssignment[a];
    if (aa === "white") {
      // White pieces: dim → bright (L ascending).
      return topClusterLch[a].L - topClusterLch[b].L;
    }
    if (aa === "rainbow") {
      return a - b;
    }
    // Chromatic bucket — primary signal is "how much of THIS colour
    // is in this piece," i.e. the sum of cluster weights whose hue
    // sits within the bucket's hue band. A wall-to-wall green field
    // has order-of-magnitude more chromatic mass at green than a
    // black-ground piece with a thin green grid; it ranks first.
    // Fallbacks: dominantStrength (concentration), then visual-
    // identity similarity to the archetype (CLIP), then distance
    // to centroid, then L.
    if (bucketMass[a] !== bucketMass[b]) {
      return bucketMass[b] - bucketMass[a];
    }
    if (dominantStrength[a] !== dominantStrength[b]) {
      return dominantStrength[b] - dominantStrength[a];
    }
    const aa2 = pieceAssignment[a] as number;
    const archetype = bucketArchetypes[aa2];
    const aE = pieceEmbeddings[a];
    const bE = pieceEmbeddings[b];
    if (archetype && aE && bE) {
      const aSim = cosineSim(aE, archetype);
      const bSim = cosineSim(bE, archetype);
      if (aSim !== bSim) return bSim - aSim;
    }
    if (distToOwn[a] !== distToOwn[b]) return distToOwn[a] - distToOwn[b];
    return topClusterLch[a].L - topClusterLch[b].L;
  });
  return indices;
}

export function SplitLogicSystem({
  cells,
  gridItems,
  embeddings = {},
}: {
  cells: WedgeCell[];
  gridItems: PieceGridItem[];
  /**
   * Per-piece CLIP-ViT-B/32 mean-pooled embedding, L2-normalised.
   * Used to refine within-bucket sort: each chromatic bucket has an
   * archetype (mean of member embeddings) and pieces sort by cosine
   * distance to it — visually-similar pieces float to the top of
   * the locked view, even when their dominant-hue alignment to the
   * centroid is identical. Optional: if absent, sort falls back to
   * dominantStrength then distance-to-centroid.
   */
  embeddings?: Record<string, number[]>;
}) {
  const [lockedZoneIdx, setLockedZoneIdx] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  // Auto-lock to the white zone on first paint so the page starts in
  // an opinionated reading state (white pieces lead the grid)
  // rather than the algorithmic-default sort. Runs exactly once
  // after the colour bar's zone keys resolve. If `white` didn't
  // surface (rare — would need <3 monochrome-bright pieces), the
  // grid simply stays in its default order.
  const initialLockAppliedRef = useRef(false);


  // Per-piece colour profile. topClusterLch is each piece's top
  // chromatic cluster (after isUnsuitableForBar) — used for
  // within-bucket sort refinement (distance to centroid, L tiebreak).
  // For all-neutral pieces, falls back to the first raw cluster so
  // they still have a stable Oklch reference.
  const piecePrimaries = useMemo(() => {
    const topHueNorm: number[] = [];
    const topClusterLch: Oklch[] = [];
    for (const cell of cells) {
      let topW = -Infinity;
      let topLch: Oklch = { L: 0, C: 0, h: 0 };
      for (const cluster of cell.clusters) {
        if (isUnsuitableForBar(cluster.lch)) continue;
        if (cluster.weight > topW) {
          topW = cluster.weight;
          topLch = cluster.lch;
        }
      }
      if (topW === -Infinity && cell.clusters.length > 0) {
        topLch = cell.clusters[0].lch;
      }
      topHueNorm.push(normHue(topLch.h));
      topClusterLch.push(topLch);
    }
    return { topHueNorm, topClusterLch };
  }, [cells]);

  // Bar zones — full pipeline.
  //   1. Specials: classify each piece as white / rainbow / chromatic.
  //   2. Collect chromatic pieces' dominant chromatic clusters into a
  //      weighted-sample pool (sample weight = cluster chroma, so
  //      saturated pieces pull centroids harder than washed-out ones).
  //   3. Run weighted k-means k=4. Centroids adapt to whatever
  //      palette the series contains; no hardcoded hue ranges.
  //   4. Sort centroids by hue → renders left-to-right as a rainbow
  //      sweep on the bar.
  //   5. Assign each chromatic piece to the nearest centroid.
  //   6. Emit zone cells in bar order: white (if ≥3 whites), the
  //      surviving centroids (≥2 pieces each), rainbow (if any).
  //   7. Each chromatic/rainbow button renders with extracted hue
  //      but normalised L/C so the bar reads as a cohesive set.
  const { zoneCells, zoneKeys, pieceAssignment, centroids } = useMemo<{
    zoneCells: WedgeCell[];
    zoneKeys: PieceAssignment[];
    pieceAssignment: PieceAssignment[];
    centroids: Oklch[];
  }>(() => {
    const assignment: PieceAssignment[] = new Array(cells.length);
    const chromaticIdx: number[] = [];
    const chromaticDom: Oklch[] = [];

    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
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

    // Sort centroids by hue (left-to-right rainbow sweep on the bar).
    const order = Array.from({ length: rawCentroids.length }, (_, i) => i).sort(
      (a, b) => normHue(rawCentroids[a].h) - normHue(rawCentroids[b].h),
    );
    const sortedCentroids = order.map((i) => rawCentroids[i]);
    const oldToNew = new Array<number>(rawCentroids.length);
    order.forEach((origIdx, newIdx) => {
      oldToNew[origIdx] = newIdx;
    });

    // Assign each chromatic piece to the nearest centroid (in the
    // sorted order so the index lines up with bar position).
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

    // Bucket counts for the surfacing gates.
    let whiteCount = 0;
    let rainbowCount = 0;
    const chromCounts = new Array<number>(sortedCentroids.length).fill(0);
    for (const a of assignment) {
      if (a === "white") whiteCount++;
      else if (a === "rainbow") rainbowCount++;
      else chromCounts[a]++;
    }

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
      // Render rainbow button using the most vivid hue found across
      // the rainbow pieces — a single hex can't BE rainbow, but a
      // saturated standout hue reads as "the multi-colour group"
      // better than a desaturated mean.
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
  }, [cells]);

  useEffect(() => {
    if (initialLockAppliedRef.current) return;
    if (zoneKeys.length === 0) return;
    const whiteIdx = zoneKeys.indexOf("white");
    initialLockAppliedRef.current = true;
    if (whiteIdx >= 0) setLockedZoneIdx(whiteIdx);
  }, [zoneKeys]);

  const lockedAssignment: PieceAssignment | null =
    lockedZoneIdx !== null && lockedZoneIdx < zoneKeys.length
      ? zoneKeys[lockedZoneIdx]
      : null;

  const pieceEmbeddings = useMemo<(number[] | null)[]>(
    () => cells.map((c) => embeddings[c.wedgeId] ?? null),
    [cells, embeddings],
  );

  // Per-chromatic-bucket archetype = L2-normalised mean of member
  // CLIP embeddings. Distance to archetype drives the within-bucket
  // sort so a yellow lock surfaces the most-archetypal yellow piece
  // first, with visual outliers (washy yellow, busy yellow) ranked
  // by their proximity to the same archetype.
  const bucketArchetypes = useMemo<(number[] | null)[]>(() => {
    const archetypes: (number[] | null)[] = [];
    for (let c = 0; c < centroids.length; c++) {
      let dim = 0;
      for (let i = 0; i < cells.length; i++) {
        if (pieceAssignment[i] === c && pieceEmbeddings[i]) {
          dim = pieceEmbeddings[i]!.length;
          break;
        }
      }
      if (dim === 0) { archetypes.push(null); continue; }
      const sum = new Array<number>(dim).fill(0);
      let count = 0;
      for (let i = 0; i < cells.length; i++) {
        if (pieceAssignment[i] !== c) continue;
        const e = pieceEmbeddings[i];
        if (!e) continue;
        for (let d = 0; d < dim; d++) sum[d] += e[d];
        count++;
      }
      if (count === 0) { archetypes.push(null); continue; }
      for (let d = 0; d < dim; d++) sum[d] /= count;
      let norm = 0;
      for (const v of sum) norm += v * v;
      norm = Math.sqrt(norm) || 1;
      for (let d = 0; d < dim; d++) sum[d] /= norm;
      archetypes.push(sum);
    }
    return archetypes;
  }, [cells, centroids, pieceAssignment, pieceEmbeddings]);

  const sortedIndices = useMemo(() => {
    const dominantStrength = cells.map((c) => c.dominantStrength ?? 0);
    // For each piece in a chromatic bucket: sum of its cluster
    // weights whose hue sits within ±25° of the bucket centroid's
    // hue. This is the "literal amount of this colour in the piece"
    // signal that drives the within-bucket sort — a full-frame
    // green ground beats a thin-line green grid by ~10×.
    const HUE_BAND_RAD = (25 * Math.PI) / 180;
    const bucketMass = cells.map((c, i) => {
      const a = pieceAssignment[i];
      if (typeof a !== "number") return 0;
      const target = centroids[a].h;
      let m = 0;
      for (const cl of c.clusters) {
        let dh = cl.lch.h - target;
        if (dh > Math.PI) dh -= 2 * Math.PI;
        else if (dh < -Math.PI) dh += 2 * Math.PI;
        if (Math.abs(dh) <= HUE_BAND_RAD) m += cl.weight;
      }
      return m;
    });
    const sorted = computeSortedIndices(
      pieceAssignment,
      piecePrimaries.topClusterLch,
      centroids,
      dominantStrength,
      bucketMass,
      pieceEmbeddings,
      bucketArchetypes,
      lockedAssignment,
    );
    // Adjacency post-pass — pull every group member into a contiguous
    // run, anchored at the position of the earliest-sorting member.
    // In-cluster order follows ADJACENCY_GROUPS array order, so pairs
    // listed adjacent in the group definition stay adjacent in the
    // rendered cluster regardless of hue-sort ranking.
    if (ADJACENCY_GROUPS.length === 0) return sorted;
    const result = sorted.slice();
    for (const group of ADJACENCY_GROUPS) {
      const positions: number[] = [];
      for (let i = 0; i < result.length; i++) {
        if (group.includes(cells[result[i]].wedgeId)) positions.push(i);
      }
      if (positions.length < 2) continue;
      const anchorPos = positions[0];
      // Re-emit in group-array order so the curator's chosen sequence
      // is preserved. Build the ordered cell list from the group def,
      // skipping members that aren't present in the current result.
      const presentIds = new Set(
        positions.map((p) => cells[result[p]].wedgeId),
      );
      const ordered = group
        .filter((id) => presentIds.has(id))
        .map((id) => {
          const p = positions.find(
            (q) => cells[result[q]].wedgeId === id,
          )!;
          return result[p];
        });
      // Remove all member positions in descending order so earlier
      // indices stay valid, then reinsert at the anchor's slot. Since
      // anchorPos is positions[0] (smallest), removals at higher
      // indices don't shift it, so anchorPos remains valid as the
      // insertion index after the splices.
      for (let i = positions.length - 1; i >= 0; i--) {
        result.splice(positions[i], 1);
      }
      result.splice(anchorPos, 0, ...ordered);
    }
    return result;
  }, [cells, pieceAssignment, piecePrimaries, centroids, pieceEmbeddings, bucketArchetypes, lockedAssignment]);

  // Clicking a category re-sorts the grid so matching pieces appear
  // first — but the full 100-piece stack stays navigable via the
  // pager. The prior version filtered to ONLY matching pieces, which
  // made the rest of the collection inaccessible from a locked state.
  const total = sortedIndices.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // If the sort shrank past the current page (defensive — `total` is
  // a constant 100 in practice), pull `page` back into bounds.
  useEffect(() => {
    if (page >= totalPages) setPage(0);
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = page * PAGE_SIZE;
    const end = Math.min(start + PAGE_SIZE, total);
    return sortedIndices.slice(start, end).map((i) => gridItems[i]);
  }, [page, total, sortedIndices, gridItems]);

  const handleZoneClick = (i: number) => {
    setLockedZoneIdx((cur) => (cur === i ? null : i));
    setPage(0);
  };

  // Both directions wrap — paging through the series is a loop, not a
  // bounded list with dead ends. From page 0 the left arrow takes you
  // to the last page; from the last page the right arrow returns to 0.
  // No auto-scroll: if the user is using the pager, they're already
  // looking at the grid; scrollIntoView would only push the colour
  // bar under the page nav and disorient them.
  const goPrev = useCallback(() => {
    setPage((p) => (p - 1 + totalPages) % totalPages);
  }, [totalPages]);

  const goNext = useCallback(() => {
    setPage((p) => (p + 1) % totalPages);
  }, [totalPages]);

  // Track whether the section is in view so the global keyboard
  // listener only fires when the user is actually looking at the
  // grid — pressing arrows from way up in the hero shouldn't shuffle
  // pages they can't see.
  const inViewRef = useRef(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Drives the fixed-position chevrons on mobile. Observes the grid
  // itself (not the wrapping pager region — that includes the page
  // indicator and section padding, which kept the ratio inflated
  // long after the actual grid had scrolled past) and requires ≥70%
  // of the grid to be in viewport. Below that threshold the chevrons
  // hide, so they never float over the artist's note, colour bar,
  // or any neighbouring chrome.
  const pagerRef = useRef<HTMLDivElement>(null);
  const [pagerInView, setPagerInView] = useState(false);
  useEffect(() => {
    const region = pagerRef.current;
    if (!region) return;
    const grid = region.querySelector<HTMLElement>(".piece-grid");
    if (!grid) return;
    const obs = new IntersectionObserver(
      ([entry]) => setPagerInView(entry.intersectionRatio >= 0.7),
      { threshold: [0, 0.3, 0.5, 0.7, 0.85, 1] }
    );
    obs.observe(grid);
    return () => obs.disconnect();
  }, []);

  // Keyboard pagination — ArrowLeft/Right or A/D (gamer-style) move
  // between pages while the grid is in view. Skip when the lightbox
  // overlay is mounted (it has its own prev/next handler for the
  // expanded artwork) and skip when the user is typing in a form
  // field. Modifier-keyed combos (Cmd-A, Ctrl-D, etc.) are also
  // ignored so the WASD shortcuts never hijack browser/OS gestures.
  useEffect(() => {
    if (totalPages <= 1) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      const isLeft = k === "ArrowLeft" || k === "a" || k === "A";
      const isRight = k === "ArrowRight" || k === "d" || k === "D";
      if (!isLeft && !isRight) return;
      if (!inViewRef.current) return;
      if (document.querySelector(".piece-grid-overlay")) return;
      const t = document.activeElement as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.tagName === "SELECT" ||
          t.isContentEditable)
      )
        return;
      e.preventDefault();
      if (isLeft) goPrev();
      else goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext, totalPages]);

  // Touch pagination — horizontal swipe across the grid changes pages.
  // Same gesture envelope as the lightbox swipe in PieceGrid (>48px,
  // dx >> dy, under 900ms) so the muscle memory transfers. Skipped
  // when the lightbox is open since that surface owns swipes there.
  const swipeRef = useRef<{ active: boolean; x: number; y: number; t: number }>(
    { active: false, x: 0, y: 0, t: 0 }
  );
  const onSwipeStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    if (document.querySelector(".piece-grid-overlay")) return;
    const t = e.touches[0];
    swipeRef.current = { active: true, x: t.clientX, y: t.clientY, t: Date.now() };
  };
  const onSwipeEnd = (e: React.TouchEvent) => {
    if (!swipeRef.current.active) return;
    swipeRef.current.active = false;
    const t = e.changedTouches[0];
    if (!t) return;
    const dx = t.clientX - swipeRef.current.x;
    const dy = t.clientY - swipeRef.current.y;
    const elapsed = Date.now() - swipeRef.current.t;
    if (
      Math.abs(dx) > 48 &&
      Math.abs(dx) > Math.abs(dy) * 1.3 &&
      elapsed < 900
    ) {
      if (dx > 0) goPrev();
      else goNext();
    }
  };

  return (
    <div ref={sectionRef}>
      <SplitLogicPalette
        cells={zoneCells}
        lockedIdx={lockedZoneIdx}
        onCellClick={handleZoneClick}
      />

      {/* Relative wrapper — arrows position:absolute in the margins,
          grid stays exactly its original width. Touch handlers here
          turn a horizontal swipe across the grid into pagination. The
          `is-in-view` class is toggled by the IntersectionObserver
          above; CSS uses it at mobile widths to show the fixed-
          position chevrons only while the grid is on screen. */}
      <div
        className={`sl-pager-region${pagerInView ? " is-in-view" : ""}`}
        ref={pagerRef}
        onTouchStart={onSwipeStart}
        onTouchEnd={onSwipeEnd}
      >
        {totalPages > 1 && (
          <button
            type="button"
            className="sl-pager-step sl-pager-prev"
            onClick={(e) => {
              // Blur after click so the button doesn't keep the
              // post-click focus state — which on some browsers
              // reads visually identical to the hover halo and
              // looks "stuck" until the user moves the mouse.
              e.currentTarget.blur();
              goPrev();
            }}
            aria-label="Previous page"
          >
            ‹
          </button>
        )}

        <PieceGrid items={pageItems} eagerMount wasdNav />

        {totalPages > 1 && (
          <button
            type="button"
            className="sl-pager-step sl-pager-next"
            onClick={(e) => {
              e.currentTarget.blur();
              goNext();
            }}
            aria-label="Next page"
          >
            ›
          </button>
        )}

        {totalPages > 1 && (
          <span
            className="sl-pager-pos"
            aria-label={`Page ${page + 1} of ${totalPages}`}
          >
            {String(page + 1).padStart(2, "0")}
            <span className="sl-pager-sep">/</span>
            {String(totalPages).padStart(2, "0")}
          </span>
        )}
      </div>
    </div>
  );
}
