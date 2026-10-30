(() => {
  /* ===== THE ARRIVAL =====
     Adds .arrived to any [data-arrive] section once it is genuinely in
     view, which releases its contents from their start positions and lets
     the CSS transitions run. All the motion lives in the stylesheet; this
     only decides WHEN.

     THE RATIO IS MEASURED AGAINST WHICHEVER IS SMALLER, the element or the
     viewport, NOT against the element alone. A plain `threshold: .28` is a
     fraction of the ELEMENT, so on a section several viewports tall (the
     spine is exactly that) 28% of it can never be on screen at once and the
     trigger would simply never fire. Comparing the visible height to
     min(element, viewport) asks the right question, "is a real part of the
     screen filled by this section", and works for a 100vh band and a
     3000px one alike.

     Fires once, then unobserves: a composition that re-assembles itself
     every time you scroll past is a gimmick. */
  const arrivals = document.querySelectorAll('[data-arrive]');
  if(!arrivals.length) return;

  /* no IntersectionObserver (or reduced motion): show everything, in place */
  if(!('IntersectionObserver' in window) ||
     window.matchMedia('(prefers-reduced-motion:reduce)').matches){
    arrivals.forEach(el => el.classList.add('arrived'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    for(const e of entries){
      if(!e.isIntersecting) continue;
      const seen = e.intersectionRect.height;
      const ref  = Math.min(e.boundingClientRect.height, innerHeight);
      if(ref > 0 && seen / ref < .28) continue;
      e.target.classList.add('arrived');
      io.unobserve(e.target);
    }
  }, {threshold:[0,.05,.1,.2,.3,.5,.75,1]});

  arrivals.forEach(el => io.observe(el));
})();
