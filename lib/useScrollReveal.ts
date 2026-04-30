"use client";

import { useEffect, useRef, useState } from "react";

/** Scroll-reveal with refined initial-load handling.
 *
 *  Elements that are already inside (or near) the viewport when the
 *  page first paints reveal with a soft staggered fade — no jarring
 *  pop, no invisible-until-scroll gap.  Elements further below the
 *  fold animate in on scroll as before.
 *
 *  The CSS `.reveal` class no longer starts at opacity:0; instead,
 *  JS adds `.reveal--hidden` after hydration.  This means content is
 *  always visible in the HTML source (good for screenshots, scrapers,
 *  and the flash before hydration), and the hide→reveal lifecycle is
 *  entirely JS-driven.
 *
 *  Falls back to immediate-visible when IntersectionObserver is
 *  unavailable. */

// Monotonic counter for stagger ordering within a single page load.
let mountOrder = 0;

export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [state, setState] = useState<"idle" | "hidden" | "visible">("idle");
  const orderRef = useRef<number>(0);

  // Capture mount order synchronously during first render.
  if (orderRef.current === 0) {
    mountOrder += 1;
    orderRef.current = mountOrder;
  }

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setState("visible");
      return;
    }

    // Check if element is already near the viewport on mount.
    // Threshold is 1.5× so elements just below a full-viewport hero
    // (which sit at ~1.0× viewport height) are treated as "near" and
    // cascade in on page load rather than waiting for scroll.
    const rect = el.getBoundingClientRect();
    const nearViewport = rect.top < window.innerHeight * 1.5;

    if (nearViewport) {
      // Already in or near viewport — stagger the reveal so multiple
      // elements cascade rather than all appearing simultaneously.
      // Base delay is tiny (80ms per mount-order) so the first item
      // is nearly instant and later items ripple in.
      setState("hidden");
      const delay = Math.min(orderRef.current * 80, 400);
      const timer = window.setTimeout(() => setState("visible"), delay);
      return () => window.clearTimeout(timer);
    }

    // Below the fold — observe and reveal on scroll.
    setState("hidden");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setState("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, state };
}
