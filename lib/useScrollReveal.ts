"use client";

import { useEffect, useRef, useState } from "react";

/** Scroll-reveal with smart initial-load handling.
 *
 *  Elements already near the viewport on mount (< 1.5× viewport
 *  height) reveal with a soft staggered cascade — no waiting for
 *  the first scroll event. Elements further below the fold animate
 *  in on scroll via IntersectionObserver as before.
 *
 *  CSS starts elements hidden (opacity:0). This hook adds the
 *  `--visible` class to trigger the transition.
 *
 *  Falls back to immediate-visible when IO is unavailable. */

// Monotonic counter for stagger ordering within a single page load.
let mountOrder = 0;

export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
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
      setVisible(true);
      return;
    }

    // Check if element is already near the viewport on mount.
    // 1.5× catches elements just below a full-viewport hero.
    const rect = el.getBoundingClientRect();
    const nearViewport = rect.top < window.innerHeight * 1.5;

    if (nearViewport) {
      // Stagger so multiple elements cascade rather than all
      // appearing simultaneously. 80ms per mount-order, capped
      // at 400ms so deep lists don't wait forever.
      const delay = Math.min(orderRef.current * 80, 400);
      const timer = window.setTimeout(() => setVisible(true), delay);
      return () => window.clearTimeout(timer);
    }

    // Below the fold — observe and reveal on scroll.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, visible };
}
