// Shared Trajectory styles, owned by the component so they are portable to
// any page: the standalone /trajectory route AND the embedded instance on
// the Split Logic exhibition page. Single source of truth — import this.

export const TRAJECTORY_CSS = `
/* Fonts matched to Ricky's Split Logic exhibition page vocabulary:
   Barlow (caps grotesque — titles + series names, the Helvetica/Akzidenz
   lineage), Saira Condensed (section eyebrows), Space Mono (the terminal
   voice — taglines + reading copy, the whole SL page is monospaced), on
   cool phosphor-white. No serif: SL is a digital surface, not paper.
   Loaded site-wide in layout.tsx; re-imported here so the standalone
   overlay never FOUTs to a fallback. */
@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Big+Shoulders+Display:wght@500;600;700;800&family=Saira+Condensed:wght@500;600&family=Space+Mono:wght@400&display=swap');

.trj-overlay{
  position:fixed; inset:0; width:100vw; height:100dvh;
  z-index:2147483647; background:#161410; color:#f5f3ef;
  overflow-x:hidden; overflow-y:auto;
  /* anchor content to the top so a tall composition never clips the title;
     the page scrolls if it exceeds the viewport. */
  display:flex; align-items:flex-start; justify-content:center;
  font-family:'Barlow',sans-serif;
  -webkit-font-smoothing:antialiased;
}
/* drag-to-select highlight — phosphor white on dark, never the OS blue */
.trj-overlay ::selection{ background:rgba(232,248,248,.86); color:#161410; }
.trj-overlay ::-moz-selection{ background:rgba(232,248,248,.86); color:#161410; }
.trj-root{
  /* Phosphor-white family — the cool CRT vocabulary of the SL page
     (rgba(232,248,248)) rather than the warm editorial off-white. */
  --bg:#161410;
  --fg:rgba(232,248,248,.96);
  --fg-soft:rgba(232,248,248,.72);
  --fg-muted:rgba(232,248,248,.52);
  --fg-whisper:rgba(232,248,248,.34);
  --rule:rgba(244,252,252,.6);
  --ease:cubic-bezier(.22,1,.36,1);
  --mono:'Space Mono',ui-monospace,monospace;
  --eyebrow:'Saira Condensed','Barlow',sans-serif;
  width:min(1180px,92vw); min-height:100%;
  display:flex; flex-direction:column; align-items:center;
  justify-content:flex-start; gap:clamp(28px,5vh,64px);
  padding:clamp(40px,8vh,96px) 0 clamp(32px,5vh,64px);
  box-sizing:border-box;
  position:relative;
}

/* ---- ambient lightbox: the artwork backlighting the whole page ---- */
.trj-ambient{
  position:fixed; inset:0;
  z-index:0;            /* behind all content; fills the whole viewport */
  overflow:hidden;
  pointer-events:none;
  background:var(--bg);
  /* the two slots alpha-composite against each other INSIDE this layer, then
     the assembled glow screens onto the ground as one unit — so a cross-fade
     never double-brightens at the crossover. isolate gives screen a clean
     backdrop (its own bg), not the page behind. */
  mix-blend-mode:normal;
  isolation:isolate;
}
.trj-ambient-glow{
  position:absolute; inset:0;
  mix-blend-mode:screen;
}
/* all real content sits above the glow */
.trj-head, .trj-deck, .trj-grid, .trj-read{ position:relative; z-index:1; }

/* two cross-fading slots — the new art fades up as the old fades out.
   A plain ease (not the house overshoot curve) keeps opacity monotonic so the
   dissolve never pulses past full/empty. */
.trj-ambient-slot{
  position:absolute; inset:0;
  opacity:0;
  transition:opacity 650ms cubic-bezier(.4, 0, .2, 1);
}
.trj-ambient-slot.is-front{ opacity:1; }

.trj-ambient-fig{
  position:absolute;
  background-size:cover;
  background-position:center;
  /* lift hard + saturate so even Ricky's near-black works emit real colour */
  filter:saturate(1.6) brightness(1.7) contrast(1.05);
  will-change:transform;
}
/* NEAR bloom — the principal coloured wash, drifts gently */
.trj-ambient-near{
  inset:-26%;
  /* contrast keeps tonal depth so light-grounded works (Low Language's cream)
     don't wash the page to flat white; brightness is restrained for the same
     reason — the dark Garden ground must always read through the bloom. */
  filter:blur(115px) saturate(1.5) brightness(1.16) contrast(1.12);
  opacity:.38;
  animation:trjDriftNear 64s ease-in-out infinite alternate;
}
/* FAR bloom — larger, softer, dimmer; atmospheric depth behind the near layer */
.trj-ambient-far{
  inset:-45%;
  filter:blur(200px) saturate(1.7) brightness(1.08) contrast(1.1);
  opacity:.26;
  animation:trjDriftFar 92s ease-in-out infinite alternate;
}
@keyframes trjDriftNear{
  from{ transform:scale(1.05) translate3d(-0.6%, -0.4%, 0); }
  to{   transform:scale(1.09) translate3d(0.6%, 0.6%, 0); }
}
@keyframes trjDriftFar{
  from{ transform:scale(1.08) translate3d(0.8%, 0.4%, 0) rotate(-0.6deg); }
  to{   transform:scale(1.14) translate3d(-0.8%, -0.6%, 0) rotate(0.6deg); }
}
@media (prefers-reduced-motion:reduce){
  .trj-ambient-near, .trj-ambient-far{ animation:none; }
}
/* A scrim that keeps the bloom concentrated behind the DECK (upper area) and
   calms the lower zone, so the timeline labels and reading copy sit on a clean,
   sleek ground — not washed by glow. Top + bottom scrims protect both the
   title and the reading text; the radial centres high, over the artwork. */
.trj-ambient::after{
  content:""; position:absolute; inset:0;
  background:
    linear-gradient(
      to bottom,
      rgba(22,20,16,0.46) 0%,
      rgba(22,20,16,0.10) 14%,
      transparent 26%,
      transparent 52%,
      rgba(22,20,16,0.34) 74%,
      rgba(22,20,16,0.62) 100%
    ),
    radial-gradient(
      ellipse 110% 80% at 50% 32%,
      transparent 42%,
      rgba(22,20,16,0.30) 72%,
      rgba(22,20,16,0.58) 100%
    );
}

/* ---- header ---- */
.trj-head{ text-align:left; align-self:stretch; position:relative; z-index:1; }
.trj-kicker{
  font-family:var(--eyebrow);
  font-weight:600; font-size:11px; letter-spacing:.28em;
  text-transform:uppercase; color:var(--fg-whisper);
  font-variant-numeric:tabular-nums lining-nums;
  margin-bottom:1.4em;
}
.trj-h1{
  /* matches the exhibition page's heading voice (Big Shoulders Display) but
     dialled back: lighter weight + slightly smaller so it reads refined, not
     chunky. Tracking opens a touch to keep the lighter weight elegant. */
  font-family:'Big Shoulders Display','Barlow',sans-serif;
  font-weight:600; font-style:normal; margin:0;
  font-size:clamp(23px,3.2vh,34px); line-height:1.08;
  text-transform:uppercase; letter-spacing:.03em;
  color:var(--fg);
}

/* ---- inline "one" wheel inside the headline ---- */
.trj-onewheel{
  /* sits on the text baseline, sized to the cap height of the H1 */
  display:inline-block; vertical-align:-0.16em;
  width:1.05em; height:1.05em; margin:0 .08em;
  padding:0; border:0; background:none; cursor:pointer;
  border-radius:50%;
  box-shadow:0 0 0 1px rgba(22,20,16,1);
  transition:transform 520ms var(--ease), box-shadow 300ms var(--ease);
}
.trj-onewheel svg{ display:block; width:100%; height:100%; border-radius:50%; }
.trj-onewheel:hover{
  transform:rotate(45deg) scale(1.06);
  box-shadow:0 0 0 1px rgba(22,20,16,1), 0 0 10px rgba(232,248,248,.22);
}
.trj-onewheel:active{ transform:rotate(80deg) scale(.98); }

/* ---- the floating scroll-deck (coverflow) ---- */
.trj-deck{
  display:flex; flex-direction:column; align-items:center;
  width:100%;
}
.trj-deck-stage{
  position:relative;
  width:100%;
  height:min(51vmin,484px,51vh);
  perspective:1600px;
  user-select:none;
}
.trj-card{
  position:absolute; top:50%; left:50%;
  width:min(51vmin,462px,51vh);
  aspect-ratio:1/1;
  margin:0;
  /* --off = signed distance from centre. Horizontal offset & rotation use the
     SIGN (mirror left/right); depth & scale use the SQUARE (always positive) so
     both flanks recede equally — a symmetric coverflow. */
  --x:calc(var(--off) * clamp(200px, 32vw, 360px));
  --mag:calc(var(--off) * var(--off));
  transform:
    translate(-50%, -50%)
    translateX(var(--x))
    translateZ(calc(var(--mag) * -190px))
    rotateY(calc(var(--off) * -17deg))
    scale(calc(1 - 0.11 * var(--mag)));
  transform-style:preserve-3d;
  transition:transform 480ms var(--ease), opacity 480ms var(--ease),
             filter 480ms var(--ease), box-shadow 480ms var(--ease);
  /* white phosphor frame with a dark plate behind the art — the non-square
     Split Logic posters letterbox onto the plate, reading as an intentional
     mat rather than an empty transparent gap. */
  background:#0d0c0a;
  border:2px solid rgba(246,253,253,.4);
  box-shadow:0 0 0 1px rgba(22,20,16,1);
  padding:clamp(10px,1.5vmin,16px);
  box-sizing:border-box;
  /* the flanks sit behind, dimmed and softened */
  opacity:.5;
  filter:brightness(.6) saturate(.85);
  cursor:pointer;
}
.trj-card.is-center{
  opacity:1;
  filter:none;
  cursor:default;
  border:2px solid rgba(246,253,253,.6);
  box-shadow:
    0 0 0 1px rgba(22,20,16,1),
    0 18px 60px rgba(0,0,0,.55),
    0 0 14px rgba(232,248,248,.06);
}
.trj-card-media{
  width:100%; height:100%; object-fit:contain; display:block;
  /* crisp, hi-res rendering: promote to its own GPU layer + hide backface so
     the high-res source composites sharply, never softened by sub-pixel
     coverflow transforms. (image-rendering left auto: smooth high-quality
     downscale of the detailed artwork, no nearest-neighbour artefacts.) */
  transform:translateZ(0);
  backface-visibility:hidden;
  -webkit-backface-visibility:hidden;
}

/* Cycle counter — Space Mono telemetry line, like the SL palette readout. */
.trj-plate-nav{
  display:flex; align-items:center; gap:18px;
  font-family:var(--mono);
  margin-top:clamp(12px,2vh,18px);
}
.trj-arrow{
  background:none; border:0; color:var(--fg-muted); cursor:pointer;
  font-size:18px; line-height:1; padding:2px 6px;
  font-family:var(--mono);
  transition:color 240ms var(--ease);
}
.trj-arrow:hover{ color:var(--fg); }
.trj-counter{
  font-size:11px; letter-spacing:.12em; color:var(--fg-whisper);
  font-variant-numeric:tabular-nums;
}

/* ---- grid (chronological selector) — borderless floating labels ---- */
.trj-grid{
  position:static !important;
  display:grid; grid-template-columns:repeat(4,1fr);
  width:100%; gap:0;
}
.trj-cell{
  position:relative; background:none; border:0; cursor:pointer;
  text-align:center; color:var(--fg-muted);
  padding:clamp(14px,2.4vh,22px) clamp(10px,1.4vw,20px);
  display:flex; flex-direction:column; align-items:center; gap:.45em;
  /* resting labels sit a touch lower + dimmer; the active one rises a few
     pixels toward the reader. A pure translateY keeps every label's internal
     rows on a perfectly shared baseline (no perspective projection drift). */
  transform:translateY(3px);
  opacity:.82;
  transition:transform 420ms var(--ease), opacity 380ms var(--ease),
             color 380ms var(--ease);
}
.trj-cell:hover{
  transform:translateY(1px);
  opacity:.95;
}
.trj-cell.is-active{
  transform:translateY(-3px);
  opacity:1;
}

/* Always-white underline with a slight radiance — ultra-refined, no colour.
   A hairline white rail that grows on activation, with a soft phosphor bloom
   so it reads as light, not paint. Sits just under the label lockup. */
.trj-cell-rail{
  position:absolute; left:50%; transform:translateX(-50%); bottom:6px;
  height:1px; width:0;
  /* a plain hairline wall-label underline — no phosphor glow (that read as
     web-UI); quiet and matte, the gallery move. Centred under the label. */
  background:rgba(232,248,248,.78);
  transition:width 480ms var(--ease), opacity 380ms var(--ease);
  opacity:0;
}
.trj-cell.is-active .trj-cell-rail{ width:34px; opacity:1; }
.trj-cell:hover .trj-cell-rail{ width:20px; opacity:.35; }
.trj-cell.is-active:hover .trj-cell-rail{ width:34px; opacity:1; }

.trj-cell-date{
  font-family:var(--eyebrow);
  font-weight:600; font-size:9.5px; letter-spacing:.22em;
  text-transform:uppercase; color:var(--fg-whisper);
  font-variant-numeric:tabular-nums lining-nums;
}
.trj-cell-title{
  font-family:'Big Shoulders Display','Barlow',sans-serif;
  font-weight:700; font-size:clamp(15px,2.1vh,19px); line-height:1.05;
  text-transform:uppercase; letter-spacing:.01em;
  color:var(--fg-soft);
  transition:color 420ms var(--ease);
}
.trj-cell-count{
  font-family:var(--mono);
  font-size:10.5px; letter-spacing:.02em; color:var(--fg-whisper);
  font-variant-numeric:tabular-nums;
}
.trj-cell:hover{ color:var(--fg-soft); }
.trj-cell:hover .trj-cell-title{ color:var(--fg); }
.trj-cell.is-active .trj-cell-title{ color:var(--fg); }

/* ---- reading (what it is + how it connects) ---- */
.trj-read{
  max-width:min(76ch, 760px); text-align:center;
  display:flex; flex-direction:column; gap:1.6em;
  animation:trjFade 560ms var(--ease);
}
.trj-read-thread{
  font-family:var(--mono);
  font-weight:400; font-size:clamp(11px,1.5vh,13px);
  text-transform:uppercase; letter-spacing:.2em;
  color:var(--fg-soft);
}
.trj-read-body{
  font-family:var(--mono);
  margin:0; font-size:clamp(12px,1.55vh,13.5px); line-height:1.8;
  color:var(--fg-soft); letter-spacing:.005em;
  text-align:left;
  /* never auto-hyphenate; no stray dash at a line edge */
  hyphens:none; -webkit-hyphens:none;
}
@keyframes trjFade{ from{ opacity:0; transform:translateY(6px);} to{ opacity:1; transform:none;} }

/* ---- iPhone 13 mini / narrow ---- */
@media (max-width:600px){
  .trj-root{
    justify-content:flex-start;
    gap:clamp(24px,4.5vh,38px);
    padding:clamp(30px,6vh,48px) 0 44px;
  }
  .trj-h1{ font-size:clamp(21px,6.4vw,28px); }

  /* A phone can't fit three large cards side-by-side, so the coverflow becomes
     a single confident centred artwork — cleaner and more legible than forcing
     overlapping flanks. Still swipeable; the deck just shows one at a time. */
  .trj-deck-stage{ height:min(85vw,380px); }
  .trj-card{
    width:min(85vw,380px);
    --x:0px;
    transform:translate(-50%, -50%) scale(calc(1 - 0.06 * var(--mag)));
  }
  .trj-card.is-flank{
    opacity:0;
    pointer-events:none;
  }

  /* timeline: clean 2x2 of floating labels — NO borders, generous row gap.
     On mobile everything shares one flush-left column (title is already left),
     so labels + their rails left-align too — a single clean vertical edge. */
  .trj-grid{
    grid-template-columns:repeat(2,1fr);
    row-gap:clamp(20px,4vh,30px);
    column-gap:clamp(16px,5vw,28px);
    perspective:none;
  }
  .trj-cell{
    transform:none;
    opacity:.78;
    padding:0;
    gap:.4em;
    text-align:left;
    align-items:flex-start;
  }
  .trj-cell:hover{ transform:none; }
  .trj-cell.is-active{ transform:none; opacity:1; }
  /* the lift rail sits just beneath the label lockup, left-anchored in flat mode */
  .trj-cell-rail{ position:static; left:auto; transform:none; margin-top:.55em; }
  .trj-cell.is-active .trj-cell-rail{ width:32px; }
  .trj-cell:hover .trj-cell-rail{ width:0; }
  .trj-cell.is-active:hover .trj-cell-rail{ width:32px; }

  /* reading copy left-aligned to the same column edge */
  .trj-read{ max-width:100%; align-items:flex-start; text-align:left; }
  .trj-read-thread{ text-align:left; }
  .trj-read-body{ text-align:left; }
}


/* ============================================================
   EMBEDDED MODE — Trajectory rendered inline inside another page
   (e.g. the Split Logic exhibition page) rather than as the
   standalone full-screen /trajectory overlay. The ambient glow is
   confined to this section instead of covering the whole viewport.
   ============================================================ */
.trj-embed{
  position:relative;
  width:100%;
  background:#161410;
  overflow:hidden;            /* keep the ambient bloom inside the section */
  isolation:isolate;
  color:#f5f3ef;
  font-family:'Barlow',sans-serif;
  -webkit-font-smoothing:antialiased;
  display:flex; justify-content:center;
}
.trj-embed ::selection{ background:rgba(232,248,248,.86); color:#161410; }
.trj-embed ::-moz-selection{ background:rgba(232,248,248,.86); color:#161410; }

.trj-root--embedded{
  /* full-bleed inside the exhibition page: span the whole section width
     (matching the other full-width sections) instead of the standalone
     route's narrow 1180px reading column. Inner padding gives breathing room. */
  width:100%; max-width:none;
  min-height:0;               /* flow at natural content height */
  padding:clamp(48px,9vh,104px) clamp(24px,6vw,96px) clamp(48px,9vh,104px);
}
/* ambient glow stays within the embedded section, not fixed to the viewport */
.trj-root--embedded .trj-ambient{
  position:absolute;
}

/* On the artist's own exhibition page the 'RICKY RETOUCH' eyebrow is
   redundant — drop it in embedded mode so the section opens on the title. */
.trj-root--embedded .trj-kicker{ display:none; }
`;
