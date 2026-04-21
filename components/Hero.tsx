"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";
import type { Exhibition } from "@/lib/types";
import type { Palette } from "@/lib/palette";
import { HeroCardReveal } from "./HeroCardReveal";
import { HeroArtwork } from "./HeroArtwork";

export type HeroSlide = {
  exhibition: Exhibition;
  palette: Palette;
};

type HeroProps = { slides: HeroSlide[] };

const DWELL_MS = 10000;
const CROSSFADE_S = 2.6;
const CARD_FADE_S = 1.4;
const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero({ slides }: HeroProps) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [arrowZone, setArrowZone] = useState<null | "left" | "right">(null);

  useEffect(() => {
    if (reduced || slides.length < 2 || paused) return;
    const id = window.setInterval(
      () => setIndex((n) => (n + 1) % slides.length),
      DWELL_MS
    );
    return () => window.clearInterval(id);
  }, [reduced, slides.length, paused]);

  if (slides.length === 0) return null;
  const current = slides[index % slides.length];
  const { exhibition: ex, palette } = current;

  const heroVars: CSSProperties = {
    ["--hero-foreground" as string]: palette.foreground,
    ["--hero-shadow" as string]: palette.shadow,
  };

  const prev = () =>
    setIndex((n) => (n - 1 + slides.length) % slides.length);
  const next = () => setIndex((n) => (n + 1) % slides.length);

  return (
    <section
      className="hero"
      style={heroVars}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        setArrowZone(null);
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const frac = (e.clientX - rect.left) / rect.width;
        if (frac < 0.22) setArrowZone("left");
        else if (frac > 0.78) setArrowZone("right");
        else setArrowZone(null);
      }}
    >
      <div className="hero-slides">
        {slides.map((s, i) => {
          const img = s.exhibition.homepageHero ?? s.exhibition.hero!;
          const slideVars: CSSProperties = {
            ["--hero-base" as string]: s.palette.base,
            ["--hero-glow" as string]: s.palette.glow,
            ["--hero-deep" as string]: s.palette.deep,
          };
          return (
            <motion.div
              key={s.exhibition.slug}
              className="slide"
              style={slideVars}
              initial={false}
              animate={{ opacity: i === index ? 1 : 0 }}
              transition={{ duration: CROSSFADE_S, ease: EASE }}
            >
              <div className="slide-bg" aria-hidden="true" />
              <Link
                href={`/exhibitions/${s.exhibition.slug}`}
                className="slide-link"
                tabIndex={i === index ? 0 : -1}
                aria-label={`View ${s.exhibition.artistName}, ${s.exhibition.title}`}
              >
                <HeroArtwork
                  src={img}
                  alt={`${s.exhibition.artistName}, ${s.exhibition.title}`}
                />
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="hero-card">
        <HeroCardReveal>
          <div className="hero-card-stage">
            <AnimatePresence initial={false}>
              <motion.div
                key={ex.slug}
                className="hero-card-slide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: CARD_FADE_S, ease: EASE }}
              >
                <Link
                  href={`/exhibitions/${ex.slug}`}
                  className="hero-card-link"
                >
                  <div className="hero-headline">
                    <div className="hero-artist">{ex.artistName}</div>
                    <div className="hero-title">{ex.title}</div>
                  </div>
                  <div className="hero-meta">{ex.date}</div>
                  <span className="hero-link">
                    <span className="hero-link-label">View Exhibition</span>
                    <span className="hero-link-arrow">→</span>
                  </span>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </HeroCardReveal>
      </div>

      {slides.length > 1 && (
        <div className="hero-nav" aria-label="Hero navigation">
          <button
            type="button"
            className="hero-nav-btn hero-nav-prev"
            data-visible={arrowZone === "left"}
            onClick={prev}
            aria-label="Previous exhibition"
          >
            <svg viewBox="0 0 10 14" width="10" height="14" aria-hidden="true">
              <polygon points="9,0 9,14 0,7" fill="currentColor" />
            </svg>
          </button>
          <button
            type="button"
            className="hero-nav-btn hero-nav-next"
            data-visible={arrowZone === "right"}
            onClick={next}
            aria-label="Next exhibition"
          >
            <svg viewBox="0 0 10 14" width="10" height="14" aria-hidden="true">
              <polygon points="0,0 0,14 10,7" fill="currentColor" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
