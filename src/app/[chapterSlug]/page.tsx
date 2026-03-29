import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Globe2, Mail, MapPin, Users } from "lucide-react";

import { getChapterBySlug } from "../../lib/db/chapters";
import { listPublishedCoachesByChapter } from "../../lib/db/coaches";
import { listEventsByChapter } from "../../lib/db/events";
import {
  getDefaultChapterHomepageContent,
  getPublishedManagedPageByChapterAndKey,
  parseChapterHomepageContent,
} from "../../lib/db/pages";

type PageParams = Promise<{ chapterSlug: string }>;

export default async function ChapterPublicPage({
  params,
}: {
  params: PageParams;
}) {
  const { chapterSlug } = await params;
  const chapter = await getChapterBySlug(chapterSlug);

  if (!chapter || chapter.status !== "active") {
    notFound();
  }

  const homepage = await getPublishedManagedPageByChapterAndKey(
    chapter.id,
    "chapter_home",
  );

  if (!homepage) {
    notFound();
  }

  const defaultContent = getDefaultChapterHomepageContent({
    chapterName: chapter.name,
    country: chapter.country,
    contactEmail: chapter.contactEmail,
  });
  const content = parseChapterHomepageContent(homepage.contentJson, defaultContent);
  const coaches = await listPublishedCoachesByChapter(chapter.id);
  const events = await listEventsByChapter(chapter.id);

  return (
    <main className="pt-24">
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white px-6 pb-20 pt-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.12),transparent_28%)]" />
          <div className="relative mx-auto max-w-7xl">
            <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <p className="mb-4 text-sm font-medium uppercase tracking-[0.22em] text-blue-600">
                  {chapter.name}
                </p>
                <h1 className="mb-6 text-5xl font-bold leading-tight text-gray-900 md:text-7xl">
                  {content.heroTitle}
                </h1>
                <p className="max-w-3xl text-xl leading-relaxed text-gray-600">
                  {content.heroSubtitle}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={`/${chapter.slug}/contact`}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
                  >
                    Contact This Chapter
                    <Mail className="h-5 w-5" />
                  </Link>
                  <Link
                    href="/chapters"
                    className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 bg-white px-8 py-4 font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Explore All Chapters
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-[#f7f8fb] p-5">
                    <MapPin className="mb-3 h-6 w-6 text-blue-600" />
                    <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
                      Country
                    </p>
                    <p className="mt-2 text-lg font-bold text-slate-900">
                      {chapter.country}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-[#f7f8fb] p-5">
                    <Globe2 className="mb-3 h-6 w-6 text-teal-600" />
                    <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
                      Language
                    </p>
                    <p className="mt-2 text-lg font-bold text-slate-900">
                      {chapter.primaryLanguage.toUpperCase()}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-[#f7f8fb] p-5">
                    <Users className="mb-3 h-6 w-6 text-orange-500" />
                    <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
                      Published Coaches
                    </p>
                    <p className="mt-2 text-lg font-bold text-slate-900">
                      {coaches.length}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-[#f7f8fb] p-5">
                    <Mail className="mb-3 h-6 w-6 text-blue-600" />
                    <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
                      Contact
                    </p>
                    <p className="mt-2 break-words text-lg font-bold text-slate-900">
                      {content.contactEmail}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f7f8fb] px-6 py-24">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-blue-600">
                Chapter Mission
              </p>
              <h2 className="mb-4 text-3xl font-bold text-slate-900">
                {content.missionTitle}
              </h2>
              <p className="leading-relaxed text-slate-600">
                {content.missionBody}
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-teal-600">
                Local Impact
              </p>
              <h2 className="mb-4 text-3xl font-bold text-slate-900">
                {content.impactTitle}
              </h2>
              <p className="leading-relaxed text-slate-600">
                {content.impactBody}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.22em] text-blue-600">
                Focus Areas
              </p>
              <h2 className="text-4xl font-bold text-slate-900 md:text-5xl">
                What This Chapter Is Building
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {content.focusAreas.map((area) => (
                <div
                  key={area}
                  className="rounded-[1.5rem] border border-slate-200 bg-[#f7f8fb] p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)]"
                >
                  <p className="text-lg font-semibold text-slate-900">{area}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f7f8fb] px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="mb-4 text-sm font-medium uppercase tracking-[0.22em] text-teal-600">
                  Local Coaches
                </p>
                <h2 className="text-4xl font-bold text-slate-900 md:text-5xl">
                  Meet Coaches In {chapter.country}
                </h2>
              </div>
              <p className="max-w-2xl text-slate-600">
                Published chapter coaches automatically appear here so each local
                chapter page stays connected to the shared WIAL coach network.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {coaches.length > 0 ? (
                coaches.map((coach) => (
                  <div
                    key={coach.id}
                    className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.08)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">
                          {coach.name}
                        </h3>
                        <p className="mt-1 text-slate-600">
                          {coach.location ?? chapter.country}
                        </p>
                      </div>
                      <span className="rounded-full bg-[#f7f8fb] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-teal-600">
                        {coach.certificationLevel}
                      </span>
                    </div>

                    <p className="mt-4 leading-relaxed text-slate-600">
                      {coach.bio ?? "Coach profile details will appear here soon."}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {coach.languages.map((language) => (
                        <span
                          key={`${coach.id}-${language}`}
                          className="rounded-full bg-[#f7f8fb] px-3 py-2 text-sm text-slate-700"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 text-slate-600 shadow-[0_12px_35px_rgba(15,23,42,0.08)] lg:col-span-2">
                  This chapter site is live, but no published coaches are attached yet.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="mb-4 text-sm font-medium uppercase tracking-[0.22em] text-orange-500">
                  Chapter Events
                </p>
                <h2 className="text-4xl font-bold text-slate-900 md:text-5xl">
                  Upcoming Chapter Events
                </h2>
              </div>
              <p className="max-w-2xl text-slate-600">
                Events added by the chapter lead appear here and can support the
                chapter&apos;s local visibility and programming.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {events.length > 0 ? (
                events.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-[1.5rem] border border-slate-200 bg-[#f7f8fb] p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">
                          {event.title}
                        </h3>
                        <p className="mt-2 text-slate-600">
                          {new Date(event.startDate).toLocaleString()}
                        </p>
                        {event.location ? (
                          <p className="mt-1 text-slate-600">{event.location}</p>
                        ) : null}
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-orange-500">
                        {event.isGlobalVisible ? "Global" : "Local"}
                      </span>
                    </div>

                    {event.description ? (
                      <p className="mt-4 leading-relaxed text-slate-600">
                        {event.description}
                      </p>
                    ) : null}
                  </div>
                ))
              ) : (
                <div className="rounded-[1.5rem] border border-slate-200 bg-[#f7f8fb] p-6 text-slate-600 shadow-[0_12px_35px_rgba(15,23,42,0.06)] lg:col-span-2">
                  No chapter events have been published yet.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-24">
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 p-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.22em] text-blue-200">
              {content.contactTitle}
            </p>
            <h2 className="mb-4 text-4xl font-bold">
              Connect With {chapter.name}
            </h2>
            <p className="max-w-3xl text-lg leading-relaxed text-slate-200">
              {content.contactBody}
            </p>

            <div className="mt-8">
              <Link
                href={`mailto:${content.contactEmail}`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Email This Chapter
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
  );
}
