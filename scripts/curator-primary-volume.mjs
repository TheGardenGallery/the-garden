// Compute primary (mint) volume across every contract discovered by
// build-curator-allowlist.mjs. Reuses the cached contract list from
// /tmp/curator-contracts.json.
//
// Mint definition: Transfer event with from == 0x0. The transaction
// that emitted it carries the ETH the buyer paid as `tx.value`. We
// dedupe by txHash (batch mints fire multiple Transfers from one tx)
// then sum values.
//
//   node scripts/curator-primary-volume.mjs

import fs from "fs";

const FROM_BLOCK = 13_000_000;
const CHUNK_BLOCKS = 50_000;
const PARALLEL_SCAN = 4;
const PARALLEL_TX = 8;

const TRANSFER_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
const ZERO_TOPIC = "0x" + "0".repeat(64);

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

// ── Load contracts from the discovery cache ───────────────────
const cache = JSON.parse(fs.readFileSync("/tmp/curator-contracts.json", "utf8"));
const series = []; // { url, contract, title }
for (const [url, v] of Object.entries(cache)) {
  if (v.contract) series.push({ url, contract: v.contract.toLowerCase(), title: v.title });
}
const contracts = [...new Set(series.map((s) => s.contract))];
console.log(`Loaded ${series.length} series · ${contracts.length} unique contracts`);

// ── Phase 1: scan mint Transfer events ────────────────────────
const latest = parseInt(await rpc("eth_blockNumber", []), 16);
console.log(`Scanning mints from ${FROM_BLOCK} → ${latest}`);

// Map: txHash → { contract, count }
const mintTxs = new Map();
// Map: contract → tx count + token count
const perContract = {};
for (const c of contracts) perContract[c] = { mintCount: 0, txCount: new Set(), wei: 0n };

const queue = [];
for (let s = FROM_BLOCK; s <= latest; s += CHUNK_BLOCKS + 1) {
  queue.push([s, Math.min(s + CHUNK_BLOCKS, latest)]);
}
console.log(`${queue.length} chunks · ${PARALLEL_SCAN} parallel`);

let done = 0;
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
            // topics[0]=Transfer event, topics[1]=from address (0x0 = mint)
            topics: [TRANSFER_TOPIC, ZERO_TOPIC],
          },
        ]);
        for (const log of logs) {
          const c = log.address.toLowerCase();
          const txHash = log.transactionHash;
          perContract[c].mintCount++;
          perContract[c].txCount.add(txHash);
          if (!mintTxs.has(txHash)) {
            mintTxs.set(txHash, { contract: c, count: 0 });
          }
          mintTxs.get(txHash).count++;
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
    process.stdout.write(
      `\r  ${done}/${queue.length + done} chunks · ${mintTxs.size} unique mint txs   `,
    );
  }
}
await Promise.all(Array.from({ length: PARALLEL_SCAN }, () => scanWorker()));
process.stdout.write("\n");

console.log(`Found ${mintTxs.size} unique mint transactions across ${contracts.length} contracts`);

// ── Phase 2: fetch tx.value for each unique mint tx ───────────
const txHashes = [...mintTxs.keys()];
console.log(`Fetching values for ${txHashes.length} txs · ${PARALLEL_TX} parallel`);

let fetched = 0;
const txQueue = [...txHashes];
async function txWorker() {
  while (txQueue.length > 0) {
    const hash = txQueue.shift();
    let attempts = 0;
    while (true) {
      try {
        const tx = await rpc("eth_getTransactionByHash", [hash]);
        if (tx && tx.value) {
          const wei = BigInt(tx.value);
          const info = mintTxs.get(hash);
          info.wei = wei;
          perContract[info.contract].wei += wei;
        }
        break;
      } catch (e) {
        attempts++;
        if (attempts > 8) {
          console.warn(`\n  giving up on ${hash}: ${e.message}`);
          break;
        }
        await new Promise((r) => setTimeout(r, 300 + Math.random() * 500));
      }
    }
    fetched++;
    if (fetched % 50 === 0)
      process.stdout.write(`\r  ${fetched}/${txHashes.length} txs   `);
  }
}
await Promise.all(Array.from({ length: PARALLEL_TX }, () => txWorker()));
process.stdout.write("\n");

// ── Report ────────────────────────────────────────────────────
function ethStr(wei) {
  // wei → ETH with 4 decimals
  const ethWhole = wei / 10n ** 18n;
  const remainder = wei % 10n ** 18n;
  const frac = (remainder * 10000n) / 10n ** 18n;
  return `${ethWhole}.${frac.toString().padStart(4, "0")}`;
}

const totalWei = [...Object.values(perContract)].reduce(
  (acc, v) => acc + v.wei,
  0n,
);

// Map contract → first-seen series title (some contracts shared between URLs)
const contractTitle = {};
for (const s of series) {
  if (!contractTitle[s.contract]) contractTitle[s.contract] = s.title ?? "(no title)";
}

console.log("\n=== per-series ===");
const sorted = Object.entries(perContract)
  .map(([c, v]) => ({
    contract: c,
    title: contractTitle[c] ?? "?",
    mintCount: v.mintCount,
    txCount: v.txCount.size,
    wei: v.wei,
    eth: ethStr(v.wei),
  }))
  .sort((a, b) => (b.wei > a.wei ? 1 : b.wei < a.wei ? -1 : 0));

for (const r of sorted) {
  const flag = r.mintCount > 0 && r.wei === 0n ? " ⚠ zero-value mints" : "";
  console.log(`${r.eth.padStart(10)} ETH · ${String(r.mintCount).padStart(4)} mints / ${String(r.txCount).padStart(4)} txs · ${r.title}${flag}`);
}

console.log(`\n=== TOTAL primary volume: ${ethStr(totalWei)} ETH ===`);
console.log(`(${mintTxs.size} unique mint transactions across ${contracts.length} contracts)`);
