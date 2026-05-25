// Compute true primary sales volume across every Verse contract by
// walking each token's Transfer history and finding the first paid
// transfer.
//
// Verse uses a mint-then-sell pattern: the artist (or a relayer)
// mints all tokens up front with value=0, then collectors buy via
// subsequent Transfer events that DO carry tx.value > 0. So we
// can't trust the mint event — we have to scan every Transfer for
// every token, then for each token find the first transfer where
// money changed hands.
//
// Output: terminal report + JSON file with per-series breakdown.
// Run after build-curator-allowlist.mjs (uses its contract cache).
//
//   node scripts/curator-true-primary-volume.mjs

import fs from "fs";

const FROM_BLOCK = 13_000_000;
const CHUNK_BLOCKS = 50_000;
const PARALLEL_SCAN = 4;
const PARALLEL_TX = 10;

const TRANSFER_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

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

const pickRpc = () => RPCS[Math.floor(Math.random() * RPCS.length)];

async function rpcOnce(url, method, params, timeoutMs = 25000) {
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

// ── Load contracts ────────────────────────────────────────────
const cache = JSON.parse(fs.readFileSync("/tmp/curator-contracts.json", "utf8"));
const series = [];
for (const [url, v] of Object.entries(cache)) {
  if (v.contract) series.push({ url, contract: v.contract.toLowerCase(), title: v.title });
}
const contracts = [...new Set(series.map((s) => s.contract))];
const contractTitle = {};
for (const s of series) if (!contractTitle[s.contract]) contractTitle[s.contract] = s.title ?? "?";
console.log(`${series.length} series · ${contracts.length} unique contracts`);

// ── Phase 1: Scan ALL Transfer events for all contracts ───────
const TRANSFERS_CACHE = "/tmp/curator-transfers.json";

const latest = parseInt(await rpc("eth_blockNumber", []), 16);
console.log(`Scanning ALL transfers from ${FROM_BLOCK} → ${latest}`);

// transfers[contract][tokenId] = [{ block, logIndex, txHash, from, to }, …]
let transfers = {};
let scanFrom = FROM_BLOCK;

if (fs.existsSync(TRANSFERS_CACHE)) {
  try {
    const saved = JSON.parse(fs.readFileSync(TRANSFERS_CACHE, "utf8"));
    transfers = saved.transfers ?? {};
    scanFrom = saved.nextBlock ?? FROM_BLOCK;
    console.log(`Resuming scan from block ${scanFrom}`);
  } catch {}
}
for (const c of contracts) if (!transfers[c]) transfers[c] = {};

const queue = [];
for (let s = scanFrom; s <= latest; s += CHUNK_BLOCKS + 1) {
  queue.push([s, Math.min(s + CHUNK_BLOCKS, latest)]);
}
console.log(`${queue.length} chunks · ${PARALLEL_SCAN} parallel`);

let scanned = 0;
let highWater = scanFrom;
async function scanWorker() {
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
          const fromAddr = "0x" + log.topics[1].slice(26).toLowerCase();
          const toAddr = "0x" + log.topics[2].slice(26).toLowerCase();
          const tokenId = log.topics[3];
          if (!transfers[c][tokenId]) transfers[c][tokenId] = [];
          transfers[c][tokenId].push({
            block: parseInt(log.blockNumber, 16),
            logIndex: parseInt(log.logIndex, 16),
            txHash: log.transactionHash,
            from: fromAddr,
            to: toAddr,
          });
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
    scanned++;
    highWater = Math.max(highWater, to + 1);
    if (scanned % 10 === 0) {
      fs.writeFileSync(
        TRANSFERS_CACHE,
        JSON.stringify({ transfers, nextBlock: highWater }),
      );
    }
    process.stdout.write(
      `\r  ${scanned}/${queue.length + scanned} chunks   `,
    );
  }
}
await Promise.all(Array.from({ length: PARALLEL_SCAN }, () => scanWorker()));
fs.writeFileSync(TRANSFERS_CACHE, JSON.stringify({ transfers, nextBlock: highWater }));
process.stdout.write("\n");

let totalEvents = 0;
for (const c of contracts) {
  for (const tokenId of Object.keys(transfers[c])) {
    totalEvents += transfers[c][tokenId].length;
  }
}
console.log(`Captured ${totalEvents} Transfer events across all contracts`);

// ── Phase 2: Unique tx hashes ─────────────────────────────────
const txSet = new Set();
for (const c of contracts) {
  for (const tokenId of Object.keys(transfers[c])) {
    for (const ev of transfers[c][tokenId]) txSet.add(ev.txHash);
  }
}
console.log(`${txSet.size} unique transaction hashes`);

// ── Phase 3: Fetch tx values (with cache) ─────────────────────
const TX_VALUES_CACHE = "/tmp/curator-tx-values.json";
let txValuesObj = {};
try {
  txValuesObj = JSON.parse(fs.readFileSync(TX_VALUES_CACHE, "utf8"));
  console.log(`${Object.keys(txValuesObj).length} tx values cached`);
} catch {}

const needFetch = [...txSet].filter((h) => txValuesObj[h] === undefined);
console.log(`Fetching ${needFetch.length} new tx values · ${PARALLEL_TX} parallel`);

let fetched = 0;
async function txWorker() {
  while (needFetch.length > 0) {
    const hash = needFetch.shift();
    let attempts = 0;
    let value = "0x0";
    while (true) {
      try {
        const tx = await rpc("eth_getTransactionByHash", [hash]);
        value = tx?.value ?? "0x0";
        break;
      } catch (e) {
        attempts++;
        if (attempts > 8) break;
        await new Promise((r) => setTimeout(r, 300 + Math.random() * 500));
      }
    }
    txValuesObj[hash] = value;
    fetched++;
    if (fetched % 100 === 0) {
      fs.writeFileSync(TX_VALUES_CACHE, JSON.stringify(txValuesObj));
      process.stdout.write(`\r  ${fetched}/${fetched + needFetch.length} fetched   `);
    }
  }
}
await Promise.all(Array.from({ length: PARALLEL_TX }, () => txWorker()));
fs.writeFileSync(TX_VALUES_CACHE, JSON.stringify(txValuesObj));
process.stdout.write("\n");

const txValue = (hash) => BigInt(txValuesObj[hash] ?? "0x0");

// ── Phase 4: For each token, find first paid transfer ─────────
// primarySale[contract][tokenId] = { txHash, value } or null
const primarySale = {};
// txTokenCount: map<txHash, count of tokens this tx is a primary sale for>
const txTokenCount = new Map();

for (const c of contracts) {
  primarySale[c] = {};
  for (const tokenId of Object.keys(transfers[c])) {
    const events = transfers[c][tokenId].sort(
      (a, b) => a.block - b.block || a.logIndex - b.logIndex,
    );
    let chosen = null;
    for (const ev of events) {
      const v = txValue(ev.txHash);
      if (v > 0n) {
        chosen = { txHash: ev.txHash, value: v };
        break;
      }
    }
    primarySale[c][tokenId] = chosen;
    if (chosen) {
      txTokenCount.set(chosen.txHash, (txTokenCount.get(chosen.txHash) ?? 0) + 1);
    }
  }
}

// ── Phase 5: Aggregate ────────────────────────────────────────
// For each token with a primary sale, its allocated value = tx.value / total tokens this tx sold across ALL contracts.
let totalWei = 0n;
const perContractWei = {};
const perContractSold = {};
const seenTxs = new Set();
for (const c of contracts) {
  perContractWei[c] = 0n;
  perContractSold[c] = 0;
  for (const tokenId of Object.keys(primarySale[c])) {
    const sale = primarySale[c][tokenId];
    if (!sale) continue;
    const share = sale.value / BigInt(txTokenCount.get(sale.txHash));
    perContractWei[c] += share;
    perContractSold[c]++;
    if (!seenTxs.has(sale.txHash)) {
      seenTxs.add(sale.txHash);
      totalWei += sale.value;
    }
  }
}

// ── Report ────────────────────────────────────────────────────
function ethStr(wei) {
  const whole = wei / 10n ** 18n;
  const remainder = wei % 10n ** 18n;
  const frac = (remainder * 10000n) / 10n ** 18n;
  return `${whole}.${frac.toString().padStart(4, "0")}`;
}

console.log("\n=== per-series primary volume ===");
const rows = contracts
  .map((c) => ({
    contract: c,
    title: contractTitle[c] ?? "?",
    sold: perContractSold[c],
    totalTokens: Object.keys(transfers[c]).length,
    wei: perContractWei[c],
  }))
  .sort((a, b) => (b.wei > a.wei ? 1 : b.wei < a.wei ? -1 : 0));

for (const r of rows) {
  const eth = ethStr(r.wei);
  console.log(
    `${eth.padStart(10)} ETH · ${String(r.sold).padStart(4)}/${String(r.totalTokens).padStart(4)} sold · ${r.title}`,
  );
}

console.log(`\n=== TOTAL on-chain primary volume: ${ethStr(totalWei)} ETH ===`);
console.log(`${seenTxs.size} unique primary-sale transactions`);
const totalSold = rows.reduce((n, r) => n + r.sold, 0);
const totalTokens = rows.reduce((n, r) => n + r.totalTokens, 0);
console.log(`${totalSold}/${totalTokens} tokens with a recorded paid first-transfer`);
console.log(
  `(Tokens without paid transfer: still held by artist, gifted, or paid via off-chain channel.)`,
);

// Write detailed JSON
const reportPath = "/Users/lonli/Downloads/curator-primary-volume-report.json";
fs.writeFileSync(
  reportPath,
  JSON.stringify(
    {
      totalETH: ethStr(totalWei),
      totalWei: totalWei.toString(),
      perSeries: rows.map((r) => ({
        contract: r.contract,
        title: r.title,
        tokensSold: r.sold,
        tokensTotal: r.totalTokens,
        eth: ethStr(r.wei),
        wei: r.wei.toString(),
      })),
      uniqueSaleTxs: seenTxs.size,
      scannedAtBlock: latest,
    },
    null,
    2,
  ),
);
console.log(`\nFull report: ${reportPath}`);
