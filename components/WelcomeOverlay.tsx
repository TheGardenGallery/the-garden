"use client";

import { useCallback, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Welcome gate — split black/white surface built from horizontal strips
 * with hairline gaps between them. Clicking "welcome." triggers a
 * split-flap curtain: each strip hinges from its top edge and falls
 * forward under simulated gravity, revealing The Garden behind the gaps.
 *
 * Portalled to document.body so it's immune to template.tsx's motion
 * fade-in (opacity 0 → 1). Only renders on the homepage ("/").
 */

const NUM_FLAPS = 22;
const GAP_PX = 1;
const SEED = 1618;

/* ── seeded PRNG ─────────────────────────────────────────────── */

function createRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = arr.slice();
  const rng = createRng(seed);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ── component ───────────────────────────────────────────────── */

export function WelcomeOverlay() {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback(() => {
    if (flipping) return;
    setFlipping(true);

    const root = rootRef.current;
    if (!root) return;

    /* fade button */
    if (btnRef.current) {
      btnRef.current.style.transition = "opacity 0.18s";
      btnRef.current.style.opacity = "0";
    }

    /* collect strips */
    const strips = root.querySelectorAll<HTMLDivElement>(".wf-strip");
    if (!strips.length) return;

    /* build stagger order: seeded shuffle */
    const indices = Array.from({ length: strips.length }, (_, i) => i);
    const order = seededShuffle(indices, SEED);

    /* per-strip micro-variation in delay (seeded) */
    const rng = createRng(SEED + 7);
    const STAGGER = 50;

    order.forEach((stripIdx, seq) => {
      const jitter = (rng() - 0.5) * 18; // ±9ms
      const delay = seq * STAGGER + jitter;
      const strip = strips[stripIdx];

      /* per-strip duration variation: 0.62s – 0.72s */
      const dur = 0.62 + rng() * 0.10;
      strip.style.animationDuration = `${dur.toFixed(3)}s`;

      setTimeout(() => {
        strip.classList.add("wf-flip");
      }, Math.max(0, delay));
    });

    /* shrink frame + unmount */
    const totalAnim = NUM_FLAPS * STAGGER + 720;
    const frame = root.querySelector<HTMLDivElement>(".wf-frame");
    if (frame) {
      setTimeout(() => {
        frame.style.transition =
          "border-width 0.4s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 0.15s ease-out 0.3s";
        frame.style.borderWidth = "0px";
        frame.style.opacity = "0";
      }, totalAnim - 200);
    }

    setTimeout(() => setDismissed(true), totalAnim + 180);
  }, [flipping]);

  /* only homepage, only until dismissed */
  if (dismissed || pathname !== "/") return null;

  /* ── strip geometry ──────────────────────────────────────── */
  const totalGap = GAP_PX * (NUM_FLAPS - 1);

  return (
    <div
      className="wf-root"
      ref={rootRef}
      onClick={handleClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      <div className="wf-strips">
        {Array.from({ length: NUM_FLAPS }, (_, i) => (
          <div
            key={i}
            className="wf-strip"
            style={{
              top: `calc(${i} * (100% - ${totalGap}px) / ${NUM_FLAPS} + ${i * GAP_PX}px)`,
              height: `calc((100% - ${totalGap}px) / ${NUM_FLAPS})`,
            }}
          >
            <div
              className="wf-strip-face"
              style={{
                height: "100vh",
                top: `calc(-${i} * (100vh - ${totalGap}px) / ${NUM_FLAPS} - ${i * GAP_PX}px)`,
              }}
            />
          </div>
        ))}
      </div>

      <div className="wf-frame" />

      <button
        ref={btnRef}
        className="wf-btn"
        onClick={handleClick}
        type="button"
      >
        welcome.
      </button>
    </div>
  );
}
