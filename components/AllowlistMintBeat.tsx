"use client";

import { useEffect, useState } from "react";
import { LocalMintTime } from "./LocalMintTime";
import {
  mintPhase,
  msUntilNextMintPhase,
  SL_ALLOWLIST_OPEN_ISO,
  SL_ALLOWLIST_LIVE_LABEL,
} from "@/lib/split-logic-mint";

/**
 * The shared "allowlist beat" used wherever the Split Logic allowlist open is
 * surfaced (homepage hero, /exhibitions row, facts sidebar). Single renderer
 * so the three spots can never drift.
 *
 *   before / after  → the open instant, localized to the viewer
 *   allowlist (live) → "Allowlist Presale · Live Now"
 *
 * FLASH-FREE BY CONSTRUCTION: the server and first client paint ALWAYS render
 * the localized-time path (identical to LocalMintTime's own SSR output), so a
 * statically-cached page can never show a stale phase — there is nothing to
 * flash *from*. The live label is swapped in only after mount, in an effect,
 * once the client confirms we're inside the window — and a single timer arms
 * the flip at the exact boundary for tabs left open across it. This mirrors
 * LocalMintTime's hydration discipline rather than branching on a server phase
 * that a CDN may have frozen hours earlier. No revalidate, no force-dynamic,
 * no perf cost — the pages stay fully static.
 */
export function AllowlistMintBeat({
  fallback,
  style = "long",
}: {
  fallback: string;
  style?: "long" | "upper";
}) {
  // Starts false on server + first paint → always the time path initially.
  const [live, setLive] = useState(false);

  useEffect(() => {
    let id: number;
    const MAX = 2_147_483_647; // setTimeout 32-bit cap (~24.8 days)
    const tick = () => {
      setLive(mintPhase(Date.now()) === "allowlist");
      const delay = msUntilNextMintPhase(Date.now());
      if (delay === null) return; // no further boundaries
      id = window.setTimeout(tick, Math.min(delay, MAX));
    };
    tick();
    return () => window.clearTimeout(id);
  }, []);

  if (live) return <span>{SL_ALLOWLIST_LIVE_LABEL}</span>;
  return (
    <LocalMintTime iso={SL_ALLOWLIST_OPEN_ISO} fallback={fallback} style={style} />
  );
}
