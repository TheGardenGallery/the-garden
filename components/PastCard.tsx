"use client";

import { useEffect, useRef, useState } from "react";
import type { Exhibition } from "@/lib/types";
import { TransitionLink } from "./TransitionLink";

export function PastCard({ exhibition }: { exhibition: Exhibition }) {
  const ref = useRef<HTMLAnchorElement>(null);
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

  return (
    <TransitionLink
      ref={ref}
      href={`/exhibitions/${exhibition.slug}`}
      className={visible ? "past-card is-visible" : "past-card"}
    >
      <div className="past-artist">{exhibition.artistName}</div>
      <div className="past-title">{exhibition.title}</div>
      <div className="past-month">{exhibition.month}</div>
    </TransitionLink>
  );
}
