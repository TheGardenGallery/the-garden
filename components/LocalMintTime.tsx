"use client";

import { useEffect, useState } from "react";
import { formatMintTime } from "@/lib/split-logic-mint";

/**
 * Renders a UTC mint instant as the viewer's LOCAL wall-clock time.
 *
 * Hydration-safe: the server (UTC on Vercel) and the client (the visitor's
 * timezone) would format the same instant to different text, which trips a
 * React hydration mismatch. So we paint the canonical CDT `fallback` on the
 * server and first client render, then swap to the localized string in an
 * effect after mount — by which point hydration is already done. The result
 * is a flash-free upgrade: collectors briefly see "11:00 AM CDT", then their
 * own zone ("8:00 AM PDT", "5:00 PM CEST", "1:00 AM JST Jun 4", …).
 *
 * Uses a real <time> element with machine-readable dateTime for semantics
 * and SEO. `title` exposes the canonical CDT on hover as a sanity anchor.
 */
export function LocalMintTime({
  iso,
  fallback,
  style = "long",
}: {
  iso: string;
  fallback: string;
  style?: "long" | "upper";
}) {
  const [local, setLocal] = useState<string | null>(null);

  useEffect(() => {
    setLocal(formatMintTime(iso, fallback, style));
  }, [iso, fallback, style]);

  return (
    <time dateTime={iso} title={fallback} suppressHydrationWarning>
      {local ?? fallback}
    </time>
  );
}
