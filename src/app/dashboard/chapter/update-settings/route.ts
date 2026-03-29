import { NextRequest, NextResponse } from "next/server";

import { getCurrentAppUser } from "../../../../lib/auth/current-user";
import { upsertChapter } from "../../../../lib/db/chapters";

function redirectToChapterDashboard(request: NextRequest, params: Record<string, string>) {
  const url = new URL("/dashboard/chapter", request.url);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return NextResponse.redirect(url);
}

function normalizeSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
  const chapterName = String(formData.get("chapterName") ?? "").trim();
  const chapterSlug = normalizeSlug(String(formData.get("chapterSlug") ?? ""));
  const country = String(formData.get("country") ?? "").trim();
  const primaryLanguage = String(formData.get("primaryLanguage") ?? "").trim();
  const contactEmail = String(formData.get("contactEmail") ?? "").trim().toLowerCase();

  if (!chapterName || !chapterSlug || !country || !primaryLanguage || !contactEmail) {
    return redirectToChapterDashboard(request, {
      error: "missing-settings-fields",
    });
  }

  try {
    const chapter = await upsertChapter({
      name: chapterName,
      slug: chapterSlug,
      country,
      primaryLanguage,
      contactEmail,
      status: "active",
    });

    return redirectToChapterDashboard(request, {
      settings: "updated",
      slug: chapter.slug,
    });
  } catch {
    return redirectToChapterDashboard(request, {
      error: "settings-save-failed",
    });
  }
}
