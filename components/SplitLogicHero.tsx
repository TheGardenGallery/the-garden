"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AutoPlayVideo } from "./AutoPlayVideo";
import { ZoomCatcher } from "./ZoomCatcher";
import type { ExpandedArtworkItem } from "./ExpandedArtwork";
import {
  getHeroAnchorIndex,
  getHeroAnchorServerSnapshot,
  setHeroAnchorIndex,
  subscribeHeroAnchor,
} from "./hero-anchor-store";

/**
 * Split-Logic-only hero memory. As the visitor pages through any
 * lightbox on the page (the ZoomCatcher one for hero+inline artworks
 * AND the piece-grid one), the anchor index updates live so the
 * canonical hero plate becomes a window onto the same artwork they
 * are looking at. Closing the lightbox leaves them facing that piece
 * — no animation; state is the truth, presentation follows.
 *
 * When anchored, the hero region ALSO adopts the lightbox's blurred-
 * poster backdrop, so the page reads as "your last lightbox view,
 * embedded into the hero" rather than a plain video swap. The
 * canonical hero (items[0]) is preserved as the default; the swap
 * is in-memory only and resets on unmount.
 *
 * Two portals: backdrop into `.ex-hero` (so the blur fills the full
 * 100vh section, not just the inner plate), video overlay into
 * `.ex-hero-plate` (so it inherits the canonical 92%-centered
 * sizing via the existing `.ex-hero-video` rules).
 */

function useHeroAnchorIndex(): number {
  return useSyncExternalStore(
    subscribeHeroAnchor,
    getHeroAnchorIndex,
    getHeroAnchorServerSnapshot,
  );
}

export function SplitLogicHeroAnchor({
  items,
}: {
  items: ExpandedArtworkItem[];
}) {
  const anchorIndex = useHeroAnchorIndex();
  const [heroMount, setHeroMount] = useState<HTMLElement | null>(null);
  const [plateMount, setPlateMount] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setHeroMount(
      document.querySelector(
        '.ex-hero[data-slug="split-logic"]',
      ) as HTMLElement | null,
    );
    setPlateMount(
      document.querySelector(
        '.ex-hero[data-slug="split-logic"] .ex-hero-plate',
      ) as HTMLElement | null,
    );
  }, []);

  // Reset the anchor when this component unmounts so leaving the page
  // (or a full reload) returns the canonical hero on next visit.
  useEffect(() => {
    return () => {
      setHeroAnchorIndex(0);
    };
  }, []);

  if (anchorIndex === 0) return null;
  const item = items[anchorIndex];
  if (!item) return null;

  return (
    <>
      {heroMount &&
        createPortal(
          <div
            className="ex-hero-anchor-bg"
            style={{ backgroundImage: `url(${item.poster})` }}
            aria-hidden="true"
          />,
          heroMount,
        )}
      {plateMount &&
        createPortal(
          <div className="ex-hero-anchor-overlay">
            <AutoPlayVideo
              className="ex-hero-video"
              src={item.video}
              poster={item.poster}
              loop
              preload="auto"
              aria-label={item.alt}
            />
          </div>,
          plateMount,
        )}
    </>
  );
}

export function SplitLogicZoomCatcher(props: {
  items: ExpandedArtworkItem[];
  scope: string;
}) {
  return <ZoomCatcher {...props} onIndexChange={setHeroAnchorIndex} />;
}
