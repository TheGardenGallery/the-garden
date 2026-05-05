"use client";

import { useEffect, useRef, useState } from "react";

/** Station index — 8 tiny phosphor dots pinned top-right. Scrollspies
 *  through the sections by watching `[data-interview-section]` elements
 *  and lights the current one. Hidden on mobile (replaced by a 1px
 *  progress rail along the top of the page — see globals.css).
 *
 *  Intentionally uses IntersectionObserver with a tall rootMargin so a
 *  section is considered "current" when its top is near the top of the
 *  viewport, not when it's perfectly centered. Matches reading feel. */
export function InterviewStationIndex({ count }: { count: number }) {
  const [active, setActive] = useState(0);
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-interview-section]"),
    );
    if (sections.length === 0) return;

    // rootMargin: mark a section "active" once its top crosses 30% down.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(
              (entry.target as HTMLElement).dataset.interviewSection,
            );
            if (!Number.isNaN(idx)) setActive(idx);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Also drive a top-edge progress rail on mobile.
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? Math.min(1, h.scrollTop / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        className="iv-progress-rail"
        aria-hidden
        style={{ transform: `scaleX(${progress})` }}
      />
      <nav className="iv-index" aria-label="Interview sections">
        {Array.from({ length: count }).map((_, i) => (
          <a
            key={i}
            href={`#sec-${i + 1}`}
            className={`iv-index-dot${i === active ? " iv-index-dot--active" : ""}`}
            aria-label={`Go to section ${i + 1}`}
          >
            <span className="iv-index-num">
              {String(i + 1).padStart(2, "0")}
            </span>
          </a>
        ))}
      </nav>
    </>
  );
}
