"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ExpandedArtwork } from "./ExpandedArtwork";

export type PieceGridItem = {
  video: string;
  poster: string;
  alt?: string;
};

export function PieceGrid({
  items,
  lightboxItems,
  cellOrder,
  eagerMount = false,
  wasdNav = false,
  snappySwipe = false,
  onClose,
}: {
  items: PieceGridItem[];
  /**
   * Optional larger pool the lightbox cycles through when prev/next
   * is pressed. `items` controls what cells get rendered on screen
   * (typically the current page), while `lightboxItems` is the
   * complete sorted collection so the user can navigate through the
   * whole series from inside the lightbox without paginating the
   * grid. When omitted, the lightbox cycles through `items` only.
   * Clicked cells are looked up in lightboxItems by video URL to
   * start cycling from the correct index.
   */
  lightboxItems?: PieceGridItem[];
  /**
   * Optional per-item visual order. `cellOrder[i]` gives the CSS `order`
   * value for the i-th item — the React array stays stable (so videoRefs,
   * mounted, and expanded indices keep pointing at the right piece) while
   * cells visually reflow. motion's `layout` prop FLIPs them between
   * positions instead of teleporting.
   */
  cellOrder?: number[];
  /**
   * When true, every cell mounts its <video> on initial render with
   * preload="auto" rather than swapping in only after first hover.
   * The hover then triggers .play() on already-buffered media, so the
   * artwork starts moving the instant the cursor lands — no metadata
   * fetch + decode pause. Bandwidth heavier (12 videos × 100-500KB =
   * ~3-6MB up front per page), so reserved for pages where the
   * piece-grid is the editorial centerpiece (Ricky's Split Logic).
   * Default false preserves the lighter hover-mount behaviour for
   * every other exhibition.
   */
  eagerMount?: boolean;
  /**
   * When true, the lightbox accepts A/D in addition to the standard
   * ArrowLeft/ArrowRight for prev/next-artwork navigation. Opted into
   * only by pages whose grid is paired with a sibling A/D pagination
   * (Split Logic), so the WASD muscle-memory is consistent between
   * paging the grid and stepping through the lightbox stack.
   */
  wasdNav?: boolean;
  /**
   * Forwards to ExpandedArtwork's `snappySwipe` — see that prop's doc.
   * On heavy-rotation grids the cinematic 200ms commit delay eats
   * rapid swipes; opting in roughly halves flick-to-next time and
   * stops the commit gate from silently dropping the second flick.
   */
  snappySwipe?: boolean;
  /**
   * Fires once when the lightbox closes, with the item from
   * `lightboxItems` (or `items`) that was last open. Lets a parent
   * remember the visitor's place — e.g. Split Logic's hero anchor —
   * without PieceGrid having to know about any specific memory.
   */
  onClose?: (item: PieceGridItem) => void;
}) {
  const [expanded, setExpanded] = useState<number | null>(null);
  // Mirrors ZoomCatcher's pattern: the last-open index is captured
  // here so we can hand the item back to onClose on the close
  // transition (by the time the effect fires, `expanded` is null).
  const lastExpandedRef = useRef<number | null>(null);
  // Hover/mount state is keyed by the piece's stable video URL rather
  // than its current array index. The Split Logic system reshuffles
  // the items array when a colour zone is locked; tracking by index
  // would mean the cell at slot 0 inherits whatever was last hovered
  // there, even though it's now a completely different piece.
  const [hovered, setHovered] = useState<string | null>(null);
  const [mounted, setMounted] = useState<Set<string>>(new Set());
  // Defer upgrading eager-mount cells from preload="metadata" to
  // preload="auto" until the page/shuffle transition settles. Without
  // this gate, every items-array change kicks off 12 simultaneous
  // full-data fetches mid-animation — bandwidth + decoder thrash
  // that registers as the "glitch" feel during pagination and colour
  // locks. After the layout animation completes (~600ms), upgrade
  // preload so subsequent hovers play instantly from buffered data.
  const [autoPreload, setAutoPreload] = useState(false);
  useEffect(() => {
    if (!eagerMount) return;
    setAutoPreload(false);
    const t = window.setTimeout(() => setAutoPreload(true), 650);
    return () => window.clearTimeout(t);
  }, [items, eagerMount]);
  // Mirror the homepage hero's left/right arrow zones — the prev/next
  // controls fade in only when the mouse is near the corresponding
  // edge of the overlay.
  const [arrowZone, setArrowZone] = useState<null | "left" | "right">(null);
  const reduced = useReducedMotion();
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  // The lightbox cycles through `lightboxItems` if provided (the full
  // sorted collection), otherwise falls back to `items` (the current
  // page). All `expanded` indices below refer to lightboxList.
  const lightboxList = lightboxItems ?? items;

  const prev = useCallback(() => {
    setExpanded((cur) =>
      cur === null
        ? null
        : (cur - 1 + lightboxList.length) % lightboxList.length,
    );
  }, [lightboxList.length]);
  const next = useCallback(() => {
    setExpanded((cur) =>
      cur === null ? null : (cur + 1) % lightboxList.length,
    );
  }, [lightboxList.length]);

  // Click handler: translate the clicked cell's position in `items`
  // into the equivalent position in lightboxList, so prev/next picks
  // up the cycle from the artwork the user actually tapped.
  const openLightbox = useCallback(
    (cellIndex: number) => {
      if (lightboxList === items) {
        setExpanded(cellIndex);
        return;
      }
      const it = items[cellIndex];
      if (!it) return;
      const idx = lightboxList.findIndex((x) => x.video === it.video);
      setExpanded(idx >= 0 ? idx : 0);
    },
    [items, lightboxList],
  );

  // Publish the last-viewed item when the lightbox closes. Captures
  // `expanded` into a ref while open so the close transition can hand
  // the item to onClose (by then `expanded` is already null).
  useEffect(() => {
    if (expanded !== null) {
      lastExpandedRef.current = expanded;
      return;
    }
    if (lastExpandedRef.current === null) return;
    const it = lightboxList[lastExpandedRef.current];
    lastExpandedRef.current = null;
    if (it && onClose) onClose(it);
  }, [expanded, lightboxList, onClose]);

  // Overlay-level swipe — fires prev/next when the user swipes
  // anywhere on the lightbox, not just on the artwork. Touches that
  // start on the artwork itself are skipped (ExpandedArtwork's own
  // handlers manage those for pan/preview).
  const swipeRef = useRef({ active: false, startX: 0, startY: 0, startTime: 0, moved: false });
  const skipNextClickRef = useRef(false);

  const onOverlayTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const target = e.target as HTMLElement;
    if (target.closest(".piece-grid-expanded, .piece-nav-btn")) return;
    const t = e.touches[0];
    swipeRef.current = {
      active: true,
      startX: t.clientX,
      startY: t.clientY,
      startTime: Date.now(),
      moved: false,
    };
  };
  const onOverlayTouchMove = (e: React.TouchEvent) => {
    if (!swipeRef.current.active || e.touches.length !== 1) return;
    const t = e.touches[0];
    const dx = t.clientX - swipeRef.current.startX;
    const dy = t.clientY - swipeRef.current.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) swipeRef.current.moved = true;
  };
  const onOverlayTouchEnd = (e: React.TouchEvent) => {
    if (!swipeRef.current.active) return;
    const moved = swipeRef.current.moved;
    swipeRef.current.active = false;
    const t = e.changedTouches[0];
    if (!t) return;
    const dx = t.clientX - swipeRef.current.startX;
    const dy = t.clientY - swipeRef.current.startY;
    const elapsed = Date.now() - swipeRef.current.startTime;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3 && elapsed < 900) {
      if (dx > 0) prev();
      else next();
      skipNextClickRef.current = true;
    } else if (moved) {
      skipNextClickRef.current = true;
    }
  };

  useEffect(() => {
    if (expanded === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      if (k === "Escape") setExpanded(null);
      else if (k === "ArrowLeft" || k === "a" || k === "A") prev();
      else if (k === "ArrowRight" || k === "d" || k === "D") next();
    };
    // Capture-phase so the handler fires before any focused descendant
    // (the overlay button, the artwork's container) could intercept.
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [expanded, prev, next]);

  // Persistent neighbor prefetch — accumulates across swipes instead
  // of being torn down on every navigation. The previous version
  // injected <link rel="preload"> on every expanded change and
  // removed them via cleanup, which on rapid swipes meant downloads
  // were being cancelled mid-flight (the user reported "choppy
  // loading" between artworks). Now: track prefetched indices in a
  // ref, only inject for indices not yet prefetched, and only clean
  // up when the lightbox actually closes. The HTTP cache accumulates
  // across the session so each swipe has a higher chance of hitting
  // already-warmed bytes.
  const prefetchedRef = useRef<Set<number>>(new Set());
  const prefetchLinksRef = useRef<HTMLLinkElement[]>([]);
  useEffect(() => {
    if (expanded === null) {
      // Lightbox closed — clean up all accumulated prefetches.
      prefetchLinksRef.current.forEach((l) => l.remove());
      prefetchLinksRef.current = [];
      prefetchedRef.current = new Set();
      return;
    }
    if (lightboxList.length <= 1) return;
    const ids = [
      expanded,
      (expanded - 1 + lightboxList.length) % lightboxList.length,
      (expanded + 1) % lightboxList.length,
    ];
    ids.forEach((idx) => {
      if (prefetchedRef.current.has(idx)) return;
      const it = lightboxList[idx];
      if (!it) return;
      prefetchedRef.current.add(idx);
      // Poster — instant via Image() cache.
      const img = new Image();
      img.src = it.poster;
      // Video — `<link rel="preload" as="video">` is a browser hint
      // that fetches the resource at high priority and reuses the
      // bytes when the actual <video> mounts with the same URL.
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "video";
      link.href = it.video;
      document.head.appendChild(link);
      prefetchLinksRef.current.push(link);
    });
  }, [expanded, lightboxList]);

  // Drive play/pause on the mounted cell videos. Only the currently
  // hovered cell plays; everything else stays paused at its last
  // frame. While anything is expanded, all cells pause.
  useEffect(() => {
    videoRefs.current.forEach((video, key) => {
      if (expanded === null && hovered === key) {
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => {});
        }
      } else {
        video.pause();
      }
    });
  }, [hovered, expanded]);

  const handleEnter = (key: string) => {
    if (reduced) return;
    setMounted((prev) => {
      if (prev.has(key)) return prev;
      const next = new Set(prev);
      next.add(key);
      return next;
    });
    setHovered(key);
  };
  const handleLeave = () => setHovered(null);

  return (
    <section className="piece-grid-section" aria-label="Series works">
      <div className="piece-grid">
        {/* popLayout removes exiting cells from layout flow immediately
            so the entering cells can FLIP to their final positions
            without being blocked by their own slot. Combined with
            keying by item.video, this gives the Split Logic system
            its "shuffle" character when the locked colour zone
            changes: shared pieces glide between positions while new
            pieces fade into place. */}
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((item, i) => {
            const cellKey = item.video;
            // eagerMount forces the <video> in from first paint with
            // aggressive preload, so hover is instant. See prop docs.
            const isMounted = eagerMount || mounted.has(cellKey);
            const cellStyle: React.CSSProperties = {};
            if (cellOrder !== undefined) cellStyle.order = cellOrder[i];
            return (
              <motion.button
                key={cellKey}
                type="button"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  // Layout (FLIP between positions when items shuffle)
                  // and opacity (fade for entering/leaving) share a
                  // duration and easing so a cell's move and its
                  // fade-in resolve on the same frame — without
                  // matching, the 0.55 vs 0.32 split meant fading
                  // completed long before the slide and the grid
                  // read as "jittering" into place. NO stagger —
                  // an earlier per-cell delay made roughly half the
                  // entering cells sit invisible for up to ~330ms
                  // during a colour-lock shuffle, which read as
                  // "artworks didn't load" rather than refined
                  // sequencing. All entering cells fade in together.
                  // Layout transition is skipped under prefers-reduced-
                  // motion — vestibular users get instant repositioning
                  // while opacity fade-in stays (fade is non-vestibular).
                  layout: reduced
                    ? { duration: 0 }
                    : { duration: 0.55, ease: [0.22, 0.61, 0.36, 1] },
                  opacity: { duration: 0.55, ease: [0.22, 0.61, 0.36, 1] },
                }}
                className="piece-cell"
                data-zoom-src={item.video}
                style={cellStyle}
                onClick={() => openLightbox(i)}
                onMouseEnter={() => handleEnter(cellKey)}
                onMouseLeave={handleLeave}
                onFocus={() => handleEnter(cellKey)}
                onBlur={handleLeave}
                aria-label={item.alt ?? `View artwork ${i + 1} in full`}
                disabled={expanded !== null}
              >
                <div className="piece-folder-art-wrap">
                  <div className="piece-folder-art">
                    {isMounted ? (
                      <video
                        ref={(el) => {
                          if (el) videoRefs.current.set(cellKey, el);
                          else videoRefs.current.delete(cellKey);
                        }}
                        src={item.video}
                        poster={item.poster}
                        muted
                        loop
                        playsInline
                        // On eagerMount pages (Split Logic) every cell
                        // mounts from first paint, but preload starts
                        // at "metadata" so a page/shuffle change
                        // doesn't kick off 12 simultaneous full-data
                        // fetches mid-animation (decoder thrash =
                        // glitch). After ~650ms (just past the
                        // layout-animation duration) the gate flips
                        // to "auto" so subsequent hovers play instantly
                        // from buffered data. Hover-mount pages stay
                        // on "metadata" forever to avoid chewing
                        // bandwidth on cells the user only grazes.
                        preload={eagerMount && autoPreload ? "auto" : "metadata"}
                        aria-hidden="true"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.poster}
                        alt=""
                        draggable={false}
                        loading="lazy"
                        // Async decoding pushes image decode off the
                        // main thread — meaningful for a grid where
                        // ~12 posters can decode concurrently on first
                        // paint.
                        decoding="async"
                      />
                    )}
                  </div>
                  {(() => {
                    // Derive the piece number from the video filename
                    // (e.g. /images/ricky-retouch/works/sl-042.mp4 → 042).
                    // Falls back to the slot index + 1 if the URL doesn't
                    // match the expected sl-NNN pattern.
                    const m = item.video.match(/sl-(\d+)\.[a-z0-9]+$/i);
                    const label = m ? m[1] : String(i + 1).padStart(3, "0");
                    return (
                      <span className="piece-cell-number" aria-hidden="true">
                        {label}
                      </span>
                    );
                  })()}
                </div>
                <div className="piece-folder-pocket" aria-hidden="true" />
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {expanded !== null && (
          <motion.div
            key="overlay"
            className="piece-grid-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={(e) => {
              if (skipNextClickRef.current) {
                skipNextClickRef.current = false;
                return;
              }
              // Only dismiss when the user clicks the overlay surface
              // itself — not when the click bubbles up from the video,
              // a nav arrow, or any other child element.
              if (e.target === e.currentTarget) setExpanded(null);
            }}
            onTouchStart={onOverlayTouchStart}
            onTouchMove={onOverlayTouchMove}
            onTouchEnd={onOverlayTouchEnd}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const frac = (e.clientX - rect.left) / rect.width;
              if (frac < 0.22) setArrowZone("left");
              else if (frac > 0.78) setArrowZone("right");
              else setArrowZone(null);
            }}
            onMouseLeave={() => setArrowZone(null)}
            role="button"
            tabIndex={0}
            aria-label="Close artwork"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setExpanded(null);
            }}
          >
            <div
              className="piece-grid-overlay-bg"
              style={{ backgroundImage: `url(${lightboxList[expanded].poster})` }}
              aria-hidden="true"
            />
            <ExpandedArtwork
              key={expanded}
              item={lightboxList[expanded]}
              onClose={() => setExpanded(null)}
              onPrev={lightboxList.length > 1 ? prev : undefined}
              onNext={lightboxList.length > 1 ? next : undefined}
              snappySwipe={snappySwipe}
            />

            <button
              type="button"
              className="piece-nav-btn piece-nav-prev"
              data-visible={arrowZone === "left"}
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous artwork"
            >
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M15 5 L8 12 L15 19"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className="piece-nav-btn piece-nav-next"
              data-visible={arrowZone === "right"}
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next artwork"
            >
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M9 5 L16 12 L9 19"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
