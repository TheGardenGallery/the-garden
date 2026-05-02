"use client";

import { useEffect, useRef, useState } from "react";
import type { BespokeProps } from "../registry";

/**
 * Split Logic — Intermission.
 *
 * A quiet pause module for Ricky's exhibition page. Holds a single
 * pull-quote against the dark surface; the quote reveals one character
 * at a time using a tight character-flip animation that echoes the
 * welcome overlay's split-flap mechanic — the same motion vocabulary
 * that gives his work its name. The module is otherwise restrained:
 * no decoration, no accent flourish, just type and timing.
 *
 * Config:
 *   {
 *     quote: string;
 *     attribution?: string;
 *   }
 *
 * Reveal triggers when the section scrolls into view (IntersectionObserver),
 * not on mount, so the choreography lands as the viewer arrives — not
 * before. After the reveal, the section is static; scrolling back up
 * does not replay the animation.
 */

type Config = {
  quote?: string;
  attribution?: string;
};

const STAGGER_MS = 32;        // per-character delay
const FLIP_MS = 480;          // single character's flip duration
const APEX_DELAY_MS = 120;    // hold before the first character flips

export function Intermission({ config }: BespokeProps) {
  const { quote = "", attribution } = config as Config;
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Split into characters, preserving spaces. Each character animates
  // independently; spaces stay rendered but don't take animation cycles.
  const chars = Array.from(quote);

  return (
    <section
      ref={ref}
      className="bespoke-intermission"
      data-visible={visible || undefined}
      aria-label="Intermission"
    >
      <div className="bespoke-intermission-inner">
        <blockquote className="bespoke-intermission-quote">
          <p>
            {chars.map((c, i) => (
              <span
                key={i}
                className="bespoke-intermission-char"
                style={{
                  animationDelay: visible
                    ? `${APEX_DELAY_MS + i * STAGGER_MS}ms`
                    : undefined,
                  animationDuration: `${FLIP_MS}ms`,
                }}
                aria-hidden={c === " " ? "true" : undefined}
              >
                {c === " " ? " " : c}
              </span>
            ))}
          </p>
          {attribution && (
            <cite
              className="bespoke-intermission-cite"
              style={{
                transitionDelay: visible
                  ? `${APEX_DELAY_MS + chars.length * STAGGER_MS}ms`
                  : undefined,
              }}
            >
              — {attribution}
            </cite>
          )}
        </blockquote>
      </div>
    </section>
  );
}
