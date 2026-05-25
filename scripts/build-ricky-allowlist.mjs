// Build an allowlist of every current owner across Ricky Retouch's
// Low Language and New North collections.
//
// Strategy:
//  • Scan ERC-721 Transfer logs from FROM_BLOCK → latest, chunked.
//  • Pool of ~14 free public RPCs. Each chunk request picks one at
//    random; failures rotate. With this many endpoints, single-IP
//    rate limits don't stall the run.
//  • Parallel workers consume chunks from a queue. Default 3 workers
//    — enough to amortize latency without hammering any one RPC.
//  • Progress saved to /tmp after every chunk; restart resumes
//    rather than re-scanning.
//  • Track tokenId → latest recipient per contract; union recipients
//    across both contracts; strip zero/marketplace addresses; write
//    the sorted list.
//
//   node scripts/build-ricky-allowlist.mjs
//
// Output: ~/Downloads/ricky-allowlist.txt

import fs from "fs";
import os from "os";
import path from "path";

const COLLECTIONS = [
  { name: "Low Language", contract: "0xbfcac1b335b800919618900b10d0337bfa8dd073" },
  { name: "New North",    contract: "0x6d718ea90e961e205282bc305d9861dd9dbc7c0a" },
];

const TRANSFER_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

const FROM_BLOCK = 19_000_000; // ~Jan 2024 — both look like recent drops
const CHUNK_BLOCKS = 50_000;
const PARALLEL = 3;

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

function pickRpc() {
  return RPCS[Math.floor(Math.random() * RPCS.length)];
}

async function rpcOnce(url, method, params, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.error) throw new Error(json.error.message ?? "rpc error");
    return json.result;
  } finally {
    clearTimeout(timer);
  }
}

async function rpc(method, params, maxAttempts = 18) {
  let lastErr;
  for (let i = 0; i < maxAttempts; i++) {
    const url = pickRpc();
    try {
      return await rpcOnce(url, method, params);
    } catch (e) {
      lastErr = e;
      // Brief jittered backoff; failures on free RPCs cluster, so a
      // pause lets another endpoint take the next try.
      await new Promise((r) => setTimeout(r, 200 + Math.random() * 400));
    }
  }
  throw new Error(`rpc(${method}) gave up: ${lastErr?.message}`);
}

async function getLogsRange(contract, from, to) {
  return rpc("eth_getLogs", [
    {
      address: contract,
      fromBlock: "0x" + from.toString(16),
      toBlock: "0x" + to.toString(16),
      topics: [TRANSFER_TOPIC],
    },
  ]);
}

function progressPath(contract) {
  return `/tmp/ricky-allowlist-progress-${contract}.json`;
}

function loadProgress(contract) {
  try {
    return JSON.parse(fs.readFileSync(progressPath(contract), "utf8"));
  } catch {
    return { nextStart: FROM_BLOCK, tokens: {} };
  }
}

function saveProgress(contract, state) {
  fs.writeFileSync(progressPath(contract), JSON.stringify(state));
}

async function ownersForContract(contract) {
  const latest = parseInt(await rpc("eth_blockNumber", []), 16);
  console.log(`  latest block: ${latest}`);
  const state = loadProgress(contract);
  if (state.nextStart > FROM_BLOCK) {
    console.log(`  resuming from block ${state.nextStart} (${Object.keys(state.tokens).length} tokens tracked)`);
  } else {
    console.log(`  scanning ${FROM_BLOCK} → ${latest}`);
  }

  // Generate chunks
  const queue = [];
  for (let s = state.nextStart; s <= latest; s += CHUNK_BLOCKS + 1) {
    queue.push([s, Math.min(s + CHUNK_BLOCKS, latest)]);
  }
  console.log(`  ${queue.length} chunks · ${PARALLEL} parallel workers`);

  let done = 0;
  let chunkSize = CHUNK_BLOCKS;

  async function worker() {
    while (queue.length > 0) {
      const [from, to] = queue.shift();
      let attempts = 0;
      while (true) {
        try {
          const logs = await getLogsRange(contract, from, to);
          for (const log of logs) {
            const recipient = "0x" + log.topics[2].slice(26).toLowerCase();
            const tokenId = log.topics[3];
            state.tokens[tokenId] = recipient;
          }
          break;
        } catch (e) {
          attempts++;
          if (attempts > 6) {
            // Split the chunk in half and re-queue.
            if (to - from > 5000) {
              const mid = Math.floor((from + to) / 2);
              queue.unshift([from, mid], [mid + 1, to]);
              console.warn(`\n  splitting ${from}-${to} (${e.message})`);
              return; // let next worker iteration pick up
            }
            throw e;
          }
          await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));
        }
      }
      done++;
      state.nextStart = to + 1;
      if (done % 5 === 0) saveProgress(contract, state);
      process.stdout.write(
        `\r  ${done} chunks · ${Object.keys(state.tokens).length} tokens   `,
      );
    }
  }

  await Promise.all(Array.from({ length: PARALLEL }, () => worker()));
  saveProgress(contract, state);
  process.stdout.write("\n");

  const owners = new Set();
  for (const owner of Object.values(state.tokens)) {
    if (!EXCLUDED.has(owner)) owners.add(owner);
  }
  console.log(`  unique current owners: ${owners.size}`);
  return owners;
}

const all = new Set();
const perCollection = {};
for (const { name, contract } of COLLECTIONS) {
  console.log(`\n=== ${name} (${contract}) ===`);
  const owners = await ownersForContract(contract);
  perCollection[name] = owners.size;
  for (const o of owners) all.add(o);
}

const sorted = [...all].sort();
const outPath = path.join(os.homedir(), "Downloads", "ricky-allowlist.txt");
fs.writeFileSync(outPath, sorted.join("\n") + "\n");

console.log("\nper-collection:", perCollection);
console.log(`✓ ${sorted.length} unique addresses (union) → ${outPath}`);
