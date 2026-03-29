import { Mail, MapPin, MessageSquareText, Send } from "lucide-react";
import { notFound } from "next/navigation";

import { getChapterPublicContext } from "../../../lib/chapter-public";

type PageParams = Promise<{ chapterSlug: string }>;

const chapterContactTopics = [
  "Local Chapter Membership",
  "Coaching Directory",
  "Events and Workshops",
  "Partnerships",
  "General Inquiry",
];

export default async function ChapterContactPage({
  params,
}: {
  params: PageParams;
}) {
  const { chapterSlug } = await params;
  const context = await getChapterPublicContext(chapterSlug);

  if (!context) {
    notFound();
  }

  const { chapter, contactContent } = context;

  return (
    <main className="pt-24">
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-[#f7f8fb] px-6 pb-24 pt-16">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.15),transparent_30%),radial-gradient(circle_at_top_right,rgba(20,184,166,0.12),transparent_28%)]"
        />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-14 max-w-4xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.24em] text-blue-600">
              {chapter.name} Contact
            </p>
            <h1 className="mb-6 text-5xl font-bold leading-[0.94] text-slate-900 md:text-7xl">
              {contactContent.heroTitle}
            </h1>
            <p className="max-w-3xl text-xl leading-relaxed text-slate-600">
              {contactContent.heroSubtitle}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="rounded-[2.25rem] border border-slate-200 bg-white p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)] md:p-10">
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 text-white">
                  <MessageSquareText className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-600">
                    Send A Message
                  </p>
                  <h2 className="text-3xl font-bold text-slate-900">
                    {contactContent.formTitle}
                  </h2>
                  <p className="mt-2 max-w-2xl text-slate-600">
                    {contactContent.formBody}
                  </p>
                </div>
              </div>

              <form className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      First Name *
                    </span>
                    <input
                      type="text"
                      name="firstName"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
                      placeholder="First"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Last Name *
                    </span>
                    <input
                      type="text"
                      name="lastName"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
                      placeholder="Last"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    E-mail *
                  </span>
                  <input
                    type="email"
                    name="email"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
                    placeholder="you@example.com"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Topic *
                  </span>
                  <select
                    name="topic"
                    defaultValue=""
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
                  >
                    <option value="" disabled>
                      Choose
                    </option>
                    {chapterContactTopics.map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Comment or Question *
                  </span>
                  <textarea
                    name="comment"
                    rows={6}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
                    placeholder={`Tell ${chapter.name} how they can help.`}
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-8 py-4 font-semibold text-white transition hover:bg-blue-600"
                >
                  Submit
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </section>

            <aside className="space-y-6">
              <div className="overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-slate-950 via-blue-950 to-teal-900 p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
                <div className="space-y-5">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-cyan-200" />
                      <h3 className="text-lg font-bold">Chapter Territory</h3>
                    </div>
                    <p className="leading-relaxed text-slate-200">
                      {chapter.country}
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <Mail className="h-5 w-5 text-cyan-200" />
                      <h3 className="text-lg font-bold">{contactContent.contactTitle}</h3>
                    </div>
                    <p className="mb-3 leading-relaxed text-slate-200">
                      {contactContent.contactBody}
                    </p>
                    <a
                      href={`mailto:${contactContent.contactEmail}`}
                      className="text-lg text-cyan-200 underline-offset-4 hover:underline"
                    >
                      {contactContent.contactEmail}
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-[2.25rem] border border-slate-200 bg-white p-8 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
                <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-blue-600">
                  Local Focus
                </p>
                <h3 className="mb-4 text-3xl font-bold text-slate-900">
                  Why this contact page scales
                </h3>
                <p className="leading-relaxed text-slate-600">
                  Every future chapter slug can use this same route while
                  loading its own chapter details, contact email, and local
                  messaging from the database.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
