import { NextRequest, NextResponse } from "next/server";

import { getCurrentAppUser } from "../../../../lib/auth/current-user";
import { upsertChapter } from "../../../../lib/db/chapters";
import { getManagedPageByChapterAndKey, upsertManagedPage } from "../../../../lib/db/pages";

function redirectToChapterDashboard(request: NextRequest, params: Record<string, string>) {
  const url = new URL("/dashboard/chapter", request.url);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return NextResponse.redirect(url);
}

function parseFocusAreas(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
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

  if (!chapterLeadAssignment?.chapterId || !chapterLeadAssignment.chapterSlug) {
    return redirectToChapterDashboard(request, {
      error: "not-chapter-lead",
    });
  }

  const formData = await request.formData();
  const chapterId = chapterLeadAssignment.chapterId;
  const chapterName = String(formData.get("chapterName") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const primaryLanguage = String(formData.get("primaryLanguage") ?? "").trim();
  const contactEmail = String(formData.get("contactEmail") ?? "").trim().toLowerCase();
  const heroTitle = String(formData.get("heroTitle") ?? "").trim();
  const heroSubtitle = String(formData.get("heroSubtitle") ?? "").trim();
  const missionTitle = String(formData.get("missionTitle") ?? "").trim();
  const missionBody = String(formData.get("missionBody") ?? "").trim();
  const impactTitle = String(formData.get("impactTitle") ?? "").trim();
  const impactBody = String(formData.get("impactBody") ?? "").trim();
  const contactTitle = String(formData.get("contactTitle") ?? "").trim();
  const contactBody = String(formData.get("contactBody") ?? "").trim();
  const focusAreas = parseFocusAreas(formData.get("focusAreas"));

  if (
    !chapterName ||
    !country ||
    !primaryLanguage ||
    !contactEmail ||
    !heroTitle ||
    !heroSubtitle ||
    !missionTitle ||
    !missionBody ||
    !impactTitle ||
    !impactBody ||
    !contactTitle ||
    !contactBody ||
    focusAreas.length === 0
  ) {
    return redirectToChapterDashboard(request, {
      error: "missing-site-fields",
    });
  }

  try {
    const chapter = await upsertChapter({
      name: chapterName,
      slug: chapterLeadAssignment.chapterSlug,
      country,
      primaryLanguage,
      contactEmail,
      status: "active",
    });

    const existingPage = await getManagedPageByChapterAndKey(chapterId, "chapter_home");

    await upsertManagedPage({
      chapterId,
      pageKey: "chapter_home",
      locale: primaryLanguage,
      title: chapter.name,
      contentJson: {
        heroTitle,
        heroSubtitle,
        missionTitle,
        missionBody,
        impactTitle,
        impactBody,
        focusAreas,
        contactTitle,
        contactBody,
        contactEmail,
      },
      status: "published",
    });

    return redirectToChapterDashboard(request, {
      website: existingPage ? "updated" : "generated",
    });
  } catch {
    return redirectToChapterDashboard(request, {
      error: "site-save-failed",
    });
  }
}
