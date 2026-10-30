(() => {
  /* ===== THE REVEAL =====
     Drives [data-reveal] and [data-reveal-seq]: adds .shown once an element
     is genuinely in view, which releases the CSS transition. All motion is
     in the stylesheet; this only decides when, and numbers the children of
     a sequence so their stagger is a pure calc().

     rootMargin -12% on the bottom means an element must be properly inside
     the viewport, not just grazing its lower edge. Without it the reveal
     fires on things still below the fold and you scroll down to find the
     work already done, which is the single most common way a reveal reads
     as broken rather than absent.

     Fires once and unobserves. Text that re-animates every time it passes
     is a gimmick, and on an exhibition page it is actively annoying to
     re-read. */
  const revealables = document.querySelectorAll('[data-reveal],[data-reveal-seq]');
  if(!revealables.length) return;

  if(!('IntersectionObserver' in window) ||
     window.matchMedia('(prefers-reduced-motion:reduce)').matches){
    revealables.forEach(el => el.classList.add('shown'));
    return;
  }

  /* number the children of every sequence ONCE, up front: the stagger is
     then carried entirely by CSS calc(--n * --stagger) with no per-element
     inline delay to maintain. */
  document.querySelectorAll('[data-reveal-seq]').forEach(seq => {
    Array.from(seq.children).forEach((child, i) => {
      child.style.setProperty('--n', i);
    });
  });

  const io = new IntersectionObserver((entries) => {
    for(const e of entries){
      if(!e.isIntersecting) continue;
      e.target.classList.add('shown');
      io.unobserve(e.target);
    }
  }, {threshold:.12, rootMargin:'0px 0px -12% 0px'});

  revealables.forEach(el => io.observe(el));
})();
