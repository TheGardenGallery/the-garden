"use client";

import type { Exhibition } from "@/lib/types";
import { TransitionLink } from "./TransitionLink";
import { useScrollReveal } from "@/lib/useScrollReveal";

export function PastCard({ exhibition }: { exhibition: Exhibition }) {
  const { ref, state } = useScrollReveal<HTMLAnchorElement>();

  const cls =
    state === "hidden"
      ? "past-card past-card--hidden"
      : state === "visible"
        ? "past-card past-card--visible"
        : "past-card";

  return (
    <TransitionLink
      ref={ref}
      href={`/exhibitions/${exhibition.slug}`}
      className={cls}
    >
      <div className="past-artist">{exhibition.artistName}</div>
      <div className="past-title">{exhibition.title}</div>
      <div className="past-month">{exhibition.month}</div>
    </TransitionLink>
  );
}
