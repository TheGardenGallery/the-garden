(() => {
  /* ===== Custom green flip-phone cursor, page-wide ===== */
  const ret = document.querySelector('.phone-reticle');
  if (ret){
    let tx=-100, ty=-100, x=-100, y=-100, raf=0, armed=false;
    const OFF = 20;                         // centre the 40px icon on the point
    const tick = () => {
      x += (tx - x) * 0.35; y += (ty - y) * 0.35;   // light, quick follow
      ret.style.transform = `translate(${x-OFF}px, ${y-OFF}px)`;
      if (Math.abs(tx-x) > 0.1 || Math.abs(ty-y) > 0.1) raf = requestAnimationFrame(tick);
      else raf = 0;
    };
    window.addEventListener('pointermove', (e) => {
      // Arm on the first real mouse/pen move rather than trusting a hover
      // media query, embedded webviews can misreport hover support and
      // would otherwise leave the native arrow showing.
      if (e.pointerType === 'touch') return;
      if (!armed){ armed = true; document.documentElement.classList.add('phone-cursor'); }
      tx = e.clientX; ty = e.clientY;
      ret.style.opacity = '1';
      if (!raf) raf = requestAnimationFrame(tick);
    }, {passive:true});
    // hide only on true window exit
    window.addEventListener('pointerout', (e) => {
      if (!e.relatedTarget) ret.style.opacity = '0';
    });
  }
})();
