import { redirect } from "next/navigation";
import {
  Globe2,
  Users,
  CalendarDays,
  Building2,
  PlusCircle,
} from "lucide-react";

import { getCurrentAppUser } from "../../../lib/auth/current-user";
import { getUserDisplayName } from "../../../lib/auth/display-name";
import { getAdminDashboardData } from "../../../lib/db/admin-dashboard";

function getBannerMessage(params: Record<string, string | string[] | undefined>) {
  if (params.created === "1") {
    const chapter = typeof params.chapter === "string" ? params.chapter : "new chapter";
    const email = typeof params.email === "string" ? params.email : "user";
    const invite = typeof params.invite === "string" ? params.invite : "invited";

    if (invite === "reset_sent") {
      return `Created or updated chapter access for ${email} under ${chapter}. A password setup or reset email was sent from Cognito, and that user can sign in with the same email after completing it.`;
    }

    return `Created or updated chapter access for ${email} under ${chapter}. A Cognito invite email was sent, and that user can sign in with the same email after setting their password.`;
  }

  if (params.error === "missing-fields") {
    return "Please fill in all required chapter and person fields.";
  }

  if (params.error === "invalid-role") {
    return "The selected role is not supported for chapter assignment.";
  }

  if (params.error === "invalid-chapter") {
    return "Please choose a valid existing chapter.";
  }

  if (params.error === "existing-chapter-required") {
    return "Content creators and coaches must be assigned to an existing chapter slug.";
  }

  if (params.error === "chapter-lead-new-only") {
    return "Chapter leads should be created through the new chapter setup flow.";
  }

  if (params.error === "invite-failed") {
    const email = typeof params.email === "string" ? params.email : "that user";
    const detail =
      typeof params.detail === "string"
        ? decodeURIComponent(params.detail)
        : "Cognito invite setup failed.";
    return `Chapter access was saved for ${email}, but the Cognito invite step failed: ${detail}`;
  }

  if (params.review === "approved") {
    const coach = typeof params.coach === "string" ? params.coach : "The coach";

    if (params.invite === "reset_sent") {
      return `${coach} was approved, and a Cognito password setup or reset email was sent so they can sign in as a coach.`;
    }

    if (params.invite === "invited") {
      return `${coach} was approved, and a Cognito invite email was sent so they can sign in as a coach.`;
    }

    if (params.invite === "failed") {
      return `${coach} was approved, but the coach login setup email failed.`;
    }

    return `${coach} was approved successfully.`;
  }

  if (params.review === "denied") {
    const coach = typeof params.coach === "string" ? params.coach : "The coach";

    return `${coach} was denied successfully.`;
  }

  if (params.review === "invalid") {
    return "The requested coach approval action was invalid.";
  }

  if (params.review === "missing") {
    return "That coach approval record could not be found.";
  }

  if (params.review === "failed") {
    return "The coach approval action could not be completed right now. Please try again.";
  }

  return null;
}

function formatRoleLabel(role: string) {
  return role
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const currentUser = await getCurrentAppUser();

  if (!currentUser) {
    redirect("/signin");
  }

  const isAllowed = currentUser.roleAssignments.some(
    (assignment) => assignment.role === "global_admin",
  );

  if (!isAllowed) {
    redirect("/");
  }

  const dashboardData = await getAdminDashboardData();
  const params = await searchParams;
  const bannerMessage = getBannerMessage(params);
  const currentUserDisplayName = getUserDisplayName(currentUser.user);

  return (
    <main className="min-h-screen bg-[#f7f8fb] px-6 py-24">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <p className="text-sm tracking-[0.22em] uppercase text-blue-600 font-medium mb-4">
            Dashboard
          </p>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                Global Admin Dashboard
              </h1>
              <p className="max-w-3xl text-slate-600">
                Signed in as {currentUserDisplayName}. This view now reflects
                the real multi-tenant backend structure: one WIAL platform,
                multiple chapters, and chapter-specific people inside each one.
              </p>
            </div>
            <form action="/auth/logout" method="get">
              <button
                type="submit"
                className="text-blue-600 font-medium hover:text-blue-800"
              >
                Sign out
              </button>
            </form>
          </div>
        </section>

        {bannerMessage ? (
          <section className="rounded-[1.5rem] border border-blue-200 bg-blue-50 px-6 py-4 text-blue-900">
            {bannerMessage}
          </section>
        ) : null}

        <section className="grid gap-5 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {dashboardData.stats.chapterCount}
            </div>
            <p className="mt-2 text-slate-600">Active chapter records</p>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {dashboardData.stats.coachCount}
            </div>
            <p className="mt-2 text-slate-600">Published coach profiles</p>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
              <CalendarDays className="h-6 w-6" />
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {dashboardData.stats.eventCount}
            </div>
            <p className="mt-2 text-slate-600">Seeded chapter events</p>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <PlusCircle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Add Chapter People
                </h2>
                <p className="text-slate-600">
                  Create a new chapter with its chapter lead. This keeps the
                  chapter-launch workflow intact and sends the Cognito setup
                  email to that lead.
                </p>
              </div>
            </div>

            <form
              action="/dashboard/admin/create-access"
              method="post"
              className="grid gap-4"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Chapter name
                  </span>
                  <input
                    name="chapterName"
                    placeholder="WIAL USA"
                    className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Chapter slug
                  </span>
                  <input
                    name="chapterSlug"
                    placeholder="USA"
                    className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Country
                  </span>
                  <input
                    name="country"
                    placeholder="USA"
                    className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Primary language
                  </span>
                  <input
                    name="primaryLanguage"
                    placeholder="en"
                    defaultValue="en"
                    className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                    required
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-700">
                  Chapter contact email
                </span>
                <input
                  name="chapterContactEmail"
                  type="email"
                  placeholder="usaorganization@wial.org"
                  className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                  required
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Person name
                  </span>
                  <input
                    name="personName"
                    placeholder="Chapter lead name"
                    className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Person email
                  </span>
                  <input
                    name="personEmail"
                    type="email"
                    placeholder="lead@example.com"
                    className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                    required
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-700">
                  Role
                </span>
                <select
                  name="role"
                  defaultValue="chapter_lead"
                  className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                >
                  <option value="chapter_lead">Chapter Lead</option>
                </select>
              </label>

              <button
                type="submit"
                className="mt-2 inline-flex w-fit items-center justify-center rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Create chapter access
              </button>
            </form>

            <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-[#f7f8fb] p-5">
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-blue-600">
                Existing Chapters
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Content creators and coaches are assigned separately to an
                existing chapter slug after the chapter lead launches the site.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Assign Existing Chapter Roles
                </h2>
                <p className="text-slate-600">
                  Attach a content creator or coach to an existing chapter slug
                  without touching the chapter-lead launch pipeline.
                </p>
              </div>
            </div>

            <form
              action="/dashboard/admin/create-access"
              method="post"
              className="grid gap-4"
            >
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-700">
                  Existing chapter
                </span>
                <select
                  name="existingChapterId"
                  className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                  required
                >
                  <option value="">Select chapter</option>
                  {dashboardData.chapters.map((chapter) => (
                    <option key={chapter.id} value={chapter.id}>
                      {chapter.name} ({chapter.slug})
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Person name
                  </span>
                  <input
                    name="personName"
                    placeholder="Content creator or coach name"
                    className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Person email
                  </span>
                  <input
                    name="personEmail"
                    type="email"
                    placeholder="person@example.com"
                    className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                    required
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-700">
                  Role
                </span>
                <select
                  name="role"
                  defaultValue="content_creator"
                  className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                >
                  <option value="content_creator">Content Creator</option>
                  <option value="coach">Coach</option>
                </select>
              </label>

              <button
                type="submit"
                className="mt-2 inline-flex w-fit items-center justify-center rounded-full bg-teal-600 px-6 py-3 font-semibold text-white transition hover:bg-teal-700"
              >
                Assign chapter role
              </button>
            </form>
          </div>
          
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.08)] lg:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Globe2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Chapter Structure
                </h2>
                <p className="text-slate-600">
                  Global template, local chapter ownership.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {dashboardData.chapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className="rounded-[1.5rem] border border-slate-200 bg-[#f7f8fb] p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {chapter.name}
                      </h3>
                      <p className="mt-1 text-slate-600">
                        {chapter.country} · Default language:{" "}
                        {chapter.primaryLanguage.toUpperCase()}
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                      {chapter.status}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3 text-sm">
                    <span className="rounded-full bg-white px-3 py-2 text-slate-700">
                      {chapter.coachCount} coaches
                    </span>
                    <span className="rounded-full bg-white px-3 py-2 text-slate-700">
                      {chapter.eventCount} events
                    </span>
                    <span className="rounded-full bg-white px-3 py-2 text-slate-700">
                      /{chapter.slug}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Coach Approvals By Chapter
          </h2>
          <p className="text-slate-600 mb-6">
            Coaches created by chapter leads stay pending until a global admin approves or denies them. Approval also provisions the coach login access and sends the Cognito setup email.
          </p>

          <div className="space-y-5">
            {dashboardData.pendingCoachApprovals.length > 0 ? (
              dashboardData.pendingCoachApprovals.map((coach) => (
                <div
                  key={coach.id}
                  className="rounded-[1.5rem] border border-slate-200 bg-[#f7f8fb] p-6"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold text-slate-900">
                          {coach.name}
                        </h3>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-orange-500">
                          Pending Approval
                        </span>
                      </div>
                      <p className="mt-2 text-slate-600">
                        {coach.chapterCountry} · {coach.chapterName} · /{coach.chapterSlug}
                      </p>
                      <p className="mt-1 text-slate-600">
                        {coach.contactEmail ?? "No coach contact email provided"}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Submitted by {coach.submittedByName ?? "Unknown user"}
                        {coach.submittedAt
                          ? ` on ${new Date(coach.submittedAt).toLocaleString()}`
                          : ""}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 lg:w-[22rem]">
                      <p className="text-sm font-medium text-slate-700 mb-3">
                        Review this coach
                      </p>

                      <form
                        action="/dashboard/admin/review-coach"
                        method="post"
                        className="space-y-3"
                      >
                        <input type="hidden" name="coachId" value={coach.id} />
                        <textarea
                          name="reviewNotes"
                          rows={3}
                          placeholder="Optional note for approval or denial"
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                        />
                        <div className="flex flex-wrap gap-3">
                          <button
                            type="submit"
                            name="decision"
                            value="approved"
                            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
                          >
                            Approve
                          </button>
                          <button
                            type="submit"
                            name="decision"
                            value="denied"
                            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                          >
                            Deny
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-slate-200 bg-[#f7f8fb] p-5 text-slate-600">
                There are no pending coach approvals right now.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Chapter Access and Roles
          </h2>
          <p className="text-slate-600 mb-6">
            Chapter leads, content creators, and chapter-level coaches all live
            here. When you add someone above, this section updates from the
            database.
          </p>

          <div className="grid gap-4 lg:grid-cols-2">
            {dashboardData.accessRecords.map((person) => (
              <div
                key={`${person.id}-${person.chapterId}-${person.role}`}
                className="rounded-[1.5rem] border border-slate-200 bg-[#f7f8fb] p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {person.fullName}
                    </h3>
                    <p className="mt-1 text-slate-600">
                      {person.chapterName} · {person.email}
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                    {formatRoleLabel(person.role)}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-2 text-sm text-slate-700">
                    /{person.chapterSlug}
                  </span>
                  <span className="rounded-full bg-white px-3 py-2 text-sm text-slate-700">
                    {person.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Published Coaches
          </h2>
          <p className="text-slate-600 mb-6">
            These are the public coach profiles currently attached to chapters.
          </p>

          <div className="grid gap-4 lg:grid-cols-2">
            {dashboardData.coaches.map((coach) => (
              <div
                key={coach.id}
                className="rounded-[1.5rem] border border-slate-200 bg-[#f7f8fb] p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {coach.name}
                    </h3>
                    <p className="mt-1 text-slate-600">
                      {coach.chapterName} · {coach.location ?? "Location pending"}
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-teal-600">
                    {coach.certificationLevel}
                  </span>
                </div>

                <p className="mt-4 text-slate-600 leading-relaxed">
                  {coach.bio ?? "Biography coming soon."}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {coach.languages.map((language) => (
                    <span
                      key={`${coach.id}-${language}`}
                      className="rounded-full bg-white px-3 py-2 text-sm text-slate-700"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
