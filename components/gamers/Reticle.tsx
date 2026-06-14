"use client";

import { useEffect, useRef } from "react";

/**
 * Reticle — a custom targeting-cursor that follows the pointer below the hero.
 *
 * VISIBILITY GATE (deliberate): the hero artwork is now large and carries its
 * OWN in-piece targeting HUD (crosshair, brackets, readout). A second cursor
 * reticle on top of it would double up and read as clutter — and since the art
 * is a fixed render you can't steer, a cursor over it falsely implies control.
 * So the reticle is HIDDEN whenever the pointer is over (or above) the hero
 * stage, and only appears once the pointer is BELOW the artwork — i.e. when you
 * scroll/move down to the GAMERS title + colophon, where it reads as the page's
 * own targeting cursor. Below the art it's a free, tight ~50ms exponential
 * follow. Hidden on touch; reduced-motion = no lag.
 *
 * The native cursor is suppressed (.reticle-on on .gamers-root) ONLY while the
 * reticle is actually shown, so the normal cursor returns over the artwork.
 */
export default function Reticle() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const noHover = window.matchMedia("(hover: none)").matches;
    if (noHover) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const elRef = ref.current;
    if (!elRef) return;
    const el: HTMLDivElement = elRef;

    const gamersRoot = document.querySelector(".gamers-root");

    // pointer target
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    // rendered position
    let px = tx;
    let py = ty;
    let shown = false;
    let last = performance.now();
    let lastMeasure = last;

    // Response time (s). Smaller = snappier. A targeting cursor wants to feel
    // locked ~1:1 to the pointer (only enough smoothing to kill sub-pixel jitter).
    const FREE_SMOOTH = reduce ? 0 : 0.012;

    // The hero artwork's bottom edge is the visibility divider: above it the
    // reticle stays hidden (the art owns the targeting HUD there), below it the
    // reticle is the page cursor. Measured off .hero-stage; a small clearance
    // keeps the hand-off from flickering right at the seam.
    const HANDOFF_PAD = 12;
    let heroBottom = 0;
    function measureHero() {
      const stage = document.querySelector(".hero-stage");
      heroBottom = stage ? stage.getBoundingClientRect().bottom + HANDOFF_PAD : 0;
    }
    measureHero();
    window.addEventListener("scroll", measureHero, { passive: true });
    window.addEventListener("resize", measureHero);

    // shown only when the pointer is BELOW the hero artwork
    function shouldShow(y: number) {
      return y > heroBottom;
    }

    function show() {
      if (!shown) {
        shown = true;
        el.style.opacity = "1";
        gamersRoot?.classList.add("reticle-on");
      }
    }
    function hide() {
      if (shown) {
        shown = false;
        el.style.opacity = "0";
        gamersRoot?.classList.remove("reticle-on");
      }
    }
    function onMove(e: MouseEvent) {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown && shouldShow(ty)) {
        // appearing fresh below the art — seed at the pointer so there's no
        // slide-in from a stale position.
        px = tx;
        py = ty;
      }
      if (shouldShow(ty)) show();
      else hide();
    }
    function onWindowOut(e: MouseEvent) {
      const evt = e as MouseEvent & { toElement?: Element };
      if (!e.relatedTarget && !evt.toElement) hide();
    }

    window.addEventListener("mousemove", onMove);
    // ALSO track pointermove: when the custom scrollbar thumb captures the
    // pointer (setPointerCapture on drag), mousemove gets retargeted to the
    // thumb and stops updating the reticle — it'd freeze mid-drag. pointermove
    // keeps firing on document during capture, so the reticle keeps tracking.
    // PointerEvent extends MouseEvent (same clientX/clientY), so onMove handles it.
    window.addEventListener("pointermove", onMove as (e: Event) => void);
    document.addEventListener("mouseout", onWindowOut);

    let raf = 0;
    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      // low-cadence re-measure (~6x/s) so a late layout shift can't leave the
      // hero divider stale, at 1/20th the per-frame reflow cost.
      if (now - lastMeasure > 160) {
        measureHero();
        lastMeasure = now;
      }
      // keep visibility in sync even when the pointer is still but the page
      // scrolled (heroBottom moved past/under the stationary pointer).
      if (shown && !shouldShow(ty)) hide();
      else if (!shown && shouldShow(ty)) {
        px = tx;
        py = ty;
        show();
      }

      if (shown) {
        const a = FREE_SMOOTH <= 0 ? 1 : 1 - Math.exp(-dt / FREE_SMOOTH);
        px += (tx - px) * a;
        py += (ty - py) * a;
        el.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("pointermove", onMove as (e: Event) => void);
      document.removeEventListener("mouseout", onWindowOut);
      window.removeEventListener("scroll", measureHero);
      window.removeEventListener("resize", measureHero);
      gamersRoot?.classList.remove("reticle-on");
    };
  }, []);

  // crosshair-only reticle (no corner brackets / square)
  return (
    <div ref={ref} className="reticle" aria-hidden>
      <svg width="26" height="26" viewBox="0 0 26 26" shapeRendering="crispEdges">
        <path className="rt-stroke" d="M13 4 V11" />
        <path className="rt-stroke" d="M13 15 V22" />
        <path className="rt-stroke" d="M4 13 H11" />
        <path className="rt-stroke" d="M15 13 H22" />
        <rect className="rt-fill" x="12.5" y="12.5" width="1" height="1" />
      </svg>
    </div>
  );
}
