import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt = "The Garden — an online gallery for digital art";
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
          Mirror the site-logo proportions from globals.css `.logo`.
          CSS on the nav renders `G<span.triangle>RDEN` as one continuous
          text run, so letter-spacing (-0.019em) bridges the gap between
          the G, the triangle, and the R. Satori splits that into three
          flex children and letter-spacing no longer applies across them,
          so we absorb the missing tracking into the triangle's margins:

          site:   margin-left  = -0.05em + letter-spacing(-0.019em) = -0.069em
          site:   margin-right =  0.02em + letter-spacing(-0.019em) =  0.001em
          at 160px font: -11px left, 0px right. Triangle stays 0.73em.
          alignItems:baseline so the triangle sits on the text baseline
          instead of the descender line.
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
            style={{ marginLeft: -11, marginRight: 0 }}
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
