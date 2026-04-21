import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt = "The Garden — a digital art gallery";
export const size = { width: 1200, height: 1200 };
export const contentType = "image/png";

/**
 * OG / share-card image: paper backdrop with the THE G△RDEN wordmark
 * centered, so link previews carry the brand instead of whichever
 * artwork the crawler happens to find first.
 *
 * Next.js emits this as <meta property="og:image"> automatically for
 * the root route.
 */
export default async function Image() {
  const interBold = await readFile(
    path.join(process.cwd(), "public/fonts/Inter-700.woff"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#f5f3ef",
          color: "#0c0c10",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 160,
            fontWeight: 700,
            letterSpacing: -6,
          }}
        >
          <span>THE G</span>
          <svg
            width="140"
            height="140"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginLeft: -4, marginRight: -4 }}
          >
            <path
              d="M50 0 L100 100 L0 100 Z M50 46 L67 79 L33 79 Z"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
          <span>RDEN</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: interBold, style: "normal", weight: 700 },
      ],
    },
  );
}
