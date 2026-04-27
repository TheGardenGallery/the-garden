import Image from "next/image";
import { TransitionLink } from "./TransitionLink";
import type { CSSProperties } from "react";
import type { Exhibition } from "@/lib/types";

type ExhibitionRowProps = {
  exhibition: Exhibition;
  variant?: "card" | "featured";
};

export function ExhibitionRow({ exhibition, variant = "card" }: ExhibitionRowProps) {
  const href = `/exhibitions/${exhibition.slug}`;
  const image =
    exhibition.cardImage ?? exhibition.hero ?? exhibition.works?.[0]?.image;
  const imageStyle: CSSProperties = {
    // Shared-element transition: pairs this card image with the
    // exhibition detail page's hero under the same name, so
    // navigating looks like the card image morphing into place.
    viewTransitionName: `ex-hero-${exhibition.slug}`,
  };
  if (exhibition.listImageScale) {
    (imageStyle as CSSProperties & { "--img-scale"?: number })[
      "--img-scale"
    ] = exhibition.listImageScale;
  }
  const classes = ["exhibition-row"];
  if (variant === "featured") classes.push("featured");
  if (exhibition.disableListHoverZoom) classes.push("no-hover-zoom");
  const className = classes.join(" ");

  return (
    <TransitionLink href={href} className={className} aria-label={`${exhibition.artistName}, ${exhibition.title}`}>
      <div className="row-image" style={imageStyle}>
        {image && (
          <Image
            src={image}
            alt={`${exhibition.artistName}, ${exhibition.title}`}
            width={1600}
            height={variant === "featured" ? 1067 : 1125}
          />
        )}
      </div>
      <div className="row-body">
        <div className="row-headline">
          <div className="row-artist">{exhibition.artistName}</div>
          <div className="row-title">{exhibition.title}</div>
        </div>
        {variant === "featured" ? (
          <div className="row-meta-right">
            <div className="row-dates">{exhibition.date}</div>
            {exhibition.location && <div className="row-location">{exhibition.location}</div>}
          </div>
        ) : (
          <div className="row-meta">
            {exhibition.date}
            {exhibition.location ? ` · ${exhibition.location}` : ""}
          </div>
        )}
      </div>
    </TransitionLink>
  );
}
