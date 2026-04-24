"use client";

import { useEffect, useRef, useState } from "react";

/** Fires `visible = true` the first time the attached element enters
    the viewport (with a 10% bottom rootMargin). Unobserves after the
    first hit so there's no "ping-pong" when the user scrolls back.
    Falls back to immediate-visible in environments without IO. */
export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
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
