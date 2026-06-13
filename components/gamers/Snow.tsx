"use client";

import { useEffect, useRef } from "react";

/**
 * Snow — a gentle full-page ambient particle layer behind the content.
 * CP437-style specks with real gravity + horizontal drift, wrapping around the
 * viewport. Tinted from the current theme ink (reads --ink off :root), so the
 * snow matches whatever iteration is showing. Single rAF loop, pointer-events
 * none, sits behind content, pauses when the tab is hidden, respects
 * prefers-reduced-motion.
 */

type Flake = {
  x: number;
  y: number;
  vy: number;     // fall speed (px/s)
  vx: number;     // base drift (px/s)
  size: number;   // square side in CSS px (integer)
  alpha: number;
  phase: number;  // for sinusoidal sway
  sway: number;   // sway amplitude
};

export default function Snow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // non-null locals so nested closures keep the narrowed types
    const cv: HTMLCanvasElement = canvas;
    const c: CanvasRenderingContext2D = ctx;

    const dpr = Math.min(Math.round(window.devicePixelRatio || 1), 2);
    let w = 0;
    let h = 0;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      cv.style.width = w + "px";
      cv.style.height = h + "px";
      // draw in DEVICE pixels (no ctx scaling) and disable smoothing so every
      // speck is a crisp pixel-aligned square — no anti-aliased blur
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.imageSmoothingEnabled = false;
    }
    resize();

    // density scales with viewport area: ~1 flake per 7k px² (≈2× the old count)
    const count = Math.round((w * h) / 7000);
    const flakes: Flake[] = [];
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const pick = <T,>(arr: T[]) => arr[(Math.random() * arr.length) | 0];
    // integer square sizes (CSS px) so they stay sharp at the CGA grid
    const SIZES = [1, 2, 2, 3, 3, 4];
    for (let i = 0; i < count; i++) {
      flakes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vy: rnd(14, 34),          // slow fall
        vx: rnd(-6, 6),           // light lateral drift
        size: pick(SIZES),
        alpha: rnd(0.28, 0.7),
        phase: Math.random() * Math.PI * 2,
        sway: rnd(4, 14),
      });
    }

    // read the themed ink colour (r,g,b) so snow matches the iteration
    function inkRGB(): string {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue("--ink")
        .trim();
      const m = v.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
      return m ? `${m[1]}, ${m[2]}, ${m[3]}` : "244, 244, 244";
    }
    let ink = inkRGB();
    // refresh tint periodically (cheap) so re-rolls re-tint the snow
    const tintTimer = window.setInterval(() => {
      ink = inkRGB();
    }, 1000);

    let last = performance.now();
    let raf = 0;
    let running = true;

    function frame(now: number) {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05); // clamp big gaps
      last = now;
      c.clearRect(0, 0, cv.width, cv.height);
      for (const f of flakes) {
        f.phase += dt * 0.8;
        f.y += f.vy * dt;
        f.x += (f.vx + Math.sin(f.phase) * f.sway) * dt;
        // wrap
        if (f.y - f.size > h) {
          f.y = -f.size;
          f.x = Math.random() * w;
        }
        if (f.x < -20) f.x = w + 20;
        else if (f.x > w + 20) f.x = -20;

        // snap to the device-pixel grid → perfectly crisp squares, no blur
        const px = Math.round(f.x * dpr);
        const py = Math.round(f.y * dpr);
        const s = f.size * dpr;
        c.fillStyle = `rgba(${ink}, ${f.alpha})`;
        c.fillRect(px, py, s, s);
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    function onVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    }
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", resize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      clearInterval(tintTimer);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="snow" aria-hidden />;
}
