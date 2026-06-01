const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/_og-preview/ricky-interview-og.html', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => { const i = document.querySelector('.plate img'); return i && i.complete && i.naturalWidth > 0; }, { timeout: 10000 });
  await page.waitForTimeout(250);
  const out = process.argv[2] || '/Users/ivanzhyzhkevych/Downloads/ricky-interview-og-preview.png';
  const isJpg = /\.jpe?g$/i.test(out);
  await page.screenshot({
    path: out,
    clip: { x: 0, y: 0, width: 1200, height: 630 },
    ...(isJpg ? { type: 'jpeg', quality: 92 } : {}),
  });
  console.log('saved', out);
  await browser.close();
})();
