(() => {
  /* ===== THE LIGHTBOX =====
     A faithful port of the Split Logic (Ricky) expanded viewer,
     components/ExpandedArtwork.tsx, into vanilla. Same constants, same
     gestures, same feel:

       scroll to zoom      1x to 6x, factor deltaY * 0.0018
       drag to pan         clamped so the artwork's edge never passes the
                           viewport edge, you can never lose the work
       double-click        reset to 1x
       click, no drag      closes, but ONLY at zoom 1
       arrows / swipe      previous and next through the whole page's works
       Escape              closes

     WHICH WORKS ARE IN IT: every <img> on the page that sits inside a plate,
     cell or grid, collected in DOM order so prev/next walks the exhibition
     the way it is hung. The HERO BRICKS ARE EXCLUDED, they are a draggable
     object with their own tap-to-flip, and the reticle belongs to them.

     Registration is by scan rather than by hand-tagging each work, so a work
     added to any region later is in the viewer automatically. ===== */
  const lb    = document.querySelector('.lb');
  if(!lb) return;
  const bg    = lb.querySelector('.lb-bg');
  const plate = lb.querySelector('.lb-plate');
  const zoomEl= lb.querySelector('.lb-zoom');
  const imgEl = lb.querySelector('.lb-zoom img');
  const prevB = lb.querySelector('.lb-prev');
  const nextB = lb.querySelector('.lb-next');

  const ZOOM_MIN = 1, ZOOM_MAX = 8, ZOOM_FLOOR = 4, ZOOM_STEP = 0.0018, PINCH_STEP = 0.01, DRAG_TOL = 4;

  /* Collect the works. EXCLUDES: the hero rail's bricks, the dithered
     lockup canvases, and the reticle. Everything else that is an artwork
     image on this page is in. */
  const works = Array.from(document.querySelectorAll(
    '.brick img, .plate img, .e-cell img, .h-cell img, .pwork img, .body-rail img'
  )).filter(img => !img.closest('.rail'));   // .rail is the hero brick strip

  if(!works.length) return;
  works.forEach(img => { img.dataset.lb = ''; });

  let index = 0, zoom = 1, panX = 0, panY = 0, open = false;
  let lastFocused = null;

  const clampPan = (x, y, z) => {
    if(z <= 1) return {x:0, y:0};
    const w = plate.offsetWidth * z, h = plate.offsetHeight * z;
    const mx = Math.max(0, (w - innerWidth) / 2);
    const my = Math.max(0, (h - innerHeight) / 2);
    return {x: Math.max(-mx, Math.min(mx, x)), y: Math.max(-my, Math.min(my, y))};
  };

  /* ── DEEP ZOOM FROM THE ORIGINALS ─────────────────────────────────────
     Every work cut from one of Movsum's ~11000px originals has a tile
     pyramid (assets/works/t/tiles/, _tools/make_tiles.py): level 1 at half
     resolution, level 0 at full. A tile layer sits inside .lb-zoom exactly
     over the picture, so it zooms and pans with it for free. After every
     zoom or pan the viewer works out how many device pixels each original
     pixel now covers; while the opened file still has that much detail no
     tile is fetched at all, and past it only the tiles in view are loaded,
     fading in over the picture.

     THE RULE: NEVER SHOW A PIXEL HE DID NOT MAKE. Up to its native
     resolution (the original's tiles, else its own file) a work is drawn
     smooth. Past it (Ivan, 2026-10-23: let us zoom in further) nothing is
     invented either: his pixels are shown ENLARGED, as hard squares
     (image-rendering: pixelated), never smoothed into a guess. Every work
     zooms to at least ZOOM_FLOOR, and to twice its native limit, to 8x. */
  let manifest = null, entry = null, zoomMax = ZOOM_MAX, nativeMax = ZOOM_MAX;
  fetch('assets/works/t/tiles/manifest.json').then(r => r.ok ? r.json() : null).then(m => { manifest = m; }).catch(() => {});
  const metas = new Map();
  const tileLayer = document.createElement('div');
  tileLayer.className = 'lb-tiles';
  zoomEl.appendChild(tileLayer);
  const tilesMade = new Map();

  const keyOf = img => (img.dataset.lbSrc || img.getAttribute('src') || '').replace(/^\.?\//, '');

  /* the most this work can be magnified without inventing pixels */
  const setZoomMax = () => {
    const dpr = devicePixelRatio || 1, pw = plate.offsetWidth || 1;
    nativeMax = Math.max(1, entry ? entry.box[2] / (pw * dpr) : (imgEl.naturalWidth || pw * dpr) / (pw * dpr));
    zoomMax = Math.min(ZOOM_MAX, Math.max(ZOOM_FLOOR, nativeMax * 2));
  };

  const updateTiles = () => {
    if (!entry || !open) return;
    const meta = metas.get(entry.tiles);
    if (!meta) return;
    const dpr = devicePixelRatio || 1, pw = plate.offsetWidth || 1;
    const [bx, by, bw, bh] = entry.box;
    const devPerSrc = pw * zoom * dpr / bw;
    const basePerSrc = (imgEl.naturalWidth || 0) / bw;
    if (devPerSrc <= basePerSrc * 1.05) return;            /* the opened file is enough */
    const lvl = devPerSrc > .5 ? 0 : 1, span = meta.tile * (lvl ? 2 : 1);
    /* the part of the picture on screen, in original pixels */
    const r = zoomEl.getBoundingClientRect();
    const fx0 = Math.max(0, -r.left / r.width), fx1 = Math.min(1, (innerWidth - r.left) / r.width);
    const fy0 = Math.max(0, -r.top / r.height), fy1 = Math.min(1, (innerHeight - r.top) / r.height);
    const sx0 = bx + fx0 * bw, sx1 = bx + fx1 * bw, sy0 = by + fy0 * bh, sy1 = by + fy1 * bh;
    const cA = Math.max(0, Math.floor(sx0 / span)), cB = Math.min(Math.ceil(meta.w / span) - 1, Math.floor(sx1 / span));
    const rA = Math.max(0, Math.floor(sy0 / span)), rB = Math.min(Math.ceil(meta.h / span) - 1, Math.floor(sy1 / span));
    for (let c = cA; c <= cB; c++) for (let rr = rA; rr <= rB; rr++) {
      const k = `${entry.tiles}/${lvl}/${c}_${rr}`;
      if (tilesMade.has(k)) continue;
      const tw = Math.min(span, meta.w - c * span), th = Math.min(span, meta.h - rr * span);
      const t = new Image();
      t.className = 'lb-tile'; t.alt = ''; t.decoding = 'async'; t.draggable = false;
      t.style.left = ((c * span - bx) / bw * 100) + '%';
      t.style.top = ((rr * span - by) / bh * 100) + '%';
      t.style.width = (tw / bw * 100 + .02) + '%';
      t.style.height = (th / bh * 100 + .02) + '%';
      t.style.zIndex = lvl ? 1 : 2;
      t.onload = () => t.classList.add('in');
      t.src = `assets/works/t/tiles/${entry.tiles}/${lvl}/${c}_${rr}.webp`;
      tileLayer.appendChild(t);
      tilesMade.set(k, t);
    }
  };
  let tileTimer = 0;
  const scheduleTiles = (ms) => { clearTimeout(tileTimer); tileTimer = setTimeout(updateTiles, ms); };

  const paint = (animate) => {
    zoomEl.style.transition = animate ? 'transform 280ms cubic-bezier(.22,.61,.36,1)' : 'none';
    zoomEl.style.transform  = `translate(${panX}px,${panY}px) scale(${zoom})`;
    zoomEl.classList.toggle('past-native', zoom > nativeMax * 1.02);
    lb.style.cursor = zoom > 1 ? 'grab' : 'zoom-out';
    scheduleTiles(animate ? 300 : 60);
  };

  /* ── THE ROOM IS THE WORK'S OWN GROUND, AND IT CHANGES WITH THE WORK ──
     Every work stands in a room painted its own ground colour, measured off
     the file (never a table of grounds to keep in step with new deliveries).

     It was measured on the FULL file: the whole 2000px picture drawn into a
     canvas and read back on the main thread, which froze the viewer for
     close to half a second on each new work, and the room then faded to its
     colour over 0.72s while the picture had already cut, so the two never
     arrived together. Then it went black (2026-10-30), which was smooth but
     lost the colour. Now (Ivan, 2026-10-30) the colour is back and it lands
     ON THE SAME FRAME as the work, with no fade:

       the ground is read off a 96px copy of the file, decoded from its
       bytes by createImageBitmap OFF the main thread. Drawing the <img>
       itself into a canvas, even a small one, forces the full picture to
       decode on the main thread (60 to 90ms measured); from a Blob it costs
       the page nothing. A flat margin is just as flat at 96px

       the works either side of the open one are decoded and measured AHEAD,
       so by the time an arrow is pressed the next picture and its colour
       are both already in hand

       the swap sets the colour and the picture together, and the colour
       does not transition at all (see .lb-bg)

     THE BORDER RING, NOT ONE CORNER. Eight points around the frame, the
     value six of them agree on wins, so a drawing touching one edge cannot
     repaint the room. A ring that does not agree means the file has no
     margin, and the dominant colour of the whole picture answers instead.
     A ring that is mostly empty is a transparent work, made to stand on its
     room: the section's own ground token answers. */
  const RING = 96;
  const groundCache = new Map();
  const keyOfSrc = src => new URL(src, document.baseURI).href;
  const groundOf = (key, fromEl, small) => {
    if(groundCache.has(key)) return groundCache.get(key);
    let out = null;
    try{
      if(small){
        const c = document.createElement('canvas');
        c.width = c.height = RING;
        const ctx = c.getContext('2d', {willReadFrequently:true});
        ctx.drawImage(small, 0, 0, RING, RING);
        const d = ctx.getImageData(0, 0, RING, RING).data;
        const at = (x, y) => (y * RING + x) * 4;
        const e = 1, m = RING >> 1, z = RING - 1 - e;
        const tally = new Map();
        let clear = 0;
        for(const [x, y] of [[e,e],[z,e],[e,z],[z,z],[m,e],[m,z],[e,m],[z,m]]){
          const i = at(x, y);
          if(d[i+3] < 8){ clear++; continue; }
          /* quantised to 8 levels per channel so samples of one flat ground
             agree with each other despite compression noise */
          const k = (d[i]>>3)+','+(d[i+1]>>3)+','+(d[i+2]>>3);
          const cur = tally.get(k) || {n:0, rgb:[0,0,0]};
          cur.n++; cur.rgb = [d[i], d[i+1], d[i+2]];
          tally.set(k, cur);
        }
        let best = null;
        for(const v of tally.values()) if(!best || v.n > best.n) best = v;
        if(clear >= 4){
          /* transparent: the section token below takes over */
        } else if(best && best.n >= 6){
          out = `rgb(${best.rgb[0]},${best.rgb[1]},${best.rgb[2]})`;
        } else {
          /* no flat margin: the dominant colour of the picture, quantised
             coarsely, then averaged inside the winning bin so the answer is
             a real colour rather than a bin centre */
          const bins = new Map();
          for(let i = 0; i < d.length; i += 4){
            if(d[i+3] < 128) continue;
            const k = (d[i]>>4)+','+(d[i+1]>>4)+','+(d[i+2]>>4);
            const cur = bins.get(k) || {n:0, r:0, g:0, b:0};
            cur.n++; cur.r += d[i]; cur.g += d[i+1]; cur.b += d[i+2];
            bins.set(k, cur);
          }
          let top = null;
          for(const v of bins.values()) if(!top || v.n > top.n) top = v;
          if(top) out = `rgb(${Math.round(top.r/top.n)},${Math.round(top.g/top.n)},${Math.round(top.b/top.n)})`;
        }
      }
    }catch(_){ /* tainted canvas: fall through to the section's token */ }
    if(!out && fromEl){
      const sec = fromEl.closest('[data-ground]');
      const tok = sec && sec.getAttribute('data-ground');
      if(tok) out = getComputedStyle(document.documentElement)
                      .getPropertyValue('--g-' + tok).trim() || null;
    }
    out = out || '#000';
    groundCache.set(key, out);
    return out;
  };
  /* measure() resolves to the work's ground, decoding its 96px copy off the
     main thread; without createImageBitmap the section token answers */
  const measure = (src, el) => {
    const key = keyOfSrc(src);
    if(groundCache.has(key)) return Promise.resolve(groundCache.get(key));
    if(!window.createImageBitmap) return Promise.resolve(groundOf(key, el));
    return fetch(src).then(r => r.blob())
      .then(b => createImageBitmap(b, {resizeWidth:RING, resizeHeight:RING, resizeQuality:'low'}))
      .then(bm => { const g = groundOf(key, el, bm); if(bm.close) bm.close(); return g; })
      .catch(() => groundOf(key, el));
  };
  const setGround = (g) => lb.style.setProperty('--lb-ground', g);

  /* ── THE NEXT WORK IS READY BEFORE IT IS ASKED FOR ────────────────────
     prepare() decodes a work off screen and measures its ground. Only the
     open work and its two neighbours are held, so arrowing through forty
     works never keeps forty decoded 2000px pictures alive. */
  const wrap = i => (i % works.length + works.length) % works.length;
  const srcOf = i => { const w = works[wrap(i)]; return w.dataset.lbSrc || w.currentSrc || w.src; };
  const ready = new Map();
  const dims = new Map();   /* decoded size per file, so the plate's ratio is known before the <img> reports it */
  const prepare = (i) => {
    const src = srcOf(i), el = works[wrap(i)];
    if(ready.has(src)) return ready.get(src);
    const pre = new Image(); pre.src = src;
    const decoded = (pre.decode ? pre.decode() : new Promise(r => { pre.onload = pre.onerror = r; })).catch(() => {});
    const p = Promise.all([decoded, measure(src, el)]).then(([, g]) => {
      if(pre.naturalWidth) dims.set(src, [pre.naturalWidth, pre.naturalHeight]);
      return {pre, g};
    });
    ready.set(src, p);
    return p;
  };
  const prepareAround = () => {
    const keep = new Set([srcOf(index - 1), srcOf(index), srcOf(index + 1)]);
    for(const k of ready.keys()) if(!keep.has(k)) ready.delete(k);
    prepare(index + 1); prepare(index - 1);
  };
  let swapToken = 0;


  /* ── THE FIELD IN THE ROOM ───────────────────────────────────────────
     The same Gabor shader that lights the page, running at a third of its
     speed and a little stronger, so the ground breathes slowly behind the
     work and leans toward the cursor. This is what says "the viewer is
     open" now that nothing is painted around the artwork to say it.

     Built once, on first open, and only if WebGL is there: a viewer that
     cannot render a field still shows the work on its correct ground. */
  let field = null;
  const ensureField = () => {
    if(field || typeof window.GaborField !== 'function') return;
    const holder = document.createElement('div');
    holder.className = 'lb-field';
    holder.setAttribute('aria-hidden', 'true');
    bg.after(holder);
    /* ── AMPLITUDE IS SET BY THE EDGE, NOT BY TASTE ───────────────────
       At amp .11 behind an opacity of .7 this printed a visible halo round
       every work, and it was read as a blur at the canvas edge. Nothing was
       blurred: the room matched the work's ground EXACTLY with the field off
       (measured rgb(150,155,151) on both sides of the boundary, no step at
       all), and the field then lifted the room to rgb(153..159) while the
       artwork stayed flat. A smooth gradient running up to a flat rectangle
       is a glow, which is the one thing a viewer must never draw around a
       work.

       The step at the boundary IS the field's local amplitude, so there is
       no spatial trick that removes it: a mask that fades the field near the
       work is a vignette, which is the same halo drawn deliberately.

       What makes both possible is that the eye finds MOVEMENT at far lower
       contrast than it finds a static edge. So the amplitude drops until the
       boundary step is under two levels, and the rate drops with it so the
       room reads as breathing rather than shimmering. You see the light
       move; you cannot find the rectangle. */
    field = window.GaborField(holder, { amp: .028, rate: .17 });
  };

  const show = (i) => {
    index = (i % works.length + works.length) % works.length;
    /* OPEN THE WORK, NOT THE THUMBNAIL IT WAS CLICKED FROM. The Series field
       is built from square plates: the work's ink extracted, scaled to 86% and
       centred on its ground, so every cell butts into one field. That square is
       a LAYOUT derivative, not the artwork, and opening it put the piece in the
       viewer at 1:1 with 14% of padding baked round it. data-lb-src names the
       real file; anything without one is already the work. */
    const src = works[index].dataset.lbSrc || works[index].currentSrc || works[index].src;
    const token = ++swapToken, el = works[index];
    /* opening: the plate's own entrance is the transition. openAt() has
       already waited for prepare(), so the colour and the picture's ratio
       are in hand and both land before the first visible frame */
    if(!lb.classList.contains('open')){
      imgEl.classList.remove('lb-in');
      const g = groundCache.get(keyOfSrc(src));
      if(g) setGround(g);
      swap(src);
      if(!g) measure(src, el).then(m => { if(token === swapToken) setGround(m); });
      prepareAround();
      return;
    }
    /* navigating: colour and picture change on the same frame, the colour
       at once, the picture rising over it in 0.18s */
    prepare(index).then(({g}) => {
      if(token !== swapToken || !open) return;
      setGround(g);
      imgEl.classList.add('lb-in');
      swap(src);
      requestAnimationFrame(() => requestAnimationFrame(() => imgEl.classList.remove('lb-in')));
      prepareAround();
    });
  };

  const swap = (src) => {
    imgEl.src = src;
    /* ── THEN THE MASTER ─────────────────────────────────────────────────
       The page shows the 2400px file of each transparent work; its 4800px
       master in works/t/hi/ has the identical framing at twice the pixels.
       The page file opens instantly (it is cached) and the master replaces
       it the moment it has arrived, so zooming reads the full drawing
       instead of enlarging a page-sized file. Same ratio, so nothing moves. */
    const master = /\/works\/t\/t-[^/]+\.webp$/.test(src) ? src.replace('/works/t/', '/works/t/hi/') : null;
    if (master) {
      const want = index, pre = new Image();
      /* decoded BEFORE it goes in: assigning a 4000px file that has only
         loaded makes the browser decode it on the main thread at the next
         paint, a freeze of about 300ms just after every work opens */
      pre.src = master;
      pre.decode().then(() => {
        if (index !== want || !open) return;
        imgEl.src = master;
        /* the native limit is the MASTER's now: measured off the page file
           it stayed at half, and past-native drew a work that had the
           detail as hard squares from about 1.3x */
        setZoomMax();
        zoomEl.classList.toggle('past-native', zoom > nativeMax * 1.02);
      }).catch(() => {});
    }
    imgEl.alt = works[index].alt || '';
    tileLayer.textContent = ''; tilesMade.clear();
    entry = manifest ? manifest[keyOf(works[index])] || null : null;
    if (entry && !metas.has(entry.tiles)) {
      fetch(`assets/works/t/tiles/${entry.tiles}/meta.json`).then(r => r.json()).then(m => { metas.set(entry.tiles, m); updateTiles(); }).catch(() => {});
    }
    zoomMax = ZOOM_MAX; nativeMax = ZOOM_MAX;
    /* the plate takes the WORK's own ratio, so nothing is cropped and the
       frame is never larger than the picture in it. naturalWidth is 0 until
       the file decodes, hence the onload fallback. */
    const known = dims.get(src);
    const setRatio = () => {
      const w = imgEl.naturalWidth || (known && known[0]), h = imgEl.naturalHeight || (known && known[1]);
      if(w && h){
        plate.style.setProperty('--lb-aspect', w + '/' + h);
        /* the numeric ratio too: the plate needs it to cap its WIDTH off the
           available HEIGHT, which is the only way a tall work is guaranteed
           to fit on screen. See .lb-plate. */
        plate.style.setProperty('--lb-ar', (w / h).toFixed(4));
      }
    };
    setRatio();
    imgEl.addEventListener('load', setRatio, {once:true});
    /* the zoom limit needs the plate's settled size and the file's pixels */
    requestAnimationFrame(setZoomMax);
    imgEl.addEventListener('load', setZoomMax, {once:true});
    zoom = 1; panX = panY = 0; paint(false);
  };

  /* OPENING WAITS FOR THE WORK, briefly. The viewer used to fade in on the
     PREVIOUS work's room colour and plate ratio, then snap to this one's
     about 100ms in (measured on a phone: the grey room's work opened on
     black for 138ms). The viewer is still invisible (opacity 0) while the
     work decodes and its ground is measured, usually a few tens of ms, so
     waiting costs nothing seen; past 250ms it opens anyway and the colour
     follows. */
  const OPEN_WAIT_MS = 250;
  let openToken = 0;
  const openAt = (i, from) => {
    lastFocused = from || document.activeElement;
    open = true;
    const my = ++openToken;
    lb.hidden = false;
    ensureField();
    if(field) field.resize();
    if(field && field.start) field.start();
    /* the page's own field is behind an opaque viewer: stop drawing it */
    if(window.pageAura) window.pageAura.stop();
    document.documentElement.style.overflow = 'hidden';
    index = wrap(i);
    Promise.race([prepare(index), new Promise(r => setTimeout(r, OPEN_WAIT_MS))]).then(() => {
      if(!open || my !== openToken) return;
      show(index);
      requestAnimationFrame(() => lb.classList.add('open'));
    });
  };

  const close = () => {
    open = false;
    lb.classList.remove('open');
    document.documentElement.style.overflow = '';
    if(window.pageAura && window.pageAura.start) window.pageAura.start();
    /* wait out the fade before hiding, so it does not blink off */
    /* the field stops with the viewer hidden: it was drawing a full-window
       shader on every frame behind display:none for the rest of the visit */
    setTimeout(() => { if(!open){ lb.hidden = true; imgEl.removeAttribute('src'); if(field) field.stop(); } }, 190);
    if(lastFocused && lastFocused.focus) lastFocused.focus();
  };

  /* ---- opening. Delegated at the document, so any work added later works
     with no rebinding. The portrait grid keeps its own click handler for
     passing focus; a BLURRED portrait selects rather than opens, and only
     the already-focused one opens, so one click never does two things. */
  /* A DRAG MUST NOT OPEN THE VIEWER. The body rails are draggable strips of
     artworks, and a pointerup after a drag still fires a click on whatever
     was under the cursor, so without this every fling would end in an open
     lightbox. Measured against the same 4px tolerance the viewer's own pan
     uses, so a shaky click still counts as a click. */
  let downX = 0, downY = 0;
  document.addEventListener('pointerdown', (e) => { downX = e.clientX; downY = e.clientY; }, true);

  document.addEventListener('click', (e) => {
    if(open) return;
    /* the click that CLOSED the viewer (mouseup closes it, the click lands
       after) must not reach through the fading overlay and reopen the work
       underneath it */
    if(e.target.closest('.lb')) return;
    if(Math.abs(e.clientX - downX) > DRAG_TOL || Math.abs(e.clientY - downY) > DRAG_TOL) return;
    /* the work under the click, even when wrapped text lies over it: a
       paragraph flowing around a work's outline still has a rectangular box
       that covers the work, and would otherwise swallow the click */
    const img = e.target.closest('[data-lb]') ||
      document.elementsFromPoint(e.clientX, e.clientY).find(n => n.matches && n.matches('img[data-lb]'));
    if(!img) return;
    /* THE PORTRAIT STACK NEVER OPENS ON A SINGLE CLICK. A click there brings
       a card forward, which is that region's whole interaction; opening the
       viewer as well would make every selection a page takeover. The stack
       opens on DOUBLE-click instead, handled below. */
    if(img.closest('.pwork')) return;
    e.preventDefault();
    openAt(works.indexOf(img), img.closest('button') || img);
  });

  /* the stack's own way in: double-click the front card. Only the front one,
     a covered card's first click is what brings it forward. */
  document.addEventListener('dblclick', (e) => {
    if(open) return;
    const card = e.target.closest('.pwork');
    if(!card || !card.classList.contains('focus')) return;
    const img = card.querySelector('img');
    if(!img) return;
    e.preventDefault();
    openAt(works.indexOf(img), card);
  });

  /* ---- zoom. Non-passive: the page must not scroll behind the viewer. */
  lb.addEventListener('wheel', (e) => {
    if(!open) return;
    e.preventDefault();
    if(e.ctrlKey && gestureFrom !== null) return;   /* Safari's gesture events own the pinch */
    /* a trackpad pinch arrives as ctrl+wheel with deltaY NEGATIVE for
       fingers apart, the opposite sign to scrolling down, so it zoomed
       backwards: spreading the fingers shrank the work */
    const d = e.ctrlKey ? -e.deltaY * PINCH_STEP : e.deltaY * ZOOM_STEP;
    zoom = Math.max(ZOOM_MIN, Math.min(zoomMax, zoom * (1 + d)));
    const p = clampPan(panX, panY, zoom); panX = p.x; panY = p.y;
    paint(true);
  }, {passive:false});

  /* ---- Safari pinch. Safari reports a trackpad pinch as gesture events,
     not ctrl+wheel, and left alone it zoomed the whole page behind the
     viewer. Scale is relative to the zoom at the gesture's start. */
  let gestureFrom = null;
  lb.addEventListener('gesturestart', (e) => { if(!open) return; e.preventDefault(); gestureFrom = zoom; });
  lb.addEventListener('gesturechange', (e) => {
    if(!open || gestureFrom === null) return;
    e.preventDefault();
    zoom = Math.max(ZOOM_MIN, Math.min(zoomMax, gestureFrom * e.scale));
    const p = clampPan(panX, panY, zoom); panX = p.x; panY = p.y;
    paint(false);
  });
  lb.addEventListener('gestureend', (e) => { if(gestureFrom === null) return; e.preventDefault(); gestureFrom = null; paint(true); });

  /* ---- mouse: drag to pan, click (no drag) at zoom 1 to close ---- */
  let drag = null;
  lb.addEventListener('mousedown', (e) => {
    if(e.target.closest('.lb-nav')) return;
    drag = {x:e.clientX, y:e.clientY, px:panX, py:panY, moved:false};
    lb.style.cursor = zoom > 1 ? 'grabbing' : 'zoom-out';
  });
  window.addEventListener('mousemove', (e) => {
    if(!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if(Math.abs(dx) > DRAG_TOL || Math.abs(dy) > DRAG_TOL) drag.moved = true;
    if(zoom > 1){
      const p = clampPan(drag.px + dx, drag.py + dy, zoom);
      panX = p.x; panY = p.y; paint(false);
    }
  });
  window.addEventListener('mouseup', () => {
    if(!drag) return;
    const wasDrag = drag.moved; drag = null;
    paint(true);
    if(!wasDrag && zoom <= 1 && open) close();
  });
  lb.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    zoom = 1; panX = panY = 0; paint(true);
  });

  /* ---- touch: pan when zoomed, swipe to navigate and tap to close at 1x.
     Same thresholds as the component: 36px of travel, or a flick over
     0.4 px/ms past 18px, inside a 900ms window, horizontal-dominant by
     1.3x so a diagonal scroll gesture is not read as a swipe. */
  let touch = null;
  lb.addEventListener('touchstart', (e) => {
    if(e.touches.length !== 1) return;
    const t = e.touches[0];
    touch = {x:t.clientX, y:t.clientY, px:panX, py:panY, t:Date.now(), moved:false};
  }, {passive:true});
  lb.addEventListener('touchmove', (e) => {
    if(!touch || e.touches.length !== 1) return;
    const t = e.touches[0];
    const dx = t.clientX - touch.x, dy = t.clientY - touch.y;
    if(Math.abs(dx) > DRAG_TOL || Math.abs(dy) > DRAG_TOL) touch.moved = true;
    if(zoom > 1){
      const p = clampPan(touch.px + dx, touch.py + dy, zoom);
      panX = p.x; panY = p.y; paint(false);
    } else if(Math.abs(dx) > Math.abs(dy)){
      panX = dx; panY = 0; paint(false);
    }
  }, {passive:true});
  lb.addEventListener('touchend', (e) => {
    if(!touch) return;
    const t = e.changedTouches[0]; const st = touch; touch = null;
    if(!t){ paint(true); return; }
    const dx = t.clientX - st.x, dy = t.clientY - st.y, ms = Date.now() - st.t;

    if(!st.moved && zoom <= 1 && ms < 400){ close(); return; }

    const horizontal = Math.abs(dx) > Math.abs(dy) * 1.3;
    const far   = Math.abs(dx) > 36;
    const flick = (Math.abs(dx) / Math.max(ms,1)) > 0.4 && Math.abs(dx) > 18;
    if(zoom <= 1 && horizontal && ms < 900 && (far || flick)){
      panX = 0; panY = 0;
      show(index + (dx > 0 ? -1 : 1));
      return;
    }
    panX = 0; panY = 0; paint(true);
  });

  /* ---- arrows. stopPropagation so the click does not also reach the
     overlay's close-on-click. */
  prevB.addEventListener('click', (e) => { e.stopPropagation(); show(index - 1); });
  nextB.addEventListener('click', (e) => { e.stopPropagation(); show(index + 1); });

  /* ---- the arrow keys are PACED to the room. A held key auto-repeats
     about thirty times a second, and every step repaints the room in the
     next work's ground, so holding one strobed the colours. The ground no
     longer fades (it changes with the work, see show()), so the pace is set
     by the work's own .18s fade-up instead of the old .72s ground fade: a
     fresh press steps at once but never inside a fade-up, and a held key
     steps once per fade-up plus a beat to see the work, about three works
     a second, brisk without strobing. */
  const HOLD_MS = 320, TAP_MS = 180;
  let lastStep = 0;
  window.addEventListener('keydown', (e) => {
    if(!open) return;
    if(e.key === 'Escape') { close(); return; }
    if(e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const now = performance.now();
    if(now - lastStep < (e.repeat ? HOLD_MS : TAP_MS)) return;
    lastStep = now;
    show(index + (e.key === 'ArrowLeft' ? -1 : 1));
  });

  /* a resize can leave a pan outside the new clamp */
  window.addEventListener('resize', () => {
    if(!open) return;
    setZoomMax();
    const p = clampPan(panX, panY, zoom); panX = p.x; panY = p.y; paint(false);
  });
})();
