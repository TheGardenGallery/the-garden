"use client";

import type { CSSProperties, ReactNode } from "react";
import { Fragment } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import type { Exhibition } from "@/lib/types";

type Quote = NonNullable<Exhibition["artistQuote"]>;

/**
 * Artist statement rendered as a word-by-word fade-in — reads as if the
 * artist is writing the words at that moment. Each word is wrapped in a
 * span whose animation-delay increments with its global index across all
 * paragraphs. Triggered on viewport entry. Respects `prefers-reduced-motion`:
 * under that flag the CSS animation is disabled and all words render at
 * full opacity immediately.
 */
export function ArtistQuote({ quote }: { quote: Quote }) {
  const { ref, state } = useScrollReveal<HTMLElement>();

  // Split each paragraph into word spans with a globally-incrementing
  // index so the stagger runs continuously across paragraph breaks.
  let idx = 0;
  const paragraphs = quote.paragraphs.map((html, pi) => {
    const rendered = renderWords(html, idx);
    idx = rendered.nextIdx;
    return <p key={pi}>{rendered.children}</p>;
  });
  const totalWords = idx;

  const style = {
    // Attribution fades in just after the last word starts animating.
    "--attribution-delay": `${totalWords * WORD_STAGGER_MS + 120}ms`,
  } as CSSProperties;

  return (
    <section
      ref={ref}
      className={`ex-artist-quote${state === "visible" ? " is-writing" : ""}`}
      aria-label="Artist statement"
      style={style}
    >
      <div className="ex-artist-quote-inner">
        <blockquote className="ex-artist-quote-body">{paragraphs}</blockquote>
        <figcaption className="ex-artist-quote-attribution">
          {quote.attribution}
        </figcaption>
      </div>
    </section>
  );
}

const WORD_STAGGER_MS = 40;

/** Tokenize an HTML paragraph into a sequence of {word | whitespace | <em>}.
    Each word and each <em>...</em> group becomes one span — so the em
    stays one "word" in the stagger — while whitespace passes through as
    plain text so line-breaks behave naturally. */
function renderWords(
  html: string,
  startIdx: number,
): { children: ReactNode[]; nextIdx: number } {
  const tokens: Array<{ type: "word" | "em" | "space"; value: string }> = [];
  const re = /<em>([^<]*)<\/em>|(\S+)|(\s+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    if (m[1] !== undefined) tokens.push({ type: "em", value: m[1] });
    else if (m[2] !== undefined) tokens.push({ type: "word", value: m[2] });
    else if (m[3] !== undefined) tokens.push({ type: "space", value: m[3] });
  }

  let idx = startIdx;
  const children: ReactNode[] = [];
  tokens.forEach((tok, i) => {
    if (tok.type === "space") {
      children.push(<Fragment key={i}>{tok.value}</Fragment>);
      return;
    }
    const inner: ReactNode =
      tok.type === "em" ? <em>{tok.value}</em> : tok.value;
    children.push(
      <span
        key={i}
        className="ex-artist-quote-word"
        style={{ "--idx": idx } as CSSProperties}
      >
        {inner}
      </span>,
    );
    idx += 1;
  });
  return { children, nextIdx: idx };
}
