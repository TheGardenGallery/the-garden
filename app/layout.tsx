import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,500;1,400&family=Barlow:wght@400;500;600&family=Inter:wght@700&display=swap"
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
      </head>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
