"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Artist } from "@/lib/types";
import { PlotCell } from "./PlotCell";
import { ArtistHoverPreview } from "./ArtistHoverPreview";
import { PersistentIframePreview } from "./PersistentIframePreview";
import {
  getArtistPreviewImage,
  getIframePreloadResources,
  optimizeImageSrc,
} from "@/lib/artist-preview";
import { EASE_SLOW } from "@/lib/motion";

type PlotGridProps = {
  artists: Artist[];
  columns?: number;
};

const defaultColumns = 6;
const LETTER_ROWS = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

/* Hover state fires all three layers on enter simultaneously — the
   visual stagger comes from different CSS fade-in durations per layer
   (col fastest, cell slowest), not setTimeout delays. This keeps the
   interaction feeling immediate while preserving the layered read. */

type DisplayRow = {
  label: string;
  letters: string[];
  isCollapsed: boolean;
};

/** Build the list of rows to render. The `#` row (numeric-prefix artists)
    always comes first, labeled "1". Then A–Z, with any run of 3+ consecutive
    empty letters collapsed into a single range row like "F—H". Shorter runs
    render as individual empty rows. */
function buildDisplayRows(occupied: Set<string>): DisplayRow[] {
  const rows: DisplayRow[] = [];
  if (occupied.has("#")) {
    rows.push({ label: "1", letters: ["#"], isCollapsed: false });
  }
  let emptyRun: string[] = [];
  const flush = () => {
    if (emptyRun.length >= 3) {
      rows.push({
        label: `${emptyRun[0]}—${emptyRun[emptyRun.length - 1]}`,
        letters: [...emptyRun],
        isCollapsed: true,
      });
    } else {
      emptyRun.forEach((l) =>
        rows.push({ label: l, letters: [l], isCollapsed: false }),
      );
    }
    emptyRun = [];
  };
  for (const letter of LETTER_ROWS) {
    if (occupied.has(letter)) {
      flush();
      rows.push({ label: letter, letters: [letter], isCollapsed: false });
    } else {
      emptyRun.push(letter);
    }
  }
  flush();
  return rows;
}

export function PlotGrid({ artists, columns = defaultColumns }: PlotGridProps) {
  const reduced = useReducedMotion();
  const occupied = new Set(artists.map((a) => a.coord.row));
  const displayRows = buildDisplayRows(occupied);

  const [hoverCol, setHoverCol] = useState<number | null>(null);
  const [hoverRow, setHoverRow] = useState<string | null>(null);
  const [hoverCellKey, setHoverCellKey] = useState<string | null>(null);
  const [hoverArtist, setHoverArtist] = useState<Artist | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleEnter = (row: string, col: number, artist?: Artist) => {
    setHoverCol(col);
    setHoverRow(row);
    setHoverCellKey(`${row}-${col}`);
    if (artist) setHoverArtist(artist);
  };

  const handleLeave = () => {
    setHoverCol(null);
    setHoverRow(null);
    setHoverCellKey(null);
    setHoverArtist(null);
  };

  const handleMove = (e: React.MouseEvent) => {
    setCursor({ x: e.clientX, y: e.clientY });
  };

  const preview = hoverArtist ? getArtistPreviewImage(hoverArtist.slug) : null;
  // Iframe-type previews are handled by PersistentIframePreview
  // (mounted on page load, revealed on hover) — null out the src
  // here so ArtistHoverPreview doesn't try to render its own iframe
  // on top of the persistent one.
  const isIframeHover = preview?.type === "iframe";
  const previewSrc =
    preview && !isIframeHover
      ? preview.type === "image"
        ? optimizeImageSrc(preview.src)
        : preview.src
      : null;
  const previewPoster = preview?.poster ? optimizeImageSrc(preview.poster) : undefined;
  const previewType = preview?.type ?? "image";

  // List of all iframe-type previews. Computed once from the artists
  // list and rendered as persistent (always-mounted) iframes — first
  // paint happens within seconds of page load, so hovering the
  // matching artist later just reveals an already-painted canvas
  // instead of waiting on a fresh bundle parse.
  const iframePreviews = useMemo(() => {
    const out: {
      slug: string;
      src: string;
      aspect?: number;
      sizeScale?: number;
    }[] = [];
    for (const a of artists) {
      const p = getArtistPreviewImage(a.slug);
      if (p?.type === "iframe") {
        out.push({ slug: a.slug, src: p.src, aspect: p.aspect, sizeScale: p.sizeScale });
      }
    }
    return out;
  }, [artists]);

  // Preload every artist's preview image on mount so the first hover
  // never has to wait for a network round-trip. Browser caches the
  // bytes; the hover preview just reads from cache.
  useEffect(() => {
    const seen = new Set<string>();
    const loaders: HTMLImageElement[] = [];
    const videoLoaders: HTMLVideoElement[] = [];
    const kick = () => {
      for (const a of artists) {
        const raw = getArtistPreviewImage(a.slug);
        if (!raw) continue;
        if (raw.type === "iframe") {
          // Warm the proxy HTML response + each known sub-resource
          // (script.js / style.css) so the first hover doesn't pay
          // for the full fetch chain. `no-cors` returns an opaque
          // body — fine, we only need the bytes in the HTTP cache.
          // The fetch handles HTTP cache; the offscreen <iframe>
          // mounted below this effect handles V8 bytecode cache by
          // actually executing the bundle once before any hover.
          if (!seen.has(raw.src)) {
            seen.add(raw.src);
            fetch(raw.src).catch(() => {});
          }
          for (const url of getIframePreloadResources(a.slug)) {
            if (seen.has(url)) continue;
            seen.add(url);
            fetch(url, { mode: "no-cors" }).catch(() => {});
          }
          continue;
        }
        if (raw.type === "video") {
          // Hint browser to start fetching the video bytes so first
          // hover doesn't block on metadata.
          if (seen.has(raw.src)) continue;
          seen.add(raw.src);
          const v = document.createElement("video");
          v.src = raw.src;
          v.preload = "auto";
          v.muted = true;
          videoLoaders.push(v);
          // Also preload the poster so the slot doesn't flash black
          // before video bytes arrive.
          if (raw.poster && !seen.has(raw.poster)) {
            seen.add(raw.poster);
            const pi = new window.Image();
            pi.decoding = "async";
            pi.src = optimizeImageSrc(raw.poster);
            loaders.push(pi);
          }
          continue;
        }
        // Image: preload the same optimised URL the preview will use.
        const src = optimizeImageSrc(raw.src);
        if (seen.has(src)) continue;
        seen.add(src);
        const img = new window.Image();
        img.decoding = "async";
        img.src = src;
        loaders.push(img);
      }
    };
    // Defer to idle so preloads don't compete with first-paint.
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
    const cic = (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
    let handle: number;
    if (ric) handle = ric(kick, { timeout: 1500 });
    else handle = window.setTimeout(kick, 400);
    return () => {
      if (ric && cic) cic(handle);
      else window.clearTimeout(handle);
      loaders.forEach((i) => (i.onload = null));
    };
  }, [artists]);

  const rowVariants = {
    hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: EASE_SLOW },
    },
  };

  return (
    <section className="plot-wrap" onMouseMove={handleMove}>
      {iframePreviews.map((p) => (
        <PersistentIframePreview
          key={p.slug}
          src={p.src}
          aspectHint={p.aspect}
          sizeScale={p.sizeScale}
          visible={hoverArtist?.slug === p.slug}
          cursorX={cursor.x}
          cursorY={cursor.y}
        />
      ))}
      <ArtistHoverPreview
        src={previewSrc}
        type={previewType}
        poster={previewPoster}
        aspectHint={preview?.aspect}
        sizeScale={preview?.sizeScale}
        visible={Boolean(hoverArtist && previewSrc)}
        cursorX={cursor.x}
        cursorY={cursor.y}
      />
      <div className="plot-top">
        <div className="plot-origin">x,y</div>
        <div className="plot-top-cells">
          {Array.from({ length: columns }, (_, i) => {
            const col = i + 1;
            const active = hoverCol === col;
            return (
              <div
                key={col}
                className={`plot-col-label${active ? " plot-col-label--active" : ""}`}
                data-col={col}
              >
                {String(col).padStart(2, "0")}
              </div>
            );
          })}
        </div>
      </div>

      <motion.div
        className="plot-body"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: { staggerChildren: reduced ? 0 : 0.04 },
          },
        }}
      >
        {displayRows.map(({ label, letters, isCollapsed }) => {
          const rowArtists = artists.filter((a) =>
            letters.includes(a.coord.row),
          );
          const maxCol = Math.max(
            columns,
            ...rowArtists.map((a) => a.coord.col),
          );
          // Numeric row uses "1" for the coord readout instead of "#"
          const coordRow = letters[0] === "#" ? "1" : letters[0];
          const cells = Array.from({ length: maxCol }, (_, i) => {
            const col = i + 1;
            const artist = rowArtists.find((a) => a.coord.col === col);
            return { col, artist };
          });

          const rowActive = hoverRow != null && letters.includes(hoverRow);

          return (
            <motion.div
              key={label}
              className={`plot-row${rowActive ? " plot-row--active" : ""}`}
              data-collapsed={isCollapsed || undefined}
              variants={rowVariants}
            >
              <div className="plot-row-label">{label}</div>
              <PlotRowCells scrollable={maxCol > columns}>
                {cells.map(({ col, artist }) => (
                  <PlotCell
                    key={col}
                    col={col}
                    row={coordRow}
                    artist={isCollapsed ? undefined : artist}
                    isColActive={hoverCol === col}
                    isCellActive={hoverCellKey === `${coordRow}-${col}`}
                    onEnter={handleEnter}
                    onLeave={handleLeave}
                  />
                ))}
              </PlotRowCells>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

/** Horizontally-scrollable cell container that flags itself while
    scrolling so :active invert styles can be suppressed (prevents a
    tap flash when the user is actually scrolling). When `scrollable`
    is false the row's cells fit exactly inside the viewport's grid
    width — sub-pixel rounding could otherwise let `overflow-x:auto`
    permit a few-px scroll past empty trailing cells, so the CSS
    drops to `clip` in that case. */
function PlotRowCells({
  children,
  scrollable,
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    el.dataset.scrolling = "true";
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      if (ref.current) ref.current.dataset.scrolling = "false";
    }, 220);
  };

  return (
    <div
      ref={ref}
      className="plot-row-cells"
      data-scrollable={scrollable || undefined}
      onScroll={onScroll}
    >
      {children}
    </div>
  );
}
