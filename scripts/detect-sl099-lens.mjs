// Find the central convergent "lens" in sl-099. The lens is an inner
// rounded rectangle in the wireframe where mesh lines curve to form a
// distinct boundary. Detection approach:
//   1. Box-filter the image — replace each pixel with the bright-pixel
//      density in a small neighbourhood. This produces a heatmap where
//      tight curves (densely packed line bends) score higher than the
//      uniform mesh elsewhere.
//   2. Look at radial profiles outward from the wireframe centre.
//      The lens edge is where density first peaks above a threshold.

import sharp from "sharp";

const SRC = "public/images/ricky-retouch/works/sl-099.jpg";
const THRESHOLD = 90;
const RADIUS = 8; // window size for density count

const { data, info } = await sharp(SRC).greyscale().raw().toBuffer({
  resolveWithObject: true,
});
const W = info.width;
const H = info.height;

// Wireframe centre (approximate)
const CX = 898;
const CY = 512;

// Compute density in a window for each pixel along radial lines.
function density(x, y) {
  let count = 0;
  for (let dy = -RADIUS; dy <= RADIUS; dy++) {
    for (let dx = -RADIUS; dx <= RADIUS; dx++) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
      if (data[ny * W + nx] >= THRESHOLD) count++;
    }
  }
  return count;
}

// Walk OUTWARD from centre along 4 cardinal directions. Record the
// density at each step. The lens edge = where density rises to a peak
// (lines crowding together). Beyond it density drops as we leave the
// inner ring and enter the more uniform outer mesh.

function walkOutward(dx, dy, maxSteps) {
  const profile = [];
  for (let step = 1; step <= maxSteps; step++) {
    const x = CX + dx * step;
    const y = CY + dy * step;
    profile.push({ step, d: density(x, y) });
  }
  return profile;
}

const profUp = walkOutward(0, -1, 300);
const profDown = walkOutward(0, 1, 300);
const profLeft = walkOutward(-1, 0, 500);
const profRight = walkOutward(1, 0, 500);

// Find the FIRST significant density peak along each direction.
// (This is where the radial mesh first crosses a tightly-bent line.)
function findFirstPeak(profile) {
  // smooth
  const smooth = profile.map((p, i) => {
    const w = 3;
    let s = 0, n = 0;
    for (let j = Math.max(0, i - w); j <= Math.min(profile.length - 1, i + w); j++) {
      s += profile[j].d;
      n++;
    }
    return { step: p.step, d: s / n };
  });
  let max = 0, maxStep = 0;
  for (const p of smooth) {
    if (p.d > max) { max = p.d; maxStep = p.step; }
  }
  // Find FIRST step that reaches at least 70% of max — that's the inner edge.
  const threshold = max * 0.85;
  for (const p of smooth) {
    if (p.d >= threshold) return { peakStep: maxStep, edgeStep: p.step, max };
  }
  return { peakStep: maxStep, edgeStep: maxStep, max };
}

const up = findFirstPeak(profUp);
const down = findFirstPeak(profDown);
const left = findFirstPeak(profLeft);
const right = findFirstPeak(profRight);

console.log("Lens extent from centre (CX, CY) =", CX, CY);
console.log(`up:    edge at step ${up.edgeStep}, peak at ${up.peakStep}, max density ${up.max}`);
console.log(`down:  edge at step ${down.edgeStep}, peak at ${down.peakStep}, max density ${down.max}`);
console.log(`left:  edge at step ${left.edgeStep}, peak at ${left.peakStep}, max density ${left.max}`);
console.log(`right: edge at step ${right.edgeStep}, peak at ${right.peakStep}, max density ${right.max}`);

const lensTop = CY - up.peakStep;
const lensBottom = CY + down.peakStep;
const lensLeft = CX - left.peakStep;
const lensRight = CX + right.peakStep;

console.log(`\nLens bbox source px: (${lensLeft}, ${lensTop}) — (${lensRight}, ${lensBottom})`);

// Frame coords (object-fit:cover trims 22 source-px top/bottom)
const fx = lensLeft / 1456;
const fy = (lensTop - 22) / 1456;
const fw = (lensRight - lensLeft) / 1456;
const fh = (lensBottom - lensTop) / 1456;

console.log(`Lens bbox frame: x=${fx.toFixed(3)}, y=${fy.toFixed(3)}, w=${fw.toFixed(3)}, h=${fh.toFixed(3)}`);
