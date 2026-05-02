"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ExpandedArtwork } from "./ExpandedArtwork";

export type PieceGridItem = {
  video: string;
  poster: string;
  alt?: string;
};

export function PieceGrid({ items }: { items: PieceGridItem[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  // Once a cell has been hovered (or focused), its <video> mounts and
  // stays mounted — pause/resume across hover cycles preserves the
  // current frame so the viewer can pick up where they left off, not
  // restart from t=0 every time.
  const [mounted, setMounted] = useState<Set<number>>(new Set());
  // Mirror the homepage hero's left/right arrow zones — the prev/next
  // controls fade in only when the mouse is near the corresponding
  // edge of the overlay.
  const [arrowZone, setArrowZone] = useState<null | "left" | "right">(null);
  const reduced = useReducedMotion();
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());

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

  useEffect(() => {
    if (expanded === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(null);
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded, prev, next]);

  // Drive play/pause on the mounted cell videos. Only the currently
  // hovered cell plays; everything else stays paused at its last
  // frame. While anything is expanded, all cells pause.
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (expanded === null && hovered === i) {
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => {});
        }
      } else {
        video.pause();
      }
    });
  }, [hovered, expanded]);

  const handleEnter = (i: number) => {
    if (reduced) return;
    setMounted((prev) => {
      if (prev.has(i)) return prev;
      const next = new Set(prev);
      next.add(i);
      return next;
    });
    setHovered(i);
  };
  const handleLeave = () => setHovered(null);

  return (
    <section className="piece-grid-section" aria-label="Series works">
      <div className="piece-grid">
        {items.map((item, i) => {
          const isMounted = mounted.has(i);
          return (
            <button
              key={i}
              type="button"
              className="piece-cell"
              data-zoom-src={item.video}
              onClick={() => setExpanded(i)}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
              onFocus={() => handleEnter(i)}
              onBlur={handleLeave}
              aria-label={item.alt ?? `View artwork ${i + 1} in full`}
              disabled={expanded !== null}
            >
              <div className="piece-folder-art-wrap">
                <div className="piece-folder-art">
                  {isMounted ? (
                    <video
                      ref={(el) => {
                        if (el) videoRefs.current.set(i, el);
                        else videoRefs.current.delete(i);
                      }}
                      src={item.video}
                      poster={item.poster}
                      muted
                      loop
                      playsInline
                      preload="auto"
                      aria-hidden="true"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.poster}
                      alt=""
                      draggable={false}
                      loading="lazy"
                    />
                  )}
                </div>
              </div>
              <div className="piece-folder-pocket" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {expanded !== null && (
          <motion.div
            key="overlay"
            className="piece-grid-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => {
              // Only dismiss when the user clicks the overlay surface
              // itself — not when the click bubbles up from the video,
              // a nav arrow, or any other child element.
              if (e.target === e.currentTarget) setExpanded(null);
            }}
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
