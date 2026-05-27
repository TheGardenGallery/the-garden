import { isEligible } from "@/lib/data/split-logic-allowlist";

const ADDR_RE = /^0[xX][0-9a-fA-F]{40}$/;

/**
 * GET /api/split-logic/check-allowlist?address=0x…
 *
 * Server-side eligibility lookup. The full 1,011-address Set lives
 * on the server only — never bundled to clients — so visitors to
 * other exhibition pages don't download data they'll never use, and
 * Split Logic itself ships a lighter JS payload too.
 *
 * The component's submit beat (~650ms) absorbs the network round
 * trip, so the perceived UX is identical to a synchronous check.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = (searchParams.get("address") ?? "").trim();

  if (!ADDR_RE.test(address)) {
    return Response.json({ error: "invalid_address" }, { status: 400 });
  }

  return Response.json(
    { eligible: isEligible(address) },
    { headers: { "cache-control": "public, max-age=300, s-maxage=300" } },
  );
}
