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
  cellOrder,
  eagerMount = false,
  wasdNav = false,
}: {
  items: PieceGridItem[];
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
}) {
  const [expanded, setExpanded] = useState<number | null>(null);
  // Hover/mount state is keyed by the piece's stable video URL rather
  // than its current array index. The Split Logic system reshuffles
  // the items array when a colour zone is locked; tracking by index
  // would mean the cell at slot 0 inherits whatever was last hovered
  // there, even though it's now a completely different piece.
  const [hovered, setHovered] = useState<string | null>(null);
  const [mounted, setMounted] = useState<Set<string>>(new Set());
  // Mirror the homepage hero's left/right arrow zones — the prev/next
  // controls fade in only when the mouse is near the corresponding
  // edge of the overlay.
  const [arrowZone, setArrowZone] = useState<null | "left" | "right">(null);
  const reduced = useReducedMotion();
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  const prev = useCallback(() => {
    setExpanded((cur) =>
      cur === null ? null : (cur - 1 + items.length) % items.length
    );
  }, [items.length]);
  const next = useCallback(() => {
    setExpanded((cur) =>
      cur === null ? null : (cur + 1) % items.length
    );
  }, [items.length]);

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

  // Preload the immediately-neighbouring posters and videos whenever
  // the lightbox is open or moves. Without this, a swipe to the next
  // artwork has to fetch the blurred-bg poster and the video src
  // from network mid-transition — visible as a stutter / "weird
  // load" behind the artwork. With both prefetched, the swap is
  // instant from cache.
  useEffect(() => {
    if (expanded === null || items.length <= 1) return;
    const ids = [
      (expanded - 1 + items.length) % items.length,
      (expanded + 1) % items.length,
    ];
    const cleanups: Array<() => void> = [];
    ids.forEach((idx) => {
      const it = items[idx];
      if (!it) return;
      const img = new Image();
      img.src = it.poster;
      const v = document.createElement("video");
      v.preload = "auto";
      v.muted = true;
      v.src = it.video;
      // Detach so the element can be GC'd once the data is cached.
      cleanups.push(() => {
        v.removeAttribute("src");
        v.load();
      });
    });
    return () => cleanups.forEach((fn) => fn());
  }, [expanded, items]);

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
                  layout: { duration: 0.55, ease: [0.22, 0.61, 0.36, 1] },
                  opacity: { duration: 0.32, ease: "easeOut" },
                }}
                className="piece-cell"
                data-zoom-src={item.video}
                style={cellStyle}
                onClick={() => setExpanded(i)}
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
                        // eagerMount pages (Split Logic) use "auto" so
                        // every visible cell is buffered ahead of hover —
                        // the artwork plays the instant the cursor lands.
                        // Hover-mount pages stay on "metadata" to avoid
                        // chewing bandwidth on cells the user only
                        // grazes.
                        preload={eagerMount ? "auto" : "metadata"}
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
              style={{ backgroundImage: `url(${items[expanded].poster})` }}
              aria-hidden="true"
            />
            <ExpandedArtwork
              key={expanded}
              item={items[expanded]}
              onClose={() => setExpanded(null)}
              onPrev={items.length > 1 ? prev : undefined}
              onNext={items.length > 1 ? next : undefined}
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
