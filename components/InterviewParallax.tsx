"use client";

import { useEffect } from "react";

/**
 * Per-section parallax for the wedge plates between chapters. Each
 * `.iv-break-media` element is translated vertically as it crosses the
 * viewport, using a unique signed speed per section so adjacent plates
 * drift in opposite directions and at different rates — gives the page
 * a sense of depth without locking everything to the same rhythm.
 *
 * Speeds are normalized against viewport height; a per-section buffer
 * cap prevents the translate from exceeding the oversized media plate
 * (`top:-20%; bottom:-20%`) and revealing empty space at the edges.
 *
 * Honors prefers-reduced-motion: returns early so users with motion
 * sensitivity get static plates.
 */
// Strict alternating direction — odd indexes are positive, even indexes
// are negative, so adjacent plates always drift opposite each other.
// Magnitudes vary slightly within each direction so the speeds aren't
// uniform.
const SPEEDS = [-0.08, 0.10, -0.07, 0.11, -0.09, 0.08, -0.10, 0.07];

export function InterviewParallax() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(".iv-break-media"),
    );
    if (elements.length === 0) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const center = vh / 2;
      elements.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;
        const distance = (elCenter - center) / vh;
        const speed = SPEEDS[i % SPEEDS.length];
        const raw = distance * speed * vh;
        const buffer = rect.height * 0.18;
        const offset = Math.max(-buffer, Math.min(buffer, raw));
        el.style.setProperty("--parallax-y", `${offset.toFixed(1)}px`);
      });
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  return null;
}
