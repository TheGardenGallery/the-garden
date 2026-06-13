"use client";

import { useEffect, useRef } from "react";

/**
 * Reticle — a custom targeting-cursor that follows the pointer, mirroring the
 * piece's HUD crosshair. Crisp pixel strokes, themed from --ink.
 *
 * KEEP-OUT BOUNDARY (deliberate): the reticle must NEVER enter the artwork's
 * frame. The artwork is a fixed render — you cannot steer the game with the
 * cursor — so letting the reticle roam over it would falsely imply control.
 * When the pointer is over (or inside the clearance around) the art, the
 * reticle rides the frame's PERIMETER at the point nearest the pointer: it
 * reads as a targeting system tracking you along the edge, locked out.
 *
 * REFINED MOTION (the previous version got STUCK — it re-snapped to the nearest
 * edge every frame and so could never cross the box to follow the pointer out
 * the far side). Here, when the pointer is inside the zone we track the reticle
 * by ARC-LENGTH along the rectangle perimeter and ease it the SHORT way toward
 * the pointer's projection. That keeps it exactly on the border, sliding around
 * corners, never cutting through the interior and never trapped. Outside the
 * zone it's a free, tight ~50ms exponential follow. Hidden on touch;
 * reduced-motion = no lag.
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
    gamersRoot?.classList.add("reticle-on");

    // pointer target
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    // rendered position
    let px = tx;
    let py = ty;
    // when riding the border we track arc-length along the perimeter (px,py are
    // derived from it); onBorder tells us which regime we're in.
    let onBorder = false;
    let s = 0;
    let shown = false;
    let last = performance.now();

    // Response time (s). Smaller = snappier; a targeting cursor wants near-1:1
    // with a whisper of lag, not a loose spring.
    const SMOOTH = reduce ? 0 : 0.05;

    // forbidden zone = .hero-stage box expanded by a clearance
    const FRAME_PAD = 44;
    type Box = { l: number; t: number; r: number; b: number; w: number; h: number; peri: number };
    let forbid: Box | null = null;
    function measureForbidden() {
      const stage = document.querySelector(".hero-stage");
      if (!stage) {
        forbid = null;
        return;
      }
      const r = stage.getBoundingClientRect();
      const l = r.left - FRAME_PAD;
      const t = r.top - FRAME_PAD;
      const rr = r.right + FRAME_PAD;
      const b = r.bottom + FRAME_PAD;
      const w = rr - l;
      const h = b - t;
      forbid = { l, t, r: rr, b, w, h, peri: 2 * (w + h) };
    }
    measureForbidden();
    window.addEventListener("scroll", measureForbidden, { passive: true });
    window.addEventListener("resize", measureForbidden);

    function inside(x: number, y: number) {
      const f = forbid;
      return !!f && x > f.l && x < f.r && y > f.t && y < f.b;
    }

    // nearest point on the perimeter to (x,y) — for the target projection
    function nearestPerimeter(x: number, y: number): [number, number] {
      const f = forbid;
      if (!f) return [x, y];
      const dl = x - f.l;
      const dr = f.r - x;
      const dt = y - f.t;
      const db = f.b - y;
      const m = Math.min(dl, dr, dt, db);
      if (m === dl) return [f.l, y];
      if (m === dr) return [f.r, y];
      if (m === dt) return [x, f.t];
      return [x, f.b];
    }

    // map a point ON (or near) the border to its arc-length s in [0, peri),
    // walking clockwise from the top-left corner: top → right → bottom → left.
    function pointToArc(x: number, y: number): number {
      const f = forbid;
      if (!f) return 0;
      const cx = Math.max(f.l, Math.min(f.r, x));
      const cy = Math.max(f.t, Math.min(f.b, y));
      const dTop = cy - f.t;
      const dRight = f.r - cx;
      const dBottom = f.b - cy;
      const dLeft = cx - f.l;
      const m = Math.min(dTop, dRight, dBottom, dLeft);
      if (m === dTop) return cx - f.l; // top edge: 0..w
      if (m === dRight) return f.w + (cy - f.t); // right edge: w..w+h
      if (m === dBottom) return f.w + f.h + (f.r - cx); // bottom: w+h..2w+h
      return f.w + f.h + f.w + (f.b - cy); // left edge: 2w+h..2w+2h
    }

    // map an arc-length s back to an (x,y) on the perimeter
    function arcToPoint(sv: number): [number, number] {
      const f = forbid;
      if (!f) return [px, py];
      let d = ((sv % f.peri) + f.peri) % f.peri;
      if (d < f.w) return [f.l + d, f.t]; // top
      d -= f.w;
      if (d < f.h) return [f.r, f.t + d]; // right
      d -= f.h;
      if (d < f.w) return [f.r - d, f.b]; // bottom
      d -= f.w;
      return [f.l, f.b - d]; // left
    }

    function show() {
      if (!shown) {
        shown = true;
        el.style.opacity = "1";
      }
    }
    function onMove(e: MouseEvent) {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        if (inside(tx, ty)) {
          const [bx, by] = nearestPerimeter(tx, ty);
          px = bx;
          py = by;
          s = pointToArc(bx, by);
          onBorder = true;
        } else {
          px = tx;
          py = ty;
          onBorder = false;
        }
      }
      show();
    }
    function onWindowOut(e: MouseEvent) {
      const evt = e as MouseEvent & { toElement?: Element };
      if (!e.relatedTarget && !evt.toElement) {
        shown = false;
        el.style.opacity = "0";
      }
    }
    function onWindowOver() {
      show();
    }

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseout", onWindowOut);
    document.addEventListener("mouseover", onWindowOver);

    let raf = 0;
    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      measureForbidden();
      const f = forbid;
      const a = SMOOTH <= 0 ? 1 : 1 - Math.exp(-dt / SMOOTH);

      if (f && inside(tx, ty)) {
        // pointer is over the art → ride the perimeter, easing the SHORT way
        // around to the projection of the pointer. Track in arc-length so we
        // glide along the border (around corners) and never cross the interior.
        const [bx, by] = nearestPerimeter(tx, ty);
        const sTarget = pointToArc(bx, by);
        if (!onBorder) {
          // just entered: seed arc-length from where we currently are so there
          // is no jump, then start easing along the border.
          s = pointToArc(px, py);
          onBorder = true;
        }
        // shortest signed distance around the loop
        let diff = sTarget - s;
        if (diff > f.peri / 2) diff -= f.peri;
        else if (diff < -f.peri / 2) diff += f.peri;
        s += diff * a;
        const [nx, ny] = arcToPoint(s);
        px = nx;
        py = ny;
      } else {
        // pointer is in free space → free 2D follow toward the pointer.
        if (onBorder) onBorder = false; // peel off the border smoothly
        px += (tx - px) * a;
        py += (ty - py) * a;
        // safety: if a fast move clipped the box, ride it back onto the nearest
        // edge (rare; keeps the keep-out absolute without trapping — next frames
        // continue easing toward the now-outside pointer).
        if (inside(px, py)) {
          const [bx, by] = nearestPerimeter(px, py);
          px = bx;
          py = by;
        }
      }

      el.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseout", onWindowOut);
      document.removeEventListener("mouseover", onWindowOver);
      window.removeEventListener("scroll", measureForbidden);
      window.removeEventListener("resize", measureForbidden);
      document.querySelector(".gamers-root")?.classList.remove("reticle-on");
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
