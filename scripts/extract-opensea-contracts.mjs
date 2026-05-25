// Click the first asset card on each OpenSea collection page; the
// asset detail URL is `opensea.io/item/{chain}/{contract}/{tokenId}`,
// which gives us the chain + contract in one shot.

import { chromium } from "playwright";

const SLUGS = ["low-language", "new-north"];
const browser = await chromium.launch({ channel: "chrome" });

for (const slug of SLUGS) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`https://opensea.io/collection/${slug}`, {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.waitForTimeout(3000);

  const data = await page.evaluate(() => {
    const itemLinks = Array.from(document.querySelectorAll('a[href*="/item/"]'))
      .map((a) => a.getAttribute("href"))
      .filter(Boolean);
    const assetLinks = Array.from(document.querySelectorAll('a[href*="/assets/"]'))
      .map((a) => a.getAttribute("href"))
      .filter(Boolean);
    const text = document.body.innerText;
    const contractMatch = text.match(/(0x[a-fA-F0-9]{40})/);
    return {
      itemSample: itemLinks.slice(0, 3),
      assetSample: assetLinks.slice(0, 3),
      firstAddressInText: contractMatch ? contractMatch[1] : null,
    };
  });

  console.log(`=== ${slug} ===`);
  console.log(JSON.stringify(data, null, 2));
  await ctx.close();
}

await browser.close();
