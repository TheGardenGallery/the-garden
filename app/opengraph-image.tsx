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
        {/*
          Mirror the site-logo proportions from globals.css `.logo`:
          - triangle: 0.73em × 0.73em (not 0.875em)
          - margin: -0.05em left, 0.02em right (not symmetric)
          - letter-spacing: -0.019em (matches 20.9px font / -0.4px tracking)
          - baseline-aligned with the letters, not center-aligned
          At 160px font size those ratios land at 117px / -8px / 3px / -3px.
        */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontSize: 160,
            fontWeight: 700,
            letterSpacing: -3,
            lineHeight: 1,
          }}
        >
          <span>THE G</span>
          <svg
            width="117"
            height="117"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginLeft: -8, marginRight: 3 }}
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
