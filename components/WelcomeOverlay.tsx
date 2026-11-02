"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

/**
 * Welcome gate — split black/white surface built from horizontal strips
 * with hairline gaps between them. The word "Welcome." fades in, holds,
 * then the split-flap curtain falls away automatically — no tap needed.
 *
 * Clicking/tapping at any point skips the wait and triggers immediately.
 *
 * Plays once per browser session: a fresh tab always sees it, but
 * navigating back to "/" from elsewhere on the site does not replay it.
 * The session flag is stamped by <VisitMarker /> on every page mount, so
 * deep-linking to /exhibitions and then visiting "/" also stays quiet.
 *
 * Portalled to document.body so it's immune to template.tsx's motion
 * fade-in (opacity 0 → 1). Only renders on the homepage ("/").
 */

const NUM_FLAPS = 22;
const GAP_PX = 1;
const SEED = 1618;
/* The welcome plays once per browser session: a fresh tab/visit always
   sees it, but in-session navigation back to "/" does not. The session
   flag is stamped by <VisitMarker /> in the root layout so deep-linking
   to a non-homepage route also disarms the welcome. */
const SESSION_KEY = "garden-session";

/* ── pacing (ms) — five phases, kept brisk ──
   A short silence, a quick-but-smooth fade-in, a tight hold, a clean
   dissolve, then a small beat before the flaps fall. The split surface
   should feel composed, not patient. */
const OPEN_HOLD = 63;        // silence on the B/W split before any motion
const TEXT_IN = 370;         // fade-in duration (matches button transition)
const TEXT_HOLD = 215;       // dwell at full opacity
const TEXT_OUT = 250;        // fade-out duration (matches button transition)
const PRE_FALL = 63;         // anticipation between text gone and curtain
// Total ≈ 2.16s before the cascade begins.
/* The text's in/hold/out now runs as one CSS animation (wfText in
   globals.css, 898ms = OPEN_HOLD + TEXT_IN + TEXT_HOLD + TEXT_OUT): as
   React-state transitions the hydration frame stalled its fade-in. */

/* The header and the hero's title card come in while the last flaps are
   still falling, not after the gate unmounts: at this share of the
   cascade the gate adds .wf-releasing and announces the release. */
const RELEASE_AT = 0.55;
const RELEASE_EVENT = "garden:welcome-release";

/* tell the page the gate has let go (HeroCardReveal waits for this) */
function announceRelease() {
  const w = window as Window & { __gardenWelcome?: string };
  if (w.__gardenWelcome === "released") return;
  w.__gardenWelcome = "released";
  window.dispatchEvent(new Event(RELEASE_EVENT));
}

/* the early-click fade (the text's own easings live in wfText) */
const EASE_CLICK_OUT = "cubic-bezier(0.32, 0, 0.67, 0)";

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
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [cachedAway, setCachedAway] = useState(false);
  const flippingRef = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* portal needs a client-side mount check */
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) {
        setCachedAway(true);
      } else {
        /* stamp immediately so a reload mid-animation does not replay */
        sessionStorage.setItem(SESSION_KEY, "1");
      }
    } catch { /* sessionStorage unavailable */ }
    setMounted(true);
  }, []);

  /* hand over from the pre-hydration cover: by the time this runs the
     gate itself is in the DOM (or is not going to play at all) */
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.remove("wf-pending");
    if (cachedAway || pathname !== "/") announceRelease();
  }, [mounted, cachedAway, pathname]);

  /* ── auto-play sequence ── */
  useEffect(() => {
    if (!mounted || dismissed || cachedAway || pathname !== "/") return;

    // "Welcome." breathes in and out on its own (CSS, see above); after a
    // beat of anticipation, drop the curtain.
    const fallDelay = OPEN_HOLD + TEXT_IN + TEXT_HOLD + TEXT_OUT + PRE_FALL;
    autoTimerRef.current = setTimeout(triggerCurtain, fallDelay);

    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, dismissed, cachedAway, pathname]);

  const triggerCurtain = useCallback(() => {
    if (flippingRef.current) return;
    flippingRef.current = true;

    // Cancel auto-timer if user clicked early
    if (autoTimerRef.current) {
      clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }

    const root = rootRef.current;
    if (!root) return;

    /* fade button — only matters on early click (auto-mode has already
       dissolved the text via setTextVisible(false) by the time we land
       here, so this is a no-op in that path) */
    const btn = btnRef.current;
    if (btn) {
      /* freeze the CSS animation where it is, then fade out from there */
      const now = getComputedStyle(btn).opacity;
      btn.style.animation = "none";
      btn.style.opacity = now;
      void btn.offsetWidth;
      btn.style.transition = `opacity 280ms ${EASE_CLICK_OUT}`;
      btn.style.opacity = "0";
    }

    /* collect strips */
    const strips = root.querySelectorAll<HTMLDivElement>(".wf-strip");
    if (!strips.length) return;

    /* build stagger order: seeded shuffle */
    const indices = Array.from({ length: strips.length }, (_, i) => i);
    const order = seededShuffle(indices, SEED);

    /* per-strip micro-variation in delay (seeded) */
    const rng = createRng(SEED + 7);
    const STAGGER = 34;  // brisk cascade — keeps momentum

    order.forEach((stripIdx, seq) => {
      const jitter = (rng() - 0.5) * 12; // ±6ms — clean, not jittery
      const delay = seq * STAGGER + jitter;
      const strip = strips[stripIdx];

      /* per-strip duration variation: 0.62s – 0.76s */
      const dur = 0.62 + rng() * 0.14;
      strip.style.animationDuration = `${dur.toFixed(3)}s`;

      setTimeout(() => {
        strip.classList.add("wf-flip");
      }, Math.max(0, delay));
    });

    /* shrink frame + unmount */
    const totalAnim = NUM_FLAPS * STAGGER + 760;
    setTimeout(() => {
      root.classList.add("wf-releasing");
      announceRelease();
    }, Math.round(totalAnim * RELEASE_AT));
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

    /* stamp the session — VisitMarker also sets this on every page,
       this just covers the case where the welcome itself completes
       before the layout's marker effect has fired */
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch { /* ignore */ }
  }, []);

  const handleClick = useCallback(() => {
    triggerCurtain();
  }, [triggerCurtain]);

  /* only homepage, only client-side, only until dismissed or cached */
  if (!mounted || dismissed || cachedAway || pathname !== "/") return null;

  /* ── strip geometry ──────────────────────────────────────── */
  const totalGap = GAP_PX * (NUM_FLAPS - 1);

  return createPortal(
    <div className="wf-root" ref={rootRef} onClick={handleClick}>
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
        Welcome.
      </button>
    </div>,
    document.body
  );
}
