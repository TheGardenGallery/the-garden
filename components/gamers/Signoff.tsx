"use client";

import { useEffect, useRef } from "react";
import { Spring, SPRING_SNAPPY } from "@/lib/gamers/spring";
import {
  Particle,
  emitDust,
  stepParticle,
  particleAlpha,
} from "@/lib/gamers/dust";

/**
 * Signoff — "Fly high, space cowboy." with game-grade hover motion.
 *
 * A single requestAnimationFrame loop drives:
 *   • per-letter velocity-aware springs (interruptible) for a left→right kick
 *     wave — each letter springs up + zooms, with a skew-lag for secondary
 *     motion (the letters *trail* like they're being dragged through air)
 *   • a CP437 dust particle system (real velocity / gravity / drift / fade)
 *     emitted at each letter's baseline as the wave reaches it
 *
 * Springs and particles share one clock, so re-hovering mid-flight continues
 * from the current state instead of restarting — the way pro game UI feels.
 */

const STAGGER = 0.038; // seconds between letters as the wave travels
const LIFT_KICK = -19; // velocity impulse upward (px/s scaled) per letter
const SCALE_KICK = 9; // velocity impulse on scale spring
const DUST_PER_LETTER = 6;

interface LetterState {
  el: HTMLSpanElement;
  lift: Spring; // vertical offset (px)
  scale: Spring; // scale around 1
  baseX: number; // for dust emission (canvas space)
  baseY: number;
}

export default function Signoff({ text }: { text: string }) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lettersRef = useRef<LetterState[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const lastTRef = useRef<number>(0);
  const reducedRef = useRef(false);

  // Build letter states once the DOM spans exist.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const spans = Array.from(
      wrap.querySelectorAll<HTMLSpanElement>("[data-letter]")
    );
    lettersRef.current = spans.map((el) => ({
      el,
      lift: new Spring(0, SPRING_SNAPPY),
      scale: new Spring(0, { stiffness: 480, damping: 20, mass: 1 }),
      baseX: 0,
      baseY: 0,
    }));

    let running = false;

    const sizeCanvas = () => {
      const c = canvasRef.current;
      if (!c) return;
      const r = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.ceil(r.width * dpr);
      c.height = Math.ceil((r.height + 40) * dpr);
      c.style.width = `${r.width}px`;
      c.style.height = `${r.height + 40}px`;
      const ctx = c.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    sizeCanvas();

    // measure each letter's baseline (canvas-local) for dust emission
    const measure = () => {
      const wr = wrap.getBoundingClientRect();
      for (const L of lettersRef.current) {
        const r = L.el.getBoundingClientRect();
        L.baseX = r.left - wr.left + r.width / 2;
        L.baseY = r.bottom - wr.top + 6;
      }
    };
    measure();

    const ctx = canvasRef.current?.getContext("2d") ?? null;

    const tick = (t: number) => {
      const dt = lastTRef.current ? (t - lastTRef.current) / 1000 : 0;
      lastTRef.current = t;

      let alive = false;

      // springs → transforms
      for (const L of lettersRef.current) {
        const m1 = L.lift.step(dt);
        const m2 = L.scale.step(dt);
        if (m1 || m2) alive = true;
        const lift = L.lift.value;
        const scale = 1 + L.scale.value * 0.05;
        // secondary motion: skew proportional to vertical velocity (trail/lag)
        const skew = Math.max(-10, Math.min(10, L.lift.velocity * 0.06));
        L.el.style.transform = `translateY(${lift}px) scale(${scale}) skewX(${skew}deg)`;
      }

      // particles
      if (ctx) {
        const c = canvasRef.current!;
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.font = "12px MBytePC230, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const ink = getComputedStyle(document.documentElement)
          .getPropertyValue("--ink")
          .trim();
        const parts = particlesRef.current;
        for (let i = parts.length - 1; i >= 0; i--) {
          const p = parts[i];
          if (!stepParticle(p, dt)) {
            parts.splice(i, 1);
            continue;
          }
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, Math.min(0.85, particleAlpha(p) * 0.7));
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = ink || "#888";
          ctx.font = `${p.size}px MBytePC230, monospace`;
          ctx.fillText(p.glyph, 0, 0);
          ctx.restore();
        }
      }

      if (alive) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        running = false;
        lastTRef.current = 0;
      }
    };

    const startLoop = () => {
      if (running) return;
      running = true;
      lastTRef.current = 0;
      rafRef.current = requestAnimationFrame(tick);
    };

    const onEnter = () => {
      if (reducedRef.current) return;
      measure(); // re-measure in case layout/theme shifted
      const letters = lettersRef.current;
      letters.forEach((L, i) => {
        // schedule each letter's kick + dust burst along the L→R wave
        window.setTimeout(() => {
          L.lift.kick(LIFT_KICK * 14); // impulse (px/s)
          L.scale.kick(SCALE_KICK);
          particlesRef.current.push(
            ...emitDust(L.baseX, L.baseY, DUST_PER_LETTER)
          );
          startLoop();
        }, i * STAGGER * 1000);
      });
    };

    wrap.addEventListener("mouseenter", onEnter);
    const onResize = () => {
      sizeCanvas();
      measure();
    };
    window.addEventListener("resize", onResize);

    return () => {
      wrap.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [text]);

  const chars = [...text];

  return (
    <span className="signoff-wrap" ref={wrapRef}>
      <span className="lede signoff" aria-label={text}>
        {chars.map((ch, i) =>
          ch === " " ? (
            <span key={i} className="signoff-space">
              &nbsp;
            </span>
          ) : (
            <span key={i} data-letter className="signoff-letter" aria-hidden>
              {ch}
            </span>
          )
        )}
      </span>
      <canvas ref={canvasRef} className="signoff-dust" aria-hidden />
    </span>
  );
}
