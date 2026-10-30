(() => {
  /* ===== THE DOCUMENT AND THE MAKING, ONE FRAME ===========================
     The process room opens on the Image Trace grab; a swipe (or a drag, or
     the hairlines under it) brings his screen recording into the same
     frame. The recording plays only while its pane is in view (the track's
     overflow clips it, so the observer sees it leave), muted and looping. */
  const reel = document.querySelector('.proc-reel');
  if (!reel) return;
  const track = reel.querySelector('.proc-reel-track');
  const panes = [...track.children];
  const marks = [...reel.querySelectorAll('.proc-reel-marks button')];
  const v = reel.querySelector('video');

  const at = () => Math.round(track.scrollLeft / track.clientWidth);
  const go = i => track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
  track.addEventListener('scroll', () => {
    const i = at();
    marks.forEach((m, k) => m.setAttribute('aria-current', k === i ? 'true' : 'false'));
  }, { passive: true });
  marks.forEach((m, k) => m.addEventListener('click', () => go(k)));
  addEventListener('resize', () => { track.scrollLeft = at() * track.clientWidth; });

  /* a mouse drags the frame and lets go to the nearer pane, or to the next
     one if it was pulled a tenth of the way; a drag never opens the
     lightbox */
  let drag = null;
  track.addEventListener('pointerdown', e => {
    if (e.button !== 0 || e.pointerType !== 'mouse') return;
    drag = { x: e.clientX, left: track.scrollLeft, from: at(), moved: false };
  });
  addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) < 5) return;
    if (!drag.moved) { drag.moved = true; track.classList.add('dragging'); }
    track.scrollLeft = drag.left - dx;
  });
  addEventListener('pointerup', () => {
    if (!drag) return;
    const d = drag; drag = null;
    if (!d.moved) return;
    const pulled = (track.scrollLeft - d.left) / track.clientWidth;
    const to = Math.abs(pulled) > .1 ? d.from + Math.sign(pulled) : d.from;
    track.classList.remove('dragging');
    go(Math.max(0, Math.min(panes.length - 1, to)));
    const eat = e => { e.stopPropagation(); e.preventDefault(); };
    track.addEventListener('click', eat, { capture: true, once: true });
    setTimeout(() => track.removeEventListener('click', eat, { capture: true }), 0);
  });

  /* the recording plays the moment it is swiped into view (Ivan,
     2026-10-27), Reduce Motion or not: it is the artist's own screen, and a
     still frame of it says nothing. Where the phone refuses to autoplay
     (iOS in Low Power Mode does), its controls appear so it can be started
     by hand. */
  if (!v) return;
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) v.play().catch(() => { v.controls = true; });
    else v.pause();
  }, { threshold: .6 }).observe(v);
})();
