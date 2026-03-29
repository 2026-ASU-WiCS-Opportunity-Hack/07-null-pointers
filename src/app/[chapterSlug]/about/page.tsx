import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Globe2, MapPin, Sparkles } from "lucide-react";

import { getChapterPublicContext } from "../../../lib/chapter-public";

type PageParams = Promise<{ chapterSlug: string }>;

export default async function ChapterAboutPage({
  params,
}: {
  params: PageParams;
}) {
  const { chapterSlug } = await params;
  const context = await getChapterPublicContext(chapterSlug);

  if (!context) {
    notFound();
  }

  const { chapter, aboutContent } = context;

  return (
    <main className="pt-24">
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white px-6 pb-24 pt-16">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.15),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.12),transparent_30%)]"
        />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.24em] text-blue-600">
                About {chapter.name}
              </p>
              <h1 className="max-w-4xl text-5xl font-bold leading-[0.95] text-slate-900 md:text-7xl">
                {aboutContent.heroTitle}
              </h1>
              <p className="mt-6 max-w-3xl text-xl leading-relaxed text-slate-600">
                {aboutContent.heroSubtitle}
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#f7f8fb] p-5">
                  <MapPin className="mb-3 h-6 w-6 text-blue-600" />
                  <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
                    Country
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {chapter.country}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#f7f8fb] p-5">
                  <Globe2 className="mb-3 h-6 w-6 text-teal-600" />
                  <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
                    Chapter Route
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    /{chapter.slug}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f8fb] px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_15px_45px_rgba(15,23,42,0.08)]">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-blue-600">
              Mission
            </p>
              <h2 className="mb-4 text-3xl font-bold text-slate-900">
                {aboutContent.missionTitle}
              </h2>
              <p className="leading-relaxed text-slate-600">
                {aboutContent.missionBody}
              </p>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_15px_45px_rgba(15,23,42,0.08)]">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-teal-600">
              Local Impact
            </p>
              <h2 className="mb-4 text-3xl font-bold text-slate-900">
                {aboutContent.impactTitle}
              </h2>
              <p className="leading-relaxed text-slate-600">
                {aboutContent.impactBody}
              </p>
          </article>
        </div>
      </section>

      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.22em] text-orange-500">
                Focus Areas
              </p>
              <h2 className="text-4xl font-bold text-slate-900 md:text-5xl">
                What {chapter.name} is building locally
              </h2>
            </div>
            <p className="max-w-2xl text-slate-600">
              Every chapter keeps the same WIAL brand foundation, but the local
              work adapts to the country, community, and leadership needs it serves.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {aboutContent.focusAreas.map((area) => (
              <div
                key={area}
                className="rounded-[1.5rem] border border-slate-200 bg-[#f7f8fb] p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)]"
              >
                <Sparkles className="mb-4 h-5 w-5 text-orange-500" />
                <p className="text-lg font-semibold text-slate-900">{area}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 pb-24">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-gradient-to-r from-slate-900 via-blue-950 to-teal-950 p-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.22em] text-blue-200">
            Next Step
          </p>
          <h2 className="mb-4 text-4xl font-bold">
            {aboutContent.ctaTitle}
          </h2>
          <p className="max-w-3xl text-lg leading-relaxed text-slate-200">
            {aboutContent.ctaBody}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={`/${chapter.slug}/directory`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              View Local Directory
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href={`/${chapter.slug}/events`}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white transition hover:bg-white/15"
            >
              View Chapter Events
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
