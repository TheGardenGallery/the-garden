"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Full-screen welcome gate — split black/white with a "welcome." button.
 * Clicking the button triggers a split-flap / rolodex curtain animation
 * that peels away to reveal The Garden homepage underneath.
 *
 * All the Three.js artwork (flower, spiral, particles) from the original
 * standalone index.html is intentionally omitted — it was hidden anyway.
 * This component is purely the entry ceremony.
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
    const flaps = overlayRef.current?.querySelectorAll<HTMLDivElement>(".welcome-flap");
    if (!flaps) return;

    const indices = Array.from({ length: flaps.length }, (_, i) => i);
    const shuffled = seededShuffle(indices, SEED);

    shuffled.forEach((flapIdx, order) => {
      setTimeout(() => {
        flaps[flapIdx].classList.add("flipping");
      }, order * STAGGER_MS);
    });

    // After animation completes, unmount overlay entirely
    const totalDuration = NUM_FLAPS * STAGGER_MS + 800;
    setTimeout(() => {
      setDismissed(true);
    }, totalDuration);
  }, [flipping]);

  if (dismissed) return null;

  return (
    <div className="welcome-overlay" ref={overlayRef}>
      {/* Split background */}
      <div className="welcome-bg" />

      {/* White border frame */}
      <div className="welcome-frame" />

      {/* Flap strips — each mirrors the split B/W background */}
      <div className="welcome-flaps">
        {Array.from({ length: NUM_FLAPS }, (_, i) => {
          const flapHeight = `calc(100% / ${NUM_FLAPS})`;
          const topOffset = `calc(${i} * 100% / ${NUM_FLAPS})`;
          return (
            <div
              key={i}
              className="welcome-flap"
              style={{
                top: topOffset,
                height: flapHeight,
              }}
            >
              <div
                className="welcome-flap-inner"
                style={{
                  height: `calc(100vh)`,
                  top: `calc(-${i} * 100vh / ${NUM_FLAPS})`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* The button */}
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
