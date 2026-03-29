"use client";

import { useState } from "react";
import { Mail, MapPin, Users } from "lucide-react";

import type { CoachProfile, CertificationLevel } from "../types/domain";
import { CERTIFICATION_LEVELS } from "../types/domain";

export function ChapterDirectoryExperience({
  chapterName,
  chapterCountry,
  coaches,
}: {
  chapterName: string;
  chapterCountry: string;
  coaches: CoachProfile[];
}) {
  const [certificationFilter, setCertificationFilter] = useState<
    "all" | CertificationLevel
  >("all");

  const filteredCoaches = coaches.filter(
    (coach) =>
      certificationFilter === "all" ||
      coach.certificationLevel === certificationFilter,
  );

  return (
    <main className="pt-24">
      <section className="bg-gradient-to-b from-blue-50 via-white to-white px-6 pb-20 pt-16">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.24em] text-blue-600">
            {chapterName} Directory
          </p>
          <h1 className="max-w-4xl text-5xl font-bold leading-[0.95] text-slate-900 md:text-7xl">
            Meet certified coaches in {chapterCountry}
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-relaxed text-slate-600">
            This chapter directory is powered by approved coach records connected
            directly to the {chapterName} workspace.
          </p>
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
                        {coach.location ?? chapterCountry}
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
                      {coach.location ?? chapterCountry}
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
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 text-slate-600 shadow-[0_15px_45px_rgba(15,23,42,0.06)] lg:col-span-2">
                No published coaches match this certification filter yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
