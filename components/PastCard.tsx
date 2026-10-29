"use client";

import { exhibitionHref } from "@/lib/exhibition-href";
import type { Exhibition } from "@/lib/types";
import { TransitionLink } from "./TransitionLink";
import { useScrollReveal } from "@/lib/useScrollReveal";

export function PastCard({ exhibition }: { exhibition: Exhibition }) {
  const { ref, visible } = useScrollReveal<HTMLAnchorElement>();

  return (
    <TransitionLink
      ref={ref}
      href={exhibitionHref(exhibition)}
      className={`past-card${visible ? " past-card--visible" : ""}`}
    >
      <div className="past-artist">{exhibition.artistName}</div>
      <div className="past-title">{exhibition.title}</div>
      <div className="past-month">{exhibition.month}</div>
    </TransitionLink>
  );
}
