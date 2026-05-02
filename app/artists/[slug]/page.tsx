import { notFound } from "next/navigation";
import { fetchArtists, fetchExhibitions } from "@/lib/verse-api";
import { ArtistReveal } from "@/components/ArtistReveal";

export async function generateStaticParams() {
  const artists = await fetchArtists();
  return artists.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artists = await fetchArtists();
  const artist = artists.find((a) => a.slug === slug);
  return {
    title: artist ? `${artist.name} | The Garden` : "Not found | The Garden",
  };
}

export default async function ArtistDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [artists, exhibitions] = await Promise.all([
    fetchArtists(),
    fetchExhibitions(),
  ]);
  const artist = artists.find((a) => a.slug === slug);
  if (!artist) notFound();

  const paragraphs =
    artist.bio
      ?.split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean) ?? [];

  if (paragraphs.length === 0) {
    return (
      <div className="coming-soon">
        <div className="coming-soon-inner">
          <div className="artist-page-name">{artist.name}</div>
          <div className="artist-page-coord">
            {artist.coord.row},{String(artist.coord.col).padStart(2, "0")}
          </div>
          <div className="coming-soon-title">Artist page — coming soon.</div>
        </div>
      </div>
    );
  }

  // Showcase exhibition for the right-side artwork reveal — prefer
  // upcoming, then current, then most recent past.
  const artistExhibitions = exhibitions.filter(
    (e) => e.artistSlug === artist.slug
  );
  const showcase =
    artistExhibitions.find((e) => e.status === "upcoming") ??
    artistExhibitions.find((e) => e.status === "current") ??
    artistExhibitions[0];

  // The reveal page picks up the showcase exhibition's hero theme
  // (paper vs dark) so the page surface matches the artwork's native
  // setting. Paper is the house default — only flip to dark when the
  // exhibition explicitly opts in (Ricky's Split Logic).
  const theme = showcase?.heroTheme === "dark" ? "dark" : "paper";

  // Showcase media priority: live iframe > video > still image. Live
  // generative pieces (e.g. VES3L's Solve-Un-Solve, John Provencher's
  // over-time) take precedence over a static rendering since the
  // live work IS the artwork. Artist-record overrides win over the
  // showcase exhibition's defaults — lets us pick a different work
  // for the artist page (e.g. Yoshi's *The Flood: Orchestrated*
  // video, distinct from his exhibition hero).
  const showcaseIframe =
    artist.showcaseIframe ?? showcase?.heroIframe;
  const showcaseVideo =
    showcaseIframe ? undefined : artist.showcaseVideo ?? showcase?.heroVideo;
  const showcaseImage =
    showcaseIframe || showcaseVideo
      ? undefined
      : artist.showcaseImage ?? showcase?.hero;

  return (
    <ArtistReveal
      artistSlug={artist.slug}
      artistName={artist.name}
      paragraphs={paragraphs}
      socials={artist.socials}
      showcaseHref={showcase ? `/exhibitions/${showcase.slug}` : undefined}
      showcaseTitle={showcase?.title}
      showcaseYear={showcase?.year}
      showcaseAriaLabel={showcase ? `View ${showcase.title}` : undefined}
      showcaseVideo={showcaseVideo}
      showcaseImage={showcaseImage}
      showcasePoster={
        artist.showcaseVideoPoster ?? showcase?.heroVideoPoster
      }
      showcaseIframe={showcaseIframe}
      showcaseIframeAspect={
        artist.showcaseIframeAspect ?? showcase?.heroIframeAspect
      }
      // No randomize on the artist page — keeps the iframe SSR-rendered
      // so the browser starts fetching the bundle during HTML parse
      // instead of after hydration. Saves ~200-500ms on first paint.
      // Per-visit re-rolls still happen on the exhibition detail page.
      showcaseIframeRandomize={false}
      theme={theme}
    />
  );
}
