// One-off — detect the bounding boxes of numerical measurement readings
// in sl-099.jpg (e.g. 4.499, 8.693, 5.683) by thresholding for bright
// pixels and running connected-components, then filtering for
// "number-shaped" blobs — wider than tall, small area, clustered in
// the left column where the decimal readings live.
//
// Same approach as detect-sl099-letters.mjs but tuned for the smaller,
// wider number strings. Outputs frame-normalised coordinates for the
// RICKY_PINS msr cycle array. Frame is 1:1 with object-fit:cover on
// a 1456×1500 source (22-px top/bottom crop):
//   frame_x = source_x / 1456
//   frame_y = (source_y − 22) / 1456

import sharp from "sharp";

const SRC = "public/images/ricky-retouch/works/sl-099.jpg";
const THRESHOLD = 70;          // numbers are dimmer than letters
const MIN_AREA = 20;           // small digit clusters
const MAX_AREA = 3000;         // not wireframe segments
const MIN_W = 25, MAX_W = 120; // number strings are wider
const MIN_H = 8, MAX_H = 30;  // but short

const img = sharp(SRC).greyscale();
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
console.log(`source: ${W}×${H}`);

// Connected components via iterative flood-fill (BFS).
const visited = new Uint8Array(W * H);
const components = [];
const neighbors = [-1, 1, -W, W, -W - 1, -W + 1, W - 1, W + 1];

const stack = new Int32Array(W * H);
let stackLen = 0;

for (let i = 0; i < W * H; i++) {
  if (visited[i] || data[i] < THRESHOLD) continue;

  stack[0] = i;
  stackLen = 1;
  visited[i] = 1;
  let minX = i % W, maxX = minX;
  let minY = (i / W) | 0, maxY = minY;
  let area = 0;

  while (stackLen > 0) {
    const idx = stack[--stackLen];
    area++;
    const x = idx % W;
    const y = (idx / W) | 0;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;

    for (const dn of neighbors) {
      const ni = idx + dn;
      if (ni < 0 || ni >= W * H) continue;
      const nx = ni % W;
      if (Math.abs(nx - x) > 1) continue;
      if (visited[ni] || data[ni] < THRESHOLD) continue;
      visited[ni] = 1;
      stack[stackLen++] = ni;
    }
  }

  const w = maxX - minX + 1;
  const h = maxY - minY + 1;
  if (area >= MIN_AREA && area <= MAX_AREA && w >= MIN_W && w <= MAX_W && h >= MIN_H && h <= MAX_H) {
    // Filter: numbers live in the left ~40% of the image (x < 600)
    // and have aspect ratio > 1.5 (wider than tall)
    const aspect = w / h;
    if (minX < 600 && aspect > 1.2) {
      components.push({ minX, minY, maxX, maxY, w, h, area, aspect });
    }
  }
}

console.log(`\n${components.length} candidate measurement components:\n`);

// Sort by Y, then X
components.sort((a, b) => a.minY - b.minY || a.minX - b.minX);

for (const c of components) {
  const fx = c.minX / 1456;
  const fy = (c.minY - 22) / 1456;
  const fw = c.w / 1456;
  const fh = c.h / 1456;
  // Padded box
  const pad = 6 / 1456;
  const px = fx - pad;
  const py = fy - pad;
  const pw = fw + pad * 2;
  const ph = fh + pad * 2;
  console.log(
    `src px (${c.minX},${c.minY})—(${c.maxX},${c.maxY})  ${c.w}×${c.h} area=${c.area} asp=${c.aspect.toFixed(1)}  ` +
      `→ { x: ${px.toFixed(3)}, y: ${py.toFixed(3)}, w: ${pw.toFixed(3)}, h: ${ph.toFixed(3)} },`
  );
}
