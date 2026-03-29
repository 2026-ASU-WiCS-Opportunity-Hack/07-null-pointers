import { notFound } from "next/navigation";
import { CalendarDays, Globe2, MapPin } from "lucide-react";

import { getChapterPublicContext } from "../../../lib/chapter-public";
import { listEventsByChapter } from "../../../lib/db/events";

type PageParams = Promise<{ chapterSlug: string }>;

function formatChapterEventDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(date));
}

export default async function ChapterEventsPage({
  params,
}: {
  params: PageParams;
}) {
  const { chapterSlug } = await params;
  const context = await getChapterPublicContext(chapterSlug);

  if (!context) {
    notFound();
  }

  const { chapter } = context;
  const events = await listEventsByChapter(chapter.id);

  return (
    <main className="pt-24">
      <section className="bg-gradient-to-b from-blue-50 via-white to-white px-6 pb-20 pt-16">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.24em] text-orange-500">
            {chapter.name} Events
          </p>
          <h1 className="max-w-4xl text-5xl font-bold leading-[0.95] text-slate-900 md:text-7xl">
            Events designed for local momentum in {chapter.country}
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-relaxed text-slate-600">
            This chapter events page scales naturally by chapter slug, so every
            future chapter can have the same structure with its own records.
          </p>
        </div>
      </section>

      <section className="bg-[#f7f8fb] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
              <CalendarDays className="mb-4 h-6 w-6 text-blue-600" />
              <div className="text-3xl font-bold text-slate-900">{events.length}</div>
              <p className="mt-2 text-slate-600">Chapter events</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
              <Globe2 className="mb-4 h-6 w-6 text-teal-600" />
              <div className="text-3xl font-bold text-slate-900">
                {events.filter((event) => event.isGlobalVisible).length}
              </div>
              <p className="mt-2 text-slate-600">Also visible globally</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
              <MapPin className="mb-4 h-6 w-6 text-orange-500" />
              <div className="text-3xl font-bold text-slate-900">{chapter.country}</div>
              <p className="mt-2 text-slate-600">Local market</p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {events.length > 0 ? (
              events.map((event) => (
                <article
                  key={event.id}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_15px_45px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        {event.title}
                      </h2>
                      <p className="mt-2 text-slate-600">
                        {formatChapterEventDate(event.startDate)}
                      </p>
                      {event.location ? (
                        <p className="mt-1 text-slate-600">{event.location}</p>
                      ) : null}
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                        event.isGlobalVisible
                          ? "bg-blue-50 text-blue-600"
                          : "bg-orange-50 text-orange-500"
                      }`}
                    >
                      {event.isGlobalVisible ? "Global + Local" : "Local"}
                    </span>
                  </div>

                  {event.description ? (
                    <p className="mt-5 leading-relaxed text-slate-600">
                      {event.description}
                    </p>
                  ) : null}
                </article>
              ))
            ) : (
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 text-slate-600 shadow-[0_15px_45px_rgba(15,23,42,0.06)] lg:col-span-2">
                No chapter events are available yet for this site.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
