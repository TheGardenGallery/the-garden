"use client";

import { useEffect, useState } from "react";
import type { Exhibition, ExhibitionStatus } from "@/lib/types";
import { resolveStatus, msUntilStatusChange } from "@/lib/exhibition-status";

/**
 * Live effective status, hydration-safe.
 *
 * `serverStatus` is what the server resolved at request time and what the
 * SSR'd HTML shows — so first client paint returns exactly that, no mismatch.
 * After mount we re-resolve against the client clock (correcting a statically
 * cached page that was built before the transition instant), then schedule a
 * SINGLE precise timer to flip at `liveStart` for tabs left open across the
 * moment. No polling; the timer fires once, at the exact instant.
 */
export function useLiveStatus(
  ex: Pick<Exhibition, "status" | "liveStart">,
  serverStatus: ExhibitionStatus,
): ExhibitionStatus {
  const [status, setStatus] = useState<ExhibitionStatus>(serverStatus);

  useEffect(() => {
    const base = { status: ex.status, liveStart: ex.liveStart };
    // Re-resolve immediately in case the cached HTML predates the instant.
    setStatus(resolveStatus(base, Date.now()));

    // setTimeout caps at ~24.8 days (32-bit). For distant drops, re-arm in
    // chunks instead of firing early and giving up. The timer fires exactly
    // once at the instant; no polling.
    const MAX = 2_147_483_647;
    let id: number;
    const arm = () => {
      const delay = msUntilStatusChange(base, Date.now());
      if (delay === null) {
        setStatus(resolveStatus(base, Date.now()));
        return;
      }
      id = window.setTimeout(delay > MAX ? arm : () => {
        setStatus(resolveStatus(base, Date.now()));
      }, Math.min(delay, MAX));
    };
    arm();
    return () => window.clearTimeout(id);
  }, [ex.status, ex.liveStart]);

  return status;
}
