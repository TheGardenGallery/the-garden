/**
 * Tiny CP437 dust particle system. Each mote has its own velocity, gravity,
 * drift, rotation, lifetime and fade — emitted at a letter's baseline when the
 * spring wave hits it. Rendered to a canvas for cheap, crisp compositing.
 */

const GLYPHS = ["·", "░", ":", "˙", "•", "▪", "‚"];

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // seconds remaining
  maxLife: number;
  size: number;
  glyph: string;
  rot: number;
  vrot: number;
}

const GRAVITY = 220; // px/s^2 — pulls motes back down after the kick
const DRAG = 1.6; // air resistance

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}

/** Spawn a small burst of dust at (x, y) kicking up-and-out. */
export function emitDust(x: number, y: number, count: number): Particle[] {
  const out: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const maxLife = rand(0.35, 0.7);
    out.push({
      x: x + rand(-2, 2),
      y,
      // kick upward and slightly forward (rightward, the way you're riding)
      vx: rand(-30, 55),
      vy: rand(-150, -70),
      life: maxLife,
      maxLife,
      size: rand(7, 12),
      glyph: GLYPHS[(Math.random() * GLYPHS.length) | 0],
      rot: rand(0, Math.PI * 2),
      vrot: rand(-4, 4),
    });
  }
  return out;
}

/** Advance one particle by dt. Returns false when dead. */
export function stepParticle(p: Particle, dt: number): boolean {
  p.life -= dt;
  if (p.life <= 0) return false;
  // drag + gravity
  p.vx -= p.vx * DRAG * dt;
  p.vy += GRAVITY * dt;
  p.vy -= p.vy * DRAG * dt * 0.4;
  p.x += p.vx * dt;
  p.y += p.vy * dt;
  p.rot += p.vrot * dt;
  return true;
}

/** Particle opacity from its remaining life (ease-out fade). */
export function particleAlpha(p: Particle): number {
  const t = p.life / p.maxLife; // 1 → 0
  // quick rise, slow fade
  return t > 0.85 ? (1 - t) / 0.15 : t / 0.85;
}
