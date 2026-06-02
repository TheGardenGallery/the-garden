"use client";

import { useEffect, useState } from "react";
import { mintPhase, msUntilNextMintPhase, type MintPhase } from "@/lib/split-logic-mint";

/**
 * Live Split Logic mint phase ("before" | "allowlist" | "after"),
 * hydration-safe.
 *
 * `serverPhase` is what the server resolved at request time and what the SSR'd
 * HTML shows, so first client paint returns exactly that — no mismatch. After
 * mount we re-resolve against the client clock (correcting a statically cached
 * page rendered before a boundary), then arm a SINGLE timer to flip at the
 * next boundary (open, then close) for tabs left open across the moment.
 */
export function useMintPhase(serverPhase: MintPhase): MintPhase {
  const [phase, setPhase] = useState<MintPhase>(serverPhase);

  useEffect(() => {
    setPhase(mintPhase(Date.now()));

    const MAX = 2_147_483_647; // setTimeout 32-bit cap (~24.8 days)
    let id: number;
    const arm = () => {
      const delay = msUntilNextMintPhase(Date.now());
      if (delay === null) {
        setPhase(mintPhase(Date.now()));
        return;
      }
      id = window.setTimeout(
        delay > MAX
          ? arm
          : () => {
              setPhase(mintPhase(Date.now()));
              arm(); // re-arm for the following boundary (open → close)
            },
        Math.min(delay, MAX),
      );
    };
    arm();
    return () => window.clearTimeout(id);
  }, []);

  return phase;
}
