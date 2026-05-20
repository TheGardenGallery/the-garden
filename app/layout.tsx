import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { VisitMarker } from "@/components/VisitMarker";
import "./globals.css";

// Resolve the canonical origin for absolute URLs in meta tags (og:image,
// twitter:image, etc.). `VERCEL_URL` is the per-deployment immutable URL,
// which requires auth for previews — crawlers can't fetch OG images from
// it, so link previews silently fall back to scraping random page images.
// `VERCEL_PROJECT_PRODUCTION_URL` is the stable production alias (e.g.
// the-garden-flax.vercel.app) and is publicly reachable.
const siteOrigin =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: "The Garden",
  description: "An online gallery for digital art.",
  // Populates the byline of every social card (the "From The Garden"
  // line on iMessage/WhatsApp/Slack, the source attribution on
  // LinkedIn). openGraph deep-merges with per-page metadata, so
  // siteName stays correct everywhere even when a page sets its own
  // openGraph.title / description.
  openGraph: {
    siteName: "The Garden",
    type: "website",
  },
  // Force the edge-to-edge image card on Twitter/X — Next auto-picks
  // this when no explicit twitter object is set, but the moment a page
  // overrides any twitter.* field it falls back to plain "summary"
  // unless we declare card here at the layout level.
  // `site` and `creator` attribute the card to @chilltulpa (provisional
  // Garden handle); the homepage's metadata override re-declares both
  // because Next replaces the twitter object rather than deep-merging.
  twitter: {
    card: "summary_large_image",
    site: "@chilltulpa",
    creator: "@chilltulpa",
  },
};

// iOS Safari paints the strip between the page's bottom pixel and its
// URL-bar pill using `theme-color`. Without this meta, the system
// default (white on light-mode iPhones) shows below the black footer
// as a mismatched sliver. Setting it to ink makes that chrome strip
// match the footer, so the page reads as one grounded column straight
// through the safe area. Only affects browser chrome — page bg, body
// bg, and every page root are unchanged, so light-themed surfaces
// inside the viewport stay paper. Next 15 moved this from `metadata`
// to the separate `viewport` export.
export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* The site mixes paper and dark surfaces page-to-page; declaring
            both schemes lets the browser style native UI (scrollbars,
            form controls, autofill) appropriately on either surface
            instead of always rendering with the system default. */}
        <meta name="color-scheme" content="light dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,500;1,400&family=Barlow:wght@400;500;600&family=Inter:wght@700&family=Big+Shoulders+Display:wght@800&family=Saira+Condensed:wght@500;600&family=Space+Mono:wght@400&display=swap"
        />
        {/* Warm up DNS/TCP for the IPFS / S3 gateways our genart
            iframes load resources from via <base href>. Cheap network
            hint that meaningfully cuts first-paint time on exhibition
            pages with live iframes (BASALT RT, Autoscope, ves3l). */}
        <link rel="preconnect" href="https://ipfs.verse.works" crossOrigin="" />
        <link
          rel="preconnect"
          href="https://verse-public-gateway.myfilebase.com"
          crossOrigin=""
        />
        <link
          rel="preconnect"
          href="https://public-bucket-verse-dev.s3.eu-west-1.amazonaws.com"
          crossOrigin=""
        />
        {/* Organization schema for Google Knowledge Graph + "About this
            result" attribution. Declares the brand entity, links to
            official socials via sameAs, and points to the canonical
            logo so Google can surface it in panel results. Kept at
            the layout level so every route inherits the same entity
            declaration. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "The Garden",
              alternateName: "The Garden Gallery",
              url: siteOrigin,
              logo: `${siteOrigin}/icon.png`,
              description: "An online gallery for digital art.",
              sameAs: ["https://x.com/chilltulpa"],
            }),
          }}
        />
      </head>
      <body>
        <VisitMarker />
        <Nav />
        <main>{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
