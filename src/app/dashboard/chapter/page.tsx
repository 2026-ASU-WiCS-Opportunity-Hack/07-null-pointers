import Link from "next/link";
import { redirect } from "next/navigation";

import { ChapterContentPageSelect } from "../../../components/ChapterContentPageSelect";
import { getCurrentAppUser } from "../../../lib/auth/current-user";
import { getUserDisplayName } from "../../../lib/auth/display-name";
import { getChapterById } from "../../../lib/db/chapters";
import {
  listCoachesByChapter,
  listPublishedCoachesByChapter,
} from "../../../lib/db/coaches";
import { listEventsByChapter } from "../../../lib/db/events";
import {
  getDefaultChapterAboutContent,
  getDefaultChapterContactContent,
  getDefaultChapterHomepageContent,
  getManagedPageByChapterAndKey,
  parseChapterAboutContent,
  parseChapterContactContent,
  parseChapterHomepageContent,
} from "../../../lib/db/pages";
import { listChapterTeamMembers } from "../../../lib/db/user-roles";

function formatRoleLabel(role: string) {
  return role
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getBannerMessage(params: Record<string, string | string[] | undefined>) {
  if (params.content === "updated") {
    return "Chapter website content was updated. The shared chapter template now reflects the new content on this slug.";
  }

  if (params.website === "generated") {
    return "Your chapter website has been generated and published. The public route is now live.";
  }

  if (params.website === "updated") {
    return "Your chapter website has been updated and republished.";
  }

  if (params.error === "not-chapter-lead") {
    return "Only chapter leads can generate or publish the chapter website.";
  }

  if (params.error === "not-content-editor") {
    return "Only the chapter lead or content creator can update chapter website content.";
  }

  if (params.error === "missing-site-fields") {
    return "Please complete all website setup fields before generating the chapter website.";
  }

  if (params.error === "missing-content-fields") {
    return "Please complete all required chapter content fields before saving.";
  }

  if (params.error === "site-save-failed") {
    return "The chapter website could not be published right now. Please try again.";
  }

  if (params.error === "content-save-failed") {
    return "The chapter website content could not be updated right now. Please try again.";
  }

  if (params.error === "site-not-ready") {
    return "The chapter website has not been generated yet. A chapter lead needs to publish the site before content creators can edit it.";
  }

  if (params.settings === "updated") {
    const slug = typeof params.slug === "string" ? params.slug : "your chapter route";
    return `Chapter settings were updated. If you changed the slug, the public chapter route is now /${slug}.`;
  }

  if (params.event === "created") {
    return "Your chapter event was created successfully.";
  }

  if (params.coach === "submitted") {
    return "The coach profile was submitted for admin approval. It will only appear publicly after approval.";
  }

  if (params.error === "missing-settings-fields") {
    return "Please complete all chapter settings fields before saving.";
  }

  if (params.error === "settings-save-failed") {
    return "Chapter settings could not be saved right now. Please try again.";
  }

  if (params.error === "missing-event-fields") {
    return "Please complete the required event fields before saving.";
  }

  if (params.error === "event-save-failed") {
    return "The chapter event could not be saved right now. Please try again.";
  }

  if (params.error === "missing-coach-fields") {
    return "Please complete the required coach profile fields before saving.";
  }

  if (params.error === "invalid-coach-level") {
    return "The selected coach certification level is invalid.";
  }

  if (params.error === "coach-save-failed") {
    return "The coach profile could not be saved right now. Please try again.";
  }

  return null;
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ChapterDashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const currentUser = await getCurrentAppUser();

  if (!currentUser) {
    redirect("/signin");
  }

  const isAllowed = currentUser.roleAssignments.some(
    (assignment) =>
      assignment.role === "global_admin" ||
      assignment.role === "chapter_lead" ||
      assignment.role === "content_creator",
  );

  if (!isAllowed) {
    redirect("/");
  }

  const preferredAssignment =
    currentUser.roleAssignments.find((assignment) => assignment.role === "chapter_lead") ??
    currentUser.roleAssignments.find((assignment) => assignment.role === "content_creator") ??
    currentUser.roleAssignments.find((assignment) => assignment.role === "coach") ??
    null;

  const chapter =
    preferredAssignment?.chapterId
      ? await getChapterById(preferredAssignment.chapterId)
      : null;

  const coaches =
    preferredAssignment?.chapterId
      ? await listPublishedCoachesByChapter(preferredAssignment.chapterId)
      : [];
  const allCoaches =
    preferredAssignment?.chapterId
      ? await listCoachesByChapter(preferredAssignment.chapterId)
      : [];
  const events =
    preferredAssignment?.chapterId
      ? await listEventsByChapter(preferredAssignment.chapterId)
      : [];
  const teamMembers =
    preferredAssignment?.chapterId
      ? await listChapterTeamMembers(preferredAssignment.chapterId)
      : [];
  const currentUserDisplayName = getUserDisplayName(currentUser.user);
  const existingHomepage =
    chapter ? await getManagedPageByChapterAndKey(chapter.id, "chapter_home") : null;
  const existingAboutPage =
    chapter ? await getManagedPageByChapterAndKey(chapter.id, "chapter_about") : null;
  const existingContactPage =
    chapter ? await getManagedPageByChapterAndKey(chapter.id, "chapter_contact") : null;
  const defaultHomepageContent =
    chapter
      ? getDefaultChapterHomepageContent({
          chapterName: chapter.name,
          country: chapter.country,
          contactEmail: chapter.contactEmail,
        })
      : null;
  const defaultAboutContent =
    chapter
      ? getDefaultChapterAboutContent({
          chapterName: chapter.name,
          country: chapter.country,
          contactEmail: chapter.contactEmail,
        })
      : null;
  const defaultContactContent =
    chapter
      ? getDefaultChapterContactContent({
          chapterName: chapter.name,
          country: chapter.country,
          contactEmail: chapter.contactEmail,
        })
      : null;
  const chapterHomepageContent =
    chapter && defaultHomepageContent
      ? parseChapterHomepageContent(existingHomepage?.contentJson, defaultHomepageContent)
      : null;
  const chapterAboutContent =
    chapter && defaultAboutContent
      ? parseChapterAboutContent(existingAboutPage?.contentJson, defaultAboutContent)
      : null;
  const chapterContactContent =
    chapter && defaultContactContent
      ? parseChapterContactContent(existingContactPage?.contentJson, defaultContactContent)
      : null;
  const params = await searchParams;
  const selectedContentEditor =
    typeof params.editor === "string" &&
    ["home", "about", "contact"].includes(params.editor)
      ? (params.editor as "home" | "about" | "contact")
      : "home";
  const bannerMessage = getBannerMessage(params);
  const isChapterLead = preferredAssignment?.role === "chapter_lead";
  const isContentEditor =
    preferredAssignment?.role === "chapter_lead" ||
    preferredAssignment?.role === "content_creator";
  const selectedPublicPagePath =
    !chapter
      ? null
      : selectedContentEditor === "home"
        ? `/${chapter.slug}`
        : `/${chapter.slug}/${selectedContentEditor}`;

  return (
    <main className="min-h-screen bg-[#f7f8fb] px-6 py-24">
      <div className="max-w-6xl mx-auto space-y-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm tracking-[0.22em] uppercase text-teal-600 font-medium mb-4">
                Dashboard
              </p>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                {chapter ? `${chapter.name} Dashboard` : "Chapter Dashboard"}
              </h1>
              <p className="text-slate-600 max-w-3xl">
                Signed in as {currentUserDisplayName}. This dashboard is
                scoped to your assigned chapter and shows only that chapter&apos;s
                people and local context.
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
          <section className="rounded-[1.5rem] border border-teal-200 bg-teal-50 px-6 py-4 text-teal-900">
            {bannerMessage}
          </section>
        ) : null}

        {chapter ? (
          <>
            <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  Chapter Summary
                </h2>
                <div className="space-y-3 text-slate-600">
                  <p>
                    <span className="font-semibold text-slate-900">Country:</span>{" "}
                    {chapter.country}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Language:</span>{" "}
                    {chapter.primaryLanguage.toUpperCase()}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Route:</span>{" "}
                    /{chapter.slug}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Contact:</span>{" "}
                    {chapter.contactEmail}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Your role:</span>{" "}
                    {preferredAssignment
                      ? formatRoleLabel(preferredAssignment.role)
                      : "Pending"}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Website status:</span>{" "}
                    {existingHomepage?.status === "published" ? "Published" : "Not published yet"}
                  </p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  Chapter Team Access
                </h2>
                <div className="space-y-4">
                  {teamMembers.length > 0 ? (
                    teamMembers.map((member) => (
                      <div
                        key={`${member.userId}-${member.role}`}
                        className="rounded-[1.5rem] border border-slate-200 bg-[#f7f8fb] p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">
                              {member.fullName}
                            </h3>
                            <p className="mt-1 text-slate-600">{member.email}</p>
                          </div>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                            {formatRoleLabel(member.role)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[1.5rem] border border-slate-200 bg-[#f7f8fb] p-5 text-slate-600">
                      No chapter team members are assigned yet.
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Chapter Settings
                </h2>
                <p className="mt-2 max-w-3xl text-slate-600">
                  Chapter leads control the local chapter identity here. The
                  chapter slug becomes the live public route, so changing it
                  updates the website URL.
                </p>
              </div>

              {isChapterLead ? (
                <form
                  action="/dashboard/chapter/update-settings"
                  method="post"
                  className="grid gap-5"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-sm font-medium text-slate-700">
                        Chapter name
                      </span>
                      <input
                        name="chapterName"
                        defaultValue={chapter.name}
                        className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                        required
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm font-medium text-slate-700">
                        Chapter slug
                      </span>
                      <input
                        name="chapterSlug"
                        defaultValue={chapter.slug}
                        className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                        required
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <label className="grid gap-2">
                      <span className="text-sm font-medium text-slate-700">
                        Country
                      </span>
                      <input
                        name="country"
                        defaultValue={chapter.country}
                        className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                        required
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm font-medium text-slate-700">
                        Primary language
                      </span>
                      <input
                        name="primaryLanguage"
                        defaultValue={chapter.primaryLanguage}
                        className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                        required
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm font-medium text-slate-700">
                        Chapter contact email
                      </span>
                      <input
                        name="contactEmail"
                        type="email"
                        defaultValue={chapter.contactEmail}
                        className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                        required
                      />
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex w-fit items-center justify-center rounded-full bg-teal-600 px-6 py-3 font-semibold text-white transition hover:bg-teal-700"
                  >
                    Save Chapter Settings
                  </button>
                </form>
              ) : (
                <div className="rounded-[1.5rem] border border-slate-200 bg-[#f7f8fb] p-5 text-slate-600">
                  Chapter settings can only be changed by the chapter lead.
                </div>
              )}
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
              <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {existingHomepage ? "Chapter Website Content" : "Chapter Website Setup"}
                  </h2>
                  <p className="mt-2 max-w-3xl text-slate-600">
                    {existingHomepage
                      ? `This shared content powers /${chapter.slug}, /${chapter.slug}/about, and /${chapter.slug}/contact. Content creators can update the local messaging without changing the underlying template.`
                      : `This creates the public chapter website at /${chapter.slug}
                    using the same WIAL platform design but with your local
                    content. Only chapter leads can publish this website.`}
                  </p>
                </div>
                {existingHomepage?.status === "published" && selectedPublicPagePath ? (
                  <Link
                    href={selectedPublicPagePath}
                    className="inline-flex items-center rounded-full border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                  >
                    View Public Chapter Page
                  </Link>
                ) : null}
              </div>

              {existingHomepage && isContentEditor ? (
                <div className="space-y-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <p className="max-w-3xl text-sm text-slate-600">
                      Choose a section to edit. Changes only apply to /{chapter.slug} and its
                      own child pages. Nothing here changes the global WIAL pages or other
                      chapter sites.
                    </p>
                    <ChapterContentPageSelect value={selectedContentEditor} />
                  </div>

                  {selectedContentEditor === "home" && chapterHomepageContent ? (
                    <form
                      action="/dashboard/chapter/update-content"
                      method="post"
                      className="grid gap-5"
                    >
                      <input type="hidden" name="pageKey" value="chapter_home" />

                      <label className="grid gap-2">
                        <span className="text-sm font-medium text-slate-700">
                          Hero title
                        </span>
                        <input
                          name="heroTitle"
                          defaultValue={chapterHomepageContent.heroTitle}
                          className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                          required
                        />
                      </label>

                      <label className="grid gap-2">
                        <span className="text-sm font-medium text-slate-700">
                          Hero subtitle
                        </span>
                        <textarea
                          name="heroSubtitle"
                          defaultValue={chapterHomepageContent.heroSubtitle}
                          rows={3}
                          className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                          required
                        />
                      </label>

                      <div className="grid gap-4 md:grid-cols-2">
                        <label className="grid gap-2">
                          <span className="text-sm font-medium text-slate-700">
                            Mission section title
                          </span>
                          <input
                            name="missionTitle"
                            defaultValue={chapterHomepageContent.missionTitle}
                            className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                            required
                          />
                        </label>

                        <label className="grid gap-2">
                          <span className="text-sm font-medium text-slate-700">
                            Impact section title
                          </span>
                          <input
                            name="impactTitle"
                            defaultValue={chapterHomepageContent.impactTitle}
                            className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                            required
                          />
                        </label>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <label className="grid gap-2">
                          <span className="text-sm font-medium text-slate-700">
                            Mission description
                          </span>
                          <textarea
                            name="missionBody"
                            defaultValue={chapterHomepageContent.missionBody}
                            rows={5}
                            className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                            required
                          />
                        </label>

                        <label className="grid gap-2">
                          <span className="text-sm font-medium text-slate-700">
                            Impact description
                          </span>
                          <textarea
                            name="impactBody"
                            defaultValue={chapterHomepageContent.impactBody}
                            rows={5}
                            className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                            required
                          />
                        </label>
                      </div>

                      <label className="grid gap-2">
                        <span className="text-sm font-medium text-slate-700">
                          Focus areas
                        </span>
                        <textarea
                          name="focusAreas"
                          defaultValue={chapterHomepageContent.focusAreas.join("\n")}
                          rows={4}
                          className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                          required
                        />
                        <span className="text-xs text-slate-500">
                          One focus area per line.
                        </span>
                      </label>

                      <div className="grid gap-4 md:grid-cols-2">
                        <label className="grid gap-2">
                          <span className="text-sm font-medium text-slate-700">
                            Contact section title
                          </span>
                          <input
                            name="contactTitle"
                            defaultValue={chapterHomepageContent.contactTitle}
                            className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                            required
                          />
                        </label>

                        <label className="grid gap-2">
                          <span className="text-sm font-medium text-slate-700">
                            Public contact email
                          </span>
                          <input
                            name="contactEmail"
                            type="email"
                            defaultValue={chapterHomepageContent.contactEmail}
                            className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                            required
                          />
                        </label>
                      </div>

                      <label className="grid gap-2">
                        <span className="text-sm font-medium text-slate-700">
                          Contact description
                        </span>
                        <textarea
                          name="contactBody"
                          defaultValue={chapterHomepageContent.contactBody}
                          rows={3}
                          className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                          required
                        />
                      </label>

                      <button
                        type="submit"
                        className="inline-flex w-fit items-center justify-center rounded-full bg-teal-600 px-6 py-3 font-semibold text-white transition hover:bg-teal-700"
                      >
                        Update Homepage Content
                      </button>
                    </form>
                  ) : null}

                  {selectedContentEditor === "about" && chapterAboutContent ? (
                    <form
                      action="/dashboard/chapter/update-content"
                      method="post"
                      className="grid gap-5"
                    >
                      <input type="hidden" name="pageKey" value="chapter_about" />

                      <label className="grid gap-2">
                        <span className="text-sm font-medium text-slate-700">
                          Hero title
                        </span>
                        <input
                          name="heroTitle"
                          defaultValue={chapterAboutContent.heroTitle}
                          className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                          required
                        />
                      </label>

                      <label className="grid gap-2">
                        <span className="text-sm font-medium text-slate-700">
                          Hero subtitle
                        </span>
                        <textarea
                          name="heroSubtitle"
                          defaultValue={chapterAboutContent.heroSubtitle}
                          rows={3}
                          className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                          required
                        />
                      </label>

                      <div className="grid gap-4 md:grid-cols-2">
                        <label className="grid gap-2">
                          <span className="text-sm font-medium text-slate-700">
                            Mission section title
                          </span>
                          <input
                            name="missionTitle"
                            defaultValue={chapterAboutContent.missionTitle}
                            className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                            required
                          />
                        </label>

                        <label className="grid gap-2">
                          <span className="text-sm font-medium text-slate-700">
                            Impact section title
                          </span>
                          <input
                            name="impactTitle"
                            defaultValue={chapterAboutContent.impactTitle}
                            className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                            required
                          />
                        </label>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <label className="grid gap-2">
                          <span className="text-sm font-medium text-slate-700">
                            Mission description
                          </span>
                          <textarea
                            name="missionBody"
                            defaultValue={chapterAboutContent.missionBody}
                            rows={5}
                            className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                            required
                          />
                        </label>

                        <label className="grid gap-2">
                          <span className="text-sm font-medium text-slate-700">
                            Impact description
                          </span>
                          <textarea
                            name="impactBody"
                            defaultValue={chapterAboutContent.impactBody}
                            rows={5}
                            className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                            required
                          />
                        </label>
                      </div>

                      <label className="grid gap-2">
                        <span className="text-sm font-medium text-slate-700">
                          Focus areas
                        </span>
                        <textarea
                          name="focusAreas"
                          defaultValue={chapterAboutContent.focusAreas.join("\n")}
                          rows={4}
                          className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                          required
                        />
                        <span className="text-xs text-slate-500">
                          One focus area per line.
                        </span>
                      </label>

                      <div className="grid gap-4 md:grid-cols-2">
                        <label className="grid gap-2">
                          <span className="text-sm font-medium text-slate-700">
                            Call-to-action title
                          </span>
                          <input
                            name="ctaTitle"
                            defaultValue={chapterAboutContent.ctaTitle}
                            className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                            required
                          />
                        </label>

                        <label className="grid gap-2">
                          <span className="text-sm font-medium text-slate-700">
                            Call-to-action description
                          </span>
                          <textarea
                            name="ctaBody"
                            defaultValue={chapterAboutContent.ctaBody}
                            rows={3}
                            className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                            required
                          />
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="inline-flex w-fit items-center justify-center rounded-full bg-teal-600 px-6 py-3 font-semibold text-white transition hover:bg-teal-700"
                      >
                        Update About Page Content
                      </button>
                    </form>
                  ) : null}

                  {selectedContentEditor === "contact" && chapterContactContent ? (
                    <form
                      action="/dashboard/chapter/update-content"
                      method="post"
                      className="grid gap-5"
                    >
                      <input type="hidden" name="pageKey" value="chapter_contact" />

                      <label className="grid gap-2">
                        <span className="text-sm font-medium text-slate-700">
                          Hero title
                        </span>
                        <input
                          name="heroTitle"
                          defaultValue={chapterContactContent.heroTitle}
                          className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                          required
                        />
                      </label>

                      <label className="grid gap-2">
                        <span className="text-sm font-medium text-slate-700">
                          Hero subtitle
                        </span>
                        <textarea
                          name="heroSubtitle"
                          defaultValue={chapterContactContent.heroSubtitle}
                          rows={3}
                          className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                          required
                        />
                      </label>

                      <div className="grid gap-4 md:grid-cols-2">
                        <label className="grid gap-2">
                          <span className="text-sm font-medium text-slate-700">
                            Form title
                          </span>
                          <input
                            name="formTitle"
                            defaultValue={chapterContactContent.formTitle}
                            className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                            required
                          />
                        </label>

                        <label className="grid gap-2">
                          <span className="text-sm font-medium text-slate-700">
                            Contact card title
                          </span>
                          <input
                            name="contactTitle"
                            defaultValue={chapterContactContent.contactTitle}
                            className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                            required
                          />
                        </label>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <label className="grid gap-2">
                          <span className="text-sm font-medium text-slate-700">
                            Form description
                          </span>
                          <textarea
                            name="formBody"
                            defaultValue={chapterContactContent.formBody}
                            rows={4}
                            className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                            required
                          />
                        </label>

                        <label className="grid gap-2">
                          <span className="text-sm font-medium text-slate-700">
                            Contact description
                          </span>
                          <textarea
                            name="contactBody"
                            defaultValue={chapterContactContent.contactBody}
                            rows={4}
                            className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                            required
                          />
                        </label>
                      </div>

                      <label className="grid gap-2">
                        <span className="text-sm font-medium text-slate-700">
                          Public contact email
                        </span>
                        <input
                          name="contactEmail"
                          type="email"
                          defaultValue={chapterContactContent.contactEmail}
                          className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                          required
                        />
                      </label>

                      <button
                        type="submit"
                        className="inline-flex w-fit items-center justify-center rounded-full bg-teal-600 px-6 py-3 font-semibold text-white transition hover:bg-teal-700"
                      >
                        Update Contact Page Content
                      </button>
                    </form>
                  ) : null}
                </div>
              ) : isChapterLead && chapterHomepageContent ? (
                <form
                  action="/dashboard/chapter/generate-site"
                  method="post"
                  className="grid gap-5"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-sm font-medium text-slate-700">
                        Chapter name
                      </span>
                      <input
                        name="chapterName"
                        defaultValue={chapter.name}
                        className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                        required
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm font-medium text-slate-700">
                        Country
                      </span>
                      <input
                        name="country"
                        defaultValue={chapter.country}
                        className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                        required
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-sm font-medium text-slate-700">
                        Primary language
                      </span>
                      <input
                        name="primaryLanguage"
                        defaultValue={chapter.primaryLanguage}
                        className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                        required
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm font-medium text-slate-700">
                        Public contact email
                      </span>
                      <input
                        name="contactEmail"
                        type="email"
                        defaultValue={chapterHomepageContent.contactEmail}
                        className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                        required
                      />
                    </label>
                  </div>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-slate-700">
                      Hero title
                    </span>
                    <input
                      name="heroTitle"
                      defaultValue={chapterHomepageContent.heroTitle}
                      className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                      required
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-slate-700">
                      Hero subtitle
                    </span>
                    <textarea
                      name="heroSubtitle"
                      defaultValue={chapterHomepageContent.heroSubtitle}
                      rows={3}
                      className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                      required
                    />
                  </label>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-sm font-medium text-slate-700">
                        Mission section title
                      </span>
                      <input
                        name="missionTitle"
                        defaultValue={chapterHomepageContent.missionTitle}
                        className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                        required
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm font-medium text-slate-700">
                        Impact section title
                      </span>
                      <input
                        name="impactTitle"
                        defaultValue={chapterHomepageContent.impactTitle}
                        className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                        required
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-sm font-medium text-slate-700">
                        Mission description
                      </span>
                      <textarea
                        name="missionBody"
                        defaultValue={chapterHomepageContent.missionBody}
                        rows={5}
                        className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                        required
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm font-medium text-slate-700">
                        Impact description
                      </span>
                      <textarea
                        name="impactBody"
                        defaultValue={chapterHomepageContent.impactBody}
                        rows={5}
                        className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                        required
                      />
                    </label>
                  </div>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-slate-700">
                      Focus areas
                    </span>
                    <textarea
                      name="focusAreas"
                      defaultValue={chapterHomepageContent.focusAreas.join("\n")}
                      rows={4}
                      className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                      required
                    />
                    <span className="text-xs text-slate-500">
                      One focus area per line.
                    </span>
                  </label>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-sm font-medium text-slate-700">
                        Contact section title
                      </span>
                      <input
                        name="contactTitle"
                        defaultValue={chapterHomepageContent.contactTitle}
                        className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                        required
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm font-medium text-slate-700">
                        Contact description
                      </span>
                      <textarea
                        name="contactBody"
                        defaultValue={chapterHomepageContent.contactBody}
                        rows={3}
                        className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                        required
                      />
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex w-fit items-center justify-center rounded-full bg-teal-600 px-6 py-3 font-semibold text-white transition hover:bg-teal-700"
                  >
                    {existingHomepage ? "Update Chapter Website" : "Generate Chapter Website"}
                  </button>
                </form>
              ) : (
                <div className="rounded-[1.5rem] border border-slate-200 bg-[#f7f8fb] p-5 text-slate-600">
                  {preferredAssignment?.role === "content_creator"
                    ? "Chapter website creation is reserved for the chapter lead. Once the chapter lead publishes the site, content creators can update the local chapter messaging here."
                    : "No chapter website setup is available for this account."}
                </div>
              )}
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Chapter Events
                  </h2>
                  <p className="mt-2 text-slate-600">
                    Chapter leads can add local events that support the public
                    chapter website and chapter programming.
                  </p>
                </div>

                {isChapterLead ? (
                  <form
                    action="/dashboard/chapter/create-event"
                    method="post"
                    className="grid gap-4"
                  >
                    <label className="grid gap-2">
                      <span className="text-sm font-medium text-slate-700">
                        Event title
                      </span>
                      <input
                        name="title"
                        placeholder="WIAL India Leadership Forum"
                        className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                        required
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm font-medium text-slate-700">
                        Description
                      </span>
                      <textarea
                        name="description"
                        rows={4}
                        placeholder="What is this event about?"
                        className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                      />
                    </label>

                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="grid gap-2">
                        <span className="text-sm font-medium text-slate-700">
                          Start date and time
                        </span>
                        <input
                          name="startDate"
                          type="datetime-local"
                          className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                          required
                        />
                      </label>

                      <label className="grid gap-2">
                        <span className="text-sm font-medium text-slate-700">
                          End date and time
                        </span>
                        <input
                          name="endDate"
                          type="datetime-local"
                          className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                        />
                      </label>
                    </div>

                    <label className="grid gap-2">
                      <span className="text-sm font-medium text-slate-700">
                        Location
                      </span>
                      <input
                        name="location"
                        placeholder="Virtual or city"
                        className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                      />
                    </label>

                    <label className="flex items-center gap-3 text-sm text-slate-700">
                      <input
                        name="isGlobalVisible"
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-teal-600"
                      />
                      Make this event globally visible
                    </label>

                    <button
                      type="submit"
                      className="inline-flex w-fit items-center justify-center rounded-full bg-teal-600 px-6 py-3 font-semibold text-white transition hover:bg-teal-700"
                    >
                      Add Chapter Event
                    </button>
                  </form>
                ) : (
                  <div className="rounded-[1.5rem] border border-slate-200 bg-[#f7f8fb] p-5 text-slate-600">
                    Only the chapter lead can add events from this dashboard.
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  {events.length > 0 ? (
                    events.map((event) => (
                      <div
                        key={event.id}
                        className="rounded-[1.25rem] border border-slate-200 bg-[#f7f8fb] p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-bold text-slate-900">{event.title}</h3>
                            <p className="mt-1 text-sm text-slate-600">
                              {new Date(event.startDate).toLocaleString()}
                              {event.location ? ` · ${event.location}` : ""}
                            </p>
                          </div>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-teal-600">
                            {event.isGlobalVisible ? "Global" : "Local"}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[1.25rem] border border-slate-200 bg-[#f7f8fb] p-4 text-slate-600">
                      No chapter events have been added yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Local Coach Profiles
                  </h2>
                  <p className="mt-2 text-slate-600">
                    Chapter leads can add and publish local coach profiles for
                    the public chapter website and directory.
                  </p>
                </div>

                {isChapterLead ? (
                  <form
                    action="/dashboard/chapter/create-coach"
                    method="post"
                    className="grid gap-4"
                  >
                    <label className="grid gap-2">
                      <span className="text-sm font-medium text-slate-700">
                        Coach name
                      </span>
                      <input
                        name="name"
                        placeholder="Coach full name"
                        className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                        required
                      />
                    </label>

                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="grid gap-2">
                        <span className="text-sm font-medium text-slate-700">
                          Certification level
                        </span>
                        <select
                          name="certificationLevel"
                          defaultValue="CALC"
                          className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                        >
                          <option value="CALC">CALC</option>
                          <option value="PALC">PALC</option>
                          <option value="SALC">SALC</option>
                          <option value="MALC">MALC</option>
                        </select>
                      </label>

                      <label className="grid gap-2">
                        <span className="text-sm font-medium text-slate-700">
                          Languages
                        </span>
                        <input
                          name="languages"
                          placeholder="English, Hindi"
                          className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                          required
                        />
                      </label>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="grid gap-2">
                        <span className="text-sm font-medium text-slate-700">
                          Location
                        </span>
                        <input
                          name="location"
                          placeholder="Mumbai, India"
                          className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                        />
                      </label>

                      <label className="grid gap-2">
                        <span className="text-sm font-medium text-slate-700">
                          Contact email
                        </span>
                        <input
                          name="contactEmail"
                          type="email"
                          placeholder="coach@example.com"
                          className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                          required
                        />
                      </label>
                    </div>

                    <label className="grid gap-2">
                      <span className="text-sm font-medium text-slate-700">
                        Bio
                      </span>
                      <textarea
                        name="bio"
                        rows={4}
                        placeholder="Coach summary for the chapter website"
                        className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                      />
                    </label>

                    <button
                      type="submit"
                      className="inline-flex w-fit items-center justify-center rounded-full bg-teal-600 px-6 py-3 font-semibold text-white transition hover:bg-teal-700"
                    >
                      Submit Coach For Approval
                    </button>
                  </form>
                ) : (
                  <div className="rounded-[1.5rem] border border-slate-200 bg-[#f7f8fb] p-5 text-slate-600">
                    Only the chapter lead can create or publish coach profiles from this dashboard.
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  {allCoaches.length > 0 ? (
                    allCoaches.map((coach) => (
                      <div
                        key={coach.id}
                        className="rounded-[1.25rem] border border-slate-200 bg-[#f7f8fb] p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-bold text-slate-900">{coach.name}</h3>
                            <p className="mt-1 text-sm text-slate-600">
                              {coach.location ?? "Location pending"}
                            </p>
                          </div>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                            {coach.approvalStatus}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[1.25rem] border border-slate-200 bg-[#f7f8fb] p-4 text-slate-600">
                      No local coach profiles have been created yet.
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  Published Coaches
                </h2>
                <p className="text-slate-600">
                  Public coach profiles connected to this chapter.
                </p>
              </div>
              <div className="space-y-4">
                {coaches.length > 0 ? (
                  coaches.map((coach) => (
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
                            {coach.location ?? "Location pending"}
                          </p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-teal-600">
                          {coach.certificationLevel}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[1.5rem] border border-slate-200 bg-[#f7f8fb] p-5 text-slate-600">
                    No published coaches are attached to this chapter yet.
                  </div>
                )}
              </div>
            </section>
          </>
        ) : (
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-600 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
            No chapter assignment was found for this user.
          </section>
        )}
      </div>
    </main>
  );
}
