import { notFound } from "next/navigation";
import { fetchExhibition, fetchExhibitions } from "@/lib/verse-api";
import {
  DEFAULT_EXHIBITION_MODULES,
  ExhibitionModuleRenderer,
} from "@/components/ExhibitionModuleRenderer";

export async function generateStaticParams() {
  const all = await fetchExhibitions();
  return all.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ex = await fetchExhibition(slug);
  if (!ex) return { title: "Not found | The Garden" };
  return { title: `${ex.title} · ${ex.artistName} | The Garden` };
}

export default async function ExhibitionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const exhibition = await fetchExhibition(slug);
  if (!exhibition) notFound();

  // The page is a sequence of modules. Most exhibitions ride the
  // default order; shows that warrant a bespoke moment override
  // `exhibition.modules` to insert custom components or reorder rooms.
  // The frame (nav, footer, paper baseline, type stack) is constant.
  const modules = exhibition.modules ?? DEFAULT_EXHIBITION_MODULES;

  return (
    <div className="exhibition-detail" data-slug={exhibition.slug}>
      {/* Kick off the hero video fetch during HTML parse so the browser
          starts buffering before React hydrates the <video>. Without
          this, autoplay begins with an empty buffer on slow connections
          and the first seconds stutter. */}
      {exhibition.heroVideo && (
        <link
          rel="preload"
          as="video"
          href={exhibition.heroVideo}
          type="video/mp4"
        />
      )}

      {modules.map((module, i) => (
        <ExhibitionModuleRenderer
          key={`${module.kind}-${i}`}
          module={module}
          exhibition={exhibition}
        />
      ))}
    </div>
  );
}
