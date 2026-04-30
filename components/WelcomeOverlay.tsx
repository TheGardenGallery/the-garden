"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Full-screen welcome gate — split black/white with a "welcome." button.
 * Clicking the button triggers a split-flap / rolodex curtain animation
 * that peels away to reveal The Garden homepage underneath.
 *
 * Architecture: the flap strips ARE the visible surface. Each strip shows
 * its slice of the B/W gradient. When a strip flips away the Garden page
 * shows through the gap. The white border frame sits above everything and
 * fades out after the animation finishes.
 */

const NUM_FLAPS = 22;
const STAGGER_MS = 45;
const SEED = 1618; // golden ratio

/** Park–Miller LCG seeded PRNG */
function createSeededRandom(initialSeed: number) {
  let s = initialSeed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

/** Fisher–Yates shuffle with seeded PRNG */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = arr.slice();
  const rng = createSeededRandom(seed);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function WelcomeOverlay() {
  const [dismissed, setDismissed] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback(() => {
    if (flipping) return;
    setFlipping(true);

    // Fade button immediately
    if (btnRef.current) {
      btnRef.current.style.transition = "opacity 0.2s";
      btnRef.current.style.opacity = "0";
    }

    // Trigger flap animations in seeded-random order
    const flaps =
      overlayRef.current?.querySelectorAll<HTMLDivElement>(".welcome-flap");
    if (!flaps) return;

    const indices = Array.from({ length: flaps.length }, (_, i) => i);
    const shuffled = seededShuffle(indices, SEED);

    shuffled.forEach((flapIdx, order) => {
      setTimeout(() => {
        flaps[flapIdx].classList.add("flipping");
      }, order * STAGGER_MS);
    });

    // Fade frame + unmount after all flaps done
    const lastFlapEnd = NUM_FLAPS * STAGGER_MS + 700; // 700ms = animation duration
    const frame = overlayRef.current?.querySelector<HTMLDivElement>(
      ".welcome-frame"
    );
    if (frame) {
      setTimeout(() => {
        frame.style.transition = "opacity 0.35s ease-out";
        frame.style.opacity = "0";
      }, lastFlapEnd - 200);
    }

    setTimeout(() => {
      setDismissed(true);
    }, lastFlapEnd + 200);
  }, [flipping]);

  if (dismissed) return null;

  return (
    <div className="welcome-overlay" ref={overlayRef}>
      {/* Flap strips — these ARE the visible B/W surface.
          Each strip clips its portion of the full-viewport gradient.
          When a strip flips, the Garden page shows through the gap. */}
      <div className="welcome-flaps">
        {Array.from({ length: NUM_FLAPS }, (_, i) => {
          const pct = 100 / NUM_FLAPS;
          return (
            <div
              key={i}
              className="welcome-flap"
              style={{
                top: `${i * pct}%`,
                height: `${pct}%`,
              }}
            >
              <div
                className="welcome-flap-inner"
                style={{
                  height: "100vh",
                  top: `calc(-${i} * 100vh / ${NUM_FLAPS})`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* White border frame — above flaps so it persists during animation */}
      <div className="welcome-frame" />

      {/* The button — above everything */}
      <button
        ref={btnRef}
        className="welcome-btn"
        onClick={handleClick}
        type="button"
      >
        welcome.
      </button>
    </div>
  );
}
