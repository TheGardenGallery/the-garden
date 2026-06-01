const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const src = process.argv[2];
  const outDir = process.argv[3] || '/Users/ivanzhyzhkevych/Downloads/sl-frames';
  const fs = require('fs');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Load the local file via a file:// data approach: serve bytes as a blob.
  const buf = fs.readFileSync(src);
  const b64 = buf.toString('base64');

  await page.setContent(`<!doctype html><html><body style="margin:0">
    <video id="v" muted playsinline></video>
    <canvas id="c"></canvas>
  </body></html>`);

  const meta = await page.evaluate(async (b64) => {
    const v = document.getElementById('v');
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const blob = new Blob([bytes], { type: 'video/mp4' });
    v.src = URL.createObjectURL(blob);
    await new Promise((res, rej) => {
      v.onloadedmetadata = res;
      v.onerror = () => rej(new Error('video load error'));
    });
    return { duration: v.duration, w: v.videoWidth, h: v.videoHeight };
  }, b64);

  console.log('META', JSON.stringify(meta));

  // Sample 6 frames across the timeline (avoid the very first/last).
  const n = 6;
  const stamps = [];
  for (let i = 0; i < n; i++) {
    stamps.push(+(meta.duration * (0.08 + 0.84 * (i / (n - 1)))).toFixed(2));
  }

  for (let i = 0; i < stamps.length; i++) {
    const t = stamps[i];
    const dataUrl = await page.evaluate(async (t) => {
      const v = document.getElementById('v');
      const c = document.getElementById('c');
      await new Promise((res) => { v.onseeked = res; v.currentTime = t; });
      await new Promise(r => setTimeout(r, 80));
      c.width = v.videoWidth; c.height = v.videoHeight;
      c.getContext('2d').drawImage(v, 0, 0);
      return c.toDataURL('image/png');
    }, t);
    const out = path.join(outDir, `frame-${String(i + 1).padStart(2, '0')}_t${t}.png`);
    fs.writeFileSync(out, Buffer.from(dataUrl.split(',')[1], 'base64'));
    console.log('saved', out);
  }

  await browser.close();
})();
