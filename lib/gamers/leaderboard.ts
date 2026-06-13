/**
 * GAMERS — leaderboard data layer (MOCK / DESIGN SCAFFOLD)
 * ----------------------------------------------------------------------------
 * The real system will rank every minted artwork by wins/losses accrued in a
 * rolling 24-hour window; the top 100 "winners" each day earn an evolution of
 * their piece. None of that infrastructure exists yet (mints/finals pending),
 * so this module is a SELF-CONTAINED, DETERMINISTIC mock that produces a
 * believable global standings table plus a simulated live tick, letting us
 * design the board's motion + interactions against real-feeling data.
 *
 * SWAP SEAM: replace `fetchStandings()` and `subscribeTicks()` with calls to a
 * real route handler / socket later. The Entry shape is the contract — keep it
 * stable and the UI doesn't change.
 */

export type Entry = {
  id: string; // stable artwork id (will map to token id later)
  fxhash: string; // the seed — drives the live world preview, same as the hero
  handle: string; // owner/collector handle shown on the row
  wins: number; // wins in the rolling 24h window
  losses: number; // losses in the rolling 24h window
  rank: number; // 1-based, derived (recomputed each tick)
  prevRank: number; // last tick's rank — lets the UI animate deltas
  evolved: boolean; // top-100 winner → artwork has earned an evolution
};

export const WINDOW_HOURS = 24;
export const EVOLVE_TOP_N = 100;
export const TOTAL_ARTWORKS = 1000; // mock pool size (real edition TBA)

// fxhash seed alphabet + format, matching the piece (oo + 49 chars)
const ALPHABET =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

// ---- deterministic seeded RNG (mulberry32) so the mock is stable per reload ---
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeFxHash(rnd: () => number): string {
  let s = "oo";
  for (let i = 0; i < 49; i++) s += ALPHABET[Math.floor(rnd() * ALPHABET.length)];
  return s;
}

const HANDLE_PARTS_A = [
  "neon", "cosmic", "pixel", "vapor", "hyper", "retro", "lunar", "delta",
  "void", "chrome", "static", "turbo", "echo", "flux", "nova", "byte",
  "ghost", "solar", "drift", "zero", "atom", "raster", "quartz", "ember",
];
const HANDLE_PARTS_B = [
  "rider", "pilot", "gamer", "runner", "cowboy", "ace", "ranger", "nomad",
  "hunter", "wraith", "scout", "racer", "jockey", "sniper", "rogue", "knight",
  "vector", "phantom", "captain", "dealer", "cadet", "maverick", "wizard", "punk",
];

function makeHandle(rnd: () => number, i: number): string {
  const a = HANDLE_PARTS_A[Math.floor(rnd() * HANDLE_PARTS_A.length)];
  const b = HANDLE_PARTS_B[Math.floor(rnd() * HANDLE_PARTS_B.length)];
  // consume the same rnd() draw as before so the downstream deterministic
  // sequence (fxhash, wins, …) is unchanged, but DON'T append the number —
  // handles read as plain `word_word` (e.g. atom_cowboy), no trailing digits.
  rnd();
  return `${a}_${b}`;
}

/** Build the deterministic seed pool once (stable handles + seeds per id). */
function buildPool(): Entry[] {
  const rnd = mulberry32(0x6a3d1f);
  const pool: Entry[] = [];
  for (let i = 0; i < TOTAL_ARTWORKS; i++) {
    pool.push({
      id: `gm-${i.toString().padStart(4, "0")}`,
      fxhash: makeFxHash(rnd),
      handle: makeHandle(rnd, i),
      wins: 0,
      losses: 0,
      rank: 0,
      prevRank: 0,
      evolved: false,
    });
  }
  return pool;
}

const POOL = buildPool();

/** Rank by SCORE (wins) descending — so rank 1 always has the highest score.
 *  Win-rate breaks ties, then id for stability. */
function rerank(entries: Entry[]): Entry[] {
  const scored = [...entries].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    const wrA = a.wins / Math.max(1, a.wins + a.losses);
    const wrB = b.wins / Math.max(1, b.wins + b.losses);
    if (wrB !== wrA) return wrB - wrA;
    return a.id.localeCompare(b.id);
  });
  scored.forEach((e, i) => {
    e.prevRank = e.rank || i + 1;
    e.rank = i + 1;
    e.evolved = e.rank <= EVOLVE_TOP_N;
  });
  return scored;
}

/**
 * Seed the pool with a believable 24h spread of wins/losses. Power-law-ish so
 * the top of the board is competitive and the long tail is sparse.
 */
function seedWindow(): Entry[] {
  const rnd = mulberry32(0xc0ffee);
  POOL.forEach((e, i) => {
    // bias: lower index slightly more active, but plenty of noise so ranks mix
    const activity = Math.pow(rnd(), 1.6); // 0..1, skewed low
    const games = Math.floor(activity * 80) + Math.floor(rnd() * 6);
    const skill = 0.3 + rnd() * 0.55; // each artwork's latent win probability
    let wins = 0;
    for (let g = 0; g < games; g++) if (rnd() < skill) wins++;
    e.wins = wins;
    e.losses = games - wins;
    e.rank = 0;
    e.prevRank = 0;
  });
  return rerank(POOL);
}

let CURRENT: Entry[] = seedWindow();

/** Return the current standings snapshot (top `limit`, or all). */
export function fetchStandings(limit?: number): Entry[] {
  const snap = CURRENT.map((e) => ({ ...e }));
  return typeof limit === "number" ? snap.slice(0, limit) : snap;
}

/** Seconds remaining in the rolling 24h window (mock: counts down to the next
 *  UTC-midnight boundary, so it's always in [0, 24h) and the clock reads sanely). */
export function windowSecondsRemaining(): number {
  const now = new Date();
  const next = new Date(now);
  next.setUTCHours(24, 0, 0, 0); // next UTC midnight
  return Math.max(0, Math.floor((next.getTime() - now.getTime()) / 1000));
}

/**
 * Simulated live tick: play a handful of random matchups, update W/L, rerank,
 * and push the new snapshot to subscribers. This is what drives the board's
 * spring-reorder motion in the scaffold. Returns an unsubscribe fn.
 */
export function subscribeTicks(
  onTick: (entries: Entry[]) => void,
  intervalMs = 2600
): () => void {
  let rnd = mulberry32(Date.now() & 0xffffffff);
  const id = setInterval(() => {
    const matches = 6 + Math.floor(rnd() * 8);
    for (let m = 0; m < matches; m++) {
      const a = CURRENT[Math.floor(rnd() * CURRENT.length)];
      const b = CURRENT[Math.floor(rnd() * CURRENT.length)];
      if (!a || !b || a === b) continue;
      // higher current win-rate is favored, but upsets happen
      const wrA = a.wins / Math.max(1, a.wins + a.losses);
      const wrB = b.wins / Math.max(1, b.wins + b.losses);
      const pA = 0.5 + (wrA - wrB) * 0.4;
      if (rnd() < pA) {
        a.wins++;
        b.losses++;
      } else {
        b.wins++;
        a.losses++;
      }
    }
    CURRENT = rerank(CURRENT);
    onTick(CURRENT.map((e) => ({ ...e })));
  }, intervalMs);
  return () => clearInterval(id);
}

/** Look up a single entry by id (for the click-to-hero pitch). */
export function getEntry(id: string): Entry | undefined {
  const e = CURRENT.find((x) => x.id === id);
  return e ? { ...e } : undefined;
}
