import { redirect } from "next/navigation";
import { Globe2, Mail, MapPin, Sparkles, UserRound } from "lucide-react";

import { getCurrentAppUser } from "../../../lib/auth/current-user";
import { getUserDisplayName } from "../../../lib/auth/display-name";
import { getCoachByUserId } from "../../../lib/db/coaches";

function getBannerMessage(params: Record<string, string | string[] | undefined>) {
  if (params.saved === "1") {
    return "Your coach profile was updated successfully. The directory will now reflect the new details.";
  }

  if (params.error === "missing-fields") {
    return "Please complete all required fields. Your description is mandatory for the directory.";
  }

  if (params.error === "missing-profile") {
    return "Your coach profile could not be found yet. Please contact your chapter lead or admin.";
  }

  if (params.error === "save-failed") {
    return "Your coach profile could not be updated right now. Please try again.";
  }

  return null;
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function CoachDashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const currentUser = await getCurrentAppUser();

  if (!currentUser) {
    redirect("/signin");
  }

  const isAllowed = currentUser.roleAssignments.some(
    (assignment) => assignment.role === "global_admin" || assignment.role === "coach",
  );

  if (!isAllowed) {
    redirect("/");
  }

  const coachProfile = await getCoachByUserId(currentUser.user.id);
  const params = await searchParams;
  const bannerMessage = getBannerMessage(params);
  const currentUserDisplayName = getUserDisplayName(currentUser.user);

  return (
    <main className="min-h-screen bg-[#f7f8fb] px-6 py-24">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.22em] text-orange-500">
                Dashboard
              </p>
              <h1 className="mb-4 text-4xl font-bold text-slate-900">
                Coach Dashboard
              </h1>
              <p className="max-w-3xl text-slate-600">
                Signed in as {currentUserDisplayName}. Keep your coach profile
                accurate here so your chapter directory and the global directory
                both stay useful.
              </p>
            </div>

            <form action="/auth/logout" method="get">
              <button
                type="submit"
                className="font-medium text-blue-600 hover:text-blue-800"
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

        {coachProfile ? (
          <>
            <section className="grid gap-5 md:grid-cols-3">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                  <Globe2 className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {coachProfile.chapterName}
                </div>
                <p className="mt-2 text-slate-600">Assigned chapter</p>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-600">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {coachProfile.certificationLevel}
                </div>
                <p className="mt-2 text-slate-600">Certification level</p>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
                  <UserRound className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {coachProfile.approvalStatus}
                </div>
                <p className="mt-2 text-slate-600">Directory status</p>
              </div>
            </section>

            <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
                <div className="mb-6">
                  <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-blue-600">
                    Edit Profile
                  </p>
                  <h2 className="text-3xl font-bold text-slate-900">
                    Manage your directory presence
                  </h2>
                  <p className="mt-3 text-slate-600">
                    Your description is required. It is what visitors read in the
                    directory, and it will also matter when we add semantic search.
                  </p>
                </div>

                <form
                  action="/dashboard/coach/update-profile"
                  method="post"
                  className="space-y-5"
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-sm font-semibold text-slate-700">
                        Full name *
                      </span>
                      <input
                        name="name"
                        defaultValue={coachProfile.name}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
                        required
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm font-semibold text-slate-700">
                        Contact email *
                      </span>
                      <input
                        type="email"
                        name="contactEmail"
                        defaultValue={coachProfile.contactEmail ?? currentUser.user.email}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
                        required
                      />
                    </label>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-sm font-semibold text-slate-700">
                        Location
                      </span>
                      <input
                        name="location"
                        defaultValue={coachProfile.location ?? ""}
                        placeholder="City, Country"
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm font-semibold text-slate-700">
                        Languages *
                      </span>
                      <input
                        name="languages"
                        defaultValue={coachProfile.languages.join(", ")}
                        placeholder="English, Portuguese"
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
                        required
                      />
                    </label>
                  </div>

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-slate-700">
                      Description / Bio *
                    </span>
                    <textarea
                      name="bio"
                      rows={8}
                      defaultValue={coachProfile.bio ?? ""}
                      placeholder="Describe your coaching background, strengths, industries, and the kinds of leadership challenges you help solve."
                      className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
                      required
                    />
                  </label>

                  <div className="rounded-[1.5rem] border border-orange-100 bg-orange-50 px-5 py-4 text-sm text-orange-900">
                    The description is mandatory because it appears in the chapter
                    and global directories and will be the main input for future
                    semantic search.
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-4 font-semibold text-white transition hover:bg-blue-600"
                  >
                    Save Profile
                  </button>
                </form>
              </div>

              <div className="space-y-6">
                <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
                  <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-teal-600">
                    Directory Preview
                  </p>
                  <h2 className="mb-5 text-3xl font-bold text-slate-900">
                    How visitors currently see you
                  </h2>

                  <article className="rounded-[1.75rem] border border-slate-200 bg-[#f7f8fb] p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">
                          {coachProfile.name}
                        </h3>
                        <p className="mt-2 text-slate-600">
                          {coachProfile.chapterName} · /{coachProfile.chapterSlug}
                        </p>
                      </div>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                        {coachProfile.certificationLevel}
                      </span>
                    </div>

                    <p className="mt-5 leading-relaxed text-slate-600">
                      {coachProfile.bio ??
                        "Coach profile details will appear here once you add your description."}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {coachProfile.languages.map((language) => (
                        <span
                          key={`${coachProfile.id}-${language}`}
                          className="rounded-full bg-white px-3 py-2 text-sm text-slate-700"
                        >
                          {language}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-orange-500" />
                        {coachProfile.location ?? coachProfile.chapterCountry ?? "Location pending"}
                      </span>
                      {coachProfile.contactEmail ? (
                        <span className="inline-flex items-center gap-2 text-blue-600">
                          <Mail className="h-4 w-4" />
                          {coachProfile.contactEmail}
                        </span>
                      ) : null}
                    </div>
                  </article>
                </section>

                <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
                  <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-blue-600">
                    Chapter Context
                  </p>
                  <h2 className="mb-4 text-2xl font-bold text-slate-900">
                    {coachProfile.chapterName}
                  </h2>
                  <p className="text-slate-600">
                    Your profile is connected to the local directory for this
                    chapter and can also appear in the global directory.
                  </p>
                </section>
              </div>
            </section>
          </>
        ) : (
          <section className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-3xl font-bold text-slate-900">
              Coach profile not found
            </h2>
            <p className="mt-4 max-w-2xl text-slate-600">
              Your login is active, but no coach profile is attached to this
              account yet. Please contact your admin if you were just approved.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
