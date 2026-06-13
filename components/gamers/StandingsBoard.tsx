"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  fetchStandings,
  subscribeTicks,
  type Entry,
} from "@/lib/gamers/leaderboard";

/**
 * StandingsBoard — the global GAMERS leaderboard.
 * ----------------------------------------------------------------------------
 * Reads the mock data layer and renders a catalogue-style ranking
 * (rank · score · handle) for the full 1000-entry field inside a ~7-row-tall
 * scroll window.
 *
 * Performance: the list is VIRTUALIZED (windowed). Although the field is 1000
 * entries, only the rows in (and just outside) the visible band are mounted to
 * the DOM. A tall spacer establishes the full scroll height so the scrollbar
 * still reaches rank 1000, and the rendered slice is offset via paddingTop so
 * each row lands in its true position. This keeps scroll at a locked frame
 * rate regardless of field size.
 *
 * Live ticks still re-rank the field every ~2.6s (setEntries with a fresh
 * sorted array) so ranks/scores update in place. The previous FLIP spring
 * animation was removed: it is incompatible with virtualization (rows
 * mount/unmount on scroll) and was a secondary perf cost. Rows simply
 * re-render in their new order.
 *
 * Interactions:
 *  · click a row → pitches that artwork as the page hero (emit a
 *                  `gamers:pitch-hero` event).
 */

const ROW_H = 96; // px, must match .lb-row height in CSS (taller to clear the big 3D-extruded type + its down-left depth)
const VISIBLE_ROWS = 7; // scroll-area height = this many rows
const OVERSCAN = 5; // extra rows rendered above/below the visible band

/**
 * Score → colour: a refined GREEN→RED performance gradient by rank. The leaders
 * (high score, winning) glow green; as you scroll down into lower scores the hue
 * walks through chartreuse and amber to red at the losing tail. Hue is eased so
 * the top stays confidently green and the slide into red is gradual, at a fixed
 * saturation/lightness tuned to read cleanly on the near-black ground.
 */
const FIELD = 1000; // ranks span 1..FIELD across the full hue ramp
/**
 * tierColor — the arcade HIGH-SCORES rainbow. The reference CRT runs the
 * spectrum top→bottom exactly like the photo: cyan crown → blue → violet →
 * magenta → red, then wrapping warm amber → green → teal toward the tail. The
 * whole row (rank, name AND score) glows in this one shared hue, so colour
 * MEANS standing.
 *
 * Hue starts at cyan (188°) for rank 1 and walks UP (188→240 blue→280 violet→
 * 320 magenta→360/0 red→ then 40 amber→100 green→160 teal), sweeping a full 360°
 * across a rolling WINDOW so any ~10-row screenful shows the rich spread the
 * photo has rather than ten near-identical greens.
 */
const HUE_START = 188; // cyan crown
const HUE_SWEEP = 360; // full wheel across one window
const WINDOW = 16; // ranks per full spectrum sweep
function tierColor(rank: number): string {
  const phase = ((rank - 1) % WINDOW) / WINDOW; // 0..1 within the rolling window
  // walk hue UPWARD (cyan→blue→violet→magenta→red→amber→green→teal) and wrap
  const hue = (HUE_START + phase * HUE_SWEEP) % 360;
  // saturated + bright so it reads as glowing phosphor on the near-black ground
  return `hsl(${hue.toFixed(0)} 85% 62%)`;
}

/** rank → arcade ordinal: 1→1ST, 2→2ND, 3→3RD, 11→11TH, 21→21ST … */
function ordinal(n: number): string {
  const tens = n % 100;
  const ones = n % 10;
  let suf = "TH";
  if (tens < 11 || tens > 13) {
    if (ones === 1) suf = "ST";
    else if (ones === 2) suf = "ND";
    else if (ones === 3) suf = "RD";
  }
  return `${n}${suf}`;
}

export default function StandingsBoard() {
  // Full field of 1000, shown in a ~7-row-tall scroll window you scroll WITHIN —
  // see ~7 at once, scroll all the way down to rank 1000. The page stays put.
  const LIMIT = 1000;
  const [entries, setEntries] = useState<Entry[]>(() => fetchStandings(LIMIT));

  const scrollRef = useRef<HTMLDivElement>(null);
  // current scroll offset (px) of the window, drives which slice we render
  const [scrollTop, setScrollTop] = useState(0);
  // rAF throttle so onScroll never does work synchronously (no layout thrash)
  const rafRef = useRef<number>(0);
  const pendingTop = useRef(0);

  // ---- live tick: rerank in place (no FLIP — virtualization mounts/unmounts
  // rows on scroll, so per-row transform animation is both wrong and costly) --
  const applyTick = useCallback((next: Entry[]) => {
    setEntries(next.slice(0, LIMIT));
  }, []);

  useEffect(() => {
    const unsub = subscribeTicks(applyTick);
    return () => {
      unsub();
      cancelAnimationFrame(rafRef.current);
    };
  }, [applyTick]);

  // ---- windowing: throttle scrollTop reads through a single rAF ------------
  const onScroll = useCallback(() => {
    const sc = scrollRef.current;
    if (!sc) return;
    pendingTop.current = sc.scrollTop;
    if (rafRef.current) return; // already a frame scheduled
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      setScrollTop(pendingTop.current);
    });
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

  // ---- windowing math ------------------------------------------------------
  const total = entries.length;
  const totalHeight = total * ROW_H; // full scroll height → scrollbar reaches rank 1000
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_H) - OVERSCAN);
  const endIndex = Math.min(total, startIndex + VISIBLE_ROWS + 2 * OVERSCAN);
  const visible = entries.slice(startIndex, endIndex);
  const padTop = startIndex * ROW_H;
  // bottom spacer makes the <ol> exactly totalHeight tall so the scrollbar
  // range stays correct even when only a slice is mounted.
  const padBottom = totalHeight - padTop - visible.length * ROW_H;

  return (
    <section className="lb mono" aria-label="Leaderboard">
      {/* single centered title */}
      <h2 className="lb-title">LEADERBOARD</h2>

      {/* column headers — align with the row grid below */}
      <div className="lb-cols dim" aria-hidden>
        <span className="lb-col-rank">RANK</span>
        <span className="lb-col-pilot">PILOT</span>
        <span className="lb-col-score">SCORE</span>
      </div>

      {/* self-contained scroll window: ~7 rows tall, scrolls WITHIN; CSS
          overscroll-behavior:contain keeps the page still until you reach an
          edge, so you scroll through the field without the page moving. */}
      <div
        className="lb-scroll"
        ref={scrollRef}
        onScroll={onScroll}
        style={{ height: ROW_H * VISIBLE_ROWS }}
      >
        <ol
          className="lb-list"
          role="list"
          style={{ paddingTop: padTop, paddingBottom: padBottom }}
        >
          {visible.map((e) => {
            // arcade-style points score (wins weighted), shown as a plain number
            const score = (e.wins * 100).toLocaleString("en-US");
            const moved = e.rank - e.prevRank;
            return (
              <li
                key={e.id}
                className="lb-row"
                data-evolved={e.evolved ? "true" : "false"}
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
                  {/* RANK: bare glowing arcade ordinal (1ST, 2ND … 10TH) */}
                  <span className="lb-c-rank">
                    <span className="lb-rank-ord">{ordinal(e.rank)}</span>
                    {moved !== 0 && (
                      <span
                        className={`lb-delta ${moved < 0 ? "up" : "down"}`}
                        aria-hidden
                      >
                        {moved < 0 ? "▲" : "▼"}
                      </span>
                    )}
                  </span>

                  {/* PILOT: username */}
                  <span className="lb-c-handle">
                    <span className="lb-handle">{e.handle}</span>
                  </span>

                  {/* SCORE: the loud right-aligned hero number */}
                  <span className="lb-c-score">
                    <span className="lb-score-num">{score}</span>
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
