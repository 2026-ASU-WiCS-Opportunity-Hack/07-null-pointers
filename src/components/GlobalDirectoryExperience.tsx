"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { Globe2, Mail, MapPin, Search, Users } from "lucide-react";

import type { CoachWithChapter } from "../lib/db/coaches";
import {
  CERTIFICATION_LEVELS,
  type CertificationLevel,
} from "../types/domain";

function matchesCoach(coach: CoachWithChapter, query: string) {
  if (!query) {
    return true;
  }

  const haystack = [
    coach.name,
    coach.chapterName,
    coach.chapterSlug,
    coach.location ?? "",
    coach.bio ?? "",
    coach.contactEmail ?? "",
    ...coach.languages,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

export function GlobalDirectoryExperience({
  coaches,
}: {
  coaches: CoachWithChapter[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [certificationFilter, setCertificationFilter] = useState<
    "all" | CertificationLevel
  >("all");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const normalizedQuery = deferredSearchTerm.trim().toLowerCase();
  const filteredCoaches = coaches.filter((coach) => {
    const queryMatch = matchesCoach(coach, normalizedQuery);
    const certificationMatch =
      certificationFilter === "all" ||
      coach.certificationLevel === certificationFilter;

    return queryMatch && certificationMatch;
  });

  return (
    <main className="pt-24">
      <section className="bg-gradient-to-b from-blue-50 via-white to-white px-6 pb-20 pt-16">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.24em] text-blue-600">
            Global Directory
          </p>
          <h1 className="max-w-4xl text-5xl font-bold leading-[0.95] text-slate-900 md:text-7xl">
            Discover coaches across the global WIAL network
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-relaxed text-slate-600">
            This directory shows approved, published coaches from every active
            chapter. Chapter directories stay local, while this page brings the
            whole network together.
          </p>

          <div className="mt-10 max-w-3xl rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
            <label className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Search className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Search Global Coaches
                </div>
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by name, chapter, language, location..."
                  className="mt-1 w-full border-0 bg-transparent p-0 text-base text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </label>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
              <Users className="mb-4 h-6 w-6 text-blue-600" />
              <div className="text-3xl font-bold text-slate-900">
                {filteredCoaches.length}
              </div>
              <p className="mt-2 text-slate-600">
                {normalizedQuery ? "Matching coaches" : "Published coaches"}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-teal-100 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
              <Globe2 className="mb-4 h-6 w-6 text-teal-600" />
              <div className="text-3xl font-bold text-slate-900">
                {new Set(filteredCoaches.map((coach) => coach.chapterSlug)).size}
              </div>
              <p className="mt-2 text-slate-600">Visible chapters</p>
            </div>
            <div className="rounded-[1.5rem] border border-orange-100 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
              <MapPin className="mb-4 h-6 w-6 text-orange-500" />
              <div className="text-3xl font-bold text-slate-900">
                {new Set(filteredCoaches.map((coach) => coach.location ?? coach.chapterName)).size}
              </div>
              <p className="mt-2 text-slate-600">Locations in view</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f8fb] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex w-fit items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 text-slate-700 shadow-sm">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="font-medium">
                {filteredCoaches.length} published coach
                {filteredCoaches.length === 1 ? "" : "es"}
              </span>
            </div>

            <label className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
              <span className="font-medium text-slate-500">Certification</span>
              <select
                value={certificationFilter}
                onChange={(event) =>
                  setCertificationFilter(
                    event.target.value as "all" | CertificationLevel,
                  )
                }
                className="bg-transparent font-semibold text-slate-900 outline-none"
              >
                <option value="all">All levels</option>
                {CERTIFICATION_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {filteredCoaches.length > 0 ? (
              filteredCoaches.map((coach) => (
                <article
                  key={coach.id}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_15px_45px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        {coach.name}
                      </h2>
                      <p className="mt-2 text-slate-600">
                        {coach.chapterName} · /{coach.chapterSlug}
                      </p>
                    </div>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                      {coach.certificationLevel}
                    </span>
                  </div>

                  <p className="mt-5 leading-relaxed text-slate-600">
                    {coach.bio ?? "Coach profile details will appear here soon."}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {coach.languages.map((language) => (
                      <span
                        key={`${coach.id}-${language}`}
                        className="rounded-full bg-[#f7f8fb] px-3 py-2 text-sm text-slate-700"
                      >
                        {language}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      {coach.location ?? coach.chapterName}
                    </span>
                    {coach.contactEmail ? (
                      <a
                        href={`mailto:${coach.contactEmail}`}
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                      >
                        <Mail className="h-4 w-4" />
                        {coach.contactEmail}
                      </a>
                    ) : null}
                    <Link
                      href={`/${coach.chapterSlug}/directory`}
                      className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-800"
                    >
                      View chapter directory
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 text-slate-600 shadow-[0_15px_45px_rgba(15,23,42,0.06)] lg:col-span-2">
                {normalizedQuery
                  ? `No coaches matched "${deferredSearchTerm.trim()}".`
                  : "No published coaches are available in the global directory yet."}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
