import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/**
 * Link primitives.
 *
 * ContentLink — underlined content-area link (prose, metadata, captions).
 *   Uses the prototype's `.link` class pattern.
 *
 * CtaLink — italic Cormorant + arrow, like "Explore now →" or "View all →".
 *   Used for terminal / call-to-action links at the end of a block.
 *
 * For navigation chrome (nav-links, footer links, reveal-on-hover underline)
 * use the feature-level Nav/Footer components — those aren't DS primitives,
 * they're singleton chrome.
 */

type NextLinkProps = ComponentProps<typeof Link>;

export function ContentLink({
  children,
  className = "",
  ...rest
}: NextLinkProps & { children: ReactNode }) {
  return (
    <Link className={`link ${className}`.trim()} {...rest}>
      {children}
    </Link>
  );
}

type CtaTone = "ink" | "on-dark";

export function CtaLink({
  children,
  arrow = "→",
  tone = "ink",
  className = "",
  ...rest
}: NextLinkProps & {
  children: ReactNode;
  arrow?: string;
  tone?: CtaTone;
}) {
  const toneClass = tone === "on-dark" ? "ds-cta--on-dark" : "";
  return (
    <Link className={`ds-cta ${toneClass} ${className}`.trim()} {...rest}>
      <span className="ds-cta-label">{children}</span>
      <span className="ds-cta-arrow" aria-hidden="true">
        {arrow}
      </span>
    </Link>
  );
}
