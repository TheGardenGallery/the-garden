"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import {
  colorDistance,
  isUnsuitableForBar,
  kmeansWeighted,
  oklchToHex,
  signatureFromHex,
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

function computeSortedIndices(
  cells: WedgeCell[],
  lockedZoneIdx: number | null,
  topHueNorm: number[],
  inZoneWeights: number[][],
  distToLockedZone: number[] | null,
): number[] {
  const n = cells.length;
  const indices = Array.from({ length: n }, (_, i) => i);

  if (lockedZoneIdx === null) {
    // Default order: smooth rainbow gradient by each piece's
    // top-weight cluster hue (normalized to [0, 2π)).
    //
    // The signal change vs. the old single-mean-hue sort: a piece's
    // dominant cluster is the largest contiguous colour mass; it
    // doesn't shift when ink-to-ground ratio drifts the way a
    // vibrance-weighted RGB mean does. Two visually identical light-
    // blue pieces both have light-blue as their top cluster → both
    // sort to the same place in the rainbow → adjacent in the grid.
    indices.sort((a, b) => topHueNorm[a] - topHueNorm[b]);
    return indices;
  }

  // Locked sort: pieces with the most cluster mass in the locked
  // zone come first. A piece that's 60% blue + 40% red beats a
  // piece that's 30% blue + 70% red when blue is locked.
  // Tiebreak by minimum colour distance to the zone centroid so
  // equal-weight pieces (e.g. both have 0 weight here) still order
  // sensibly — the closest visually-similar pieces win the tie
  // instead of falling back to original array order.
  const dist = distToLockedZone!;
  indices.sort((a, b) => {
    const wa = inZoneWeights[a][lockedZoneIdx];
    const wb = inZoneWeights[b][lockedZoneIdx];
    if (wa !== wb) return wb - wa;
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

  // Per-piece colour profile used by both the default rainbow sort
  // and the locked-zone sort.
  //   topHueNorm[i]  = hue of piece i's heaviest cluster, normalized
  //                    to [0, 2π) so the rainbow anchors at red.
  //   inZoneWeights[i][z] = sum of cluster weights in piece i whose
  //                    nearest zone centroid is z. Drives the locked
  //                    sort — pieces with most blue cluster mass come
  //                    first when the blue zone is locked.
  const piecePrimaries = useMemo(() => {
    const numZones = zoneCells.length;
    const topHueNorm: number[] = [];
    const inZoneWeights: number[][] = [];
    for (const cell of cells) {
      let topW = -Infinity;
      let topH = 0;
      const w = new Array(numZones).fill(0);
      for (const cluster of cell.clusters) {
        if (isUnsuitableForBar(cluster.lch)) continue;
        if (cluster.weight > topW) {
          topW = cluster.weight;
          topH = cluster.lch.h;
        }
        if (numZones > 0) {
          let nearest = 0;
          let minD = Infinity;
          for (let z = 0; z < numZones; z++) {
            const d = colorDistance(cluster.lch, zoneCells[z].clusters[0].lch);
            if (d < minD) { minD = d; nearest = z; }
          }
          w[nearest] += cluster.weight;
        }
      }
      // Fallback for an all-neutral piece: use cell.hex's hue, which
      // is the single vibrance-weighted mean — better than 0.
      if (topW === -Infinity && cell.clusters.length > 0) {
        topH = cell.clusters[0].lch.h;
      }
      topHueNorm.push(normHue(topH));
      inZoneWeights.push(w);
    }
    return { topHueNorm, inZoneWeights };
  }, [cells, zoneCells]);

  // Per-piece distance to the currently-locked zone (used as the
  // locked-sort tiebreak so equal-weight pieces still order sensibly).
  // Recomputed when the lock changes; null when nothing is locked.
  const distToLockedZone = useMemo<number[] | null>(() => {
    if (lockedZoneIdx === null) return null;
    if (zoneCells.length === 0) return null;
    const targetLch = zoneCells[lockedZoneIdx].clusters[0].lch;
    return cells.map((cell) => {
      let minD = Infinity;
      for (const cluster of cell.clusters) {
        const d = colorDistance(cluster.lch, targetLch);
        if (d < minD) minD = d;
      }
      return minD === Infinity ? 999 : minD;
    });
  }, [cells, zoneCells, lockedZoneIdx]);

  const sortedIndices = useMemo(
    () =>
      computeSortedIndices(
        cells,
        lockedZoneIdx,
        piecePrimaries.topHueNorm,
        piecePrimaries.inZoneWeights,
        distToLockedZone,
      ),
    [cells, lockedZoneIdx, piecePrimaries, distToLockedZone],
  );

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
