// One-off — detect "+" plus signs and domino/bar-matrix blocks in sl-099.jpg
// Plus signs: small bright cross shapes, detected as connected components
// that are roughly square and small.
// Bar blocks: wider rectangular bright blobs with high aspect ratio.

import sharp from "sharp";

const SRC = "public/images/ricky-retouch/works/sl-099.jpg";
const THRESHOLD = 80;
const FRAME = 1456;
const CROP = 22;

const img = sharp(SRC).greyscale();
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
console.log(`source: ${W}×${H}\n`);

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
  const aspect = w / h;
  components.push({ minX, minY, maxX, maxY, w, h, area, aspect });
}

// Plus signs: roughly square (aspect 0.5–2.0), small (area 15–200, w 5–25, h 5–25)
const plusSigns = components.filter(c =>
  c.area >= 15 && c.area <= 200 &&
  c.w >= 5 && c.w <= 25 &&
  c.h >= 5 && c.h <= 25 &&
  c.aspect >= 0.5 && c.aspect <= 2.0 &&
  // Plus signs have low fill ratio (area / bbox) — cross shape doesn't fill its box
  (c.area / (c.w * c.h)) < 0.65 && (c.area / (c.w * c.h)) > 0.2
);

console.log(`=== PLUS SIGNS (${plusSigns.length} candidates) ===\n`);
plusSigns.sort((a, b) => a.minY - b.minY || a.minX - b.minX);
for (const c of plusSigns) {
  const cx = (c.minX + c.maxX) / 2;
  const cy = (c.minY + c.maxY) / 2;
  const fill = (c.area / (c.w * c.h)).toFixed(2);
  // Frame coords
  const pad = 8 / FRAME;
  const side = Math.max(c.w, c.h) / FRAME + pad * 2;
  const fx = cx / FRAME - side / 2;
  const fy = (cy - CROP) / FRAME - side / 2;
  console.log(
    `src center (${cx.toFixed(0)},${cy.toFixed(0)}) ${c.w}×${c.h} area=${c.area} fill=${fill}  ` +
    `→ { x: ${fx.toFixed(3)}, y: ${fy.toFixed(3)}, w: ${side.toFixed(3)}, h: ${side.toFixed(3)} },`
  );
}

// Bar/domino blocks: wide (w 60–200), short-to-medium (h 40–200),
// high fill ratio, in the left half
const barBlocks = components.filter(c =>
  c.w >= 40 && c.w <= 200 &&
  c.h >= 30 && c.h <= 200 &&
  c.area >= 500 &&
  c.minX < 600 &&
  (c.area / (c.w * c.h)) > 0.3
);

console.log(`\n=== BAR/DOMINO BLOCKS (${barBlocks.length} candidates) ===\n`);
barBlocks.sort((a, b) => a.minY - b.minY || a.minX - b.minX);
for (const c of barBlocks) {
  const pad = 6 / FRAME;
  const fx = c.minX / FRAME - pad;
  const fy = (c.minY - CROP) / FRAME - pad;
  const fw = c.w / FRAME + pad * 2;
  const fh = c.h / FRAME + pad * 2;
  const fill = (c.area / (c.w * c.h)).toFixed(2);
  console.log(
    `src (${c.minX},${c.minY})—(${c.maxX},${c.maxY}) ${c.w}×${c.h} area=${c.area} fill=${fill}  ` +
    `→ { x: ${fx.toFixed(3)}, y: ${fy.toFixed(3)}, w: ${fw.toFixed(3)}, h: ${fh.toFixed(3)} },`
  );
}
