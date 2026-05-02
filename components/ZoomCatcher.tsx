"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ExpandedArtwork } from "./ExpandedArtwork";
import type { ExpandedArtworkItem } from "./ExpandedArtwork";

/**
 * Page-wide zoom-on-click + unified prev/next nav for every artwork
 * on the exhibition page (hero, inline artworks, piece grid). Uses a
 * capture-phase click listener so it fires BEFORE component-level
 * onClick handlers (e.g., PieceGrid's own cell click), letting us
 * suppress PieceGrid's local modal via stopPropagation and route
 * everything through this single lightbox.
 *
 * Click matching:
 *   - First, look for `[data-zoom-src]` on the click ancestry
 *     (PieceGrid cells set this attribute since their click target
 *     is a button, not a video).
 *   - Fall back to the `<video>` element's src under the cursor
 *     (used for hero / inline-artwork videos that don't need an
 *     extra wrapper).
 *
 * The matched URL is looked up in the `items` array by index; the
 * lightbox opens at that index and prev/next cycle through the
 * collection (with wrap-around). */
export function ZoomCatcher({
  items,
  scope,
}: {
  items: ExpandedArtworkItem[];
  scope: string;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const [arrowZone, setArrowZone] = useState<"left" | "right" | null>(null);

  const prev = useCallback(() => {
    setIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length));
  }, [items.length]);
  const next = useCallback(() => {
    setIndex((i) => (i === null ? null : (i + 1) % items.length));
  }, [items.length]);

  // Overlay-level swipe — fires prev/next when the user swipes
  // anywhere on the lightbox backdrop, not just on the artwork
  // itself. Touches that start on the artwork are skipped here and
  // routed through ExpandedArtwork's own touch handlers (which
  // handle pan-when-zoomed and visual swipe preview).
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
      // Suppress the synthetic click after the swipe so onClick
      // doesn't see a "tap on backdrop" and close the lightbox.
      skipNextClickRef.current = true;
    } else if (moved) {
      skipNextClickRef.current = true;
    }
  };

  useEffect(() => {
    const container = document.querySelector(scope);
    if (!container) return;

    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      // Never re-trigger from inside an open lightbox.
      if (
        target.closest(
          ".piece-grid-overlay, .piece-grid-expanded, .piece-nav-btn",
        )
      ) {
        return;
      }

      // Prefer an explicit data-zoom-src ancestor (PieceGrid cells)
      // before falling back to a <video> element under the cursor.
      const zoomEl = target.closest("[data-zoom-src]") as HTMLElement | null;
      let src: string | undefined = zoomEl?.dataset.zoomSrc;
      if (!src) {
        const video = target.closest("video") as HTMLVideoElement | null;
        src = video?.currentSrc || video?.src || undefined;
      }
      if (!src) return;

      const idx = items.findIndex(
        (i) => i.video === src || src!.endsWith(i.video),
      );
      if (idx < 0) return;

      e.preventDefault();
      e.stopPropagation();
      // stopImmediatePropagation halts other listeners on the same
      // element (capture phase). React's synthetic onClick handlers
      // are bubble-phase though, and stopPropagation here suppresses
      // the bubble cycle entirely — PieceGrid's onClick won't fire.
      if ((e as Event & { stopImmediatePropagation?: () => void }).stopImmediatePropagation) {
        (e as Event & { stopImmediatePropagation: () => void }).stopImmediatePropagation();
      }
      setIndex(idx);
    };
    container.addEventListener("click", handleClick, true);
    return () => container.removeEventListener("click", handleClick, true);
  }, [scope, items]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, prev, next]);

  return (
    <AnimatePresence>
      {index !== null && items[index] && (
        <motion.div
          key="zoom-overlay"
          className="piece-grid-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => {
            if (skipNextClickRef.current) {
              skipNextClickRef.current = false;
              return;
            }
            if (e.target === e.currentTarget) setIndex(null);
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
            if (e.key === "Enter" || e.key === " ") setIndex(null);
          }}
        >
          <div
            className="piece-grid-overlay-bg"
            style={{ backgroundImage: `url(${items[index].poster})` }}
            aria-hidden="true"
          />
          <ExpandedArtwork
            item={items[index]}
            onClose={() => setIndex(null)}
            onPrev={items.length > 1 ? prev : undefined}
            onNext={items.length > 1 ? next : undefined}
          />
          {items.length > 1 && (
            <>
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
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
