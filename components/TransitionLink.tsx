"use client";

import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";

type TransitionLinkProps = Omit<LinkProps, "onClick"> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    children: ReactNode;
  };

/**
 * Wraps next/link and drives same-origin client-side navigations
 * through `document.startViewTransition`, so the browser crossfades
 * the old and new page states instead of hard-cutting.
 *
 * Falls back to a normal Link click for: modifier/middle clicks
 * (new tab), preventDefault-ed clicks, and browsers without View
 * Transitions support. No visible difference on those paths.
 */
export const TransitionLink = forwardRef<
  HTMLAnchorElement,
  TransitionLinkProps
>(function TransitionLink({ href, onClick, children, ...props }, ref) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    if (
      typeof document === "undefined" ||
      typeof (document as Document & { startViewTransition?: unknown })
        .startViewTransition !== "function"
    ) {
      return;
    }
    e.preventDefault();
    (
      document as Document & {
        startViewTransition: (cb: () => void) => void;
      }
    ).startViewTransition(() => router.push(href.toString()));
  };

  return (
    <Link ref={ref} href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
});
