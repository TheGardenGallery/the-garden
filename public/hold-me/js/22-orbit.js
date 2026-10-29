(() => {
  /* ===== THE ORBIT: the series as one slow ring ==========================
     Six works of the series, each a stack of phones, on one ellipse, at
     staggered heights, in real 3D: angle -> a
     point on the circle (sin a * R, 0, (cos a - 1) * D), so foreshortening
     is the browser's own perspective. Each phone turns with the ring
     (rotateY) and fades toward the room's grey with distance; nothing is
     blurred.

     Ivan (2026-10-22): no wireframe, less clutter, more serious. The cage
     and the snake that rode it are gone. The stacks stay (Ivan: single
     phones read too linear); the far side of the ring fades further back
     so the front stacks lead instead of all of them at once.

     Steering: the pointer's side of the room sets speed and direction, and
     a drag turns it by hand with inertia. A press that moves is a drag; the
     lightbox ignores those, so only a still click opens a work. It runs only
     while the room is on screen. */
  const room = document.querySelector('.band-orbit');
  if (!room) return;
  const items = [...room.querySelectorAll('.orbit-item')];
  if (!items.length) return;
  /* the slow turn runs under Reduce Motion too (Ivan, 2026-10-27): it is
     one unhurried rotation, and stopped, the room read as broken */
  let theta = 0, omega = .1, px = null, drag = null, fling = 0;
  const BASE = .1;

  /* ON A TOUCH SCREEN (2026-10-27) the ring stuck and jolted: a finger has
     no hover, so its position must not steer the speed; and when a touch
     becomes a page scroll the browser cancels it, which was never heard,
     so the ring believed it was still held and froze until the next tap.
     Now the pointer steers only with a mouse, and a cancelled touch lets go
     (the room's touch-action leaves vertical swipes to the page). */
  room.addEventListener('pointermove', e => {
    if (e.pointerType === 'mouse') {
      const r = room.getBoundingClientRect();
      px = (e.clientX - r.left) / r.width;
    }
    if (drag !== null) { const d = e.clientX - drag; drag = e.clientX; theta += d * .0045; fling = d * .0045 * 60; }
  });
  room.addEventListener('pointerleave', () => { px = null; drag = null; });
  room.addEventListener('pointerdown', e => { drag = e.clientX; fling = 0; });
  addEventListener('pointerup', () => { drag = null; });
  addEventListener('pointercancel', () => { drag = null; });

  const place = () => {
    const W = room.clientWidth, H = room.clientHeight;
    /* a phone screen is narrower than a stack is wide, so the ring opens
       out there: the side stacks swing past the edges instead of piling
       onto the front one */
    const narrow = W <= 600;
    const R = W * (narrow ? .62 : .34), D = W * (narrow ? 1.1 : .62);
    items.forEach((it, i) => {
      const a = theta + i * Math.PI * 2 / items.length;
      const depth = Math.cos(a);
      const t = (depth + 1) / 2;                   /* 0 back .. 1 front */
      const x = Math.sin(a) * R;
      const z = (depth - 1) * D;
      const turn = -Math.sin(a) * 30;
      const y = H * (+it.dataset.y || 0) * .9;
      it.style.transform = `translate(-50%,-50%) translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,${z.toFixed(1)}px) rotateY(${turn.toFixed(2)}deg)`;
      it.style.opacity = (.12 + .88 * Math.pow(t, 2)).toFixed(3);
      it.style.zIndex = Math.round(t * 100);
    });
  };

  let raf = 0, last = 0, on = false;
  const tick = now => {
    const dt = last ? Math.min((now - last) / 1000, .05) : 0; last = now;
    const target = px === null ? BASE : BASE + (px - .5) * .8;
    omega += (target - omega) * Math.min(1, dt * 2);
    if (drag === null) { theta += (omega + fling) * dt; fling *= Math.pow(.04, dt); }
    place();
    if (on) raf = requestAnimationFrame(tick);
  };
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !on) { on = true; last = 0; raf = requestAnimationFrame(tick); }
    else if (!e.isIntersecting) { on = false; cancelAnimationFrame(raf); }
  }).observe(room);
  place();
})();
