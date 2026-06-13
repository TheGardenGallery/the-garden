"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  fetchStandings,
  subscribeTicks,
  windowSecondsRemaining,
  WINDOW_HOURS,
  EVOLVE_TOP_N,
  type Entry,
} from "@/lib/gamers/leaderboard";
import { Spring } from "@/lib/gamers/spring";

/**
 * StandingsBoard — the global GAMERS leaderboard.
 * ----------------------------------------------------------------------------
 * Reads the mock data layer, renders a catalogue-style ranking (rank · live
 * world thumbnail · handle · W–L · win-rate bar), and on each simulated live
 * tick re-ranks and animates rows to their new positions with REAL spring
 * physics (FLIP), not CSS keyframes — per house style.
 *
 * Interactions:
 *  · hover a row's thumbnail → the live world zoom-scrolls in (scale + reveal).
 *  · click a row            → pitches that artwork as the page hero (we emit a
 *                             `gamers:pitch-hero` event; the seam is ready for
 *                             the real hero swap once finals exist).
 *  · top-100 (EVOLVE_TOP_N) → marked EVOLVED with a restrained ▲ + hairline
 *                             underglow in the artwork accent, not a trophy.
 */

const ROW_H = 64; // px, must match .lb-row height in CSS

/**
 * Rank → CGA tier colour. Evokes the Pac-Man high-score screen's per-row
 * rainbow, but as a CALM warm→cool descent (not 100 random colours): the
 * leaders glow warm (cyan/white/yellow), the field cools to blue/dim. Reads
 * as a gradient of standing, gallery-grade, not a circus.
 */
function tierColor(rank: number): string {
  if (rank === 1) return "var(--cga-cyan)";
  if (rank <= 3) return "var(--cga-white)";
  if (rank <= 10) return "var(--cga-yellow)";
  if (rank <= 25) return "var(--cga-brown)";
  if (rank <= 50) return "var(--cga-l-green)";
  if (rank <= 100) return "var(--cga-l-blue)";
  return "var(--ink-dim)";
}

function fmtCountdown(total: number): string {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const p = (n: number) => n.toString().padStart(2, "0");
  return `${p(h)}:${p(m)}:${p(s)}`;
}

export default function StandingsBoard() {
  // how many rows to show — keep the scaffold light; real board paginates
  const LIMIT = 100;
  const [entries, setEntries] = useState<Entry[]>(() => fetchStandings(LIMIT));
  const [countdown, setCountdown] = useState<number>(() =>
    windowSecondsRemaining()
  );

  // refs to each row element by entry id, for FLIP measurement
  const rowRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  // springs driving each row's Y offset (one per id), persist across ticks
  const springs = useRef<Map<string, Spring>>(new Map());
  const rafRef = useRef<number>(0);
  const animating = useRef(false);

  // ---- live tick: rerank + FLIP ------------------------------------------
  const applyTick = useCallback((next: Entry[]) => {
    const limited = next.slice(0, LIMIT);
    // FIRST: record current pixel positions before the DOM reorders
    const firstTop = new Map<string, number>();
    rowRefs.current.forEach((el, id) => {
      firstTop.set(id, el.getBoundingClientRect().top);
    });

    setEntries(limited);

    // LAST + INVERT + PLAY happens after paint, via rAF below
    requestAnimationFrame(() => {
      let needsAnim = false;
      rowRefs.current.forEach((el, id) => {
        const lastTop = el.getBoundingClientRect().top;
        const prev = firstTop.get(id);
        if (prev == null) return;
        const dy = prev - lastTop; // how far it must appear to start from
        if (Math.abs(dy) < 0.5) return;
        let sp = springs.current.get(id);
        if (!sp) {
          sp = new Spring(0);
          springs.current.set(id, sp);
        }
        // jump the spring to the inverted offset, target 0 → it springs home
        sp.value = dy;
        sp.setTarget(0);
        needsAnim = true;
      });
      if (needsAnim) startAnim();
    });
  }, []);

  const startAnim = useCallback(() => {
    if (animating.current) return;
    animating.current = true;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      let stillMoving = false;
      springs.current.forEach((sp, id) => {
        const moving = sp.step(dt);
        const el = rowRefs.current.get(id);
        if (el) {
          el.style.transform =
            Math.abs(sp.value) < 0.01
              ? ""
              : `translateY(${sp.value.toFixed(2)}px)`;
        }
        if (moving) stillMoving = true;
      });
      if (stillMoving) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        animating.current = false;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const unsub = subscribeTicks(applyTick);
    return () => {
      unsub();
      cancelAnimationFrame(rafRef.current);
    };
  }, [applyTick]);

  // ---- window countdown ---------------------------------------------------
  useEffect(() => {
    const id = setInterval(() => setCountdown(windowSecondsRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  // ---- click → pitch as hero (seam) --------------------------------------
  const pitchHero = useCallback((e: Entry) => {
    window.dispatchEvent(
      new CustomEvent("gamers:pitch-hero", {
        detail: { id: e.id, fxhash: e.fxhash, handle: e.handle },
      })
    );
    // scaffold feedback: scroll to top where the hero will live
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="lb">
      {/* board masthead — extends the MISSION CONTROL fiction */}
      <div className="lb-head mono">
        <div className="lb-head-line">
          <span className="lb-head-k dim">STANDINGS</span>
          <span className="lb-head-sep" aria-hidden />
          <span className="lb-head-v">
            GLOBAL · ROLLING {WINDOW_HOURS}H
          </span>
        </div>
        <div className="lb-head-line">
          <span className="lb-head-k dim">WINDOW RESETS</span>
          <span className="lb-head-sep" aria-hidden />
          <span className="lb-head-v lb-clock" aria-live="off">
            {fmtCountdown(countdown)}
          </span>
        </div>
        <div className="lb-head-line">
          <span className="lb-head-k dim">EVOLUTION TIER</span>
          <span className="lb-head-sep" aria-hidden />
          <span className="lb-head-v">
            TOP {EVOLVE_TOP_N} · WINNERS EVOLVE ▲
          </span>
        </div>
      </div>

      <hr className="hairline section-rule" />

      {/* column legend */}
      <div className="lb-legend mono dim" aria-hidden>
        <span className="lb-c-rank">#</span>
        <span className="lb-c-thumb" />
        <span className="lb-c-handle">PILOT</span>
        <span className="lb-c-record">W · L</span>
        <span className="lb-c-rate">WIN RATE</span>
      </div>

      <ol className="lb-list" role="list">
        {entries.map((e) => {
          const total = e.wins + e.losses;
          const rate = total ? e.wins / total : 0;
          const moved = e.rank - e.prevRank;
          return (
            <li
              key={e.id}
              className="lb-row mono"
              data-evolved={e.evolved ? "true" : "false"}
              ref={(el) => {
                if (el) rowRefs.current.set(e.id, el);
                else rowRefs.current.delete(e.id);
              }}
              style={
                {
                  height: ROW_H,
                  "--tier": tierColor(e.rank),
                } as React.CSSProperties
              }
            >
              <button
                className="lb-row-btn"
                onClick={() => pitchHero(e)}
                aria-label={`Pitch ${e.handle}'s artwork as the hero`}
              >
                <span className="lb-c-rank">
                  <span className="lb-rank-num">{e.rank}</span>
                  {moved !== 0 && (
                    <span
                      className={`lb-delta ${moved < 0 ? "up" : "down"}`}
                      aria-hidden
                    >
                      {moved < 0 ? "▲" : "▼"}
                      {Math.abs(moved)}
                    </span>
                  )}
                </span>

                <span className="lb-c-thumb">
                  <Thumb fxhash={e.fxhash} id={e.id} />
                </span>

                <span className="lb-c-handle">
                  <span className="lb-handle">{e.handle}</span>
                  {e.evolved && (
                    <span className="lb-evolved" aria-label="evolved">
                      ▲ EVOLVED
                    </span>
                  )}
                </span>

                <span className="lb-c-record">
                  <span className="lb-w">{e.wins}</span>
                  <span className="lb-dot dim" aria-hidden>
                    ·
                  </span>
                  <span className="lb-l dim">{e.losses}</span>
                </span>

                <span className="lb-c-rate">
                  <span className="lb-bar" aria-hidden>
                    <span
                      className="lb-bar-fill"
                      style={{ width: `${(rate * 100).toFixed(1)}%` }}
                    />
                  </span>
                  <span className="lb-rate-num">
                    {(rate * 100).toFixed(0)}%
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/**
 * Thumb — a per-row artwork preview that is CHEAP AT REST and LIVE ON HOVER.
 *
 * WHY: a live WebGL world per row × 100 rows = 100 GPU renderers = the page
 * melts (same class of problem as the hero/world-plate thermal lag). A
 * leaderboard thumbnail doesn't need to animate until you look at it. So at
 * rest we show a static, seed-tinted placeholder (zero GPU); on hover we mount
 * the real live world iframe and let it zoom-scroll in. We keep it mounted for
 * a short grace period after the pointer leaves so a scan back up the list is
 * instant, then unmount to release the context. At most a couple are ever live.
 */
function Thumb({ fxhash, id }: { fxhash: string; id: string }) {
  const [live, setLive] = useState(false);
  const offTimer = useRef<number>(0);

  // a stable, cheap tint derived from the seed — gives each resting thumb a
  // distinct colour so the column reads as 100 different worlds, not 100 blanks.
  const hue = (() => {
    let h = 0;
    for (let i = 2; i < fxhash.length; i++) h = (h * 31 + fxhash.charCodeAt(i)) % 360;
    return h;
  })();

  const enter = useCallback(() => {
    window.clearTimeout(offTimer.current);
    setLive(true);
  }, []);
  const leave = useCallback(() => {
    window.clearTimeout(offTimer.current);
    offTimer.current = window.setTimeout(() => setLive(false), 1200);
  }, []);

  useEffect(() => () => window.clearTimeout(offTimer.current), []);

  return (
    <span
      className="lb-thumb"
      data-id={id}
      data-live={live ? "true" : "false"}
      onMouseEnter={enter}
      onMouseLeave={leave}
      style={
        {
          "--thumb-hue": `${hue}`,
        } as React.CSSProperties
      }
    >
      {/* cheap resting placeholder — pure CSS, no GPU */}
      <span className="lb-thumb-still" aria-hidden />
      {live && (
        <iframe
          className="lb-thumb-frame"
          title=""
          aria-hidden
          tabIndex={-1}
          scrolling="no"
          src={`/gamers/piece-bg/index.html?fxhash=${encodeURIComponent(fxhash)}`}
        />
      )}
    </span>
  );
}
