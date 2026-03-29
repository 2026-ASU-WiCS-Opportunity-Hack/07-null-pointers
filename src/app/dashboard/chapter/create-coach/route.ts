import { NextRequest, NextResponse } from "next/server";

import { getCurrentAppUser } from "../../../../lib/auth/current-user";
import { upsertCoachProfile } from "../../../../lib/db/coaches";
import { CERTIFICATION_LEVELS } from "../../../../types/domain";

function redirectToChapterDashboard(request: NextRequest, params: Record<string, string>) {
  const url = new URL("/dashboard/chapter", request.url);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return NextResponse.redirect(url);
}

function parseLanguages(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentAppUser();

  if (!currentUser) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  const chapterLeadAssignment = currentUser.roleAssignments.find(
    (assignment) => assignment.role === "chapter_lead" && assignment.chapterId,
  );

  if (!chapterLeadAssignment?.chapterId) {
    return redirectToChapterDashboard(request, {
      error: "not-chapter-lead",
    });
  }

  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const certificationLevel = String(formData.get("certificationLevel") ?? "").trim();
  const languages = parseLanguages(formData.get("languages"));
  const bio = String(formData.get("bio") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const contactEmail = String(formData.get("contactEmail") ?? "").trim().toLowerCase();

  if (!name || !certificationLevel || languages.length === 0 || !contactEmail) {
    return redirectToChapterDashboard(request, {
      error: "missing-coach-fields",
    });
  }

  if (!CERTIFICATION_LEVELS.includes(certificationLevel as (typeof CERTIFICATION_LEVELS)[number])) {
    return redirectToChapterDashboard(request, {
      error: "invalid-coach-level",
    });
  }

  try {
    await upsertCoachProfile({
      chapterId: chapterLeadAssignment.chapterId,
      submittedByUserId: currentUser.user.id,
      name,
      certificationLevel: certificationLevel as (typeof CERTIFICATION_LEVELS)[number],
      languages,
      bio: bio || null,
      location: location || null,
      contactEmail,
      approvalStatus: "pending",
      isPublished: false,
    });

    return redirectToChapterDashboard(request, {
      coach: "submitted",
    });
  } catch {
    return redirectToChapterDashboard(request, {
      error: "coach-save-failed",
    });
  }
}
