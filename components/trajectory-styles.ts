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
/* fine film grain over the lightbox — a whisper of analog texture so the glow
   reads as a lit surface, not flat digital colour. SVG fractal noise, very low
   opacity, soft-light blend so it modulates without dimming. Sits above the
   glow, below the content. */
.trj-ambient::before{
  content:"";
  position:absolute; inset:0;
  z-index:1;
  pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size:160px 160px;
  opacity:.045;
  mix-blend-mode:soft-light;
}
/* all real content sits above the glow AND above the edge-fade bands */
.trj-head, .trj-deck, .trj-grid, .trj-read{ position:relative; z-index:2; }

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
  /* lift colour out of even Ricky's near-black works so the bloom reads as a
     genuinely lit surface — confident presence, just shy of the original blast */
  filter:saturate(1.6) brightness(1.62) contrast(1.04);
  will-change:transform;
}
/* NEAR bloom — the principal coloured wash, drifts gently. Lit with real
   presence; the section ground now dissolves into the page (see .trj-embed
   top/bottom fade) so the glow integrates rather than reading as a panel. */
.trj-ambient-near{
  inset:-26%;
  filter:blur(118px) saturate(1.5) brightness(1.16) contrast(1.08);
  opacity:.44;
  animation:trjDriftNear 64s ease-in-out infinite alternate;
}
/* FAR bloom — larger, softer, dimmer; atmospheric depth behind the near layer */
.trj-ambient-far{
  inset:-45%;
  filter:blur(205px) saturate(1.64) brightness(1.08) contrast(1.06);
  opacity:.30;
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
/* An enveloping vignette that dissolves the bloom into the ground on EVERY
   edge — not just top/bottom. The faint glow has no perceptible boundary: it
   lifts gently in the centre and falls all the way back to the ground tone
   (#161410) toward the perimeter, so there is no glow-vs-black seam anywhere.
   A soft full-field veil of the ground colour sits over the whole layer too,
   so the transition from glow to ground crosses a shared tone rather than
   jumping to pure black. */
.trj-ambient::after{
  content:""; position:absolute; inset:0;
  background:
    /* gentle vertical settle — keeps title + reading copy on clean ground */
    linear-gradient(
      to bottom,
      rgba(22,20,16,0.40) 0%,
      rgba(22,20,16,0.12) 16%,
      rgba(22,20,16,0.06) 50%,
      rgba(22,20,16,0.20) 80%,
      rgba(22,20,16,0.44) 100%
    ),
    /* enveloping radial — feathers the bloom back to the ground on all sides;
       wide + soft so there is no hard ring, the colour just melts outward. */
    radial-gradient(
      ellipse 96% 92% at 50% 42%,
      transparent 22%,
      rgba(22,20,16,0.34) 58%,
      rgba(22,20,16,0.74) 84%,
      rgba(22,20,16,0.94) 100%
    ),
    /* a faint full-field veil of the ground tone so glow→ground shares a
       midtone — kills the figure/ground contrast that read as "too much". */
    linear-gradient(rgba(22,20,16,0.22), rgba(22,20,16,0.22));
}

/* ---- header ---- */
.trj-head{ text-align:left; align-self:stretch; position:relative; z-index:2; }
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
  /* constrained to roughly the deck's visual width and centred, so the index
     sits directly under the artwork it labels rather than stretching to the
     section edges — a more contained, composed relationship. */
  width:100%; max-width:920px; margin-inline:auto; gap:0;
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
    /* breathing vertical rhythm — generous enough that the blocks aren't
       cramped, but a single composed unit (not the old uniform ~38px that read
       as five disconnected cards). Gently viewport-aware with a tight ceiling. */
    gap:clamp(30px,4.5vh,40px);
    padding:clamp(36px,6vh,52px) 0 44px;
  }
  .trj-h1{ font-size:clamp(21px,6.4vw,28px); }
  /* on mobile the whole section centres (title, eyebrow, series labels, body) */
  .trj-head{ text-align:center; }

  /* A phone can't fit three large cards side-by-side, so the coverflow becomes
     a single confident centred artwork — cleaner and more legible than forcing
     overlapping flanks. Still swipeable; the deck just shows one at a time. */
  .trj-deck-stage{ height:min(85vw,380px); }
  .trj-card{
    width:min(85vw,380px);
    --x:0px;
    transform:translate(-50%, -50%) scale(calc(1 - 0.06 * var(--mag)));
  }
  /* fill the square content box so the only black inside the frame is the
     uniform padding mat on all four edges — no uneven contain-letterbox on
     the slightly non-square Split Logic poster (1456x1500). */
  .trj-card .trj-card-media{ object-fit:cover; }
  .trj-card.is-flank{
    opacity:0;
    pointer-events:none;
  }
  /* counter sits under the deck with a touch of air */
  .trj-plate-nav{ margin-top:clamp(14px,2vh,18px); }

  /* timeline: clean 2x2 of floating labels — NO borders. Centred lockups with
     a comfortable row gap so the four series read as a composed index. */
  .trj-grid{
    grid-template-columns:repeat(2,1fr);
    row-gap:clamp(22px,3.2vh,28px);
    column-gap:clamp(16px,5vw,28px);
    perspective:none;
  }
  .trj-cell{
    transform:none;
    opacity:.78;
    padding:0;
    gap:.4em;
    text-align:center;
    align-items:center;
  }
  .trj-cell:hover{ transform:none; }
  .trj-cell.is-active{ transform:none; opacity:1; }
  /* the lift rail sits just beneath the label lockup, centred in flat mode */
  .trj-cell-rail{ position:static; left:auto; transform:none; margin:.5em auto 0; }
  .trj-cell.is-active .trj-cell-rail{ width:32px; }
  .trj-cell:hover .trj-cell-rail{ width:0; }
  .trj-cell.is-active:hover .trj-cell-rail{ width:32px; }

  /* reading copy is its own movement — give it slightly more air above to set
     it apart from the index. Container + short thread label centre, but the
     multi-line BODY paragraph stays left-aligned (centring a long paragraph is
     an amateur tell); a constrained measure keeps it visually on-axis. */
  .trj-read{ max-width:90vw; align-items:center; text-align:center; margin-top:6px; }
  .trj-read-thread{ text-align:center; }
  .trj-read-body{ text-align:left; max-width:42ch; }
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
/* Dissolve the section into the page on the TOP and BOTTOM edges. The page
   ground is pure black (#000) while this section is warm near-black (#161410);
   without this, the tonal step reads as a separate rectangular panel pieced
   onto the page. These bands fade the page-black into the section ground (and
   back out) so the section has no hard horizontal seam above or below — it
   emerges from and returns to the page continuously. Tall + multi-stop so the
   dissolve is an imperceptible S-curve, not a linear ramp with a visible elbow.
   z-index:1 sits the bands ABOVE the ambient ground/glow (z-index:0) so they
   actually blend the warm section ground down to page-black at the edges — but
   BELOW the readable content (.trj-head/.trj-deck/.trj-grid/.trj-read are
   z-index:2) so they never veil the title or artwork. pointer-events:none. */
.trj-embed::before,
.trj-embed::after{
  content:""; position:absolute; left:0; right:0;
  /* overhang the section edge by 1px so a fractional device-pixel boundary
     can never leave a warm-ground hairline between the band's solid-black edge
     and the page; the +2px height absorbs the overhang at both ends. */
  height:calc(clamp(150px,22vh,260px) + 2px);
  z-index:1; pointer-events:none;
}
.trj-embed::before{
  top:-1px;
  background:linear-gradient(to bottom,
    #000 0%,
    rgba(0,0,0,0.92) 14%,
    rgba(0,0,0,0.70) 32%,
    rgba(0,0,0,0.40) 54%,
    rgba(0,0,0,0.16) 76%,
    rgba(0,0,0,0) 100%);
}
.trj-embed::after{
  bottom:-1px;
  /* taller + a longer solid-black hold at the edge: the bottom of the section
     is empty padding below the reading copy, so the band must carry the warm
     ground all the way to black across that whole zone — otherwise the band's
     transparent end stops partway and the warm ground continues beneath it,
     leaving a soft tonal step partway down the gap. */
  height:calc(clamp(220px,30vh,360px) + 2px);
  background:linear-gradient(to top,
    #000 0%,
    #000 18%,
    rgba(0,0,0,0.86) 34%,
    rgba(0,0,0,0.58) 52%,
    rgba(0,0,0,0.28) 72%,
    rgba(0,0,0,0.10) 86%,
    rgba(0,0,0,0) 100%);
}
.trj-embed ::selection{ background:rgba(232,248,248,.86); color:#161410; }
.trj-embed ::-moz-selection{ background:rgba(232,248,248,.86); color:#161410; }

.trj-root--embedded{
  /* The CONTENT matches the exhibition page's column discipline (1440px frame,
     40px gutters, labels at x=40) — but the section's dark ground + ambient glow
     fill the FULL width via .trj-embed, so wide viewports never show dark side
     bands. Only the inner content is capped/centred. */
  width:100%; max-width:1440px; margin-inline:auto;
  min-height:0;               /* flow at natural content height */
  padding:clamp(64px,10vh,120px) 40px clamp(64px,10vh,120px);
}
/* ambient glow fills the FULL-WIDTH .trj-embed section (edge to edge), not the
   capped content box — so it never leaves dark gutters beside the content. */
.trj-embed{ position:relative; }
.trj-root--embedded .trj-ambient{
  position:absolute;
  left:50%; transform:translateX(-50%);
  width:100vw; max-width:100vw;
}

/* On the artist's own exhibition page the 'RICKY RETOUCH' eyebrow is
   redundant — drop it in embedded mode so the section opens on the title. */
.trj-root--embedded .trj-kicker{ display:none; }
`;
