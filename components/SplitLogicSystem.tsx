"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import {
  hexToOklch,
  isUnsuitableForBar,
  kmeansWeighted,
  oklchToHex,
  signatureDistance,
  signatureFromHex,
  type WedgeCell,
  type Oklch,
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
  lchs: Oklch[],
  lockedZoneIdx: number | null,
  zoneCells: WedgeCell[],
): number[] {
  const n = cells.length;
  const indices = Array.from({ length: n }, (_, i) => i);

  if (lockedZoneIdx === null) {
    // Default order: a coherent hue spectrum, dark to light within
    // each hue. Reads as a rainbow rather than a random shuffle when
    // the page first loads.
    indices.sort((a, b) => {
      const ha = lchs[a].h;
      const hb = lchs[b].h;
      if (Math.abs(ha - hb) > 0.01) return ha - hb;
      return lchs[b].L - lchs[a].L;
    });
    return indices;
  }

  // Locked-zone sort: rank by distance between each piece's full
  // colour-distribution embedding and a synthetic single-pixel
  // embedding of the locked zone's hex. The shared hue histogram +
  // L/C means a sage-leaning piece beats a brick-and-jade piece for
  // a "sage" lock, even if the brick piece has one near-identical
  // pixel — which the old min-distance metric would have rewarded.
  const target = signatureFromHex(zoneCells[lockedZoneIdx].hex);
  const distances = cells.map((c) => signatureDistance(c.signature, target));
  indices.sort((a, b) => distances[a] - distances[b]);
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

  const lchs = useMemo(() => cells.map((c) => hexToOklch(c.hex)), [cells]);
  // Bar zones — Material-You / Vibrant.js-inspired pipeline:
  //   1. POOL every wedge's per-image clusters (5 per piece) into one
  //      weighted sample set. Each cluster carries its piece's
  //      population × chroma — saturated tones pull harder than dim
  //      ones. This is the key shift from the old single-mean-per-piece
  //      input: a red+blue piece now contributes both red and blue
  //      clusters instead of muddying the pool with their average.
  //   2. FILTER aggressively — drop neutrals (C < 0.10), browns,
  //      and extreme luminance (near-black/white). The bar should be
  //      firmly chromatic; a dusty grey-blue or charcoal in the row
  //      reads as a gap.
  //   3. WEIGHTED K-MEANS on the filtered pool, k = ZONE_COUNT (8).
  //      Each cluster's pull is scaled by its weight so the centroids
  //      land where the series' colour mass actually concentrates.
  //   4. HUE SORT the centroids — produces a true left-to-right
  //      rainbow rather than a dark→light gradient. Reds on one end,
  //      violets on the other, no neutrals anywhere.
  const zoneCells = useMemo<WedgeCell[]>(() => {
    const pool: WeightedSample[] = [];
    for (const cell of cells) {
      for (const cluster of cell.clusters) {
        if (isUnsuitableForBar(cluster.lch)) continue;
        pool.push({ lch: cluster.lch, weight: cluster.weight });
      }
    }
    if (pool.length === 0) return [];
    const centroids = kmeansWeighted(pool, ZONE_COUNT);
    // Sort by hue, normalized to [0, 2π) so the rainbow anchors at
    // red (~0.5 rad) and proceeds red → orange → yellow → green →
    // cyan → blue → purple → magenta. Without normalization the raw
    // atan2 range (-π, π] would split the wheel between magenta and
    // cyan and put them at opposite ends of the bar — visually wrong.
    const TWO_PI = Math.PI * 2;
    const norm = (h: number) => ((h % TWO_PI) + TWO_PI) % TWO_PI;
    centroids.sort((a, b) => norm(a.h) - norm(b.h));
    return centroids.map((lch, i) => {
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

  const sortedIndices = useMemo(
    () => computeSortedIndices(cells, lchs, lockedZoneIdx, zoneCells),
    [cells, lchs, lockedZoneIdx, zoneCells]
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
