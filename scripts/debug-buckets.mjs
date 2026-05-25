// Simulate computeSplitLogicBuckets with the actual sl-palette.json
// data to confirm the BUCKET_OVERRIDE map lands each new piece in
// the right anchor's bucket on the live deploy. Mirrors the logic
// in lib/split-logic-buckets.ts.

import fs from "fs";
import {
  colorDistance,
  kmeansWeighted,
} from "../lib/split-logic-color.ts";

const cells = JSON.parse(
  fs.readFileSync("/Users/lonli/Documents/the-garden/data/sl-palette.json", "utf8"),
);

const CHROMATIC_BUTTON_COUNT = 4;
const MONO_BRIGHT_L_MIN = 0.65;
const MONO_C_MAX = 0.10;

const RAINBOW_IDS = new Set(["sl-094", "sl-001", "sl-002", "sl-003", "sl-004"]); // approximate

const BUCKET_OVERRIDE = {
  "sl-011": "sl-077",
  "sl-019": "sl-097",
  "sl-075": "sl-015",
};

function findTopCluster(clusters) {
  if (!clusters?.length) return null;
  return [...clusters].sort((a, b) => b.weight - a.weight)[0].lch;
}
function isWhitePiece(clusters) {
  const top = findTopCluster(clusters);
  return !!top && top.L >= MONO_BRIGHT_L_MIN && top.C < MONO_C_MAX;
}
function findDominantChromatic(clusters) {
  // Simplified - take the cluster with highest weight*C product
  let best = null;
  let bestScore = -Infinity;
  for (const c of clusters || []) {
    const score = c.weight * c.lch.C;
    if (score > bestScore) { bestScore = score; best = c.lch; }
  }
  return best;
}

function normHue(h) {
  return ((h % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
}

const assignment = new Array(cells.length);
const chromaticIdx = [];
const chromaticDom = [];
const overrideTargets = new Set(Object.keys(BUCKET_OVERRIDE));

for (let i = 0; i < cells.length; i++) {
  const cell = cells[i];
  if (overrideTargets.has(cell.wedgeId)) continue;
  if (RAINBOW_IDS.has(cell.wedgeId)) { assignment[i] = "rainbow"; continue; }
  if (isWhitePiece(cell.clusters)) { assignment[i] = "white"; continue; }
  const dom = cell.dominant ?? findDominantChromatic(cell.clusters);
  if (dom) { chromaticIdx.push(i); chromaticDom.push(dom); }
  else { assignment[i] = "white"; }
}

const samples = chromaticDom.map((lch) => ({ lch, weight: lch.C }));
const k = Math.min(CHROMATIC_BUTTON_COUNT, samples.length);
const raw = k > 0 ? kmeansWeighted(samples, k) : [];
const order = Array.from({ length: raw.length }, (_, i) => i).sort(
  (a, b) => normHue(raw[a].h) - normHue(raw[b].h),
);
const sortedCentroids = order.map((i) => raw[i]);

console.log("\n=== centroids (hue-sorted) ===");
sortedCentroids.forEach((c, i) => {
  const deg = ((c.h * 180 / Math.PI) + 360) % 360;
  console.log(`  chrom-${i}: hue=${deg.toFixed(0)}° L=${c.L.toFixed(2)} C=${c.C.toFixed(2)}`);
});

for (let j = 0; j < chromaticIdx.length; j++) {
  const dom = chromaticDom[j];
  let bestIdx = 0, bestDist = Infinity;
  for (let c = 0; c < sortedCentroids.length; c++) {
    const d = colorDistance(dom, sortedCentroids[c]);
    if (d < bestDist) { bestDist = d; bestIdx = c; }
  }
  assignment[chromaticIdx[j]] = bestIdx;
}

// Apply BUCKET_OVERRIDE
for (let i = 0; i < cells.length; i++) {
  const sourceId = BUCKET_OVERRIDE[cells[i].wedgeId];
  if (!sourceId) continue;
  const srcIdx = cells.findIndex((c) => c.wedgeId === sourceId);
  if (srcIdx >= 0 && assignment[srcIdx] !== undefined) {
    assignment[i] = assignment[srcIdx];
  } else {
    assignment[i] = "white";
    console.log(`!! override fallback for ${cells[i].wedgeId}: srcIdx=${srcIdx} srcAssignment=${assignment[srcIdx]}`);
  }
}

console.log("\n=== key piece assignments ===");
for (const id of ["sl-011", "sl-077", "sl-019", "sl-097", "sl-075", "sl-015"]) {
  const idx = cells.findIndex((c) => c.wedgeId === id);
  console.log(`  ${id}: ${assignment[idx]}`);
}

// Count chromatic buckets
const chromCounts = new Array(sortedCentroids.length).fill(0);
let whiteCount = 0, rainbowCount = 0;
for (const a of assignment) {
  if (a === "white") whiteCount++;
  else if (a === "rainbow") rainbowCount++;
  else chromCounts[a]++;
}
console.log("\n=== bucket counts ===");
console.log(`  white: ${whiteCount}`);
sortedCentroids.forEach((c, i) => {
  const deg = ((c.h * 180 / Math.PI) + 360) % 360;
  console.log(`  chrom-${i} (hue ${deg.toFixed(0)}°): ${chromCounts[i]}`);
});
console.log(`  rainbow: ${rainbowCount}`);
