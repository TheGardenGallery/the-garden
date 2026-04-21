import { NextResponse } from "next/server";
import { getArtworkPalette } from "@/lib/palette";

/**
 * GET /api/palette?src=/images/…
 *
 * Returns the cached backdrop palette for a /public asset. Response is
 * immutable — safe to public-cache for a year. Use the `lib/palette`
 * helper directly when composing server-rendered pages; this route is
 * for client-side or external consumers.
 */
export async function GET(request: Request) {
  const src = new URL(request.url).searchParams.get("src");
  if (!src || !src.startsWith("/")) {
    return NextResponse.json(
      { error: "Provide ?src as an absolute public-asset path (e.g. /images/...)" },
      { status: 400 }
    );
  }

  try {
    const palette = await getArtworkPalette(src);
    return NextResponse.json(palette, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: `palette extraction failed: ${(err as Error).message}` },
      { status: 500 }
    );
  }
}
