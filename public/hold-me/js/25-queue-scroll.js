(() => {
  /* ===== THE QUEUE SCROLLS SIDEWAYS =====================================
     Trackpads and touch scroll the line natively (overflow-x). A mouse has
     no sideways wheel, so the line can also be dragged, with a short coast
     on release. A drag that moves is a drag: the lightbox ignores clicks
     that moved, and the loupe closes while a button is down, so neither
     fires mid-drag. Vertical wheel is never taken: the page keeps
     scrolling through the room. */
  const sc = document.querySelector('.queue-scroll');
  if (!sc) return;

  /* ── THE OPENING: AS MANY WHOLE PHONES AS FIT, CENTRED ───────────────
     The line's left padding is set so the run of whole phones that fits the
     window stands centred in it, with the same black on both sides; the
     next phone waits past the right edge. The gaps themselves never change
     (H/4, see the CSS): only where the line starts. Re-set on resize, and
     the visitor's own position is kept once they have moved the line. */
  /* both shelves share the scroll; the opening run is measured on the
     candybar shelf and the same start is given to both, so their first
     phones stand on one vertical line */
  const lines = [...sc.querySelectorAll('.queue')];
  const line = lines[0];
  let touched = false;
  const settle = () => {
    const gutter = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gutter')) || 80;
    const items = [...line.querySelectorAll('.queue-item')];
    if (!items.length) return;
    const G = parseFloat(getComputedStyle(line).columnGap) || 0;
    const room = sc.clientWidth - 2 * gutter;
    let run = 0;
    for (let k = 0; k < items.length; k++) {
      const w = items[k].offsetWidth + (k ? G : 0);
      if (run + w > room) break;
      run += w;
    }
    const pad = Math.max(gutter, (sc.clientWidth - run) / 2);
    lines.forEach(l => { l.style.paddingLeft = l.style.paddingRight = pad.toFixed(1) + 'px'; });
    if (!touched) sc.scrollLeft = 0;
  };

  ['wheel', 'pointerdown', 'touchstart', 'keydown'].forEach(t => sc.addEventListener(t, () => { touched = true; }, { passive: true }));
  addEventListener('resize', settle);
  addEventListener('load', settle);
  settle();

  if (matchMedia('(pointer:coarse)').matches) return;
  /* mouse drag with a short coast, for the Queue and for every other
     sideways strip marked [data-hscroll] (the Process room's flips) */
  [sc, ...document.querySelectorAll('[data-hscroll]')].forEach(strip => {
  let drag = null, v = 0, raf = 0;
  const coast = () => {
    raf = 0;
    if (drag || Math.abs(v) < .3) return;
    strip.scrollLeft -= v; v *= .93;
    raf = requestAnimationFrame(coast);
  };
  strip.addEventListener('pointerdown', e => {
    if (e.button !== 0 || e.pointerType !== 'mouse') return;
    drag = { x: e.clientX, moved: false }; v = 0;
  });
  addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) < 5) return;
    if (!drag.moved) { drag.moved = true; strip.classList.add('dragging'); }
    strip.scrollLeft -= dx; v = v * .5 + dx * .5; drag.x = e.clientX;
  });
  addEventListener('pointerup', () => {
    if (!drag) return;
    const moved = drag.moved; drag = null; strip.classList.remove('dragging');
    if (moved && !raf) raf = requestAnimationFrame(coast);
  });
  });
})();
