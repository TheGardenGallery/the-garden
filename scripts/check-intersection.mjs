import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const url = "https://verse.works/series/Intersection";
const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(3500);
const data = await page.evaluate(() => ({
  url: location.href,
  title: document.title,
  h1: document.querySelector("h1")?.innerText,
  bodyTop: document.body.innerText.slice(0, 1500),
  curatorMention: [...document.body.innerText.matchAll(/(curat|present|by)[^\n]{0,80}/gi)].map((m) => m[0]).slice(0, 6),
}));
console.log("HTTP status:", resp?.status());
console.log(JSON.stringify(data, null, 2));
await browser.close();
