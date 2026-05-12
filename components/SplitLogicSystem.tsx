"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import {
  colorDistance,
  isUnsuitableForBar,
  kmeansWeighted,
  oklchToHex,
  pickDistinctIndices,
  signatureFromHex,
  type WedgeCell,
  type WeightedSample,
} from "@/lib/split-logic-color";
import { SplitLogicPalette } from "./SplitLogicPalette";
import { PieceGrid, type PieceGridItem } from "./PieceGrid";

const PAGE_SIZE = 12;
// Eight zones gives a fuller rainbow without crowding the bar — six
// always left a gap between green and blue or between red and orange.
const ZONE_COUNT = 8;

function computeSortedIndices(
  cells: WedgeCell[],
  lockedZoneIdx: number | null,
  inZoneWeights: number[][],
  primaryZone: number[],
): number[] {
  const n = cells.length;
  const indices = Array.from({ length: n }, (_, i) => i);

  if (lockedZoneIdx === null) {
    // Default order: bucket pieces by their primary zone, then within
    // each bucket sort by how strongly they belong (in-zone weight
    // desc). Two pieces that both register as "blue zone" will always
    // end up adjacent — that's the property the old single-hue sort
    // failed to guarantee, because a piece's vibrance-weighted mean
    // could drift hue under different ink/ground proportions even
    // when the piece looked indistinguishable to the eye.
    indices.sort((a, b) => {
      const za = primaryZone[a];
      const zb = primaryZone[b];
      if (za !== zb) return za - zb;
      return inZoneWeights[b][zb] - inZoneWeights[a][za];
    });
    return indices;
  }

  // Locked-zone sort: rank by how much of each piece's colour mass
  // lives in the locked zone. A piece that's 60% blue + 40% red
  // beats a piece that's 30% blue + 70% red on a "blue" lock — the
  // pieces that read most strongly as the locked colour come first,
  // and pieces with no clusters in that zone (weight 0) fall to the
  // end of the run. Two visually similar blue pieces will always be
  // adjacent because their in-zone weights are similar.
  indices.sort((a, b) => {
    return inZoneWeights[b][lockedZoneIdx] - inZoneWeights[a][lockedZoneIdx];
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

  // Bar zones — Material-You / Vibrant.js-inspired pipeline:
  //   1. POOL every wedge's per-image clusters (5 per piece) into one
  //      weighted sample set. Population × chroma per cluster —
  //      saturated tones pull harder than dim ones. The key shift
  //      from the old single-mean-per-piece input: a red+blue piece
  //      contributes both red and blue clusters instead of muddying
  //      the pool with their average.
  //   2. FILTER aggressively — drop neutrals (C < 0.10), browns,
  //      and extreme luminance (near-black/white). The bar should be
  //      firmly chromatic; a dusty grey-blue or charcoal in the row
  //      reads as a gap.
  //   3. WEIGHTED K-MEANS on the filtered pool, OVER-CLUSTERED at
  //      k = ZONE_COUNT * 2. K-means alone clumps centroids in dense
  //      regions — when the series leans heavily on green, two
  //      centroids land side-by-side in the green family and the bar
  //      gets two near-identical green buttons.
  //   4. FARTHEST-FIRST PICK ZONE_COUNT from the over-clustered set.
  //      Guarantees the chosen zones are mutually perceptually
  //      distinct — a button is also a UI control, and two cells the
  //      eye can't tell apart make for two clicks that confuse the
  //      user. Representativeness comes from k-means; distinctness
  //      comes from farthest-first.
  //   5. HUE SORT the chosen zones, normalized to [0, 2π) so the
  //      rainbow anchors at red and proceeds red → orange → yellow →
  //      green → cyan → blue → purple → magenta. Without
  //      normalization the raw atan2 range (-π, π] splits the wheel
  //      between magenta and cyan at the bar's two ends.
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
    const pickedIdxs = pickDistinctIndices(overCentroids, ZONE_COUNT);
    const picked = pickedIdxs.map((i) => overCentroids[i]);
    const TWO_PI = Math.PI * 2;
    const norm = (h: number) => ((h % TWO_PI) + TWO_PI) % TWO_PI;
    picked.sort((a, b) => norm(a.h) - norm(b.h));
    return picked.map((lch, i) => {
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

  // Per-piece zone-membership profile.
  //   inZoneWeights[pieceIdx][zoneIdx] = sum of cluster weights in
  //     that piece whose nearest zone is `zoneIdx`.
  //   primaryZone[pieceIdx] = argmax over zones of the above.
  //
  // This is what pairs visually similar pieces: two pieces dominated
  // by light blue both have their cluster mass land nearest the
  // "blue" zone centroid → both get primaryZone = blue → both end up
  // adjacent in the default sort. The old sort, which used each
  // piece's single vibrance-weighted mean, would split them apart
  // whenever their mean hues drifted slightly (e.g. one piece's blue
  // ground had more black ink mixed in than the other's).
  const pieceZoneInfo = useMemo(() => {
    const numZones = zoneCells.length;
    const inZoneWeights: number[][] = [];
    const primaryZone: number[] = [];
    for (const cell of cells) {
      const w = new Array(numZones).fill(0);
      for (const cluster of cell.clusters) {
        if (isUnsuitableForBar(cluster.lch)) continue;
        let nearest = 0;
        let minD = Infinity;
        for (let z = 0; z < numZones; z++) {
          const d = colorDistance(cluster.lch, zoneCells[z].clusters[0].lch);
          if (d < minD) { minD = d; nearest = z; }
        }
        w[nearest] += cluster.weight;
      }
      let bestZ = 0;
      let bestW = -Infinity;
      for (let z = 0; z < numZones; z++) {
        if (w[z] > bestW) { bestW = w[z]; bestZ = z; }
      }
      inZoneWeights.push(w);
      primaryZone.push(bestZ);
    }
    return { inZoneWeights, primaryZone };
  }, [cells, zoneCells]);

  const sortedIndices = useMemo(
    () =>
      computeSortedIndices(
        cells,
        lockedZoneIdx,
        pieceZoneInfo.inZoneWeights,
        pieceZoneInfo.primaryZone,
      ),
    [cells, lockedZoneIdx, pieceZoneInfo],
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
