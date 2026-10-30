/* ===== THE AURA, Gabor FM, on the GPU, behind the page ==============
     After pixlpa's "Gabor FM Gradient Study 1" (hicetnunc 32293). A Gabor
     wavelet is one sine wave under a Gaussian envelope; the piece sums a few
     and runs a MODULATOR pass that varies each wavelet's frequency by spatial
     lookup, so the bands wander instead of marching.

     ── WHY THIS IS A SHADER AND NOT A CANVAS ───────────────────────────
     The first build computed the field on a grid a tenth of the viewport and
     let the browser stretch it. That is literally low-resolution grading:
     every soft edge is a bilinear ramp between two cells, and on a wide
     gradient the cell structure reads as blocks. Worse, an 8-bit grey ramp
     spread over hundreds of pixels quantises into visible contour bands,
     which is the artifact banding this layer must never show.

     On the GPU the field is evaluated PER PIXEL at device resolution, so
     there is nothing to interpolate and no cell structure to see, and it
     costs less than the small canvas did. Banding is then killed properly,
     by dithering BELOW the quantiser: a per-pixel hash of about one 255th is
     added before the value is written, so a slow ramp crosses each 8-bit step
     as grain rather than as a contour line. Same trick film grading uses on
     dark skies.

     ── IT IS BEHIND EVERYTHING ─────────────────────────────────────────
     The layer sits UNDER the page's content and over the bands' grounds, so
     it lights the rooms and never touches a work or a line of type. That is
     a deliberate reversal of the first build, which floated it over the whole
     page: light laid on an artwork is a filter on the artwork.

     The trade it accepts, stated plainly: a band's ground now breathes while
     the flat ground baked into each artwork file does not, so a plate edge
     can show at the amplitude of the modulation. AMP below is held low for
     exactly that reason, and is the one number to turn down if an edge ever
     shows. ===== */

  /* EXPORTED AS A FACTORY, because two surfaces need this field: the page
     itself and the artwork viewer. One implementation, two instances, rather
     than a shader and a copy of a shader that drift apart. */
window.GaborField = (host, opts) => {
  opts = opts || {};
  if (!host) return null;

  const canvas = document.createElement('canvas');
  host.appendChild(canvas);
  /* premultiplied, the browser's own format: every pixel is written at
     alpha 1, where premultiplied and straight colour are the same numbers,
     and an unpremultiplied canvas costs the compositor a conversion pass on
     every frame it presents */
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true });
  if (!gl) { host.remove(); return; }       /* no WebGL: the page is fine without it */

  const N = 6;

  const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.0,1.0); }`;

  const FRAG = `
  precision highp float;
  uniform vec2  uRes;
  uniform float uTime;
  uniform vec2  uPtr;
  uniform float uPull;
  uniform float uAmp;
  uniform vec4  uA[${N}];   /* cx, cy, sigma, baseFreq          */
  uniform vec4  uB[${N}];   /* dirX, dirY, phase, phaseSpeed    */
  uniform vec4  uC[${N}];   /* modFx, modFy, modSpeed, modDepth */
  uniform float uW[${N}];   /* amplitude                        */
  uniform float uGrain;     /* grain strength, as a fraction of full scale */
  uniform float uSmooth;    /* how much of the smooth field survives      */
  uniform float uDpr;

  /* sin-free hash (Hoskins): the sin() hash shows lattice artifacts at large
     coordinates on some GPUs, which is exactly where a fine grain lives */
  float hash(vec2 p){
    vec3 p3 = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  void main(){
    vec2 uv = gl_FragCoord.xy / uRes;
    uv.y = 1.0 - uv.y;

    /* the pointer is the MODULATOR, not a spotlight: it changes frequency,
       it never adds brightness. */
    vec2 d = uv - uPtr;
    float near = exp(-dot(d,d) / (2.0 * 0.30 * 0.30)) * uPull;

    float acc = 0.0;
    for(int i = 0; i < ${N}; i++){
      vec4 a = uA[i], b = uB[i], c = uC[i];
      vec2 e = uv - a.xy;
      float env = exp(-dot(e,e) / (2.0 * a.z * a.z));

      /* MODULATOR PASS: frequency varied by spatial lookup, then lifted
         locally by the pointer. This is the whole gesture. */
      float m = sin(uv.x * c.x * 6.2831853 + uv.y * c.y * 6.2831853 + uTime * c.z);
      float f = a.w * (1.0 + c.w * m) * (1.0 + 0.79 * near);

      acc += env * uW[i] * cos(dot(uv, b.xy) * f * 6.2831853 + b.z + uTime * b.w);
    }

    /* grey around mid: 0.5 leaves the ground alone under soft-light, above
       lifts it, below deepens it. Hue is never touched, so what moves is the
       room's own colour. */
    float tone = acc * uAmp;

    /* ── GRAIN, NOT PLASTIC ──────────────────────────────────────────────
       A smooth field alone reads as a glossy moulded surface: every value
       is a perfect ramp, which is what plastic looks like. Film and print
       never show a pure ramp, they show the ramp THROUGH grain.

       So the smooth field is held back to uSmooth of itself and the rest of
       the form is carried by grain: one CSS pixel per grain (not one device
       pixel, which on a retina screen is too fine to read as grain at all),
       triangular rather than flat noise (two hashes summed, so most grains
       are near the mean and a few are strong, the way silver grain is), and
       a little stronger in the field's dark passages, the way grain shows
       most in a print's shadows. The grain refreshes at 24 per second, film
       rate, rather than every frame: per-frame noise fizzes like video. */
    vec2 cell = floor(gl_FragCoord.xy / uDpr);
    float seed = floor(uTime * 24.0);
    float n = hash(cell + seed * vec2(17.13, 9.71))
            + hash(cell * 1.37 + seed * vec2(3.17, 11.73)) - 1.0;
    float shade = clamp(0.5 - tone * 6.0, 0.0, 1.0);
    float v = 0.5 + tone * uSmooth + n * uGrain * (0.7 + 0.6 * shade);

    gl_FragColor = vec4(vec3(v), 1.0);
  }`;

  const sh = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('aura shader:', gl.getShaderInfoLog(s)); return null;
    }
    return s;
  };
  const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) { host.remove(); return; }
  const prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const U = n => gl.getUniformLocation(prog, n);
  const uRes = U('uRes'), uTime = U('uTime'), uPtr = U('uPtr'),
        uPull = U('uPull'), uAmp = U('uAmp'),
        uGrain = U('uGrain'), uSmooth = U('uSmooth'), uDpr = U('uDpr'),
        uA = U('uA'), uB = U('uB'), uC = U('uC'), uW = U('uW');

  const rnd = (a, b) => a + Math.random() * (b - a);
  const A = new Float32Array(N * 4), B = new Float32Array(N * 4),
        C = new Float32Array(N * 4), W = new Float32Array(N);
  const home = [];
  for (let i = 0; i < N; i++) {
    const th = rnd(0, Math.PI * 2);
    const cx = rnd(.1, .9), cy = rnd(.1, .9);
    home.push([cx, cy]);
    A.set([cx, cy, rnd(.34, .72), rnd(2.2, 5.4)], i * 4);
    B.set([Math.cos(th), Math.sin(th), rnd(0, Math.PI * 2),
           rnd(.08, .26) * (Math.random() < .5 ? -1 : 1)], i * 4);
    C.set([rnd(.5, 1.6), rnd(.5, 1.6), rnd(.05, .14), rnd(.35, .62)], i * 4);
    W[i] = rnd(.5, 1);
  }

  let px = .5, py = .5, tx = .5, ty = .5, pull = 0, pullT = 0;
  /* ── STILL WHILE SOMEONE IS LOOKING CLOSELY ──────────────────────────
     Holding the loupe on a work is close looking; the room answering the
     same hand at the same time pulls attention back out to the ground. So
     while the loupe is open (html.loupe-on) the field ignores the pointer
     and eases back to its own slow drift, and picks the pointer up again
     on release. The drift itself never stops, so the page does not freeze. */
  const looking = () => document.documentElement.classList.contains('loupe-on');
  addEventListener('pointermove', e => {
    if (looking()) return;
    tx = e.clientX / innerWidth; ty = e.clientY / innerHeight; pullT = 1;
  }, { passive: true });
  addEventListener('pointerleave', () => { pullT = 0; }, { passive: true });

  let dpr = 1;
  const size = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    const r = host.getBoundingClientRect();
    canvas.width  = Math.max(1, Math.round((r.width  || innerWidth)  * dpr));
    canvas.height = Math.max(1, Math.round((r.height || innerHeight) * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
    fresh = true;                    /* a resized canvas is blank: draw on the next frame */
  };
  let fresh = true;
  size();
  addEventListener('resize', size, { passive: true });

  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const AMP = opts.amp != null ? opts.amp : 0.085;
  const RATE = opts.rate != null ? opts.rate : 1;   /* the viewer runs slower */
  const GRAIN = opts.grain != null ? opts.grain : 0.055;
  const SMOOTH = opts.smooth != null ? opts.smooth : 0.6;

  /* the eased state moves once per frame, exactly as it always has; the
     picture is drawn from it separately (see THE FIELD IS DRAWN WHEN IT
     CHANGES, below) */
  const ease = () => {
    px += (tx - px) * .045;          /* the lag that makes it read as light */
    py += (ty - py) * .045;
    pull += ((looking() ? 0 : pullT) - pull) * .02;

    for (let i = 0; i < N; i++) {
      const h = home[i];
      A[i * 4]     += ((h[0] + (px - h[0]) * .165 * pull) - A[i * 4])     * .012;
      A[i * 4 + 1] += ((h[1] + (py - h[1]) * .165 * pull) - A[i * 4 + 1]) * .012;
    }
  };

  const render = (t) => {
    fresh = false;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, t);
    gl.uniform2f(uPtr, px, py);
    gl.uniform1f(uPull, pull);
    gl.uniform1f(uAmp, AMP);
    gl.uniform1f(uGrain, GRAIN);
    gl.uniform1f(uSmooth, SMOOTH);
    gl.uniform1f(uDpr, dpr);
    gl.uniform4fv(uA, A); gl.uniform4fv(uB, B);
    gl.uniform4fv(uC, C); gl.uniform1fv(uW, W);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  if (reduce) { ease(); render(0); host.classList.add('live'); return { stop(){}, resize: size }; }   /* the lightbox resizes its field on open */

  /* ── THE FIELD IS DRAWN WHEN IT CHANGES (2026-10-27) ─────────────────
     It was drawn on every frame: a full-window shader at device resolution
     60 or 120 times a second, behind a page that is mostly holding still.
     What the eye actually sees change is the grain, which turns over 24
     times a second of field time (floor(uTime * 24) in the shader); the
     smooth field under it drifts by well under one 8-bit level between two
     grain frames. So at rest the field is drawn once per grain frame, and
     while the pointer is steering it (the light still easing toward the
     cursor, or the pull fading in or out) it is drawn on every frame as
     before, so the response to the hand is exactly as fluid as it was. */
  const steering = () => Math.abs(tx - px) + Math.abs(ty - py) > .002 ||
    Math.abs((looking() ? 0 : pullT) - pull) > .01;
  let raf = 0, running = true, wanted = true, lastSeed = NaN, stoppedAt = 0;
  const loop = ms => {
    if (!running) return;
    ease();
    const t = ms / 1000 * RATE, seed = Math.floor(t * 24);
    if (fresh || seed !== lastSeed || steering()) { lastSeed = seed; render(t); }
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  const pause = () => { running = false; cancelAnimationFrame(raf); stoppedAt = performance.now(); };
  const resume = catchUp => {
    /* the viewer's field is stopped while the viewer is closed (it used to
       run on, unseen); reopened, its eased state catches up on the frames
       it missed, at 60 a second, so the light is where it would have been */
    if (catchUp) {
      const n = Math.min(600, Math.round((performance.now() - stoppedAt) / (1000 / 60)));
      for (let i = 0; i < n; i++) ease();
    }
    fresh = true; running = true; raf = requestAnimationFrame(loop);
  };
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (running) pause(); }
    else if (wanted && !running) resume(false);
  });

  requestAnimationFrame(() => host.classList.add('live'));
  return {
    resize: size,
    stop(){ wanted = false; if (running) pause(); },
    start(){ wanted = true; if (!running && !document.hidden) resume(true); },
  };
};


/* the page's own field */
(() => {
  const h = document.querySelector('.aura');
  if (h) window.GaborField(h, {});
})();
