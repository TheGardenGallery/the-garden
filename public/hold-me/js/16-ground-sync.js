/* ===== GROUND SYNC: the header and the cursor take the room they are in.
   =====================================================================
   Every band and every rule note declares its own ground with
   `data-ground`, and this unit answers one question for two consumers:
   WHICH GROUND IS AT THIS POINT ON THE PAGE?

     the HEADER asks about the point behind its own bar, so the bar carries
       the room the page has scrolled under it
     the CURSOR asks about the pointer, so the reticle is always legible on
       whatever it is standing on

   OFFSETS ARE MEASURED ONCE, NOT PER EVENT. getBoundingClientRect() inside a
   pointermove handler is a forced layout on every frame of every mouse
   movement, which is the exact thrash that made the body rails janky before
   they were rewritten. The bands only move when the page reflows, so they are
   measured on load, on resize and after the images land, and every lookup
   after that is arithmetic against cached numbers.

   Reads are also rAF-throttled: pointermove and scroll both fire far faster
   than the screen repaints, and nothing here can be seen more than once a
   frame. ===== */
(() => {
  const root = document.documentElement;
  const zones = [...document.querySelectorAll('[data-ground]')];
  if (!zones.length) return;

  /* which reticle palette reads on which ground. Ivan's mapping, with one
     addition: the white room was not specified and a white reticle would be
     invisible on it, so it takes the black palette. */
  const CURSOR = {
    hero:   'red',
    red:    'green',
    black:  'white',
    white:  'black',
    orange: 'green',
    grey:   'white',
    green:  'orange',
  };

  let spans = [];
  const measure = () => {
    const y = window.scrollY;
    spans = zones.map(el => {
      const r = el.getBoundingClientRect();
      return { g: el.dataset.ground, top: r.top + y, bottom: r.bottom + y };
    });
  };

  /* LAST match wins, not first. The rule notes sit between bands and a band
     can be a few pixels taller than its content, so spans can touch or
     overlap by a hair; taking the later one in document order keeps the
     handover crisp instead of flickering at the join. */
  const groundAt = docY => {
    let hit = null;
    for (const s of spans) if (docY >= s.top && docY < s.bottom) hit = s.g;
    return hit;
  };

  const NAV_H = 60;
  let pointerY = null, pointerX = null, queued = false;

  const sync = () => {
    queued = false;
    if (!spans.length) return;
    const y = window.scrollY;

    const navGround = groundAt(y + NAV_H / 2);
    if (navGround && root.dataset.nav !== navGround) root.dataset.nav = navGround;

    if (pointerY !== null) {
      let g = groundAt(y + pointerY);
      /* the straddle room is two grounds side by side, split at the page's
         centre: the reticle takes whichever half the pointer is over */
      if (g === 'straddle') g = (pointerX !== null && pointerX >= innerWidth / 2) ? 'green' : 'red';
      const c = CURSOR[g];
      if (c && root.dataset.cursor !== c) root.dataset.cursor = c;
    }
  };
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(sync); } };

  window.addEventListener('pointermove', e => { pointerX = e.clientX; pointerY = e.clientY; schedule(); }, { passive: true });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', () => { measure(); schedule(); });

  /* the page grows as artwork decodes, so the cached offsets have to be taken
     again once it has: a nav that stops matching halfway down the page is
     almost always a measurement taken before the images had height. */
  window.addEventListener('load', () => { measure(); schedule(); });
  document.querySelectorAll('img').forEach(im => {
    if (!im.complete) im.addEventListener('load', () => { measure(); schedule(); }, { once: true });
  });

  measure();
  sync();
})();
