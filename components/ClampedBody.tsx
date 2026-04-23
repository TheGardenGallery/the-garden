"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { preserveHyphens } from "@/lib/typography";

/**
 * Paragraph that clamps to N lines and ends on a word boundary. CSS
 * `-webkit-line-clamp` cuts mid-word and auto-inserts an ellipsis right
 * after a partial letter — readable, ugly. On mount we measure the full
 * text off-screen, binary-search the largest prefix (in whole words) that
 * still fits inside N × line-height, then render that prefix + "…".
 *
 * SSR ships the full body with the CSS clamp still active, so noscript
 * and the flash-before-hydration show the ugly-but-safe version. Client
 * JS replaces it on mount.
 */
export function ClampedBody({
  text,
  className,
  lines = 6,
}: {
  text: string;
  className?: string;
  lines?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [truncated, setTruncated] = useState<string | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const cs = getComputedStyle(el);
    const lh = parseFloat(cs.lineHeight);
    if (!Number.isFinite(lh) || lh <= 0) return;
    const maxHeight = lh * lines + 1;

    const measure = document.createElement("p");
    measure.className = el.className;
    measure.style.cssText = `
      position:absolute;left:-9999px;top:0;visibility:hidden;
      width:${el.clientWidth}px;
      display:block;-webkit-line-clamp:unset;line-clamp:unset;
      overflow:visible;
    `;
    document.body.appendChild(measure);

    measure.innerHTML = preserveHyphens(text);
    if (measure.scrollHeight <= maxHeight) {
      document.body.removeChild(measure);
      return;
    }

    const words = text.split(/\s+/);
    let lo = 1;
    let hi = words.length;
    let best = 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      measure.innerHTML = preserveHyphens(words.slice(0, mid).join(" ")) + "…";
      if (measure.scrollHeight <= maxHeight) {
        best = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    document.body.removeChild(measure);
    const prefix = words.slice(0, best).join(" ").replace(/[,;:.\-—–]+$/u, "");
    setTruncated(preserveHyphens(prefix) + "…");
  }, [text, lines]);

  const html = truncated ?? preserveHyphens(text);
  return (
    <p
      ref={ref}
      className={className}
      style={
        truncated
          ? { display: "block", WebkitLineClamp: "unset", overflow: "visible" }
          : undefined
      }
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
