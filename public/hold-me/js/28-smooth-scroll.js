(() => {
  /* ===== SMOOTH SCROLL: Lenis (Ivan, 2026-10-23) ==========================
     The wheel is eased into the page's native scroll, so every scroll-driven
     room (the curtain, the orange cycle, spine C's scrub, the sticky pins)
     still reads window.scrollY and IntersectionObserver as before: Lenis
     only decides how fast scrollY travels, never where things are.

     What it must leave alone:
     - sideways gestures: the Queue, the clamshell strip and the interlude
       panels pan on deltaX, so a swipe that is more sideways than down is
       handed back to the browser untouched;
     - pinch (ctrl + wheel), which is the loupe's: Lenis ignores it itself;
     - the lightbox, which zooms on the wheel: the page holds still while it
       is open (it locks the root's overflow, and Lenis stops with it);
     - touch, which stays native (syncTouch off), and reduced motion. */
  if (typeof Lenis !== 'function') return;
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;

  const lenis = new Lenis({
    lerp: .1,
    wheelMultiplier: 1,
    gestureOrientation: 'vertical',
    virtualScroll: ({ deltaX, deltaY }) => Math.abs(deltaX) <= Math.abs(deltaY)
  });
  window.lenis = lenis;

  const root = document.documentElement;
  new MutationObserver(() => {
    if (root.style.overflow === 'hidden') lenis.stop(); else lenis.start();
  }).observe(root, { attributes: true, attributeFilter: ['style'] });

  const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
})();
