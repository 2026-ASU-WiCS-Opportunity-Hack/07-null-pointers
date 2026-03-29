import { ArrowRight, Users, MapPin } from "lucide-react";
import Link from "next/link";

interface ChapterCardData {
  id: string;
  name: string;
  slug: string;
  country: string;
  summary: string;
  coachCount: number;
  hasPublishedSite: boolean;
}

interface ChaptersProps {
  chapters: ChapterCardData[];
}

export function Chapters({ chapters }: ChaptersProps) {
  return (
    <section
      id="chapters"
      className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Global Chapters
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our worldwide network of action learning communities,
            each bringing unique perspectives and local expertise
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-blue-300 hover:-translate-y-2"
            >
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 text-lg font-bold uppercase">
                {chapter.slug.slice(0, 2)}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {chapter.name}
              </h3>

              <p className="text-gray-600 mb-6 leading-relaxed min-h-[60px]">
                {chapter.summary}
              </p>

              <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{chapter.coachCount} Coaches</span>
                </div>

                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{chapter.country}</span>
                </div>
              </div>

              <div className="mb-4">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                    chapter.hasPublishedSite
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {chapter.hasPublishedSite ? "Live" : "In Setup"}
                </span>
              </div>

              {chapter.hasPublishedSite ? (
                <Link
                  href={`/${chapter.slug}`}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold group-hover:bg-blue-600 transition-colors"
                >
                  View Chapter
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-500 rounded-xl font-semibold cursor-not-allowed"
                >
                  Website In Setup
                </button>
              )}
            </div>
          ))}
        </div>

        {chapters.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-gray-200 bg-white px-8 py-10 text-center text-gray-600">
            No active chapters have been added yet.
          </div>
        ) : null}

      </div>
    </section>
  );
}
