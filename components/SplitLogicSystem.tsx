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
const ZONE_COUNT = 8;
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
  ["sl-007", "sl-012"],
  ["sl-049", "sl-037", "sl-027", "sl-087"],
  ["sl-013", "sl-093"],
  ["sl-078", "sl-070", "sl-020"],
  ["sl-060", "sl-046", "sl-050", "sl-063"],
  ["sl-015", "sl-008"],
];

function computeSortedIndices(
  cells: WedgeCell[],
  lockedZoneIdx: number | null,
  topHueNorm: number[],
  topClusterDistToLocked: number[] | null,
  isRainbow: boolean[],
): number[] {
  const n = cells.length;
  const indices = Array.from({ length: n }, (_, i) => i);

  // Rainbow pieces (multi-colour mosaics that span 3+ hue families)
  // always cluster together at the end of the grid, regardless of
  // sort. They're a "rainbow trait" that breaks cohesion if
  // interleaved — a piece that's 20% red, 20% green, 20% blue, 20%
  // yellow has no business appearing inside the run of red-dominant
  // pieces just because it has some red. Better to have them as a
  // distinct block the eye can read as "and these are the
  // multicolour ones."
  const partition = (a: number, b: number) => {
    if (isRainbow[a] !== isRainbow[b]) return isRainbow[a] ? 1 : -1;
    return 0;
  };

  if (lockedZoneIdx === null) {
    // Default: rainbow pieces last; non-rainbow sorted by top-weight
    // cluster hue for a smooth gradient. The top cluster doesn't
    // drift the way a vibrance-weighted single mean does, so two
    // visually similar light-blue pieces sort adjacent.
    indices.sort((a, b) => {
      const p = partition(a, b);
      if (p !== 0) return p;
      return topHueNorm[a] - topHueNorm[b];
    });
    return indices;
  }

  // Locked: rank non-rainbow pieces by distance from their TOP
  // cluster (their dominant colour) to the locked zone centroid.
  // The earlier in-zone-weight ranking gave a piece credit for
  // having one tiny green tile in an otherwise red composition —
  // the "wrong" piece showed up second when locking on green. Using
  // the top cluster instead means a piece must be DOMINATED by the
  // locked colour to rank high; a yellow-dominant piece with a
  // green tile sits with the other yellow-dominant pieces, far
  // from the head of the green-locked view.
  const dist = topClusterDistToLocked!;
  indices.sort((a, b) => {
    const p = partition(a, b);
    if (p !== 0) return p;
    return dist[a] - dist[b];
  });
  return indices;
}

export function SplitLogicSystem({
  cells,
  gridItems,
}: {
  cells: WedgeCell[];
  gridItems: PieceGridItem[];
}) {
  const [lockedZoneIdx, setLockedZoneIdx] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const total = gridItems.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Bar zones — pipeline:
  //   1. POOL every wedge's per-image clusters (5 per piece) into one
  //      weighted sample set. Population × chroma per cluster — a
  //      red+blue piece contributes both red and blue clusters
  //      instead of being collapsed to a muddy average.
  //   2. FILTER — drop neutrals (C < 0.10), browns, and extreme
  //      luminance. The bar must read as firmly chromatic.
  //   3. OVER-CLUSTER with weighted k-means (k = ZONE_COUNT * 2 = 16),
  //      so the colour space is finely sampled.
  //   4. PARTITION the pool to nearest centroid and accumulate the
  //      true total weight per centroid (population × chroma sum).
  //   5. WEIGHT-ORDERED GREEDY PICK with a minimum-distance gate.
  //      Walk centroids heaviest-first; accept each only if it's at
  //      least MIN_DIST from every already-picked centroid. This
  //      gives both representativeness (heaviest = real colour mass)
  //      and distinctness (gate rejects the second forest-green when
  //      a brighter lime already sits in the bar). Farthest-first
  //      would have done the opposite — picking edge cases nobody
  //      could click meaningfully on.
  //      If the gate is too tight to fill ZONE_COUNT slots, relax
  //      it iteratively until we do.
  //   6. HUE SORT, normalized to [0, 2π) so the rainbow anchors at
  //      red and proceeds red → orange → yellow → green → cyan →
  //      blue → purple → magenta. Raw atan2 (-π, π] would split the
  //      wheel between magenta and cyan at the bar's two ends.
  const zoneCells = useMemo<WedgeCell[]>(() => {
    const pool: WeightedSample[] = [];
    for (const cell of cells) {
      for (const cluster of cell.clusters) {
        if (isUnsuitableForBar(cluster.lch)) continue;
        pool.push({ lch: cluster.lch, weight: cluster.weight });
      }
    }
    if (pool.length === 0) return [];

    const overK = Math.min(ZONE_COUNT * 2, pool.length);
    const overCentroids = kmeansWeighted(pool, overK);

    // Compute true weight per centroid by partitioning the pool.
    const centroidWeights = new Array(overCentroids.length).fill(0);
    for (const sample of pool) {
      let nearest = 0;
      let minD = Infinity;
      for (let i = 0; i < overCentroids.length; i++) {
        const d = colorDistance(sample.lch, overCentroids[i]);
        if (d < minD) { minD = d; nearest = i; }
      }
      centroidWeights[nearest] += sample.weight;
    }

    // Hue-binning: divide the colour wheel into ZONE_COUNT (= 8)
    // equal 45° bins, then pick the heaviest centroid in each bin.
    //
    // Why bins instead of a greedy hue-distance gate: a relaxing gate
    // sneaks duplicates back in whenever it can't fill 8 cells with
    // the tight gate. Fixed bins are categorical — two greens at 135°
    // and 145° both land in the same bin, only the heavier one wins;
    // there's no "oops, we needed more cells, let's lower the gate"
    // failure mode. The bar may end up with fewer than ZONE_COUNT
    // cells if a bin is empty (e.g., no purple in this series), and
    // that's the right answer: better an honest 7-cell bar than a
    // padded 8-cell one with two near-identical blues.
    //
    // Bin layout (45° each):
    //   0 [  0°,  45°): reds + coral
    //   1 [ 45°,  90°): orange / amber
    //   2 [ 90°, 135°): yellow / yellow-green
    //   3 [135°, 180°): green
    //   4 [180°, 225°): cyan / teal
    //   5 [225°, 270°): blue
    //   6 [270°, 315°): purple / violet
    //   7 [315°, 360°): magenta / pink
    const BIN_WIDTH = TWO_PI / ZONE_COUNT;
    const binPicks: (typeof overCentroids[number] | null)[] =
      new Array(ZONE_COUNT).fill(null);
    const binWeights = new Array(ZONE_COUNT).fill(-Infinity);
    for (let i = 0; i < overCentroids.length; i++) {
      const bin = Math.min(
        ZONE_COUNT - 1,
        Math.floor(normHue(overCentroids[i].h) / BIN_WIDTH),
      );
      if (centroidWeights[i] > binWeights[bin]) {
        binWeights[bin] = centroidWeights[i];
        binPicks[bin] = overCentroids[i];
      }
    }

    const pickedLch: typeof overCentroids = [];
    for (let b = 0; b < ZONE_COUNT; b++) {
      const p = binPicks[b];
      if (p !== null) pickedLch.push(p);
    }
    // pickedLch is already in bin (= hue) order by construction.

    return pickedLch.map((lch, i) => {
      const hex = oklchToHex(lch);
      return {
        hex,
        palette: [hex],
        signature: signatureFromHex(hex),
        clusters: [{ lch, weight: 1 }],
        wedgeId: `cluster-${i}`,
      };
    });
  }, [cells]);

  // Per-piece colour profile.
  //   topHueNorm[i]   = hue of piece i's heaviest chromatic cluster,
  //                     normalized to [0, 2π) for the rainbow gradient.
  //   topClusterLch[i] = the full Oklch of that heaviest cluster —
  //                     used by the locked sort for distance-to-zone
  //                     ranking. Using the dominant colour (not the
  //                     piece's full pixel distribution) means a piece
  //                     must actually be dominated by the locked
  //                     colour to rank high; a stray green tile in a
  //                     yellow piece won't pull it into the green
  //                     view.
  //   isRainbow[i]    = piece is in the curated RAINBOW_IDS set.
  //                     These pieces have small amounts of every
  //                     colour and would otherwise leak into every
  //                     locked-zone view, breaking grid cohesion.
  //                     Bucketed together at the end of every sort.
  const piecePrimaries = useMemo(() => {
    const topHueNorm: number[] = [];
    const topClusterLch: Oklch[] = [];
    const isRainbow: boolean[] = [];
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
      // Fallback for an all-neutral piece — use the first cluster.
      if (topW === -Infinity && cell.clusters.length > 0) {
        topLch = cell.clusters[0].lch;
      }

      topHueNorm.push(normHue(topLch.h));
      topClusterLch.push(topLch);
      isRainbow.push(RAINBOW_IDS.has(cell.wedgeId));
    }
    return { topHueNorm, topClusterLch, isRainbow };
  }, [cells]);

  // Distance from each piece's TOP (dominant) cluster to the locked
  // zone's centroid. Recomputed when the lock changes; null otherwise.
  const topClusterDistToLocked = useMemo<number[] | null>(() => {
    if (lockedZoneIdx === null) return null;
    if (zoneCells.length === 0) return null;
    const targetLch = zoneCells[lockedZoneIdx].clusters[0].lch;
    return piecePrimaries.topClusterLch.map((lch) =>
      colorDistance(lch, targetLch),
    );
  }, [piecePrimaries, zoneCells, lockedZoneIdx]);

  const sortedIndices = useMemo(() => {
    const sorted = computeSortedIndices(
      cells,
      lockedZoneIdx,
      piecePrimaries.topHueNorm,
      topClusterDistToLocked,
      piecePrimaries.isRainbow,
    );
    // Adjacency post-pass — pull every group member into a contiguous
    // run, anchored at the position of the first member found in the
    // current sort. Members later in the sort are spliced out and
    // re-inserted right after the anchor, preserving relative order.
    if (ADJACENCY_GROUPS.length === 0) return sorted;
    const result = sorted.slice();
    for (const group of ADJACENCY_GROUPS) {
      const positions: number[] = [];
      for (let i = 0; i < result.length; i++) {
        if (group.includes(cells[result[i]].wedgeId)) positions.push(i);
      }
      if (positions.length < 2) continue;
      const anchor = positions[0];
      const movers: number[] = [];
      for (let i = positions.length - 1; i > 0; i--) {
        movers.unshift(result[positions[i]]);
        result.splice(positions[i], 1);
      }
      result.splice(anchor + 1, 0, ...movers);
    }
    return result;
  }, [cells, lockedZoneIdx, piecePrimaries, topClusterDistToLocked]);

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

  // Drives the fixed-position chevrons on mobile. Uses a ratio
  // threshold (≥40% of the pager region in viewport) so the chevrons
  // only appear once the grid actually dominates the screen — not
  // when only the top edge is peeking up from below or sliding off
  // the bottom past the colour bar above.
  const pagerRef = useRef<HTMLDivElement>(null);
  const [pagerInView, setPagerInView] = useState(false);
  useEffect(() => {
    const el = pagerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setPagerInView(entry.intersectionRatio >= 0.4),
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Keyboard pagination — ArrowLeft/Right move between pages while the
  // grid is in view. Skip when the lightbox overlay is mounted (it has
  // its own ArrowLeft/Right handler for prev/next artwork) and skip
  // when the user is typing in a form field.
  useEffect(() => {
    if (totalPages <= 1) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
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
      if (e.key === "ArrowLeft") goPrev();
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

        <PieceGrid items={pageItems} />

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
