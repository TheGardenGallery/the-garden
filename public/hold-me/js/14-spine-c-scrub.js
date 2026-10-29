(() => {
  /* ===== SPINE C · THE PINNED REVEAL =====
     Writes a continuous 0-1 progress value to --p as the pinned section is
     scrolled through. Everything visual is CSS calc() off that number: this
     only measures.

     Scrubbed rather than triggered, so the spread is always exactly where
     the reader put it and reverses on the way back up. `--p` is set on the
     STAGE (the sticky element) because that is the shared ancestor of both
     the work and the passage.

     EASED, NOT LINEAR. Raw scroll progress makes both halves start moving
     the instant the pin engages and stop dead at the end. A smoothstep
     (3t^2 - 2t^3) gives the convergence a soft start and a soft landing
     while staying a pure function of scroll position, so it is still
     perfectly scrubbable in both directions. */
  const sections = document.querySelectorAll('[data-spinec]');
  if(!sections.length) return;

  const stages = Array.from(sections, s => ({
    scroll: s,
    stage: s.querySelector('.spine-c-stage'),
    plate: s.querySelector('.plate'),
    cap: 0
  })).filter(o => o.stage);
  if(!stages.length) return;

  /* how fast the pinned work keeps travelling, as a fraction of the page's
     own scroll rate. */
  const PARALLAX = 0.1;

  /* THE EXCURSION IS CAPPED BY REAL CLEARANCE, MEASURED.
     A fixed 0.1x rate is only safe while the artwork is small enough to
     have room above it, and this plate is now 88vh. At 900px tall that
     leaves 24px of clearance against an uncapped excursion of 61px, so the
     work's top edge would be cut off by the stage's overflow:hidden.

     Rather than hand-tune the rate to whatever the current art size
     tolerates (which silently breaks the next time the plate is resized),
     the budget is measured from the DOM: half the difference between the
     stage and the plate, minus a 4px hairline so the edge never touches.
     The drift is then the smaller of the 0.1x rate and that budget, so it
     is as close to the requested speed as the composition physically
     allows and can never clip at any viewport or any art size.

     Measured on load and on resize only, never per frame: reading
     offsetHeight inside the scroll handler would force a synchronous
     layout on every frame. */
  const measure = () => {
    for(const o of stages){
      const sh = o.stage.offsetHeight;
      const ph = o.plate ? o.plate.offsetHeight : sh;
      o.cap = Math.max(0, (sh - ph) / 2 - 4);
      /* the scrub's length too (2026-10-27): it was read in every frame
         after all, and on a page whose other scroll work has just moved
         things that read forces the browser to resolve styles mid-frame */
      o.travel = o.scroll.offsetHeight - sh;
    }
  };

  let raf = 0;
  const paint = (all) => {
    raf = 0;
    for(const {scroll, stage, cap, live, travel} of stages){
      /* a section more than a screen away is held at its end (t 0 or 1),
         so it is measured and written only near the window; the observer
         below paints it once more as it leaves, which lands it there */
      if(!live && all !== true) continue;
      if(travel <= 0){
        stage.style.setProperty('--p', 1);
        stage.style.setProperty('--dy', '0px');
        continue;
      }
      const past = -scroll.getBoundingClientRect().top + 60;
      let t = past / travel;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      /* the composition: eased, so it starts and lands softly */
      stage.style.setProperty('--p', (t * t * (3 - 2 * t)).toFixed(4));
      /* the parallax: RAW distance scrolled, not the eased value. Using the
         eased t here would make the drift accelerate and decelerate against
         a constant scroll, which reads as drag; parallax has to be linear
         to read as depth. Centred on the midpoint so the excursion splits
         either side of centre, then clamped to the measured clearance. */
      const past01 = Math.min(Math.max(past, 0), travel);
      const want = -(past01 - travel / 2) * PARALLAX;
      const dy = Math.max(-cap, Math.min(cap, want));
      stage.style.setProperty('--dy', dy.toFixed(1) + 'px');
    }
  };
  const onScroll = () => { if(!raf) raf = requestAnimationFrame(paint); };
  const remeasure = () => { measure(); paint(true); };
  const near = new IntersectionObserver(es => {
    for(const e of es){
      const o = stages.find(o => o.scroll === e.target);
      if(o){ o.live = e.isIntersecting; paint(true); }
    }
  }, {rootMargin:'100% 0px'});
  stages.forEach(o => { o.live = false; near.observe(o.scroll); });
  /* any change of the section's, the stage's or the work's height is
     measured again, whatever caused it (a font, a phone's toolbar) */
  const sized = new ResizeObserver(remeasure);
  stages.forEach(o => { sized.observe(o.scroll); sized.observe(o.stage); if(o.plate) sized.observe(o.plate); });

  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', remeasure);
  /* the plate's height is set in vh so it is known immediately, but the
     image inside it decodes later; re-measure on load so the cap is taken
     from the settled layout rather than a pre-decode one. */
  window.addEventListener('load', remeasure);
  remeasure();
})();
