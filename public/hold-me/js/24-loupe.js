(() => {
  /* ===== THE LOUPE: rest the cursor on any work to look closer ==========
     Move onto an artwork and, after a breath (DWELL, so crossing a work on
     the way somewhere else does not flash it), the flip-phone cursor opens
     into a square viewfinder that magnifies the drawing under it, read from
     the sharpest file the work has (the 4800px masters where they exist).
     Move to travel across the work; move off it and it closes.

     The wheel stays the PAGE's: a loupe that took the wheel on hover would
     trap the scroll under every work, which is exactly the stop Movsum
     asked us to remove from the orange room. Magnification is a pinch on
     the trackpad (the browser reports it as ctrl + wheel), or ctrl + wheel
     on a mouse. A click still opens the lightbox, and closes the loupe.

     Rooms with their own drag (the orbit, the rails, the closing surface)
     are left alone, and on touch screens nothing changes: pinch and the
     lightbox already do this job there.

     Square, hairline, no ornament: a circle reads as a gadget, a frame
     reads as a viewfinder, which is what a phone camera gave people. No
     magnification readout: the picture says how close you are. */
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;

  /* DWELL runs from ENTERING a work and is not restarted by moving across
     it, so the glass opens as the cursor arrives (Ivan: instantly), not
     once it rests; it only spares a work the cursor merely crosses. */
  const DWELL = 60, MIN = 1.5, FLOOR = 1.25, MAX = 6;
  /* every artwork has the glass (Ivan, 2026-10-23), the orbit's included;
     only the panels that are their own viewers (the interludes and the
     closing surface) and the chrome are left out */
  const EXCLUDE = '.rail, .body-rail, .surface-pan, .lb, nav, .hold, .brick';
  const root = document.documentElement;

  const el = document.createElement('div');
  el.className = 'loupe';
  el.setAttribute('aria-hidden', 'true');
  /* the magnified picture is an IMAGE on its own plane, moved by transform
     only (composited, never repainted), with the original's tiles laid over
     it on the same plane: a background-image repainted the whole master on
     every move, which is what made the glass stutter */
  el.innerHTML = '<div class="loupe-view"><div class="loupe-plane"><img class="loupe-pic" alt="" decoding="async"><div class="loupe-tiles"></div></div></div>';
  document.body.appendChild(el);
  const view = el.querySelector('.loupe-view');
  const plane = el.querySelector('.loupe-plane');
  const pic = el.querySelector('.loupe-pic');
  const tilesEl = el.querySelector('.loupe-tiles');

  /* ── THE SAME TILES AS THE LIGHTBOX ──────────────────────────────────
     Where a work has a tile pyramid from Movsum's original, the viewfinder
     lays the tiles it needs as a scaled copy of the work behind the glass,
     so past what the 4800px master holds it reads the original itself.
     Keyed by the file the PAGE shows (the drop-ins frame their works
     differently from the originals, so they are not in the manifest). */
  let manifest = null; const metas = new Map(), made = new Map();
  fetch('assets/works/t/tiles/manifest.json').then(r => r.ok ? r.json() : null).then(m => { manifest = m; }).catch(() => {});
  const tileFor = img => manifest && manifest[(img.getAttribute('src') || '').replace(/^[.]?[/]/, '')] || null;

  let active = null, refused = null, wantT = 0, mag = 3, shownMag = 1, raf = 0, px = 0, py = 0;

  /* the work under the point: the target itself, or, when a transparent
     overlay sits on top of a work (wrapped text, for instance), the first
     artwork beneath it */
  /* ONLY OVER THE DRAWING. Most files carry transparent margins around
     their ink; over those the glass opened onto bare room colour, an empty
     square. Each work gets a small alpha map, made once, and the point
     must be within a few pixels of ink. Opaque files always pass. */
  const inkMaps = new WeakMap();
  const mapOf = (img, src, quality) => {
    const S = 96, k = S / Math.max(img.naturalWidth, img.naturalHeight);
    const w = Math.max(1, Math.round(img.naturalWidth * k)), h = Math.max(1, Math.round(img.naturalHeight * k));
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d', { willReadFrequently: true });
    if (quality) g.imageSmoothingQuality = quality;
    g.drawImage(src, 0, 0, w, h);
    const d = g.getImageData(0, 0, w, h).data, a = new Uint8Array(w * h);
    let opaque = true;
    for (let i = 0; i < w * h; i++) { a[i] = d[i * 4 + 3]; if (a[i] < 250) opaque = false; }
    return opaque ? 'opaque' : { w, h, a };
  };

  /* ── MADE AHEAD, OFF THE MAIN THREAD (2026-10-27) ────────────────────
     Drawing the work itself into the canvas decoded the whole file on the
     main thread, 40 to 100ms the first time the cursor crossed each work,
     and that is usually mid-scroll: these were the page's longest frames.
     So each map is now made as its work nears the window, from the file
     decoded on a worker thread (createImageBitmap of the fetched file: of
     the element itself, it decodes on the main thread too). A JPEG has no
     alpha and is opaque without a look. If the cursor ever gets there
     first, the map is made the old way, on the spot. */
  const making = new WeakSet();
  const prepare = img => {
    if (inkMaps.has(img) || making.has(img)) return;
    making.add(img);
    const go = () => {
      const src = img.currentSrc || img.src;
      if (!img.naturalWidth || inkMaps.has(img)) return;
      if (/\.jpe?g(\?|$)/i.test(src)) { inkMaps.set(img, 'opaque'); return; }
      fetch(src).then(r => r.blob()).then(b => createImageBitmap(b)).then(bm => {
        if (!inkMaps.has(img)) inkMaps.set(img, mapOf(img, bm, 'medium'));
        bm.close();
      }).catch(() => {});
    };
    if (img.complete) go(); else img.addEventListener('load', go, { once: true });
  };
  const near = new IntersectionObserver(es => {
    for (const e of es) if (e.isIntersecting) { near.unobserve(e.target); prepare(e.target); }
  }, { rootMargin: '100% 0px' });
  document.querySelectorAll('img').forEach(im => { if (!im.closest(EXCLUDE)) near.observe(im); });

  const inkAt = (img, x, y) => {
    let m = inkMaps.get(img);
    if (m === undefined) {
      try { m = mapOf(img, img); }
      catch (e) { m = 'opaque'; }                       /* unreadable: never block the glass */
      inkMaps.set(img, m);
    }
    if (m === 'opaque' || !m) return true;
    const d = drawn(img);
    const u = Math.floor((x - d.x) / d.w * m.w), v = Math.floor((y - d.y) / d.h * m.h);
    for (let j = v - 1; j <= v + 1; j++) for (let i = u - 1; i <= u + 1; i++) {
      if (i >= 0 && j >= 0 && i < m.w && j < m.h && m.a[j * m.w + i] > 24) return true;
    }
    return false;
  };
  const artUnder = (x, y, target) => {
    const hit = artAt(target);
    if (hit && inkAt(hit, x, y)) return hit;
    /* only the room actually on top here: a room pinned under the page (the
       curtain keeps them stuck beneath the later rooms) is not in view */
    const all = document.elementsFromPoint(x, y);
    const room = all[0] && all[0].closest('section, .hero');
    for (const n of all) {
      if (n.closest(EXCLUDE)) return null;
      if (n.tagName === 'IMG' && n.closest('section, .hero') === room) { const a = artAt(n); if (a && inkAt(a, x, y)) return a; }
    }
    return null;
  };
  const artAt = target => {
    if (!target || target.closest(EXCLUDE)) return null;
    const img = target.tagName === 'IMG' ? target
      : target.closest('.plate, .e-plate, .e-cell, .h-cell, .pwork')?.querySelector('img');
    if (!img || !img.naturalWidth || img.closest(EXCLUDE)) return null;
    return img;
  };

  /* the sharpest file this work has */
  /* NOT data-lb-src: the lightbox may open a work in a different framing
     (the drop-ins open their trimmed originals), and the loupe must read the
     picture in the PAGE's framing, or it magnifies the wrong place. Past
     this file, the original's tiles take over (registered to the page
     image by _tools/register_pages.py). */
  const sharpest = img => {
    /* a master cut from Movsum's original in the page's framing
       (data-loupe-src), where the page ships no tiles for the work */
    if (img.dataset.loupeSrc) return img.dataset.loupeSrc;
    const src = img.currentSrc || img.src;
    if (/\/works\/t\/t-[^/]+\.webp$/.test(src)) return src.replace('/works/t/', '/works/t/hi/');
    return src;
  };

  /* the room colour behind the work, so transparent files sit on it */
  const groundOf = node => {
    for (let n = node; n && n !== document.body; n = n.parentElement) {
      const bg = getComputedStyle(n).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg;
    }
    return '#000';
  };

  /* where the picture is actually drawn inside its box (object-fit) */
  const drawn = img => {
    const r = img.getBoundingClientRect(), nw = img.naturalWidth, nh = img.naturalHeight;
    const fit = getComputedStyle(img).objectFit;
    let w = r.width, h = r.height;
    if (fit === 'contain' || fit === 'cover') {
      const k = (fit === 'contain' ? Math.min : Math.max)(r.width / nw, r.height / nh);
      w = nw * k; h = nh * k;
    }
    return { x: r.left + (r.width - w) / 2, y: r.top + (r.height - h) / 2, w, h };
  };

  /* ONE frame, read and written together: where the work is now (it may
     have moved under a still cursor: the page easing, a strip scrolling, a
     room sliding in) and where the cursor is. Runs every frame while the
     loupe is open, so nothing ever waits for an event to catch up. */
  let lastX = NaN, lastY = NaN, lastSY = NaN, dirty = false, planeW = 0, planeH = 0;
  const paint = () => {
    if (!active) return;
    shownMag += (mag - shownMag) * .22;
    if (Math.abs(mag - shownMag) < .002) shownMag = mag;
    const d = drawn(active.img), S = el.offsetWidth;
    /* the work slid out from under the cursor, or something now covers it:
       whatever is on top under the cursor counts. A pinned room (the
       curtain) does not move at all while the next room slides over it, so
       the test cannot wait for the work to move: any scroll asks again. */
    const sy = scrollY;
    if (d.x !== lastX || d.y !== lastY || sy !== lastSY || dirty) {
      const moved = !isNaN(lastX) || dirty; lastX = d.x; lastY = d.y; lastSY = sy; dirty = false;
      if (moved) { track(null); if (!active) return; }
    }
    const cx = Math.max(d.x, Math.min(d.x + d.w, px)), cy = Math.max(d.y, Math.min(d.y + d.h, py));
    /* `translate`, not `transform`: the frame opens with `scale`, which the
       browser applies BEFORE `transform`, so a transform-placed frame had its
       position scaled too and slid in from the page's top left */
    el.style.translate = `${(px - S / 2).toFixed(1)}px ${(py - S / 2).toFixed(1)}px`;
    const W = d.w * shownMag, H = d.h * shownMag;
    if (Math.abs(W - planeW) > .05 || Math.abs(H - planeH) > .05) {
      planeW = W; planeH = H;
      plane.style.width = W.toFixed(1) + 'px'; plane.style.height = H.toFixed(1) + 'px';
    }
    plane.style.transform = `translate3d(${(S / 2 - (cx - d.x) * shownMag).toFixed(1)}px,${(S / 2 - (cy - d.y) * shownMag).toFixed(1)}px,0)`;
    el.dataset.mag = (Math.round(shownMag * 2) / 2).toString();   /* read by _tools/loupe-audit.mjs; not shown */
    const en = active.entry, meta = en && metas.get(en.tiles);
    if (meta) {
      const [bx, by, bw, bh] = en.box, dpr = devicePixelRatio || 1;
      const devPerSrc = d.w * shownMag * dpr / bw;
      const basePerSrc = active.hiW ? active.hiW / bw : 0;
      if (devPerSrc > basePerSrc * 1.05) {
        const lvl = devPerSrc > .5 ? 0 : 1, span = meta.tile * (lvl ? 2 : 1);
        const half = S / 2 / (d.w * shownMag) * bw;           /* original px from centre to edge */
        const scx = bx + (cx - d.x) / d.w * bw, scy = by + (cy - d.y) / d.h * bh;
        const cA = Math.max(0, Math.floor((scx - half) / span)), cB = Math.min(Math.ceil(meta.w / span) - 1, Math.floor((scx + half) / span));
        const rA = Math.max(0, Math.floor((scy - half) / span)), rB = Math.min(Math.ceil(meta.h / span) - 1, Math.floor((scy + half) / span));
        for (let c = cA; c <= cB; c++) for (let r = rA; r <= rB; r++) {
          const k = `${en.tiles}/${lvl}/${c}_${r}`;
          let t = made.get(k);
          if (!t) {
            t = new Image(); t.className = 'loupe-tile'; t.alt = ''; t.decoding = 'async';
            t.onload = () => t.classList.add('in');
            t.src = `assets/works/t/tiles/${en.tiles}/${lvl}/${c}_${r}.webp`;
            made.set(k, t);
          }
          if (t.parentNode !== tilesEl) {
            const tw = Math.min(span, meta.w - c * span), th = Math.min(span, meta.h - r * span);
            t.style.left = ((c * span - bx) / bw * 100) + '%'; t.style.top = ((r * span - by) / bh * 100) + '%';
            t.style.width = (tw / bw * 100 + .02) + '%'; t.style.height = (th / bh * 100 + .02) + '%';
            t.style.zIndex = lvl ? 1 : 2;
            tilesEl.appendChild(t);
          }
        }
      }
    }
  };
  const loop = () => { raf = 0; if (!active) return; paint(); if (active && !raf) raf = requestAnimationFrame(loop); };
  const schedule = () => { if (!raf && active) raf = requestAnimationFrame(loop); };

  /* the eased page scroll moves the work in Lenis's own frame: paint in that
     same frame, after it, so the picture never shows where the work was */
  let hooked = false;
  const hook = () => { if (hooked || !window.lenis) return; hooked = true; window.lenis.on('scroll', () => { if (active) paint(); }); };

  /* ── NEVER A PIXEL HE DID NOT MAKE ───────────────────────────────────
     The deepest the loupe can go on a work is where its sharpest source
     runs out: the original (through its tiles) where one exists, else the
     file itself. A work whose file runs out before 1.5x opens at
     its own limit, never under FLOOR (Ivan, 2026-10-29: crisp first, the
     glass still on every work), so at worst a few are enlarged at 1.25x. */
  const maxMagFor = (img, entry) => {
    const d = drawn(img), dpr = devicePixelRatio || 1;
    const src = img.currentSrc || img.src;
    const srcW = entry ? entry.box[2] : img.dataset.loupeW ? +img.dataset.loupeW
      : (/\/works\/t\/t-[^/]+\.webp$/.test(src) ? img.naturalWidth * 2 : img.naturalWidth);
    return Math.min(MAX, srcW / (d.w * dpr));
  };

  const open = img => {
    const entry = tileFor(img);
    const cap = Math.max(FLOOR, maxMagFor(img, entry));
    const least = Math.min(MIN, cap);                   /* where it opens */
    refused = null;
    const moving = !!active;                            /* straight from one work to another */
    active = { img, entry, hiW: 0, cap };
    el.dataset.ground = (img.closest('[data-ground]') || {}).dataset?.ground || 'black';
    tilesEl.textContent = '';
    if (entry && !metas.has(entry.tiles)) fetch(`assets/works/t/tiles/${entry.tiles}/meta.json`).then(r => r.json()).then(m => { metas.set(entry.tiles, m); schedule(); }).catch(() => {});
    /* the loupe opens at its LEAST magnification (Ivan): a first look, and
       the viewer pinches in from there if they want to go closer. Moving
       straight onto another work keeps the magnification they chose, as far
       as that work's file allows. */
    /* the picture is at its magnification from the first frame: only the
       frame opens, so nothing zooms or slides while it appears */
    if (moving) mag = Math.max(least, Math.min(cap, mag));
    else { mag = least; shownMag = least; }
    hook(); lastX = lastY = NaN;
    const hi = sharpest(img), page = img.currentSrc || img.src;
    view.style.backgroundColor = groundOf(img);
    /* never show the previous work's picture while this one decodes */
    if (pic.getAttribute('src') !== page) {
      pic.style.visibility = 'hidden'; pic.src = page;
      pic.decode().catch(() => {}).then(() => { if (active && active.img === img) pic.style.visibility = ''; });
    }
    if (hi !== page) {                                  /* the master, decoded OFF the main thread, then swapped */
      const pre = new Image(); pre.decoding = 'async'; pre.src = hi;
      pre.decode().then(() => { if (active && active.img === img) { pic.src = hi; active.hiW = pre.naturalWidth; } }).catch(() => {});
    }
    /* placed under the cursor BEFORE it shows, so the first visible frame is
       already where it belongs */
    lastX = lastY = NaN; paint();
    root.classList.add('loupe-on');
    el.classList.add('on');
    schedule();
  };

  const close = () => {
    if (!active) return;
    active = null; cancelAnimationFrame(raf); raf = 0;
    root.classList.remove('loupe-on');
    el.classList.remove('on');
  };

  /* what is under the cursor now decides: the same work keeps the loupe,
     another work takes it over at once, bare page closes it. Opening from
     nothing waits DWELL so a pass across a work does not flash it. */
  let pending = null;
  const track = target => {
    const img = artUnder(px, py, target || document.elementFromPoint(px, py));
    if (img && active && img === active.img) { schedule(); return; }
    if (img && img === pending) return;                 /* already on its way: moving does not restart it */
    clearTimeout(wantT); pending = null;
    if (!img) { close(); refused = null; return; }
    if (img === refused) return;
    if (active) { open(img); return; }
    pending = img;
    wantT = setTimeout(() => { pending = null; open(img); }, DWELL);
  };

  addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    px = e.clientX; py = e.clientY;
    if (e.buttons) { clearTimeout(wantT); pending = null; close(); return; }   /* a drag or a selection, not a look */
    track(e.target);
  }, { passive: true });

  /* the page, or a sideways strip, scrolls under a still cursor: whatever is
     under it now counts. Captured, because a strip's scroll never reaches the
     window. While open, the scroll marks the frame dirty and the next frame
     re-tests, so a strip scrolled under a still cursor is caught too. */
  addEventListener('scroll', () => {
    if (!(px || py)) return;
    if (active) { dirty = true; schedule(); } else track(null);
  }, { passive: true, capture: true });

  const away = () => { clearTimeout(wantT); pending = null; close(); };
  document.documentElement.addEventListener('mouseleave', away);
  addEventListener('blur', away);
  addEventListener('pointerdown', away, true);              /* a click opens the lightbox, not both */

  /* pinch (ctrl + wheel) changes the magnification; the plain wheel scrolls */
  addEventListener('wheel', e => {
    if (!active || !e.ctrlKey) return;
    e.preventDefault();
    mag = Math.max(Math.min(MIN, active.cap), Math.min(active.cap, mag * Math.exp(-Math.max(-40, Math.min(40, e.deltaY)) * .01)));
    schedule();
  }, { passive: false });
})();
