// Build a single deduped allowlist of every current holder across an
// arbitrary list of Verse series URLs, all on Ethereum mainnet.
//
// Three phases:
//   1. DISCOVER  — scrape each Verse page in headless Chrome to find
//                  its contract address (cached to /tmp so re-runs
//                  skip this).
//   2. VERIFY    — for each unique contract, detect ERC-721 / -1155
//                  and read totalSupply() so we can confirm coverage
//                  at the end.
//   3. SCAN      — one multi-address eth_getLogs over block range
//                  [FROM_BLOCK, latest] collects Transfer events for
//                  every 721 in a single sweep. 1155 contracts get a
//                  separate sweep over TransferSingle/TransferBatch.
//                  Per-contract tokenId → latest-recipient maps roll
//                  up into a global owners set, filtered of zero +
//                  marketplace pools, sorted, deduped.
//
// Output: ~/Downloads/ivan-full-curator-allowlist.txt

import fs from "fs";
import os from "os";
import path from "path";
import { chromium } from "playwright";

const OUT_BASENAME = "ivan-full-curator-allowlist";

const URLS = [
  "https://verse.works/series/pictography-by-1mposter",
  "https://verse.works/series/phantasmagoria-by-mazin",
  "https://verse.works/series/distrakted-by-mark-webster",
  "https://verse.works/series/trails-by-perfect-l00p",
  "https://verse.works/series/bully-by-riiiis",
  "https://verse.works/series/Piezo-by-rudxane",
  "https://verse.works/series/imagined-wreckage-by-chuck-anderson",
  "https://verse.works/series/equinox-by-aluan-wang",
  "https://verse.works/series/escapes-tuukz",
  "https://verse.works/series/basalt-rt-itsgalo",
  "https://verse.works/series/deluge-by-chepertom",
  "https://verse.works/series/basalt-by-itsgalo",
  "https://verse.works/series/autoscope-by-erik-swahn",
  "https://verse.works/series/gwanak-gu-by-earthsample",
  "https://verse.works/series/isle-of-alcina-by-tuukz",
  "https://verse.works/series/glitch-garden-by-spogelsesmaskinen",
  "https://verse.works/series/making-an-egg-with-hands-by-nikita-diakur",
  "https://verse.works/series/the-flood-orchestrated-by-yoshi-sodeoka",
  "https://verse.works/series/the-flood-chaos-by-yoshi-sodeoka",
  "https://verse.works/series/simple-thoughts-by-khwampa",
  "https://verse.works/series/ha-ha-by-john-provencher",
  "https://verse.works/series/over-time-by-john-provencher",
  "https://verse.works/series/constraint-by-eric-andwer",
  "https://verse.works/series/drift-by-paolo-ceric-1",
  "https://verse.works/series/space-time-by-loackme",
  "https://verse.works/series/new-life-to-still-life-by-cydr",
  "https://verse.works/series/Intersection",
  "https://verse.works/series/jjjjjars-by-john-karel",
  "https://verse.works/series/ascii-maximalism-by-enigmatriz",
  "https://verse.works/series/base23-by-loackme",
  "https://verse.works/series/among-falling-suns-by-0009",
  "https://verse.works/series/reveries-by-orkhan",
  "https://verse.works/series/this-is-what-it-remembers-by-m0dest",
  "https://verse.works/series/spectramnesia-by-serezha-galkin",
  "https://verse.works/series/in-your-dreams-by-macbeth",
  "https://verse.works/series/apocalyptish-by-peter-the-roman",
  "https://verse.works/series/synthetic-bloom-by-0009",
  "https://verse.works/series/lost-memories-from-latent-space-by-orkhan",
  "https://verse.works/series/a-snap-in-time-by-qubibi",
  "https://verse.works/series/isolux-by-yoshi-sodeoka",
  "https://verse.works/series/polypaths-by-aluan-wang",
  "https://verse.works/series/do-machines-dream-of-human-bodies-by-dalos-dov",
  "https://verse.works/series/panes-by-elna-frederick",
  "https://verse.works/series/geek-gifs-by-benedict",
  "https://verse.works/series/special-by-benedict",
  "https://verse.works/series/we-should-be-promping-a-museum-she-said-by-canek-zapata-rocio-mio",
  "https://verse.works/series/tactile-studies-of-the-synthetic-landscape-by-canek-zapata-rocio-mio",
  "https://verse.works/series/c-be3s-by-paul-prudence",
  "https://verse.works/series/topology-of-a-dream-beyond-drive-c-by-serezha-galkin",
  "https://verse.works/series/su-by-nipetrov",
  "https://verse.works/series/safe-haven-by-kirill-semenovich",
  "https://verse.works/series/worn-currents-by-0009",
  "https://verse.works/series/barbarians-by-jacek-markusiewicz",
  "https://verse.works/series/the-swarm-1618-by-yoshi-sodeoka",
  "https://verse.works/series/the-swarm-r-by-yoshi-sodeoka",
  "https://verse.works/series/bifurcation-by-yoshi-sodeoka",
  "https://verse.works/series/iso-iec-10646-by-paul-prudence",
];

// Verse launched late 2021. Block 13_000_000 is ~Oct 2021 — captures
// every drop with comfortable margin.
const FROM_BLOCK = 13_000_000;
const CHUNK_BLOCKS = 50_000;
const PARALLEL = 4;

const TRANSFER_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
const TRANSFER_SINGLE_TOPIC =
  "0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62";
const TRANSFER_BATCH_TOPIC =
  "0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb";

const RPCS = [
  "https://ethereum-rpc.publicnode.com",
  "https://eth.merkle.io",
  "https://eth.llamarpc.com",
  "https://1rpc.io/eth",
  "https://eth-mainnet.public.blastapi.io",
  "https://ethereum.blockpi.network/v1/rpc/public",
  "https://rpc.mevblocker.io",
  "https://rpc.payload.de",
  "https://gateway.tenderly.co/public/mainnet",
  "https://api.zan.top/node/v1/eth/mainnet/public",
  "https://endpoints.omniatech.io/v1/eth/mainnet/public",
  "https://eth.drpc.org",
  "https://core.gashawk.io/rpc",
  "https://eth.rpc.subquery.network/public",
];

const EXCLUDED = new Set(
  [
    "0x0000000000000000000000000000000000000000",
    "0x000000000000000000000000000000000000dead",
    "0x00000000006c3852cbef3e08e8df289169ede581", // Seaport 1.1
    "0x00000000000000adc04c56bf30ac9d3c0aaf14dc", // Seaport 1.5
    "0x0000000000000068f116a894984e2db1123eb395", // Seaport 1.6
    "0x000000000000ad05ccc4f10045630fb830b95127", // Blur Pool
    "0x39da41747a83aee658334415666f3ef92dd0d541", // Blur exchange
    "0x29469395eaf6f95920e59f858042f0e28d98a20b", // Blur multicall
  ].map((a) => a.toLowerCase()),
);

// ── RPC helper ────────────────────────────────────────────────
const pickRpc = () => RPCS[Math.floor(Math.random() * RPCS.length)];

async function rpcOnce(url, method, params, timeoutMs = 20000) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
      signal: c.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = await res.json();
    if (j.error) throw new Error(j.error.message ?? "rpc error");
    return j.result;
  } finally {
    clearTimeout(t);
  }
}

async function rpc(method, params, maxAttempts = 22) {
  let lastErr;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await rpcOnce(pickRpc(), method, params);
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 250 + Math.random() * 450));
    }
  }
  throw new Error(`rpc(${method}) gave up: ${lastErr?.message}`);
}

// ── Phase 1: Discovery via headless Chrome ────────────────────
const CONTRACTS_CACHE = "/tmp/curator-contracts.json";

function loadCache() {
  try {
    return JSON.parse(fs.readFileSync(CONTRACTS_CACHE, "utf8"));
  } catch {
    return {};
  }
}
function saveCache(map) {
  fs.writeFileSync(CONTRACTS_CACHE, JSON.stringify(map, null, 2));
}

async function discoverContract(browser, url) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  try {
    // `domcontentloaded` instead of `networkidle` because live/active
    // series pages keep polling for price + availability and never
    // settle. Then we POLL the DOM for the etherscan link to appear
    // (lazy-loaded after hydration). Also scroll to the bottom in
    // case the contract row is below the fold and gets mounted only
    // when its section enters the viewport.
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);
    let contract = null;
    let title = null;
    const deadline = Date.now() + 20000;
    while (Date.now() < deadline) {
      const found = await page.evaluate(() => {
        const explorerLinks = Array.from(document.querySelectorAll("a[href]"))
          .map((a) => a.href)
          .filter((h) =>
            /etherscan\.io\/(address|token)\/0x[a-fA-F0-9]{40}/.test(h),
          );
        const fromExplorer = explorerLinks[0]?.match(/0x[a-fA-F0-9]{40}/i)?.[0];
        return { contract: fromExplorer ?? null, title: document.title };
      });
      contract = found.contract;
      title = found.title;
      if (contract) break;
      await page.waitForTimeout(750);
    }
    return {
      contract: contract ? contract.toLowerCase() : null,
      title,
    };
  } catch (e) {
    return { contract: null, title: null, error: e.message };
  } finally {
    await ctx.close();
  }
}

async function discoverAll() {
  const cache = loadCache();
  const missing = URLS.filter((u) => !cache[u] || !cache[u].contract);
  if (missing.length === 0) {
    console.log(`✓ all ${URLS.length} contracts cached`);
    return cache;
  }
  console.log(`discovering ${missing.length} new contracts…`);
  const browser = await chromium.launch({ channel: "chrome" });
  for (let i = 0; i < missing.length; i += 5) {
    const batch = missing.slice(i, i + 5);
    const results = await Promise.all(
      batch.map((url) => discoverContract(browser, url)),
    );
    batch.forEach((url, idx) => {
      cache[url] = results[idx];
      console.log(
        `  ${cache[url].contract ?? "—NOT FOUND—"}  ${url.split("/").pop()}`,
      );
    });
    saveCache(cache);
  }
  await browser.close();
  return cache;
}

// ── Phase 2: Standard detection ───────────────────────────────
async function detectStandard(contract) {
  // supportsInterface(0x80ac58cd) = ERC-721
  // supportsInterface(0xd9b67a26) = ERC-1155
  const callData721 = "0x01ffc9a7" + "80ac58cd" + "0".repeat(56);
  const callData1155 = "0x01ffc9a7" + "d9b67a26" + "0".repeat(56);
  const [r721, r1155] = await Promise.all([
    rpc("eth_call", [{ to: contract, data: callData721 }, "latest"]).catch(() => null),
    rpc("eth_call", [{ to: contract, data: callData1155 }, "latest"]).catch(() => null),
  ]);
  if (r1155 && parseInt(r1155, 16) === 1) return "1155";
  if (r721 && parseInt(r721, 16) === 1) return "721";
  return "unknown";
}

async function totalSupply(contract) {
  try {
    const hex = await rpc("eth_call", [{ to: contract, data: "0x18160ddd" }, "latest"]);
    return hex && hex !== "0x" ? parseInt(hex, 16) : null;
  } catch {
    return null;
  }
}

// ── Phase 3: Multi-contract scan ──────────────────────────────
async function scan721(contracts) {
  if (contracts.length === 0) return {};
  const latest = parseInt(await rpc("eth_blockNumber", []), 16);
  console.log(`\nscan721: ${contracts.length} contracts · blocks ${FROM_BLOCK} → ${latest}`);

  const queue = [];
  for (let s = FROM_BLOCK; s <= latest; s += CHUNK_BLOCKS + 1) {
    queue.push([s, Math.min(s + CHUNK_BLOCKS, latest)]);
  }
  console.log(`  ${queue.length} chunks · ${PARALLEL} parallel`);

  const tokenToOwner = {}; // contract → tokenId hex → owner
  for (const c of contracts) tokenToOwner[c] = {};

  let done = 0;
  async function worker() {
    while (queue.length > 0) {
      const [from, to] = queue.shift();
      let attempts = 0;
      while (true) {
        try {
          const logs = await rpc("eth_getLogs", [
            {
              address: contracts,
              fromBlock: "0x" + from.toString(16),
              toBlock: "0x" + to.toString(16),
              topics: [TRANSFER_TOPIC],
            },
          ]);
          for (const log of logs) {
            const c = log.address.toLowerCase();
            const recipient = "0x" + log.topics[2].slice(26).toLowerCase();
            const tokenId = log.topics[3];
            if (!tokenToOwner[c]) tokenToOwner[c] = {};
            tokenToOwner[c][tokenId] = recipient;
          }
          break;
        } catch (e) {
          attempts++;
          if (attempts > 6) {
            if (to - from > 5000) {
              const mid = Math.floor((from + to) / 2);
              queue.unshift([from, mid], [mid + 1, to]);
              return;
            }
            throw e;
          }
          await new Promise((r) => setTimeout(r, 500 + Math.random() * 800));
        }
      }
      done++;
      const totalTokens = Object.values(tokenToOwner).reduce(
        (n, m) => n + Object.keys(m).length, 0);
      process.stdout.write(
        `\r  ${done}/${queue.length + done} chunks · tokens: ${totalTokens}   `,
      );
    }
  }
  await Promise.all(Array.from({ length: PARALLEL }, () => worker()));
  process.stdout.write("\n");
  return tokenToOwner;
}

async function scan1155(contracts) {
  // ERC-1155 scan: track balances[contract][tokenId hex][owner] += value
  if (contracts.length === 0) return {};
  const latest = parseInt(await rpc("eth_blockNumber", []), 16);
  console.log(`\nscan1155: ${contracts.length} contracts · blocks ${FROM_BLOCK} → ${latest}`);

  const balances = {};
  for (const c of contracts) balances[c] = {};

  const queue = [];
  for (let s = FROM_BLOCK; s <= latest; s += CHUNK_BLOCKS + 1) {
    queue.push([s, Math.min(s + CHUNK_BLOCKS, latest)]);
  }
  console.log(`  ${queue.length} chunks`);

  function applySingle(log) {
    const c = log.address.toLowerCase();
    const from = "0x" + log.topics[2].slice(26).toLowerCase();
    const to = "0x" + log.topics[3].slice(26).toLowerCase();
    // data: 32B id + 32B value
    const data = log.data.slice(2);
    const id = BigInt("0x" + data.slice(0, 64));
    const value = BigInt("0x" + data.slice(64, 128));
    const tok = "0x" + id.toString(16);
    if (!balances[c]) balances[c] = {};
    if (!balances[c][tok]) balances[c][tok] = {};
    if (from !== "0x0000000000000000000000000000000000000000") {
      balances[c][tok][from] = (balances[c][tok][from] ?? 0n) - value;
    }
    balances[c][tok][to] = (balances[c][tok][to] ?? 0n) + value;
  }
  function applyBatch(log) {
    const c = log.address.toLowerCase();
    const from = "0x" + log.topics[2].slice(26).toLowerCase();
    const to = "0x" + log.topics[3].slice(26).toLowerCase();
    const data = log.data.slice(2);
    // ABI-encoded: offset_ids(32) offset_values(32) ids_len(32) ids[…] values_len(32) values[…]
    const idsOffset = parseInt(data.slice(0, 64), 16) * 2;
    const valuesOffset = parseInt(data.slice(64, 128), 16) * 2;
    const idsLen = parseInt(data.slice(idsOffset, idsOffset + 64), 16);
    const valuesLen = parseInt(data.slice(valuesOffset, valuesOffset + 64), 16);
    const ids = [];
    const values = [];
    for (let i = 0; i < idsLen; i++) {
      ids.push(BigInt("0x" + data.slice(idsOffset + 64 + i * 64, idsOffset + 64 + (i + 1) * 64)));
    }
    for (let i = 0; i < valuesLen; i++) {
      values.push(BigInt("0x" + data.slice(valuesOffset + 64 + i * 64, valuesOffset + 64 + (i + 1) * 64)));
    }
    for (let i = 0; i < ids.length; i++) {
      const tok = "0x" + ids[i].toString(16);
      if (!balances[c][tok]) balances[c][tok] = {};
      if (from !== "0x0000000000000000000000000000000000000000") {
        balances[c][tok][from] = (balances[c][tok][from] ?? 0n) - values[i];
      }
      balances[c][tok][to] = (balances[c][tok][to] ?? 0n) + values[i];
    }
  }

  let done = 0;
  async function worker() {
    while (queue.length > 0) {
      const [from, to] = queue.shift();
      try {
        const [singles, batches] = await Promise.all([
          rpc("eth_getLogs", [
            {
              address: contracts,
              fromBlock: "0x" + from.toString(16),
              toBlock: "0x" + to.toString(16),
              topics: [TRANSFER_SINGLE_TOPIC],
            },
          ]),
          rpc("eth_getLogs", [
            {
              address: contracts,
              fromBlock: "0x" + from.toString(16),
              toBlock: "0x" + to.toString(16),
              topics: [TRANSFER_BATCH_TOPIC],
            },
          ]),
        ]);
        for (const log of singles) applySingle(log);
        for (const log of batches) applyBatch(log);
      } catch (e) {
        if (to - from > 5000) {
          const mid = Math.floor((from + to) / 2);
          queue.unshift([from, mid], [mid + 1, to]);
          continue;
        }
        throw e;
      }
      done++;
      process.stdout.write(`\r  1155 chunk ${done}   `);
    }
  }
  await Promise.all(Array.from({ length: PARALLEL }, () => worker()));
  process.stdout.write("\n");
  return balances;
}

// ── Main ──────────────────────────────────────────────────────
const discovered = await discoverAll();

const series = [];
for (const url of URLS) {
  const entry = discovered[url];
  if (!entry || !entry.contract) {
    console.warn(`⚠ no contract for ${url}`);
    continue;
  }
  series.push({ url, contract: entry.contract, title: entry.title });
}

console.log(`\n${series.length}/${URLS.length} series have contracts`);
const uniqContracts = [...new Set(series.map((s) => s.contract))];
console.log(`${uniqContracts.length} unique contract addresses`);

console.log("\n— detecting standards + supply —");
const contractInfo = {};
for (const c of uniqContracts) {
  const [standard, supply] = await Promise.all([detectStandard(c), totalSupply(c)]);
  contractInfo[c] = { standard, supply };
  console.log(`  ${c}  ${standard}  supply=${supply}`);
}

const contracts721 = uniqContracts.filter((c) => contractInfo[c].standard === "721");
const contracts1155 = uniqContracts.filter((c) => contractInfo[c].standard === "1155");
const contractsUnknown = uniqContracts.filter((c) => contractInfo[c].standard === "unknown");
if (contractsUnknown.length) {
  console.warn(`⚠ ${contractsUnknown.length} contracts didn't report a standard — treating as 721`);
  contracts721.push(...contractsUnknown);
}

const tokenToOwner = await scan721(contracts721);
const balances = await scan1155(contracts1155);

// Verify coverage
console.log("\n— coverage check —");
for (const c of contracts721) {
  const supply = contractInfo[c].supply;
  const tracked = Object.keys(tokenToOwner[c] ?? {}).length;
  const status = supply == null ? "?" : tracked === supply ? "✓" : "⚠";
  console.log(`  ${status} ${c}  tracked ${tracked}/${supply ?? "?"}`);
}
for (const c of contracts1155) {
  const tokens = Object.keys(balances[c] ?? {}).length;
  console.log(`  · ${c}  1155 · tokenIds tracked: ${tokens}`);
}

// Build owners set
const all = new Set();
for (const c of contracts721) {
  for (const owner of Object.values(tokenToOwner[c] ?? {})) {
    if (!EXCLUDED.has(owner)) all.add(owner);
  }
}
for (const c of contracts1155) {
  for (const tok of Object.values(balances[c] ?? {})) {
    for (const [owner, bal] of Object.entries(tok)) {
      if (bal > 0n && !EXCLUDED.has(owner)) all.add(owner);
    }
  }
}

const sorted = [...all].sort();
const outPath = path.join(os.homedir(), "Downloads", `${OUT_BASENAME}.txt`);
fs.writeFileSync(outPath, sorted.join("\n") + "\n");

console.log(`\n✓ ${sorted.length} unique addresses → ${outPath}`);
