// One-off — detect the bounding boxes of letter glyphs in sl-099.jpg
// by thresholding for bright pixels and running connected-components,
// then filtering for "letter-shaped" blobs (small, not wireframe-long).
//
// Outputs frame-normalised coordinates so they can be pasted straight
// into the RICKY_PINS cycle array. The frame is 1:1 with object-fit:
// cover applied to a 1456×1500 source, so y is shifted to account
// for the 22-px top/bottom crop:
//   frame_x = source_x / 1456
//   frame_y = (source_y − 22) / 1456

import sharp from "sharp";

const SRC = "public/images/ricky-retouch/works/sl-099.jpg";
const THRESHOLD = 90;         // grey value to count as "bright"
const MIN_AREA = 30;          // ignore single-pixel noise
const MAX_AREA = 4000;        // allow larger groups (multi-letter clusters)
const MIN_W = 10, MAX_W = 160; // glyph cluster width range
const MIN_H = 18, MAX_H = 55;  // glyph height range

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

  // Iterative flood-fill
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
      // Skip neighbors that wrap horizontally
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
    components.push({ minX, minY, maxX, maxY, w, h, area });
  }
}

console.log(`\n${components.length} candidate glyph components:\n`);

// Sort by Y, then X
components.sort((a, b) => a.minY - b.minY || a.minX - b.minX);

for (const c of components) {
  // Frame coords (object-fit: cover trims 22px from top/bottom)
  const fx = c.minX / 1456;
  const fy = (c.minY - 22) / 1456;
  const fw = c.w / 1456;
  const fh = c.h / 1456;
  // Centre + square that wraps the glyph
  const cx = fx + fw / 2;
  const cy = fy + fh / 2;
  const sqSide = Math.max(fw, fh) + 0.012;
  const sqX = cx - sqSide / 2;
  const sqY = cy - sqSide / 2;
  console.log(
    `src px (${c.minX},${c.minY})—(${c.maxX},${c.maxY})  ${c.w}×${c.h} area=${c.area}  ` +
      `→ frame ${fx.toFixed(3)},${fy.toFixed(3)} ${fw.toFixed(3)}×${fh.toFixed(3)}  ` +
      `→ sq ${sqX.toFixed(3)},${sqY.toFixed(3)} side=${sqSide.toFixed(3)}`
  );
}
