(() => {
  /* ===== THE SURFACE: the whole drawing behind one framing ================
     The room opens on a fixed fragment of png9 and can be dragged anywhere
     across the whole drawing at that same scale. The drawing is a two-level
     tile pyramid (_tools/make_tiles.py): level 1 at half resolution, always
     laid underneath so any area appears at once, and level 0 at full
     resolution on top, fading in tile by tile. Only tiles near the view are
     ever requested. Scale is fixed by the opening framing (it COVERS the
     room, as the image did), so there is no zoom and nothing to learn: you
     simply move the picture.

     Input: drag in any direction with momentum on release; a sideways
     trackpad swipe pans too, while a vertical one scrolls the page as usual;
     on touch, sideways swipes pan and vertical ones scroll (touch-action).

     EVERY .surface-pan on the page is mounted: the closing surface and the
     interludes between the rooms (2026-10-16) are the same component.

     THE INTERLUDES DRIFT AS WELL (Ivan, 2026-10-23): on top of the drag, as
     a panel passes the window the drawing travels against the page at a
     slower pace, so it seems to lie a little behind it. Each opening image
     is cut data-pad of its framing taller above and below
     (_tools/make_interludes.py), so the drift has drawing to show even
     where tiles are not served. Untouched and filling the window, the
     framing in view is his locked one; a drag moves the view from there and
     the drift carries on from wherever it was left. Where
     a work's tiles are not served (the private preview leaves the pyramids
     out), the room still opens on its framing, covering, and simply does
     not pan; before this fallback the opening image was never placed. */
  const mount = pan => {
  const layer = pan.querySelector('.surface-layer');
  const start = pan.querySelector('.surface-start');
  const base = pan.dataset.tiles;
  const [vx, vy, vw, vh] = pan.dataset.view.split(' ').map(Number);
  const pad = +pan.dataset.pad || 0, drifts = pad > 0, my = vh * pad;   /* margin, source px */

  /* the view is the framing's centre + the viewer's own pan (ux, uy) + the
     drift; ox / oy, the view's top left in drawing px, follow from those */
  let meta = null, s = 1, ox = 0, oy = 0, W = 0, H = 0, ux = 0, uy = 0;
  let velX = 0, velY = 0, raf = 0, drag = null, lastT = 0;
  const made = new Map();
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* panning bounds: the whole drawing, or only the framing without tiles */
  const clamp = () => {
    const [x0, y0, x1, y1] = meta.none ? [vx, vy - my, vx + vw, vy + vh + my] : [0, 0, meta.w, meta.h];
    ox = Math.max(x0, Math.min(x1 - W / s, ox));
    oy = Math.max(y0, Math.min(y1 - H / s, oy));
  };

  /* lay one tile of a level, once */
  const tile = (lvl, c, r) => {
    const k = lvl + '/' + c + '_' + r;
    if (made.has(k)) return;
    const span = meta.tile * (lvl ? 2 : 1);                /* source px per tile */
    const im = new Image();
    im.className = 'tile';
    im.decoding = 'async';
    im.alt = '';
    im.draggable = false;
    im.style.zIndex = lvl ? 1 : 3;
    im.dataset.c = c; im.dataset.r = r; im.dataset.lvl = lvl;
    im.onload = () => im.classList.add('in');
    im.src = `${base}${lvl}/${c}_${r}.webp`;
    layer.appendChild(im);
    made.set(k, im);
    sizeTile(im);
  };
  /* tiles are placed in CSS px at the current scale; half a pixel of
     overlap hides the hairline seam fractional positions would leave */
  const sizeTile = im => {
    const lvl = +im.dataset.lvl, span = meta.tile * (lvl ? 2 : 1);
    const c = +im.dataset.c, r = +im.dataset.r;
    const wSrc = Math.min(span, meta.w - c * span), hSrc = Math.min(span, meta.h - r * span);
    im.style.left = (c * span * s) + 'px';
    im.style.top = (r * span * s) + 'px';
    im.style.width = (wSrc * s + .5) + 'px';
    im.style.height = (hSrc * s + .5) + 'px';
  };

  const ensure = () => {
    if (meta.none) return;
    const devPerSrc = s * (devicePixelRatio || 1);
    const levels = devPerSrc > .5 ? [1, 0] : [1];
    const x0 = ox, y0 = oy, x1 = ox + W / s, y1 = oy + H / s;
    for (const lvl of levels) {
      const span = meta.tile * (lvl ? 2 : 1), m = span * .5;
      const cA = Math.max(0, Math.floor((x0 - m) / span)), cB = Math.min(Math.ceil(meta.w / span) - 1, Math.floor((x1 + m) / span));
      const rA = Math.max(0, Math.floor((y0 - m) / span)), rB = Math.min(Math.ceil(meta.h / span) - 1, Math.floor((y1 + m) / span));
      for (let c = cA; c <= cB; c++) for (let r = rA; r <= rB; r++) tile(lvl, c, r);
    }
  };

  const paint = () => {
    layer.style.transform = `translate3d(${(-ox * s).toFixed(2)}px,${(-oy * s).toFixed(2)}px,0)`;
    ensure();
  };

  const layout = () => {
    W = pan.clientWidth; H = pan.clientHeight;
    s = Math.max(W / vw, H / vh);                       /* cover, as the image did */
    /* the opening image sits exactly where its pixels are in the drawing */
    start.style.left = (vx * s) + 'px'; start.style.top = ((vy - my) * s) + 'px';
    start.style.width = (vw * s) + 'px'; start.style.height = ((vh + 2 * my) * s) + 'px';
    start.style.zIndex = 2;
    made.forEach(sizeTile);
    place();
  };

  /* the parallax: -1 as the panel's top enters at the window's bottom, 0 when
     it fills the window, +1 as its bottom leaves at the top. The drawing
     moves against the page by up to 8% of the window (less where the cut has
     less to give), easing nothing: it follows the scroll exactly. */
  const AMP = reduce || !drifts ? 0 : .08;
  /* the same inputs give the same view, so a call that changes nothing
     writes nothing: the scroll event and Lenis's own frame both arrive
     for one scroll step, and only the first of them has work to do */
  let was = '';
  const place = () => {
    if (!meta) return;
    let dy = 0;
    const top = AMP ? pan.getBoundingClientRect().top : 0;
    const now = top + ' ' + ux + ' ' + uy + ' ' + W + ' ' + H + ' ' + s;
    if (now === was) return;
    was = now;
    if (AMP) {
      const prog = Math.max(-1, Math.min(1, -top / H));
      const travel = Math.min(AMP * H, Math.max(0, ((vh + 2 * my) * s - H) / 2));
      dy = -prog * travel / s;
    }
    const bx = vx + vw / 2 - W / s / 2 + ux, by = vy + vh / 2 - H / s / 2 + uy + dy;
    ox = bx; oy = by; clamp();
    ux += ox - bx; uy += oy - by;                      /* a pan held at an edge stays at it */
    paint();
  };

  /* momentum after a release, decaying in about a second */
  const glide = () => {
    raf = 0;
    if (drag) return;
    const now = performance.now(), dt = Math.min(.05, (now - lastT) / 1000); lastT = now;
    velX *= Math.pow(.02, dt); velY *= Math.pow(.02, dt);
    if (Math.hypot(velX, velY) < 8) return;
    ux -= velX * dt / s; uy -= velY * dt / s;
    place();
    raf = requestAnimationFrame(glide);
  };

  pan.addEventListener('pointerdown', e => {
    if (!meta || e.button !== 0) return;
    drag = { x: e.clientX, y: e.clientY, t: performance.now() };
    velX = velY = 0;
    pan.classList.add('dragging');
    pan.setPointerCapture(e.pointerId);
  });
  pan.addEventListener('pointermove', e => {
    if (!drag) return;
    const now = performance.now(), dx = e.clientX - drag.x;
    /* on touch the browser owns vertical movement (touch-action pan-y) */
    const dy = e.pointerType === 'touch' ? 0 : e.clientY - drag.y;
    const dt = Math.max(1, now - drag.t) / 1000;
    velX = velX * .6 + (dx / dt) * .4; velY = velY * .6 + (dy / dt) * .4;
    drag = { x: e.clientX, y: e.clientY, t: now };
    ux -= dx / s; uy -= dy / s;
    place();
  });
  const release = () => {
    if (!drag) return;
    drag = null;
    pan.classList.remove('dragging');
    if (!reduce && !raf) { lastT = performance.now(); raf = requestAnimationFrame(glide); }
  };
  pan.addEventListener('pointerup', release);
  pan.addEventListener('pointercancel', release);

  /* a sideways trackpad swipe pans; a vertical one is left to the page */
  pan.addEventListener('wheel', e => {
    if (!meta || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    ux += e.deltaX / s;
    place();
  }, { passive: false });

  addEventListener('resize', () => { if (meta) layout(); });

  /* nothing is fetched until the room is near */
  new IntersectionObserver(async ([e], io) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    meta = await fetch(base + 'meta.json').then(r => r.ok ? r.json() : null).catch(() => null);
    if (!meta) { meta = { none: true }; pan.style.cursor = 'default'; }
    layout();
    if (AMP) {
      /* every scroll frame, and inside Lenis's own frame so the drawing never
         lags the page by one. Only while the panel is within a window of
         the screen: further off, the drift is pinned at its end (-1 or +1)
         and every frame would recompute the same view. Leaving, it is
         placed once more, so it waits at exactly that end. */
      let live = false;
      new IntersectionObserver(([e]) => { live = e.isIntersecting; place(); }, { rootMargin: '100% 0px' }).observe(pan);
      const onScroll = () => { if (live) place(); };
      addEventListener('scroll', onScroll, { passive: true });
      if (window.lenis) window.lenis.on('scroll', onScroll);
    }
  }, { rootMargin: '100% 0px' }).observe(pan);
  };
  document.querySelectorAll('.surface-pan').forEach(mount);
})();
