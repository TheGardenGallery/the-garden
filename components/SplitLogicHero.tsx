"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
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
 * AND the piece-grid one), the artwork they were last looking at
 * when they closed becomes the new hero. The canonical hero is
 * preserved as items[0] in the page-wide collection, so the URL's
 * first impression for fresh visitors is never altered — the swap
 * is in-memory only and wipes when this anchor unmounts (which
 * happens on full reload or navigating off the exhibition).
 *
 * SplitLogicHeroAnchor paints the anchored artwork over the
 * canonical hero plate via a crossfade. SplitLogicZoomCatcher is
 * just a thin bridge that hands ZoomCatcher's close-index back to
 * the shared store.
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
  const [mount, setMount] = useState<HTMLElement | null>(null);

  // Find the canonical hero plate once the DOM is live, then portal
  // into it. Holding the node in state (not a ref) lets the overlay
  // re-render when the plate appears post-hydration.
  useEffect(() => {
    setMount(
      document.querySelector(
        '.ex-hero[data-slug="split-logic"] .ex-hero-plate',
      ) as HTMLElement | null,
    );
  }, []);

  // Reset the anchor when this component unmounts — leaving the page
  // (or a full reload) returns the canonical hero on next visit, so
  // memory never leaks across exhibitions.
  useEffect(() => {
    return () => {
      setHeroAnchorIndex(0);
    };
  }, []);

  if (!mount) return null;

  return createPortal(
    <AnimatePresence>
      {anchorIndex !== 0 && items[anchorIndex] && (
        <motion.div
          key={anchorIndex}
          className="ex-hero-anchor-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // Symmetric easeInOut, 500ms — film-style cross-dissolve.
          // Both pieces share air evenly through the transition; the
          // new one "arrives" rather than "snaps in."
          transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
        >
          <AutoPlayVideo
            className="ex-hero-video"
            src={items[anchorIndex].video}
            poster={items[anchorIndex].poster}
            loop
            preload="auto"
            aria-label={items[anchorIndex].alt}
          />
        </motion.div>
      )}
    </AnimatePresence>,
    mount,
  );
}

export function SplitLogicZoomCatcher(props: {
  items: ExpandedArtworkItem[];
  scope: string;
}) {
  return <ZoomCatcher {...props} onClose={setHeroAnchorIndex} />;
}
