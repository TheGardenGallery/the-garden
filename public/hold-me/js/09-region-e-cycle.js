(() => {
  /* ===== E · THE COUNTER-CLOCKWISE CYCLE =====
     The 2x2 pins for one viewport and the four quadrants step counter-
     clockwise around the ring, one step per screen of scroll, for exactly
     ONE FULL CYCLE (4 steps). On the fifth state every work is back where it
     started, the figure has resolved, and the sticky runs out so the page
     continues into the grey region.

     Slots are the four corners in CLOCKWISE ring order:
       0 = top-left   1 = top-right   2 = bottom-right   3 = bottom-left
     Counter-clockwise is therefore slot MINUS one, so each move is an EDGE
     move: 0->3 down the left, 3->2 across the bottom, 2->1 up the right,
     1->0 across the top. No cell ever crosses the centre or passes another.

     Driven by scroll POSITION, not by wheel events: the state is a pure
     function of where the page is, so it is scrubbable in both directions,
     survives a mid-cycle reload, and never desynchronises the way an
     event-counting scroll-jack does. No preventDefault anywhere, the page
     is never hijacked, it simply has a tall section. ===== */
  const scroller = document.querySelector('.e-scroll');
  const sticky   = document.querySelector('.e-sticky');
  const grid     = document.querySelector('.e-grid');
  if(!scroller || !sticky || !grid) return;

  const cells  = Array.from(grid.querySelectorAll('.e-cell'));
  const textC  = grid.querySelector('.e-text');
  const passes = Array.from(grid.querySelectorAll('.e-text .e-pass'));
  const STEPS  = 4;                       // the empty slot's full circuit

  /* ---- PRECOMPUTE THE FIVE ARRANGEMENTS ----
     Simulated rather than hardcoded, so the sequence is derived from the
     rule instead of transcribed by hand (and stays correct if the panels
     are reordered in the markup).

     Slots clockwise: 0 = TL, 1 = TR, 2 = BR, 3 = BL. The empty slot is
     wherever the text panel is. Each step the artwork at slot (e+1)%4 slides
     into e, which is a single-axis edge move into space that is already
     vacant. The empty then walks clockwise to the slot just vacated, so
     every ARTWORK's own travel is counter-clockwise. After four steps the
     orange is home, having been round all four corners. */
  const layouts = [];
  {
    const at = [];                                   // at[slot] = cell
    cells.forEach(c => { at[+c.dataset.slot] = c; });
    let empty = +textC.dataset.slot;
    for(let s = 0; s <= STEPS; s++){
      layouts.push(at.map(c => c));                  // snapshot
      const from = (empty + 1) % 4;
      at[empty] = at[from];
      at[from]  = textC;
      empty = from;
    }
  }

  let state = -1;

  /* arm the transitions only after the first paint, so nothing slides on
     load */
  requestAnimationFrame(() => requestAnimationFrame(() => grid.classList.add('live')));

  const apply = (s) => {
    if(s === state) return;
    state = s;
    layouts[s].forEach((cell, slot) => { cell.dataset.slot = slot; });
    /* the copy drops instantly (transition:opacity 0s) and the new passage
       comes back on the .74s delay built into .e-pass.on, which is after the
       .72s slide has landed. Type is never in the air. */
    passes.forEach((p,i) => p.classList.toggle('on', i === s));
  };

  /* ---- GEOMETRY IS MEASURED ONCE, NOT EVERY FRAME ----
     This read scroller.offsetHeight, sticky.offsetHeight AND
     getBoundingClientRect() inside the rAF, so every animation frame of
     every scroll through this section forced three synchronous layouts.
     That is the lag: the browser cannot composite a frame while it is being
     asked to re-resolve the document, so the slide stutters exactly when the
     viewer is moving, which is the only time anyone sees it.

     None of those numbers change while scrolling. They change when the page
     reflows, so they are cached on load, on resize and after the images
     land, and every frame after that is arithmetic against scrollY. The
     ground-sync unit solves the identical problem the identical way. */
  let topY = 0, travel = 0;
  const remeasure = () => {
    const r = scroller.getBoundingClientRect();
    topY   = r.top + window.scrollY;
    travel = scroller.offsetHeight - sticky.offsetHeight;
    measure();
  };

  let raf = 0;
  const measure = () => {
    raf = 0;
    if(travel <= 0){ apply(0); return; }
    const past = Math.min(Math.max(window.scrollY - topY + 60, 0), travel);
    /* Math.round, not floor: a state is reached at the MIDPOINT of its band,
       so the move happens halfway through its screen rather than only at the
       very end of it. */
    apply(Math.min(Math.round((past / travel) * STEPS), STEPS));
  };
  const onScroll = () => { if(!raf) raf = requestAnimationFrame(measure); };

  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', remeasure);
  addEventListener('load', remeasure);
  remeasure();
})();
