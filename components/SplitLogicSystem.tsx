"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import {
  colorDistance,
  isUnsuitableForBar,
  type Oklch,
  type WedgeCell,
} from "@/lib/split-logic-color";
import {
  computeSplitLogicBuckets,
  type PieceAssignment,
} from "@/lib/split-logic-buckets";
import { SplitLogicPalette } from "./SplitLogicPalette";
import { PieceGrid, type PieceGridItem } from "./PieceGrid";
import { setHeroAnchorIndex } from "./hero-anchor-store";
import type { ExpandedArtworkItem } from "./ExpandedArtwork";

const PAGE_SIZE = 12;
// Eight 45° hue bins gives a fuller rainbow without crowding the bar.
// The bar may show fewer cells if a bin is empty (e.g., no purple in
// Ricky's series — better an honest 7-cell rainbow than a padded 8-cell
// one with two near-identical blues).
const TWO_PI = Math.PI * 2;
const normHue = (h: number) => ((h % TWO_PI) + TWO_PI) % TWO_PI;

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
  // sl-075 leads sl-015 — put sl-075 first in the group definition
  // so the adjacency post-pass renders it before sl-015 within the
  // cluster. The cluster lands wherever the earliest-sorting member
  // naturally sits.
  ["sl-075", "sl-015", "sl-076", "sl-067", "sl-066", "sl-073", "sl-038", "sl-064", "sl-008", "sl-086", "sl-080"],
  ["sl-036", "sl-033", "sl-034", "sl-044", "sl-028", "sl-092", "sl-058", "sl-018"],
  // sl-075 used to anchor [sl-075, sl-045, sl-042] but now belongs
  // with sl-015 above; sl-045 and sl-042 keep their own pair.
  ["sl-045", "sl-042"],
  // sl-011 inserted right after sl-077; sl-007 stays the anchor.
  ["sl-007", "sl-012", "sl-099", "sl-077", "sl-011", "sl-100", "sl-061", "sl-069", "sl-065", "sl-025", "sl-079", "sl-043", "sl-051", "sl-017", "sl-047", "sl-085"],
  ["sl-009", "sl-056", "sl-053", "sl-014", "sl-090", "sl-068", "sl-084", "sl-048", "sl-023"],
  ["sl-057", "sl-022", "sl-088"],
  ["sl-062", "sl-055", "sl-021", "sl-059", "sl-071", "sl-074", "sl-030", "sl-040", "sl-029", "sl-041", "sl-035", "sl-054", "sl-024"],
  // sl-019 inserted right after sl-097; sl-097 stays the anchor.
  ["sl-097", "sl-019", "sl-089", "sl-083", "sl-039", "sl-031", "sl-032", "sl-081", "sl-082", "sl-091", "sl-026", "sl-052", "sl-072", "sl-005", "sl-006", "sl-010", "sl-060", "sl-046", "sl-050", "sl-063", "sl-016"],
];

// Bar design — see lib/split-logic-buckets.ts for the bucket-derivation
// rules (white / chromatic k-means / rainbow). Each piece gets exactly
// one assignment: "white", "rainbow", or a chromatic centroid index
// (0..k-1, hue-sorted). Default sort respects this assignment; locked
// sort floats matching pieces to the head and ranks within them by
// distance to the centroid so the closest match to the clicked button
// leads.

function rankPriority(a: PieceAssignment): number {
  if (a === "white") return 0;
  if (a === "rainbow") return 1e6;
  return 1 + a;
}

function computeSortedIndices(
  pieceAssignment: PieceAssignment[],
  topClusterLch: Oklch[],
  centroids: Oklch[],
  dominantStrength: number[],
  bucketMass: number[],
  archetypeSimilarities: Record<string, number>,
  cells: WedgeCell[],
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
    const aSim = archetypeSimilarities[cells[a].wedgeId];
    const bSim = archetypeSimilarities[cells[b].wedgeId];
    if (aSim !== undefined && bSim !== undefined && aSim !== bSim) {
      return bSim - aSim;
    }
    if (distToOwn[a] !== distToOwn[b]) return distToOwn[a] - distToOwn[b];
    return topClusterLch[a].L - topClusterLch[b].L;
  });
  return indices;
}

export function SplitLogicSystem({
  cells,
  gridItems,
  archetypeSimilarities = {},
  allArtworks,
}: {
  cells: WedgeCell[];
  gridItems: PieceGridItem[];
  /**
   * Pre-computed cosine similarity of each piece's CLIP embedding to
   * its bucket's archetype, indexed by wedgeId. Computed server-side
   * (see `getSplitLogicArchetypeSimilarities` in lib/split-logic-
   * palette.ts) so the 1MB embeddings file never ships to the
   * browser. Used as the within-bucket sort tiebreak — visually-
   * similar pieces float to the top of the locked view, even when
   * their dominant-hue alignment to the centroid is identical.
   * Optional: if absent, sort falls back to distance-to-centroid.
   */
  archetypeSimilarities?: Record<string, number>;
  /**
   * Page-wide artwork collection (hero + inline + piece grid items in
   * document order) used to map the piece-grid lightbox's close-item
   * back to an index in the canonical hero memory store. Without it,
   * piece-grid closes can't update the hero. Only passed for Split
   * Logic.
   */
  allArtworks?: ExpandedArtworkItem[];
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

  // Bar zones derived in one shot via the shared helper — see
  // lib/split-logic-buckets.ts for the full pipeline (white surfacing,
  // weighted k-means on chromatic pieces, rainbow shortcut). Single
  // source of truth shared with the server-side archetype-similarity
  // pre-computation; both sides see the same bucket assignment.
  const { zoneCells, zoneKeys, pieceAssignment, centroids } = useMemo(
    () => computeSplitLogicBuckets(cells),
    [cells],
  );

  useEffect(() => {
    if (initialLockAppliedRef.current) return;
    if (zoneKeys.length === 0) return;
    const whiteIdx = zoneKeys.indexOf("white");
    initialLockAppliedRef.current = true;
    if (whiteIdx >= 0) setLockedZoneIdx(whiteIdx);
  }, [zoneKeys]);

  // Warm the poster cache for every piece in the series, idle-time,
  // once per mount. PieceGrid's 650ms `autoPreload` defer means a
  // freshly-mounted cell relies entirely on its poster image to look
  // "filled" for the first ~half-second after a colour-lock or page
  // change. If that poster has to round-trip the network mid-
  // transition the cell reads as a blank box for hundreds of ms —
  // the "weird load-in" symptom. With every poster prefetched into
  // browser cache up front, the swap renders the still frame
  // instantly and the video stream catches up underneath.
  //
  // Cost is bounded by the series size (100 pieces × ~80KB poster =
  // <10MB once, then immutable-cached forever by our Cache-Control
  // headers). Skipped on Save-Data and 2G — those users would rather
  // pay the per-swap stutter than burn 10MB upfront.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (gridItems.length === 0) return;
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType === "slow-2g" || conn?.effectiveType === "2g") return;

    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      for (const item of gridItems) {
        if (!item.poster) continue;
        const img = new Image();
        img.src = item.poster;
      }
    };

    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const w = window as IdleWindow;
    let idleId: number | null = null;
    let timerId: number | null = null;
    if (w.requestIdleCallback) {
      idleId = w.requestIdleCallback(start, { timeout: 2000 });
    } else {
      timerId = window.setTimeout(start, 500);
    }
    return () => {
      cancelled = true;
      if (idleId !== null && w.cancelIdleCallback) w.cancelIdleCallback(idleId);
      if (timerId !== null) window.clearTimeout(timerId);
    };
  }, [gridItems]);

  const lockedAssignment: PieceAssignment | null =
    lockedZoneIdx !== null && lockedZoneIdx < zoneKeys.length
      ? zoneKeys[lockedZoneIdx]
      : null;

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
      archetypeSimilarities,
      cells,
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
  }, [cells, pieceAssignment, piecePrimaries, centroids, archetypeSimilarities, lockedAssignment]);

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

  // Full sorted list — passed to PieceGrid as `lightboxItems` so the
  // lightbox cycles through every piece in the active sort order,
  // not just the 12 visible on the current page. Tap any artwork on
  // any page → lightbox opens at that piece and prev/next walks the
  // whole series in current-sort order.
  const fullSortedItems = useMemo(
    () => sortedIndices.map((i) => gridItems[i]),
    [sortedIndices, gridItems],
  );

  // Single animation lock shared by pagination AND colour-lock
  // changes. PieceGrid runs a 550ms FLIP + opacity animation on
  // every items prop change; stacking two mid-flight leaves motion's
  // internal state inconsistent (cells stuck at opacity 0 / blank
  // grid until reload). The lockout window matches that duration
  // plus a small buffer so taps during the transition are dropped
  // rather than queued.
  const pageLockRef = useRef(false);

  const handleZoneClick = (i: number) => {
    // No toggle-to-null — the system stays LOCKED at all times. The
    // page opens locked on white, and every swatch click just moves
    // the lock to that swatch. Clicking the currently-locked
    // swatch is a no-op (already locked there).
    if (pageLockRef.current) return;
    if (i === lockedZoneIdx) return;
    pageLockRef.current = true;
    setLockedZoneIdx(i);
    setPage(0);
    window.setTimeout(() => {
      pageLockRef.current = false;
    }, 600);
  };

  // Live-sync the piece-grid lightbox's current item to the hero
  // anchor store. Mapping is by video URL since the piece-grid
  // tracks its own sort-order indices, which don't line up with
  // the page-wide allArtworks order.
  const onPieceLightboxItemChange = useCallback(
    (item: PieceGridItem) => {
      if (!allArtworks) return;
      const idx = allArtworks.findIndex((a) => a.video === item.video);
      if (idx > 0) setHeroAnchorIndex(idx);
    },
    [allArtworks],
  );

  // Both directions wrap — paging through the series is a loop, not a
  // bounded list with dead ends. From page 0 the left arrow takes you
  // to the last page; from the last page the right arrow returns to 0.
  // No auto-scroll: if the user is using the pager, they're already
  // looking at the grid; scrollIntoView would only push the colour
  // bar under the page nav and disorient them. Gated by the shared
  // pageLockRef defined above so rapid clicks can't pile up.
  const guardedSetPage = useCallback((updater: (p: number) => number) => {
    if (pageLockRef.current) return;
    pageLockRef.current = true;
    setPage(updater);
    window.setTimeout(() => {
      pageLockRef.current = false;
    }, 600);
  }, []);

  const goPrev = useCallback(() => {
    guardedSetPage((p) => (p - 1 + totalPages) % totalPages);
  }, [guardedSetPage, totalPages]);

  const goNext = useCallback(() => {
    guardedSetPage((p) => (p + 1) % totalPages);
  }, [guardedSetPage, totalPages]);

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

        <PieceGrid
          items={pageItems}
          lightboxItems={fullSortedItems}
          eagerMount
          wasdNav
          snappySwipe
          onItemChange={onPieceLightboxItemChange}
        />

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
