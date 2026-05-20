import type { MetadataRoute } from "next";

/**
 * Web manifest — controls the "Add to home screen" experience on iOS
 * and Android. Without this, a collector who saves thegarden.art to
 * their phone gets a generic globe icon and a truncated URL as the
 * label. With it, they get the Garden wordmark icon and "The Garden"
 * as the saved name, opening fullscreen via `display: standalone`.
 *
 * Next 15 App Router auto-emits `<link rel="manifest">` in <head>
 * whenever this file exists, so no manual link tag is required.
 *
 * Icons reference the canonical app-folder icons (icon.png, icon.svg,
 * apple-icon.png) — Next serves them at /icon.png, etc.
 *
 * `background_color` matches the paper ground that opens most pages
 * (#f5f3ef) so the splash screen reads as the site's default surface
 * before paint, not a jarring white card.
 * `theme_color` matches the existing layout `themeColor: #000000` so
 * the address-bar tint and PWA chrome are unified.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Garden",
    short_name: "The Garden",
    description: "An online gallery for digital art.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f3ef",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon.png",
        sizes: "any",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
