// Inspect a Verse series page to discover the on-chain plumbing:
//   • contract address + chain
//   • token standard (721 vs 1155) — affects scan logic
//   • whether the series shares a contract with others (tokenId range)
//   • edition size if shown on the page

import { chromium } from "playwright";

const URL = "https://verse.works/series/iso-iec-10646-by-paul-prudence";
const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(3500);

const data = await page.evaluate(() => {
  const text = document.body.innerText;
  const html = document.documentElement.outerHTML;

  const itemLinks = Array.from(document.querySelectorAll('a[href*="/item/"], a[href*="/token/"], a[href*="/release/"]'))
    .map((a) => a.getAttribute("href"))
    .filter(Boolean);

  const explorerLinks = Array.from(document.querySelectorAll("a[href]"))
    .map((a) => a.href)
    .filter((h) =>
      /etherscan\.io\/(address|token)\/0x|basescan\.org\/(address|token)\/0x|optimistic\.etherscan\.io\/(address|token)\/0x/.test(
        h,
      ),
    );

  // Pull all 0x addresses out of the HTML and dedupe
  const addrs = [...new Set([...html.matchAll(/0x[a-fA-F0-9]{40}/g)].map((m) => m[0]))];

  // Snippets that might tell us standard/edition/chain
  const snippets = {};
  for (const kw of ["Edition", "Editions", "Token", "Standard", "Contract", "Chain", "ERC-721", "ERC-1155", "Ethereum", "Base"]) {
    const re = new RegExp(`[^\\n]{0,30}${kw}[^\\n]{0,80}`, "i");
    const m = text.match(re);
    if (m) snippets[kw] = m[0].trim();
  }

  return {
    title: document.title,
    itemLinks: itemLinks.slice(0, 10),
    explorerLinks: explorerLinks.slice(0, 10),
    addressSample: addrs.slice(0, 20),
    snippets,
  };
});

console.log(JSON.stringify(data, null, 2));

// Also try clicking an item to land on its detail page (URL usually
// has the contract + tokenId in it).
const firstItem = data.itemLinks[0];
if (firstItem) {
  await page.goto(new URL(firstItem, URL).href, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(2500);
  const itemData = await page.evaluate(() => ({
    url: location.href,
    pageText: document.body.innerText.slice(0, 2500),
    explorer: Array.from(document.querySelectorAll("a[href]"))
      .map((a) => a.href)
      .filter((h) => /scan\.io\/(address|token|tx)/.test(h))
      .slice(0, 10),
    addrs: [...new Set([...document.documentElement.outerHTML.matchAll(/0x[a-fA-F0-9]{40}/g)].map((m) => m[0]))].slice(0, 20),
  }));
  console.log("\n=== first-item detail ===");
  console.log(JSON.stringify(itemData, null, 2));
}

await browser.close();
