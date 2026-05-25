const TS = "0x18160ddd"; // totalSupply()
const RPCS = ["https://ethereum-rpc.publicnode.com","https://eth.merkle.io","https://eth.llamarpc.com","https://eth.drpc.org"];
async function call(addr) {
  for (const rpc of RPCS) {
    try {
      const res = await fetch(rpc, { method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_call", params: [{ to: addr, data: TS }, "latest"] }) });
      const j = await res.json();
      if (j.result && j.result !== "0x") return parseInt(j.result, 16);
    } catch {}
  }
  return null;
}
for (const [name, addr] of [
  ["Low Language", "0xbfcac1b335b800919618900b10d0337bfa8dd073"],
  ["New North", "0x6d718ea90e961e205282bc305d9861dd9dbc7c0a"],
]) {
  const supply = await call(addr);
  console.log(`${name}: totalSupply() = ${supply}`);
}
