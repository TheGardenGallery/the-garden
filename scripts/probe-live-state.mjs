import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
const page = await ctx.newPage();

// Capture each network-fetched .js chunk so we can dump computeSplitLogicBuckets
await page.goto("https://thegarden.art/exhibitions/split-logic", { waitUntil: "domcontentloaded", timeout: 90000 });
await page.waitForSelector(".piece-grid", { timeout: 30000 });
await page.evaluate(() => document.querySelector(".piece-grid")?.scrollIntoView({ block: "center" }));
await page.waitForTimeout(3000);

// Inject probe — find the React fiber for the .piece-grid section and walk
// up to extract pieceAssignment + zoneKeys + sortedIndices/state.
const state = await page.evaluate(() => {
  const gridEl = document.querySelector(".sl-pager-region");
  if (!gridEl) return { error: "no .sl-pager-region" };
  // React 19 attaches fiber via __reactFiber prop. Walk up to find SplitLogicSystem state.
  const fiberKey = Object.keys(gridEl).find((k) => k.startsWith("__reactFiber"));
  if (!fiberKey) return { error: "no fiber key", keys: Object.keys(gridEl) };
  let fiber = gridEl[fiberKey];
  const path = [];
  while (fiber && path.length < 80) {
    const name = fiber.type?.displayName || fiber.type?.name || (typeof fiber.type === "string" ? fiber.type : null);
    if (name) path.push(name);
    if (name === "SplitLogicSystem") break;
    fiber = fiber.return;
  }
  if (!fiber) return { error: "SplitLogicSystem fiber not found", path };
  // Find memoizedState chain — useMemo for sortedIndices, useMemo for buckets, etc.
  const hooks = [];
  let h = fiber.memoizedState;
  while (h && hooks.length < 30) {
    hooks.push({
      hasMemo: !!h.memoizedState,
      value: h.memoizedState !== undefined && h.memoizedState !== null && typeof h.memoizedState === "object" && Array.isArray(h.memoizedState)
        ? `Array(${h.memoizedState.length}) [first: ${JSON.stringify(h.memoizedState[0])?.slice(0, 80)}]`
        : (typeof h.memoizedState === "object" && h.memoizedState !== null)
        ? Object.keys(h.memoizedState).join(",")
        : String(h.memoizedState).slice(0, 100),
    });
    h = h.next;
  }
  return { found: true, path, hooksCount: hooks.length, hooks };
});

console.log(JSON.stringify(state, null, 2).slice(0, 3000));

await browser.close();
