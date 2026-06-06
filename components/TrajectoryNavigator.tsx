"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Trajectory Navigator (STANDALONE localhost experiment, /trajectory).
 *
 * Walk Ricky Retouch's line of work: Surface Sets, Low Language, New North,
 * Split Logic. The grid as a living substrate, from static emergence, to
 * numeric texture, to organic topography, to a system that finally moves.
 *
 * The current series' works sit in a floating coverflow deck (centre work
 * plays as video; the others flank it, dimmed and pushed back). A linear
 * TIMELINE BAR below selects the series; a blurred wash of the active work
 * backlights the whole page. Garden idiom + Split Logic type vocabulary
 * (Barlow grotesque, Space Mono telemetry). Nothing in the live app is
 * touched; noindex sketch.
 */

type Series = {
  id: string;
  title: string;
  date: string;
  count: string;
  thread: string;
  body: string;
  /** each work: a still, or a looping video with a poster fallback */
  works: { src: string; alt: string; video?: string; poster?: string }[];
  /** palette pulled from the artwork (the wheel wedge colour) */
  accent: string;
};

const SERIES: Series[] = [
  {
    id: "surface-sets",
    title: "Surface Sets",
    date: "May 2025",
    count: "100 artworks",
    thread: "restless forms",
    body:
      "Surface Sets is where it starts: an open exploration of generative systems, run to see what they throw off. A custom process turns out a range of abstract forms, some clean, some unstable, many unexpected. Each piece catches a single moment in a system that never stops changing, where a structure holds for an instant before the noise pulls it back apart. There is no story and no symbolism here, only emerging forms and the tension between control and chance. It is the raw material everything after this tries to give a shape to.",
    works: [
      { src: "/images/ricky-retouch/trajectory/ss-1.png", alt: "Surface Sets, emergent pointillist field in blue, red, gold and black" },
      { src: "/images/ricky-retouch/trajectory/ss-2.png", alt: "Surface Sets, marbled rainbow flow of densely packed points" },
      { src: "/images/ricky-retouch/trajectory/ss-3.png", alt: "Surface Sets, organic dot-field, blue, green and orange cells" },
    ],
    accent: "#ff5a4d",
  },
  {
    id: "low-language",
    title: "Low Language",
    date: "July 2025",
    count: "200 artworks",
    thread: "the grid arrives",
    body:
      "Low Language takes that raw emergence and gives it a grid to live on. Every image starts from a simple grid; a pattern decides which cells fill, and numbers stand in for those cells, used less as data than as texture, a mechanical but irregular fill with real visual weight. Layered grids and geometric forms break up the base, holding digital precision against analog imperfection. The same tension between control and chance from Surface Sets is still here, but now it is pinned to a structure you can actually read.",
    works: [
      { src: "/images/ricky-retouch/trajectory/ll-1.png", alt: "Low Language, blue numerals beneath red topographic contours on cream" },
      { src: "/images/ricky-retouch/trajectory/ll-2.png", alt: "Low Language, green reaction-diffusion maze with sparse red numerals" },
      { src: "/images/ricky-retouch/trajectory/ll-3.png", alt: "Low Language, black numerals as mechanical texture with a dense whorl" },
    ],
    accent: "#3b7bff",
  },
  {
    id: "new-north",
    title: "New North",
    date: "September 2025",
    count: "33 artworks",
    thread: "the grid becomes terrain",
    body:
      "New North lets that grid breathe. The pieces are still built from grids and scattered points, but now custom noise textures and contour lines borrowed from topographic maps flow across them, giving a sense of depth and movement, some works bare and technical, others fully organic. This is the hinge in the arc: the rigid frame of Low Language starts to behave like landscape. The numbers give way to elevation, and the grid stops just holding the image and starts describing a place.",
    works: [
      { src: "/images/ricky-retouch/trajectory/nn-1.png", alt: "New North, red distorted grid and contours with edition number 53" },
      { src: "/images/ricky-retouch/trajectory/nn-2.png", alt: "New North, contour topography and scattered points on blue, edition 84" },
      { src: "/images/ricky-retouch/trajectory/nn-3.png", alt: "New North, blue gingham grid crossed by contours and points, edition 91" },
    ],
    accent: "#1fc16b",
  },
  {
    id: "split-logic",
    title: "Split Logic",
    date: "June 2026",
    count: "100 artworks",
    thread: "the terrain comes alive",
    body:
      "Split Logic is where the terrain finally moves. A standard rectangular grid slips out of alignment through a re\u2011meshing process; it stretches, compresses and folds into dense fields where repeated subdivision builds real tension. Beneath the surface these become responsive systems: small blinking walkers trace routes that shift across the image, wait timers releasing new destinations in steady pulses. It can read like transit maps, circuit diagrams or colonies moving through an invented terrain, though nothing single is steering it. The place New North described is now inhabited and running on its own, and the arc that began with a few restless forms closes here.",
    works: [
      { video: "/images/ricky-retouch/works/sl-071.mp4", poster: "/images/ricky-retouch/works/sl-071.jpg", src: "/images/ricky-retouch/works/sl-071.jpg", alt: "Split Logic 71, re-meshed grid field with blinking walkers and terminal readout" },
      { video: "/images/ricky-retouch/works/sl-031.mp4", poster: "/images/ricky-retouch/works/sl-031.jpg", src: "/images/ricky-retouch/works/sl-031.jpg", alt: "Split Logic 31, warped subdivision lattice with shifting points" },
      { video: "/images/ricky-retouch/works/sl-064.mp4", poster: "/images/ricky-retouch/works/sl-064.jpg", src: "/images/ricky-retouch/works/sl-064.jpg", alt: "Split Logic 64, dense spatial field with routes tracing across the grid" },
    ],
    accent: "#ffc233",
  },
];

const N = SERIES.length;

export function TrajectoryNavigator({ embedded = false }: { embedded?: boolean } = {}) {
  const [active, setActive] = useState(N - 1); // open on the latest work
  const [workIdx, setWorkIdx] = useState(0);
  const prevActive = useRef(active);

  const series = SERIES[active];
  const works = series.works;

  // ---- ambient lightbox cross-fade (ping-pong) -------------------------------
  // Two stacked layers cross-fade so the background dissolves between works
  // instead of hard-cutting. `front=0` shows slotA, `front=1` shows slotB.
  // To avoid the "fade up to blank then pop" flicker, the incoming image is
  // PRELOADED + DECODED before we flip the front slot — the layer is already
  // painted when it begins its fade-in, so the dissolve is perfectly stable.
  const ambientUrl = works[workIdx].poster ?? works[workIdx].src;
  const [ambient, setAmbient] = useState<{ a: string; b: string; front: 0 | 1 }>(
    { a: ambientUrl, b: ambientUrl, front: 0 },
  );
  const lastAmbient = useRef(ambientUrl);
  const ambientToken = useRef(0);

  // Preload EVERY series' ambient poster once, up front, so switching series
  // never waits on a network fetch — decode() then resolves instantly and the
  // cross-fade starts immediately (no unprofessional lag on the first switch).
  useEffect(() => {
    const urls = new Set<string>();
    for (const s of SERIES) {
      for (const w of s.works) urls.add(w.poster ?? w.src);
    }
    const imgs: HTMLImageElement[] = [];
    urls.forEach((u) => {
      const im = new Image();
      im.src = u;
      imgs.push(im);
    });
    return () => {
      imgs.length = 0;
    };
  }, []);

  useEffect(() => {
    if (lastAmbient.current === ambientUrl) return;
    lastAmbient.current = ambientUrl;
    const token = ++ambientToken.current;
    let cancelled = false;

    const swap = () => {
      // only the latest requested image wins (guards rapid cycling)
      if (cancelled || token !== ambientToken.current) return;
      setAmbient((s) =>
        s.front === 0
          ? { ...s, b: ambientUrl, front: 1 }
          : { ...s, a: ambientUrl, front: 0 },
      );
    };

    const img = new Image();
    img.src = ambientUrl;
    // decode() resolves once the bitmap is ready to paint with no flash; but a
    // slow decode must never stall the dissolve — a short timeout forces the
    // swap so the transition always feels immediate and responsive.
    let done = false;
    const fire = () => {
      if (done) return;
      done = true;
      swap();
    };
    const timer = window.setTimeout(fire, 90);
    if (typeof img.decode === "function") {
      img.decode().then(fire).catch(fire);
    } else {
      img.onload = fire;
      img.onerror = fire;
    }
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [ambientUrl]);

  // changing series resets the deck to its first work
  useEffect(() => {
    if (prevActive.current !== active) {
      prevActive.current = active;
      setWorkIdx(0);
    }
  }, [active]);

  // rotate which work sits at the centre of the deck
  const goWork = useCallback(
    (dir: number) => {
      if (works.length < 2) return;
      setWorkIdx((i) => (i + dir + works.length) % works.length);
    },
    [works.length],
  );

  // swipe / drag on the deck to cycle works
  const dragX = useRef<number | null>(null);
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragX.current = e.clientX;
  }, []);
  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (dragX.current == null) return;
      const dx = e.clientX - dragX.current;
      dragX.current = null;
      if (Math.abs(dx) > 40) goWork(dx < 0 ? 1 : -1);
    },
    [goWork],
  );

  return (
    <div className={`trj-root${embedded ? " trj-root--embedded" : ""}`}>
      {/* AMBIENT LIGHTBOX: the current artwork backlighting the whole page.
          Two stacked slots cross-fade (ping-pong) on every change — a true
          dissolve, never a hard cut. Each slot carries a near + far bloom for
          atmospheric depth; both drift slowly so the light feels alive. */}
      <div className="trj-ambient" aria-hidden="true">
        <div className="trj-ambient-glow">
          <div className={`trj-ambient-slot ${ambient.front === 0 ? "is-front" : ""}`}>
            <div className="trj-ambient-fig trj-ambient-far" style={{ backgroundImage: `url(${ambient.a})` }} />
            <div className="trj-ambient-fig trj-ambient-near" style={{ backgroundImage: `url(${ambient.a})` }} />
          </div>
          <div className={`trj-ambient-slot ${ambient.front === 1 ? "is-front" : ""}`}>
            <div className="trj-ambient-fig trj-ambient-far" style={{ backgroundImage: `url(${ambient.b})` }} />
            <div className="trj-ambient-fig trj-ambient-near" style={{ backgroundImage: `url(${ambient.b})` }} />
          </div>
        </div>
      </div>

      <header className="trj-head">
        <div className="trj-kicker">Ricky Retouch</div>
        <h1 className="trj-h1">Four seasons of one practice</h1>
      </header>

      {/* DECK: the current series' works as a floating scroll-deck:
          centre = active work (the playing video), the others flank it,
          scaled down and pushed behind, peeking out left & right. */}
      <div
        className="trj-deck"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        style={{ touchAction: "pan-y" }}
        role="group"
        aria-label="series works, swipe to cycle"
      >
        <div className="trj-deck-stage">
          {works.map((w, i) => {
            // signed offset from centre, wrapped to the shortest direction
            let off = i - workIdx;
            const half = works.length / 2;
            if (off > half) off -= works.length;
            if (off < -half) off += works.length;
            const isCenter = off === 0;
            return (
              <figure
                key={`${series.id}-${i}`}
                className={`trj-card ${isCenter ? "is-center" : "is-flank"}`}
                style={
                  {
                    "--off": off,
                    zIndex: 10 - Math.abs(off),
                  } as React.CSSProperties
                }
                onClick={() => !isCenter && setWorkIdx(i)}
                aria-hidden={!isCenter}
              >
                {isCenter && w.video ? (
                  <video
                    className="trj-card-media"
                    src={w.video}
                    poster={w.poster}
                    aria-label={w.alt}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    ref={(el) => {
                      // swallow the autoplay play() promise rejection that some
                      // browsers throw before a user gesture — keeps the console
                      // clean and never blocks the poster→video handoff.
                      if (el) {
                        const p = el.play();
                        if (p && typeof p.catch === "function") p.catch(() => {});
                      }
                    }}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="trj-card-media"
                    src={w.poster ?? w.src}
                    alt={isCenter ? w.alt : ""}
                  />
                )}
              </figure>
            );
          })}
        </div>
      </div>

      {/* TIMELINE BAR: the linear chronological selector */}
      <div className="trj-grid" role="tablist" aria-label="series timeline">
        {SERIES.map((s, i) => (
          <button
            key={s.id}
            className={`trj-cell ${i === active ? "is-active" : ""}`}
            onClick={() => setActive(i)}
            role="tab"
            aria-selected={i === active}
          >
            <span className="trj-cell-rail" />
            <span className="trj-cell-date">{s.date}</span>
            <span className="trj-cell-title">{s.title}</span>
            <span className="trj-cell-count">{s.count}</span>
          </button>
        ))}
      </div>

      {/* WRITING: what the series is and how it connects forward */}
      <section className="trj-read" aria-live="polite">
        <div className="trj-read-thread">{series.thread}</div>
        <p className="trj-read-body">{series.body}</p>
      </section>
    </div>
  );
}
