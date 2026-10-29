(() => {
  /* ===== THE CURSOR BLOOM =====
     Feeds the cursor's position to each black region's ::after, so the
     frost warms where the pointer passes. Everything visual is CSS: this
     writes two numbers and the compositor does the per-pixel work.

     The red band is NOT in this list any more: its metal treatment is gone
     and a flat fill has nothing to light.

     Coordinates are region-LOCAL (clientX minus the region's own rect), so
     the bloom is correct while the page scrolls without the CSS needing to
     know anything about scroll position.

     A pointermove fires far more often than the display refreshes, so the
     handler only stores the event and a single rAF does the writing: one
     update per frame, never more. */
  const fields = Array.from(document.querySelectorAll('.band-void, .band-close'));
  if(!fields.length) return;
  if(window.matchMedia('(any-hover:none) and (any-pointer:coarse)').matches) return;

  let px = 0, py = 0, raf = 0;

  const paint = () => {
    raf = 0;
    for(const el of fields){
      const r = el.getBoundingClientRect();
      /* skip regions that are nowhere near the pointer, and offscreen ones:
         no reason to touch style on a band the cursor is not in. */
      if(r.bottom < -400 || r.top > innerHeight + 400) continue;
      el.style.setProperty('--mx', (px - r.left) + 'px');
      el.style.setProperty('--my', (py - r.top)  + 'px');
    }
  };

  window.addEventListener('pointermove', (e) => {
    px = e.clientX; py = e.clientY;
    if(!raf) raf = requestAnimationFrame(paint);
  }, {passive:true});

  /* the light should follow the page when it moves under a still cursor */
  window.addEventListener('scroll', () => {
    if(!raf) raf = requestAnimationFrame(paint);
  }, {passive:true});
})();
