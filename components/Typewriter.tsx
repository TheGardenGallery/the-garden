"use client";

import type { CSSProperties, ReactNode } from "react";

const CHAR_STAGGER_MS = 78;
const CHAR_DURATION_MS = 110;

/**
 * Character-by-character type-in. Each char is wrapped in a span with
 * a global `--idx` so the stagger flows continuously across calls
 * (pass `startIdx` from a previous Typewriter to chain artist → title
 * without resetting the rhythm). Uses `display:inline` + opacity-only
 * transitions so character kerning stays intact in proportional
 * fonts. The trailing `.tw-cursor` begins blinking just after the
 * last character lands.
 */
export function Typewriter({
  text,
  startIdx = 0,
  showCursor = false,
  className,
}: {
  text: string;
  startIdx?: number;
  showCursor?: boolean;
  className?: string;
}) {
  const children: ReactNode[] = [];
  let idx = startIdx;

  const chars = Array.from(text);
  chars.forEach((ch, i) => {
    children.push(
      <span
        key={i}
        className="tw-char"
        style={{ "--idx": idx } as CSSProperties}
      >
        {ch === " " ? " " : ch}
      </span>,
    );
    idx += 1;
  });

  if (showCursor) {
    const cushionMs = 220;
    const cursorDelayMs = idx * CHAR_STAGGER_MS + CHAR_DURATION_MS + cushionMs;
    children.push(
      <span
        key="tw-cursor"
        className="tw-cursor"
        style={{ "--cursor-delay": `${cursorDelayMs}ms` } as CSSProperties}
        aria-hidden="true"
      />,
    );
  }

  return <span className={className}>{children}</span>;
}
