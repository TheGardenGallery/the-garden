"use client";

import { useEffect, useState } from "react";

/**
 * Live-iframe hero with an inline "refresh" affordance.
 *
 * Most Verse generative bundles seed their RNG from the payload's
 * `hash` field, which means the same payload always renders the same
 * piece — bumping a cache-buster won't visibly change the output. To
 * give viewers a fresh variation on every page load, we (when
 * `randomize` is set) replace the payload's hash with a fresh
 * cryptographically-random 64-char hex value before mounting the
 * iframe. The piece's "DNA" changes, so colors, structure, and
 * scramble all roll new each visit. The refresh button does the same
 * thing on demand.
 *
 * The iframe is mounted only after hydration: rendering it on the
 * server with a seed payload caused the browser to start fetching the
 * ~2MB bundle, only for the post-mount randomize step to remount with
 * a different URL and discard that work. Deferring to client mount
 * collapses the first visit into a single load. A same-shape
 * placeholder keeps layout stable during SSR.
 */
export function HeroIframeMedia({
  src,
  title,
  aspect,
  randomize = false,
}: {
  src: string;
  title: string;
  aspect?: string;
  randomize?: boolean;
}) {
  const [state, setState] = useState<{ src: string; v: number } | null>(null);

  useEffect(() => {
    setState({
      src: randomize ? withRandomHash(src) : src,
      v: Date.now(),
    });
  }, [src, randomize]);

  function reroll() {
    setState((prev) => ({
      src: randomize ? withRandomHash(src) : (prev?.src ?? src),
      v: Date.now(),
    }));
  }

  const aspectStyle = { ["--hero-iframe-aspect" as string]: aspect ?? "1" };

  let finalSrc: string | null = null;
  if (state) {
    const sep = state.src.includes("?") ? "&" : "?";
    finalSrc = `${state.src}${sep}v=${state.v}`;
  }

  return (
    <>
      {finalSrc && state ? (
        <iframe
          key={state.v}
          className="ex-hero-iframe"
          src={finalSrc}
          title={title}
          style={aspectStyle}
        />
      ) : (
        <div className="ex-hero-iframe" style={aspectStyle} aria-hidden="true" />
      )}
      {randomize && (
        <button
          type="button"
          className="ex-hero-iframe-refresh"
          onClick={reroll}
          aria-label="Roll a new variation of the artwork"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16.023 9.348h4.992v-4.992" />
            <path d="M21.015 9.348a8.252 8.252 0 0 0-14.97-1.226" />
            <path d="M7.977 14.652H2.985v4.992" />
            <path d="M2.985 14.652a8.252 8.252 0 0 0 14.97 1.226" />
          </svg>
        </button>
      )}
    </>
  );
}

function makeRandomHash(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return (
    "0x" +
    Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
  );
}

/**
 * Take a proxy URL like `/api/genart/ves3l?payload=<base64-json>` and
 * return the same URL with the payload's `hash` field swapped out for
 * a fresh random 64-char hex value. Falls back to the original src on
 * any parse failure so the iframe always loads something.
 */
function withRandomHash(src: string): string {
  if (typeof window === "undefined") return src;
  try {
    const url = new URL(src, window.location.origin);
    const payloadParam = url.searchParams.get("payload");
    if (!payloadParam) return src;
    const payload = JSON.parse(atob(payloadParam));
    payload.hash = makeRandomHash();
    url.searchParams.set("payload", btoa(JSON.stringify(payload)));
    return url.pathname + (url.search ? url.search : "");
  } catch {
    return src;
  }
}
