(() => {
  /* ===== THE HANDSET'S SCREEN, DRAWN AS A SCREEN ==========================
     The first build typeset Silkscreen on the green with a soft glow and a
     block caret: type on a green rectangle. This draws the panel itself.

     ── THE PANEL ───────────────────────────────────────────────────────
     84 pixels across, the PCD8544's own width, and as many rows as the
     artwork's aperture holds at square pixels (2.78 : 1 -> 30). Every pixel
     cell is drawn, lit or not: the unlit ones at a few percent of ink, the
     ghost matrix every one of these screens showed, which is what makes a
     green rectangle read as an LCD. Lit pixels are flat, slightly
     translucent squares with a hairline gap. No blur anywhere: an LCD does
     not glow.

     ── WHAT IT SHOWS ───────────────────────────────────────────────────
     Idle: signal bars top left, battery top right, and the operator name in
     the middle, which here is the show: HOLD ME. Then a number is dialled
     the way these phones dialled: big bold digits arriving from the RIGHT,
     bottom-weighted, no cursor. It stands to be read, is cleared with C
     held (back to front, fast), and the screen returns to idle.

     The numbers are the exhibition's own figures, fictional by construction
     (3310 the Nokia, 250 the Samsung E250, 8448 the panel's 84 x 48), so
     none can resolve to a real line. The keypress timing is a thumb, not a
     metronome: 115 to 260ms per digit, a longer pause between groups.

     Mounted into any element carrying [data-lcd]; the element supplies the
     size (the measured aperture). Runs only while on screen. */

  const COLS = 84;
  const INK = [11, 43, 16];                 /* the panel's near-black green */
  const LIT = .88, GHOST = .05, GAP = .09;  /* alpha lit / unlit; gap share of a cell */

  /* bold dialling digits, 6 x 9, two-pixel strokes like the handsets' own */
  const BIG = {
    '0': ['.####.','##..##','##..##','##..##','##..##','##..##','##..##','##..##','.####.'],
    '1': ['..##..','.###..','####..','..##..','..##..','..##..','..##..','..##..','######'],
    '2': ['.####.','##..##','....##','....##','...##.','..##..','.##...','##....','######'],
    '3': ['.####.','##..##','....##','..###.','....##','....##','....##','##..##','.####.'],
    '4': ['...##.','..###.','.####.','##.##.','##.##.','######','...##.','...##.','...##.'],
    '5': ['######','##....','##....','#####.','....##','....##','....##','##..##','.####.'],
    '6': ['.####.','##..##','##....','#####.','##..##','##..##','##..##','##..##','.####.'],
    '7': ['######','....##','...##.','...##.','..##..','..##..','.##...','.##...','.##...'],
    '8': ['.####.','##..##','##..##','.####.','##..##','##..##','##..##','##..##','.####.'],
    '9': ['.####.','##..##','##..##','##..##','.#####','....##','....##','##..##','.####.'],
  };
  /* the operator line, 5 rows tall */
  const SMALL = {
    'H': ['#..#','#..#','####','#..#','#..#'],
    'O': ['.##.','#..#','#..#','#..#','.##.'],
    'L': ['#...','#...','#...','#...','####'],
    'D': ['###.','#..#','#..#','#..#','###.'],
    'M': ['#...#','##.##','#.#.#','#...#','#...#'],
    'E': ['####','#...','###.','#...','####'],
    ' ': ['..','..','..','..','..'],
  };
  /* four rising bars, and a battery */
  const SIGNAL = ['......#','....#.#','..#.#.#','#.#.#.#','#.#.#.#'];
  const BATTERY = ['.#####.','##...##','##.#.##','##.#.##','#######'];

  const NUMBERS = ['3310 250', '84 48', '0250 3310', '1952', '8448 250'];
  const OPERATOR = 'HOLD ME';

  const mount = host => {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated';
    host.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let ROWS = 30, cell = 1, ox = 0, oy = 0;
    let state = { mode: 'idle', digits: '' };

    const size = () => {
      const r = host.getBoundingClientRect(), dpr = devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      ROWS = Math.max(20, Math.round(COLS * r.height / r.width));
      cell = Math.min(canvas.width / COLS, canvas.height / ROWS);
      ox = (canvas.width - cell * COLS) / 2;
      oy = (canvas.height - cell * ROWS) / 2;
      draw();
    };

    /* a frame is a set of lit cells, built from the current state */
    const frame = () => {
      const lit = new Set();
      const put = (rows, x0, y0) => rows.forEach((row, y) => [...row].forEach((c, x) => { if (c === '#') lit.add((x0 + x) + ',' + (y0 + y)); }));
      put(SIGNAL, 2, 1);
      put(BATTERY, COLS - 9, 1);
      if (state.mode === 'idle') {
        const w = [...OPERATOR].reduce((a, ch) => a + SMALL[ch][0].length + 1, -1);
        let x = Math.round((COLS - w) / 2);
        const y = Math.round(ROWS / 2) - 2;
        for (const ch of OPERATOR) { put(SMALL[ch], x, y); x += SMALL[ch][0].length + 1; }
      } else {
        /* right-aligned on the lower half: digits arrive from the right */
        const y = ROWS - 9 - Math.max(2, Math.round(ROWS * .12));
        let x = COLS - 3;
        for (const ch of [...state.digits].reverse()) {
          if (ch === ' ') { x -= 4; continue; }
          x -= 6; put(BIG[ch], x, y); x -= 1;
        }
      }
      return lit;
    };

    const draw = () => {
      const lit = frame();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const s = cell * (1 - GAP), inset = (cell - s) / 2;
      for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
        ctx.fillStyle = `rgba(${INK},${lit.has(x + ',' + y) ? LIT : GHOST})`;
        ctx.fillRect(Math.round(ox + x * cell + inset), Math.round(oy + y * cell + inset), Math.max(1, Math.round(s)), Math.max(1, Math.round(s)));
      }
    };

    const wait = ms => new Promise(r => setTimeout(r, ms));
    const press = () => 115 + Math.random() * 145;
    let running = false, token = 0;
    const loop = async (my) => {
      let i = 0;
      while (running && my === token) {
        state = { mode: 'idle', digits: '' }; draw();
        await wait(2200); if (my !== token) return;
        const n = NUMBERS[i++ % NUMBERS.length];
        state = { mode: 'dial', digits: '' };
        for (const ch of n) {
          state.digits += ch; draw();
          await wait(ch === ' ' ? press() + 190 : press()); if (my !== token) return;
        }
        await wait(2600); if (my !== token) return;
        while (state.digits.length) {                 /* C held: back to front, fast */
          state.digits = state.digits.slice(0, -1).replace(/ $/, ''); draw();
          await wait(46); if (my !== token) return;
        }
        await wait(500);
      }
    };

    size();
    addEventListener('resize', size);
    /* the aperture can still be 0 tall when this runs (Safari lays the
       plate out after the script), which left a 1px canvas: a blank green
       screen. Re-measure whenever the aperture itself changes size. */
    if (window.ResizeObserver) new ResizeObserver(size).observe(host);
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) { state = { mode: 'dial', digits: NUMBERS[0] }; draw(); return; }
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) { running = true; loop(++token); }
      else if (!e.isIntersecting && running) { running = false; token++; }
    }, { threshold: .25 }).observe(host);
  };

  document.querySelectorAll('[data-lcd]').forEach(mount);
  window.HandsetLCD = mount;
})();
