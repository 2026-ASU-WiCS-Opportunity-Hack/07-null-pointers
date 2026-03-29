"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Globe2,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";

import type { PublicEventWithChapter } from "../lib/db/events";

function formatEventDate(date: string) {
  const value = new Date(date);
  const month = value.toLocaleString("en-US", {
    month: "short",
    timeZone: "UTC",
  });
  const day = value.toLocaleString("en-US", {
    day: "numeric",
    timeZone: "UTC",
  });
  const year = value.toLocaleString("en-US", {
    year: "numeric",
    timeZone: "UTC",
  });
  const time = value.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });

  return `${month} ${day}, ${year} · ${time} UTC`;
}

function getEventMonth(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    timeZone: "UTC",
  }).format(new Date(date));
}

function getEventDay(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    timeZone: "UTC",
  }).format(new Date(date));
}

function matchesEvent(event: PublicEventWithChapter, query: string) {
  if (!query) {
    return true;
  }

  const haystack = [
    event.title,
    event.description ?? "",
    event.chapterName,
    event.chapterCountry,
    event.chapterSlug,
    event.location ?? "",
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

export function EventsExperience({
  events,
}: {
  events: PublicEventWithChapter[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const normalizedQuery = deferredSearchTerm.trim().toLowerCase();

  const filteredEvents = events.filter((event) =>
    matchesEvent(event, normalizedQuery),
  );
  const matchingResults = normalizedQuery ? filteredEvents.slice(0, 6) : [];
  const globalEvents = filteredEvents.filter((event) => event.isGlobalVisible);
  const localEvents = filteredEvents.filter((event) => !event.isGlobalVisible);
  const featuredGlobalEvent = globalEvents[0] ?? null;
  const remainingGlobalEvents = featuredGlobalEvent
    ? globalEvents.slice(1)
    : globalEvents;

  const localEventsByChapter = localEvents.reduce<
    Array<{
      chapterSlug: string;
      chapterName: string;
      chapterCountry: string;
      events: PublicEventWithChapter[];
    }>
  >((groups, event) => {
    const existingGroup = groups.find(
      (group) => group.chapterSlug === event.chapterSlug,
    );

    if (existingGroup) {
      existingGroup.events.push(event);
      return groups;
    }

    groups.push({
      chapterSlug: event.chapterSlug,
      chapterName: event.chapterName,
      chapterCountry: event.chapterCountry,
      events: [event],
    });

    return groups;
  }, []);

  function jumpToEvent(eventId: string) {
    setSelectedEventId(eventId);

    const element = document.getElementById(`event-${eventId}`);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }

  return (
    <main className="bg-white pt-24">
      <section className="overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              WIAL Event Hub
            </div>
            <h1 className="max-w-4xl text-5xl font-bold leading-tight text-slate-900 md:text-6xl">
              Events That Bring{" "}
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Global Learning
              </span>{" "}
              Into Local Action
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600">
              Explore WIAL events across the network. Global sessions create
              shared momentum across regions, while chapter events help local
              communities practice action learning where it matters most.
            </p>

            <div className="mt-8 max-w-2xl rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
              <label className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Search className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Search Events
                  </div>
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Try Meet, India, workshop, leadership..."
                    className="mt-1 w-full border-0 bg-transparent p-0 text-base text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </label>
            </div>

            {normalizedQuery ? (
              <div className="mt-4 max-w-2xl overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.10)]">
                {matchingResults.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {matchingResults.map((event) => (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => jumpToEvent(event.id)}
                        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition hover:bg-blue-50/60"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                                event.isGlobalVisible
                                  ? "bg-blue-50 text-blue-600"
                                  : "bg-orange-50 text-orange-500"
                              }`}
                            >
                              {event.isGlobalVisible ? "Global" : "Local"}
                            </span>
                            <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                              {event.chapterCountry}
                            </span>
                          </div>
                          <div className="mt-2 text-base font-semibold text-slate-900">
                            {event.title}
                          </div>
                          <div className="mt-1 text-sm text-slate-600">
                            {event.chapterName} · {formatEventDate(event.startDate)}
                          </div>
                        </div>
                        <span className="mt-1 text-sm font-medium text-blue-600">
                          View
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-4 text-sm text-slate-600">
                    No matching events found for &quot;{deferredSearchTerm.trim()}&quot;.
                  </div>
                )}
              </div>
            ) : null}

            <div className="mt-4 text-sm text-slate-500">
              {normalizedQuery
                ? `${filteredEvents.length} matching event${filteredEvents.length === 1 ? "" : "s"} for "${deferredSearchTerm.trim()}"`
                : `Showing ${events.length} events from the database`}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="#global-events"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-4 font-semibold text-white transition hover:bg-blue-700"
              >
                Explore Global Events
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="#chapter-events"
                className="inline-flex items-center gap-2 rounded-full border-2 border-slate-200 bg-white px-7 py-4 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Browse Chapter Events
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[1.75rem] border border-blue-100 bg-white p-6 shadow-[0_15px_50px_rgba(59,130,246,0.12)]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Globe2 className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-slate-900">
                {globalEvents.length}
              </div>
              <p className="mt-2 text-slate-600">Global events in this view</p>
            </div>

            <div className="rounded-[1.75rem] border border-teal-100 bg-white p-6 shadow-[0_15px_50px_rgba(20,184,166,0.12)]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-600">
                <CalendarDays className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-slate-900">
                {localEvents.length}
              </div>
              <p className="mt-2 text-slate-600">Local chapter events in view</p>
            </div>

            <div className="rounded-[1.75rem] border border-orange-100 bg-white p-6 shadow-[0_15px_50px_rgba(249,115,22,0.12)]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-slate-900">
                {localEventsByChapter.length}
              </div>
              <p className="mt-2 text-slate-600">Chapters hosting matches</p>
            </div>
          </div>
        </div>
      </section>

      <section id="global-events" className="bg-white px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.22em] text-blue-600">
                Global Events
              </p>
              <h2 className="text-4xl font-bold text-slate-900 md:text-5xl">
                Shared Learning Across the WIAL Network
              </h2>
            </div>
            <p className="max-w-2xl text-slate-600">
              These are the events marked for global visibility in the
              database. They help chapters stay connected to the wider WIAL
              movement while still supporting local practice.
            </p>
          </div>

          {featuredGlobalEvent ? (
            <div className="mb-8 rounded-[2rem] border border-slate-200 bg-gradient-to-r from-slate-900 via-blue-950 to-teal-950 p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)] md:p-10">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <p className="mb-4 text-sm font-medium uppercase tracking-[0.22em] text-blue-200">
                    Featured Global Event
                  </p>
                  <h3
                    id={`event-${featuredGlobalEvent.id}`}
                    className={`text-3xl font-bold scroll-mt-32 md:text-4xl ${
                      selectedEventId === featuredGlobalEvent.id
                        ? "text-blue-200"
                        : ""
                    }`}
                  >
                    {featuredGlobalEvent.title}
                  </h3>
                  <p className="mt-4 text-lg leading-relaxed text-slate-200">
                    {featuredGlobalEvent.description ??
                      "This event is live in the WIAL database and highlighted for network-wide participation."}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3 text-sm">
                    <span className="rounded-full bg-white/10 px-4 py-2 text-slate-100">
                      {formatEventDate(featuredGlobalEvent.startDate)}
                    </span>
                    <span className="rounded-full bg-white/10 px-4 py-2 text-slate-100">
                      {featuredGlobalEvent.chapterName}
                    </span>
                    <span className="rounded-full bg-white/10 px-4 py-2 text-slate-100">
                      /{featuredGlobalEvent.chapterSlug}
                    </span>
                    {featuredGlobalEvent.location ? (
                      <span className="rounded-full bg-white/10 px-4 py-2 text-slate-100">
                        {featuredGlobalEvent.location}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="grid min-w-[13rem] gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
                    Event Reach
                  </span>
                  <div className="text-2xl font-bold">Global Visibility</div>
                  <p className="text-sm leading-relaxed text-slate-300">
                    Visible beyond the chapter site so global visitors can
                    discover and join.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8 rounded-[1.75rem] border border-slate-200 bg-[#f7f8fb] p-8 text-slate-600 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
              {normalizedQuery
                ? "No global events match your search yet."
                : "No global events are currently marked in the database."}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {remainingGlobalEvents.length > 0
              ? remainingGlobalEvents.map((event) => (
                  <article
                    key={event.id}
                    id={`event-${event.id}`}
                    className="group rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)]"
                  >
                    <div
                      className={`rounded-[1.2rem] ${
                        selectedEventId === event.id
                          ? "ring-2 ring-blue-200 ring-offset-2 ring-offset-white"
                          : ""
                      }`}
                    >
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div className="rounded-2xl bg-blue-50 px-4 py-3 text-center">
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                          {getEventMonth(event.startDate)}
                        </div>
                        <div className="text-2xl font-bold text-slate-900">
                          {getEventDay(event.startDate)}
                        </div>
                      </div>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                        Global
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">
                      {event.title}
                    </h3>
                    <p className="mt-3 text-slate-600">
                      {event.description ??
                        "A globally visible WIAL event pulled directly from the live event database."}
                    </p>

                    <div className="mt-5 space-y-2 text-sm text-slate-600">
                      <p>{formatEventDate(event.startDate)}</p>
                      <p>
                        {event.chapterName} · /{event.chapterSlug}
                      </p>
                      {event.location ? <p>{event.location}</p> : null}
                    </div>
                    </div>
                  </article>
                ))
              : null}
          </div>
        </div>
      </section>

      <section id="chapter-events" className="bg-[#f7f8fb] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.22em] text-orange-500">
                Chapter Events
              </p>
              <h2 className="text-4xl font-bold text-slate-900 md:text-5xl">
                Local Programs, Visible by Chapter
              </h2>
            </div>
            <p className="max-w-2xl text-slate-600">
              This section pulls chapter-specific events from the database and
              groups them by chapter, so visitors can discover activity close
              to their own region.
            </p>
          </div>

          <div className="space-y-8">
            {localEventsByChapter.length > 0 ? (
              localEventsByChapter.map((group) => (
                <section
                  key={group.chapterSlug}
                  className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.08)]"
                >
                  <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-orange-500">
                          {group.chapterCountry}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                          /{group.chapterSlug}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {group.chapterName}
                      </h3>
                    </div>

                    <Link
                      href={`/${group.chapterSlug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      Visit Chapter Site
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    {group.events.map((event) => (
                      <article
                        key={event.id}
                        id={`event-${event.id}`}
                        className={`rounded-[1.5rem] border border-slate-200 bg-[#f7f8fb] p-6 transition hover:border-orange-200 ${
                          selectedEventId === event.id
                            ? "ring-2 ring-orange-200 ring-offset-2 ring-offset-white"
                            : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="text-xl font-bold text-slate-900">
                              {event.title}
                            </h4>
                            <p className="mt-2 text-slate-600">
                              {formatEventDate(event.startDate)}
                            </p>
                            {event.location ? (
                              <p className="mt-1 text-slate-600">{event.location}</p>
                            ) : null}
                          </div>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-orange-500">
                            Local
                          </span>
                        </div>

                        <p className="mt-4 leading-relaxed text-slate-600">
                          {event.description ??
                            "This chapter event is available from the live WIAL event database."}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>
              ))
            ) : (
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 text-slate-600 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
                {normalizedQuery
                  ? "No chapter events match your search yet."
                  : "No local chapter events are currently available in the database."}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 p-10 text-white shadow-[0_30px_80px_rgba(37,99,235,0.24)]">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.22em] text-blue-100">
            Keep the Network Moving
          </p>
          <h2 className="mb-4 text-4xl font-bold">
            One Event Hub, Multiple Levels of Impact
          </h2>
          <p className="max-w-3xl text-lg leading-relaxed text-blue-50">
            Global WIAL programming creates shared energy across the network,
            while chapter-led events create meaningful local presence. This
            page now reflects both directly from the database.
          </p>
        </div>
      </section>
    </main>
  );
}
