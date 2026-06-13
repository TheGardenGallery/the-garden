"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  fetchStandings,
  subscribeTicks,
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

const ROW_H = 76; // px, must match .lb-row height in CSS (artwork-rectangle row)
const VISIBLE_ROWS = 7; // scroll-area height = this many rows

/**
 * Rank → colour from the cool electric register, stepped in pairs across the
 * top 10 so scrolling the window reveals a continuous cool "gradient of
 * standing": aqua crown → teal → azure → indigo → cool violet, slate beyond.
 */
function tierColor(rank: number): string {
  if (rank <= 2) return "var(--pal-saffron)"; // electric aqua — crown
  if (rank <= 4) return "var(--pal-sienna)"; // bright teal
  if (rank <= 6) return "var(--pal-madder)"; // azure
  if (rank <= 8) return "var(--pal-violet)"; // electric indigo
  if (rank <= 10) return "var(--pal-peacock)"; // cool violet
  return "var(--pal-moss)"; // deep slate field (beyond the visible 10)
}

export default function StandingsBoard() {
  // Full field of 1000, shown in a ~7-row-tall scroll window you scroll WITHIN —
  // see ~7 at once, scroll all the way down to rank 1000. The page stays put.
  const LIMIT = 1000;
  const [entries, setEntries] = useState<Entry[]>(() => fetchStandings(LIMIT));

  // refs to each row element by entry id, for FLIP measurement
  const rowRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const scrollRef = useRef<HTMLDivElement>(null);
  // springs driving each row's Y offset (one per id), persist across ticks
  const springs = useRef<Map<string, Spring>>(new Map());
  const rafRef = useRef<number>(0);
  const animating = useRef(false);

  // ---- live tick: rerank + FLIP (ONLY for rows in/near the visible window —
  // measuring all 1000 rows each tick would stutter; off-screen rows just snap) ----
  const applyTick = useCallback((next: Entry[]) => {
    const limited = next.slice(0, LIMIT);

    // visible band of the scroll window (+ a margin), so we only FLIP what's seen
    const sc = scrollRef.current;
    const viewTop = sc ? sc.getBoundingClientRect().top - 200 : -Infinity;
    const viewBot = sc ? sc.getBoundingClientRect().bottom + 200 : Infinity;
    const inView = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return r.bottom >= viewTop && r.top <= viewBot;
    };

    // FIRST: record current pixel positions before the DOM reorders (visible only)
    const firstTop = new Map<string, number>();
    rowRefs.current.forEach((el, id) => {
      if (inView(el)) firstTop.set(id, el.getBoundingClientRect().top);
    });

    setEntries(limited);

    // LAST + INVERT + PLAY happens after paint, via rAF below
    requestAnimationFrame(() => {
      let needsAnim = false;
      firstTop.forEach((prev, id) => {
        const el = rowRefs.current.get(id);
        if (!el) return;
        const lastTop = el.getBoundingClientRect().top;
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
    <section className="lb mono" aria-label="Leaderboard">
      {/* single centered title */}
      <h2 className="lb-title">LEADERBOARD</h2>

      {/* column headers — align with the row grid below */}
      <div className="lb-cols dim" aria-hidden>
        <span className="lb-col-rank">RANK</span>
        <span className="lb-col-score">SCORE</span>
        <span className="lb-col-pilot">PILOT</span>
      </div>

      {/* self-contained scroll window: ~7 rows tall, scrolls WITHIN; CSS
          overscroll-behavior:contain keeps the page still until you reach an
          edge, so you scroll through the 10 without the page moving. */}
      <div className="lb-scroll" ref={scrollRef} style={{ height: ROW_H * VISIBLE_ROWS }}>
        <ol className="lb-list" role="list">
          {entries.map((e) => {
            // arcade-style points score (wins weighted), shown as a plain number
            const score = (e.wins * 100).toLocaleString("en-US");
            const moved = e.rank - e.prevRank;
            return (
              <li
                key={e.id}
                className="lb-row"
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
                  aria-label={`Pitch ${e.handle}'s artwork as the hero, rank ${e.rank}`}
                >
                  {/* RANK: a plain white box with the black rank number */}
                  <span className="lb-c-art">
                    <span className="lb-art-rank">
                      {e.rank.toString().padStart(2, "0")}
                    </span>
                    {moved !== 0 && (
                      <span
                        className={`lb-delta ${moved < 0 ? "up" : "down"}`}
                        aria-hidden
                      >
                        {moved < 0 ? "▲" : "▼"}
                      </span>
                    )}
                  </span>

                  {/* SCORE: arcade-style points number */}
                  <span className="lb-c-score">
                    <span className="lb-score-num">{score}</span>
                  </span>

                  {/* PILOT: username */}
                  <span className="lb-c-handle">
                    <span className="lb-handle">{e.handle}</span>
                    {e.evolved && (
                      <span className="lb-evolved" aria-hidden>
                        EVOLVED
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
