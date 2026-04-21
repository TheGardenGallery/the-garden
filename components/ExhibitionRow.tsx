import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import type { Exhibition } from "@/lib/types";

type ExhibitionRowProps = {
  exhibition: Exhibition;
  variant?: "card" | "featured";
};

export function ExhibitionRow({ exhibition, variant = "card" }: ExhibitionRowProps) {
  const href = `/exhibitions/${exhibition.slug}`;
  const image = exhibition.hero ?? exhibition.works?.[0]?.image;
  const imageStyle = exhibition.listImageScale
    ? ({ "--img-scale": exhibition.listImageScale } as CSSProperties)
    : undefined;
  const classes = ["exhibition-row"];
  if (variant === "featured") classes.push("featured");
  if (exhibition.disableListHoverZoom) classes.push("no-hover-zoom");
  const className = classes.join(" ");

  return (
    <Link href={href} className={className} aria-label={`${exhibition.artistName}, ${exhibition.title}`}>
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
    </Link>
  );
}
