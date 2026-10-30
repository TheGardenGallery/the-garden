(() => {
  /* ===== THE KEY RAILS ================================================
     A keypad lattice standing in each gutter, one pair per room.

     ── THE TILE IS A KEYPAD, NOT A GRID ───────────────────────────────
     Three columns and four rows, which is 1-2-3 / 4-5-6 / 7-8-9 / *-0-#,
     with a wider gap after the block exactly as the handsets have between
     their keypad and their soft keys. The marks are rounded rectangles wider
     than they are tall, because that is the shape of a key; a circle would
     have made it graph paper again.

     Pitch is measured against the gutter rather than chosen: three columns
     have to sit inside 80px with air at both ends, so the column pitch is a
     share of the rail and every other number follows from it. Change
     --gutter and the keypad rescales with it.

     ── INK PER ROOM ───────────────────────────────────────────────────
     These are the header's own measured values. The comment in 03-nav.css
     records how they were chosen: by contrast against each ground, not by
     light-or-dark instinct, because white type scores 2.8 on the grey and
     near-black scores 7.4, and on the green the gap is wider still. Reusing
     them means the rails can never disagree with the bar standing above
     them.

     ── IT IS BUILT ONCE ───────────────────────────────────────────────
     One pass at load, two small SVGs per band, no scroll handler and nothing
     to recompute: the pattern is defined in the SVG and the browser tiles
     it. The rails cost nothing after the first paint. */

  /* ── THE REGISTER IS CALIBRATED, NOT CHOSEN ─────────────────────────
     These opacities were not picked by eye. The reference sits about 4
     levels off its ground, and the first pass here measured 13.7 to 28.7
     levels across the ten rooms: four to seven times too loud, which reads
     as a pattern rather than as a texture. Each room was then scaled by
     target over measured and re-measured.

     The target rises slightly with the lightness of the ground rather than
     holding one absolute step, because an equal step is not an equal
     impression: the same four levels that whisper on the void room nearly
     disappear on the grey. Dark rooms aim at 5 levels, mid rooms at 6, the
     grey at 7.

     Second value is the opacity, first is the ink. The inks are the
     header's own measured values, so the lattice can never disagree with
     the bar standing above it. */
  const INK = {
    hero:   ['#f5f3ef', .015],   /* measured 28.7 levels at .085 */
    black:  ['#f5f3ef', .015],
    red:    ['#170006', .051],   /* measured 18.7 at .16 */
    white:  ['#141414', .045],   /* no white room in this hang; unverified */
    orange: ['#2a0d00', .059],   /* measured 15.3 at .15 */
    grey:   ['#141614', .044],   /* measured 23.7 at .15 */
    green:  ['#08240c', .074],   /* measured 13.7 at .17 */
    straddle: ['#170006', .051], /* split red|green room: the red's ink */
  };

  const NS = 'http://www.w3.org/2000/svg';
  const COLUMN = 1360;   /* the page's notional content column, as on Ricky's page */
  let uid = 0;

  /* ── THE KEYPAD IS THE GUTTER MODULE ────────────────────────────────
     The tile is exactly one gutter wide, so the left rail holds exactly one
     keypad standing on the page axis and the right rail mirrors it.

     The first build let the lattice tile freely across the page, the way the
     reference does. Boosting the contrast and counting showed why that is
     wrong here: the gutter came out with three and a half columns in it,
     because the tile boundary fell wherever the page width happened to put
     it. The reference can afford that - its dot grid is isotropic, so there
     is no such thing as a half dot. A keypad has three columns and half of
     one is visibly a mistake.

     So the lattice is anchored rather than wallpapered. This page has a
     single axis at 80px and W-80px, and the keypad now sits on it like
     everything else does. */
  /* ── DENSITY IS THE WHOLE THING, NOT CONTRAST ───────────────────────
     The first tile put three columns inside one 80px gutter with keys
     15 x 9, which is about 23% ink coverage. The reference is 3-4px dots on
     a 40px pitch: about 0.75%. Thirty times sparser.

     That is why lowering the opacity never fixed it. At 23% coverage the
     lattice is a continuous surface, so it reads as present everywhere
     however faint it is; at 1% it is a scattering of points that the eye
     only gathers into a texture where there is enough empty ground to
     gather, which is exactly the "reveals itself on wider viewports"
     behaviour. The quality being matched is not how dark the marks are, it
     is how much of the page they occupy.

     So the marks shrink to the reference's size and the pitch opens to its
     spacing. What stays is the KEYPAD rhythm rather than a square grid:
     three columns, four rows, a wider gap after the block, and a mark
     slightly wider than tall. At this size the phone is in the spacing, not
     in the drawing of a key - which is the correct place for it, because a
     recognisable key at 1% coverage would just be a smudge.

     The tile is no longer tied to the gutter. That constraint existed when
     these were rails and had to fit one keypad exactly; a plane has no such
     obligation, and forcing 3 columns into 80px is what made the pitch
     twice as tight as the reference in the first place. */
  const tile = (gutter) => {
    const colPitch = gutter / 2;           /* 40px at the standard gutter */
    const keyW = colPitch * 0.125;         /* 5px: the reference's mark size */
    const keyH = keyW / 1.6;               /* a key is wider than it is tall */
    const rowPitch = colPitch * 0.65;
    const blockGap = rowPitch * 0.62;      /* keypad to soft keys */
    return {
      w: colPitch * 3,
      h: rowPitch * 4 + blockGap,
      colPitch, keyW, keyH, rowPitch,
    };
  };

  const makeField = (gutter, ink) => {
    const t = tile(gutter);
    const id = 'keypad-' + (uid++);
    const el = document.createElement('div');
    el.className = 'keyfield';
    el.setAttribute('aria-hidden', 'true');
    el.style.setProperty('--rail-ink', ink[0]);
    el.style.setProperty('--rail-op', ink[1]);

    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('preserveAspectRatio', 'none');

    const defs = document.createElementNS(NS, 'defs');
    const pat = document.createElementNS(NS, 'pattern');
    pat.setAttribute('id', id);
    pat.setAttribute('width', t.w);
    pat.setAttribute('height', t.h);
    pat.setAttribute('patternUnits', 'userSpaceOnUse');

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        const k = document.createElementNS(NS, 'rect');
        k.setAttribute('x', (c * t.colPitch + (t.colPitch - t.keyW) / 2).toFixed(2));
        k.setAttribute('y', (r * t.rowPitch + t.rowPitch * .5 - t.keyH / 2).toFixed(2));
        k.setAttribute('width',  t.keyW.toFixed(2));
        k.setAttribute('height', t.keyH.toFixed(2));
        k.setAttribute('rx', (t.keyH * .34).toFixed(2));
        k.setAttribute('fill', 'currentColor');
        pat.appendChild(k);
      }
    }
    defs.appendChild(pat);
    svg.appendChild(defs);

    /* the field covers the whole room: the lattice is only ever SEEN where
       the room is empty, which is what makes the margins read as rails
       without anyone authoring a rail */
    /* ── IT STANDS OUTSIDE THE CONTENT, NOT UNDER IT ──────────────────
       The reference's plane really is full-bleed: measured on the live page
       by testing for its 40px periodicity, the centre column carries the
       lattice just as strongly as the margins do (83% concentration at the
       sides, 54% in the middle, where content pollutes the count).

       But copying that construction onto this page does not reproduce what
       you SEE there. His centre is covered by content from top to bottom,
       so the plane only ever surfaces at the two sides. These rooms carry
       large areas of empty ground in the middle, so the same plane surfaces
       where his never gets the chance to.

       The honest port is of the RESULT, not the method: two strips, left
       and right of whatever this room actually contains.

       The edges are MEASURED per room rather than set to the gutter, and
       that is the part that makes it breathe. A room whose work is capped
       at 1000px has 364px of margin at 1728 and 220px at 1440, so the
       lattice opens as the window widens and closes as it narrows. A fixed
       80px rail sat there at identical strength forever, which is what made
       it feel bolted on. */
    const stripL = document.createElementNS(NS, 'rect');
    stripL.setAttribute('x', '0'); stripL.setAttribute('y', '0');
    stripL.setAttribute('width', '0'); stripL.setAttribute('height', '100%');
    stripL.setAttribute('fill', `url(#${id})`);
    stripL.setAttribute('class', 'kf-l');
    const stripR = document.createElementNS(NS, 'rect');
    stripR.setAttribute('y', '0');
    stripR.setAttribute('width', '0'); stripR.setAttribute('height', '100%');
    stripR.setAttribute('fill', `url(#${id})`);
    stripR.setAttribute('class', 'kf-r');
    svg.appendChild(stripL); svg.appendChild(stripR);

    el.appendChild(svg);
    return el;
  };

  /* the room's real content extent: the union of everything in it that is
     not the lattice. Conservative on purpose - the narrowest margins down
     the whole band win, so the strips can never slide under a work that
     sits further out than its neighbours. */
  const fitToContent = (band, field) => {
    const br = band.getBoundingClientRect();
    let L = br.width, R = 0;
    band.querySelectorAll('*').forEach(el => {
      if (el.closest('.keyfield')) return;
      if (el.children.length && !/^(IMG|P|H1|H2|H3|SPAN|FIGCAPTION)$/.test(el.tagName)) return;
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      L = Math.min(L, r.left - br.left);
      R = Math.max(R, r.right - br.left);
    });
    if (!(L < R)) { L = br.width; R = 0; }          /* nothing found: no strips */
    /* ── THE MARGIN OUTSIDE THE PAGE'S COLUMN, NOT OUTSIDE THE WORK ────
       Measured to each room's content alone, a room holding one 630px work
       put the lattice 550px into the screen on both sides, right up to the
       work, which is nothing like the reference: there the dots live only
       in the margin OUTSIDE a fixed content column, so they appear as the
       window grows past it and never reach toward the centre.

       So the strip is the smaller of two widths: the margin outside a
       COLUMN of COLUMN px centred on the room, and the room's real content
       margin (so a work that runs wider than the column still covers it).
       At 1728 that is 184px a side, at 1512 76px, and below 1360 nothing. */
    const outside = Math.max(0, (br.width - COLUMN) / 2);
    const l = Math.max(0, Math.floor(Math.min(L, outside)));
    const r = Math.max(0, Math.ceil(Math.min(br.width - R, outside)));
    field.style.setProperty('--kf-l', l + 'px');
    field.style.setProperty('--kf-r', r + 'px');
    const sl = field.querySelector('.kf-l'), sr = field.querySelector('.kf-r');
    if (sl) sl.setAttribute('width', l);
    if (sr) { sr.setAttribute('x', Math.round(br.width - r)); sr.setAttribute('width', r); }
  };


  const build = () => {
    document.querySelectorAll('.keyfield').forEach(e => e.remove());
    const gutter = parseFloat(getComputedStyle(document.documentElement)
      .getPropertyValue('--gutter')) || 80;
    if (window.innerWidth <= 600) return;

    document.querySelectorAll('body > section.band, body > .hero').forEach(band => {
      const ground = band.getAttribute('data-ground') || 'black';
      const ink = INK[ground] || INK.black;
      /* every room gets one, bleed rooms included: where the work covers the
         lattice it is simply not seen, which is the correct outcome and
         needs no special case */
      if (getComputedStyle(band).position === 'static') band.style.position = 'relative';
      const f = makeField(gutter, ink);
      band.insertBefore(f, band.firstChild);
      fitToContent(band, f);
    });
  };

  let t = 0;
  addEventListener('resize', () => { clearTimeout(t); t = setTimeout(build, 180); });
  build();
  addEventListener('load', build);
})();
