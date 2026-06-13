/**
 * Minimal velocity-aware spring solver (semi-implicit Euler).
 * Interruptible: set a new target mid-flight and motion continues from the
 * current position + velocity, the way real game UI springs behave.
 *
 * Defaults are tuned for snappy-but-settled UI motion (think Balatro/UIKit).
 */
export interface SpringConfig {
  stiffness: number; // higher = faster pull to target
  damping: number; // higher = less oscillation
  mass: number;
}

export const SPRING_SNAPPY: SpringConfig = {
  stiffness: 420,
  damping: 22,
  mass: 1,
};

export class Spring {
  value: number;
  velocity = 0;
  target: number;
  private cfg: SpringConfig;

  constructor(initial = 0, cfg: SpringConfig = SPRING_SNAPPY) {
    this.value = initial;
    this.target = initial;
    this.cfg = cfg;
  }

  setTarget(t: number) {
    this.target = t;
  }

  /** Add an instantaneous velocity impulse (the "kick"). */
  kick(v: number) {
    this.velocity += v;
  }

  /** Advance by dt seconds. Returns true while still moving. */
  step(dt: number): boolean {
    // clamp dt so a stalled tab doesn't explode the integration
    const h = Math.min(dt, 1 / 30);
    const { stiffness, damping, mass } = this.cfg;
    const force = -stiffness * (this.value - this.target) - damping * this.velocity;
    const accel = force / mass;
    this.velocity += accel * h;
    this.value += this.velocity * h;

    const settled =
      Math.abs(this.velocity) < 0.01 && Math.abs(this.value - this.target) < 0.001;
    if (settled) {
      this.value = this.target;
      this.velocity = 0;
      return false;
    }
    return true;
  }
}
