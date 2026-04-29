"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";

/**
 * Year heading for the Past archive. Same scroll-reveal pattern as
 * `PastCard`, but the entrance translateY is *negative* (starts above
 * its rest position and falls down) — opposite direction from the
 * cards, which rise from below. Reads as the year settling onto the
 * table while the rows beneath it rise into place.
 */
export function PastYear({ year }: { year: number }) {
  const { ref, visible } = useScrollReveal<HTMLHeadingElement>();
  return (
    <h3
      ref={ref}
      className={visible ? "past-year is-visible" : "past-year"}
    >
      <span className="past-year-label">{year}</span>
    </h3>
  );
}
