"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Exhibition } from "@/lib/types";
import type { Palette } from "@/lib/palette";
import { HeroCardReveal } from "./HeroCardReveal";
import { HeroArtwork } from "./HeroArtwork";
import { EASE_SLOW } from "@/lib/motion";
import {
  getHeroCopyTreatment,
  getHeroTreatment,
} from "@/lib/data/display-rules";

export type HeroSlide = {
  exhibition: Exhibition;
  palette: Palette;
};

type HeroProps = { slides: HeroSlide[] };

const DWELL_MS = 10000;
// Upcoming-exhibition video slides hold for 2 minutes — the piece
// commands the homepage when a viewer first lands, before the
// rotation moves on to other works.
const VIDEO_DWELL_MS = 120000;
// Slide glide duration. The artwork no longer fades — outgoing
// translates off one side as incoming translates in from the other,
// so the work itself is always solid on screen. A slow ease keeps
// the gesture editorial rather than slideshow-y.
const SLIDE_S = 1.4;
const CARD_FADE_S = 1.0;
const EASE = EASE_SLOW;

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%" }),
  center: { x: "0%" },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%" }),
};

export function Hero({ slides }: HeroProps) {
  const reduced = useReducedMotion();
  // Direction is tracked alongside index so the slide animation
  // knows which side to enter / exit from. +1 = forward (next), -1 =
  // backward (prev). Auto-rotation always moves forward.
  const [[index, direction], setIndexState] = useState<[number, number]>([
    0,
    1,
  ]);
  const [paused, setPaused] = useState(false);
  const [arrowZone, setArrowZone] = useState<null | "left" | "right">(null);

  useEffect(() => {
    if (reduced || slides.length < 2 || paused) return;
    const currentSlide = slides[index % slides.length];
    const dwell = currentSlide.exhibition.homepageHeroVideo
      ? VIDEO_DWELL_MS
      : DWELL_MS;
    const id = window.setTimeout(
      () => setIndexState(([n]) => [(n + 1) % slides.length, 1]),
      dwell
    );
    return () => window.clearTimeout(id);
  }, [reduced, slides, paused, index]);

  if (slides.length === 0) return null;
  const current = slides[index % slides.length];
  const { exhibition: ex } = current;
  const theme = ex.heroTheme ?? (current.palette.isDark ? "dark" : "paper");

  const prev = () =>
    setIndexState(([n]) => [(n - 1 + slides.length) % slides.length, -1]);
  const next = () =>
    setIndexState(([n]) => [(n + 1) % slides.length, 1]);

  return (
    <section
      className="hero"
      data-theme={theme}
      data-slug={ex.slug}
      data-hero-treatment={getHeroTreatment(ex.slug)}
      data-hero-copy-treatment={getHeroCopyTreatment(ex.slug)}
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
        <AnimatePresence initial={false} custom={direction} mode="sync">
          <motion.div
            key={ex.slug}
            className="slide"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: SLIDE_S, ease: EASE }}
          >
            <Link
              href={`/exhibitions/${ex.slug}`}
              className="slide-link"
              aria-label={`View ${ex.artistName}, ${ex.title}`}
            >
              {ex.homepageHeroVideo ? (
                <video
                  className="slide-video"
                  src={ex.homepageHeroVideo}
                  poster={ex.homepageHeroVideoPoster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  aria-label={`${ex.artistName}, ${ex.title}`}
                />
              ) : (
                <HeroArtwork
                  src={(ex.homepageHero ?? ex.hero)!}
                  alt={`${ex.artistName}, ${ex.title}`}
                />
              )}
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="hero-card">
        <HeroCardReveal>
          <div className="hero-card-stage">
            <AnimatePresence initial={false} mode="wait">
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
                  <div className="hero-meta">
                    {ex.status === "upcoming"
                      ? `Upcoming · ${ex.date}`
                      : ex.date}
                  </div>
                  <span className="hero-link">
                    <span className="hero-link-label">
                      {ex.status === "upcoming"
                        ? "Get notified"
                        : "View Exhibition"}
                    </span>
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
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M15 5 L8 12 L15 19"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="hero-nav-btn hero-nav-next"
            data-visible={arrowZone === "right"}
            onClick={next}
            aria-label="Next exhibition"
          >
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M9 5 L16 12 L9 19"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
