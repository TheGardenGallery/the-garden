// One-off — re-encode the Split Logic poster JPEGs with mozjpeg at high
// quality. The originals come from ffmpeg's mjpeg encoder which uses
// generic quantization tables; in dark gradient regions of Ricky's
// pieces this produces visible banding when the cell is downsampled to
// grid size. Mozjpeg's optimized quant tables + trellis quantization
// preserve smooth dark gradients far better at similar file sizes.
//
// Run from the project root: node scripts/reencode-sl-posters.mjs
//
// Writes each output to a .tmp file first, then atomically renames so
// a crash mid-script can't leave a partial file in place.

import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";

const DIR = path.resolve("public/images/ricky-retouch/works");

const entries = await fs.readdir(DIR);
const targets = entries.filter((f) => /^sl-\d+\.jpg$/.test(f)).sort();

console.log(`Re-encoding ${targets.length} posters with mozjpeg q=92…`);

let beforeBytes = 0;
let afterBytes = 0;

for (const name of targets) {
  const src = path.join(DIR, name);
  const tmp = src + ".tmp";
  const before = (await fs.stat(src)).size;
  beforeBytes += before;

  await sharp(src)
    .jpeg({
      quality: 92,
      mozjpeg: true,
      // chromaSubsampling 4:4:4 keeps colour edges crisp on the
      // dense text/wireframe content; mozjpeg's default 4:2:0 can
      // soften thin coloured text glyphs.
      chromaSubsampling: "4:4:4",
    })
    .toFile(tmp);

  const after = (await fs.stat(tmp)).size;
  afterBytes += after;
  await fs.rename(tmp, src);

  process.stdout.write(
    `  ${name}: ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB\n`
  );
}

console.log(
  `\nDone. Total: ${(beforeBytes / 1024 / 1024).toFixed(2)} MB → ${(afterBytes / 1024 / 1024).toFixed(2)} MB`
);
