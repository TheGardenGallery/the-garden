"use client";

import { LocalMintTime } from "./LocalMintTime";
import { useMintPhase } from "@/lib/use-mint-phase";
import {
  SL_ALLOWLIST_OPEN_ISO,
  SL_ALLOWLIST_LIVE_LABEL,
  type MintPhase,
} from "@/lib/split-logic-mint";

/**
 * The shared "allowlist beat" used wherever the Split Logic allowlist open is
 * surfaced (homepage hero, /exhibitions row, facts sidebar). Single renderer
 * so the three spots can never drift:
 *
 *   before    → the open instant, localized to the viewer (e.g. "June 3, 11:00 AM CDT")
 *   allowlist → "Allowlist Presale · Live Now" (only while the window is open)
 *   after     → falls back to the localized open instant (no longer claims live)
 *
 * `serverPhase` keeps SSR and first client paint identical (no hydration flash);
 * the hook flips it at the exact boundary.
 */
export function AllowlistMintBeat({
  serverPhase,
  fallback,
  style = "long",
}: {
  serverPhase: MintPhase;
  fallback: string;
  style?: "long" | "upper";
}) {
  const phase = useMintPhase(serverPhase);

  if (phase === "allowlist") {
    return <span>{SL_ALLOWLIST_LIVE_LABEL}</span>;
  }
  return (
    <LocalMintTime
      iso={SL_ALLOWLIST_OPEN_ISO}
      fallback={fallback}
      style={style}
    />
  );
}
