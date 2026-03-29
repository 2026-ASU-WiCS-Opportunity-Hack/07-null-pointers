import { NextRequest, NextResponse } from "next/server";

import { provisionCognitoUser } from "../../../../lib/auth/cognito-admin";
import { getCurrentAppUser } from "../../../../lib/auth/current-user";
import { getChapterById, upsertChapter } from "../../../../lib/db/chapters";
import { assignRoleToUser } from "../../../../lib/db/user-roles";
import { createOrUpdatePendingUser } from "../../../../lib/db/users";
import type { AppRole } from "../../../../types/rbac";

function normalizeSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function redirectToAdmin(request: NextRequest, params: Record<string, string>) {
  const url = new URL("/dashboard/admin", request.url);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return NextResponse.redirect(url);
}

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentAppUser();

  if (!currentUser) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  const isAllowed = currentUser.roleAssignments.some(
    (assignment) => assignment.role === "global_admin",
  );

  if (!isAllowed) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const formData = await request.formData();
  const existingChapterId = String(formData.get("existingChapterId") ?? "").trim();
  const chapterName = String(formData.get("chapterName") ?? "").trim();
  const chapterSlug = normalizeSlug(String(formData.get("chapterSlug") ?? ""));
  const country = String(formData.get("country") ?? "").trim();
  const primaryLanguage = String(formData.get("primaryLanguage") ?? "en").trim();
  const chapterContactEmail = String(formData.get("chapterContactEmail") ?? "").trim();
  const personName = String(formData.get("personName") ?? "").trim();
  const personEmail = String(formData.get("personEmail") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "").trim() as AppRole;

  const isUsingExistingChapter = Boolean(existingChapterId);

  if (
    (!isUsingExistingChapter &&
      (!chapterName || !chapterSlug || !country || !chapterContactEmail)) ||
    !personName ||
    !personEmail
  ) {
    return redirectToAdmin(request, {
      error: "missing-fields",
    });
  }

  if (!["chapter_lead", "content_creator", "coach"].includes(role)) {
    return redirectToAdmin(request, {
      error: "invalid-role",
    });
  }

  if (role === "chapter_lead" && isUsingExistingChapter) {
    return redirectToAdmin(request, {
      error: "chapter-lead-new-only",
    });
  }

  if ((role === "content_creator" || role === "coach") && !isUsingExistingChapter) {
    return redirectToAdmin(request, {
      error: "existing-chapter-required",
    });
  }

  try {
    const chapter = isUsingExistingChapter
      ? await getChapterById(existingChapterId)
      : await upsertChapter({
          name: chapterName,
          slug: chapterSlug,
          country,
          primaryLanguage,
          contactEmail: chapterContactEmail,
          status: "active",
        });

    if (!chapter) {
      return redirectToAdmin(request, {
        error: "invalid-chapter",
      });
    }

    const user = await createOrUpdatePendingUser({
      fullName: personName,
      email: personEmail,
      status: "pending",
    });

    await assignRoleToUser({
      userId: user.id,
      role,
      chapterId: chapter.id,
    });

    const cognitoResult = await provisionCognitoUser({
      email: personEmail,
      fullName: personName,
    });

    return redirectToAdmin(request, {
      created: "1",
      chapter: chapter.slug,
      email: personEmail,
      invite: cognitoResult.status,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to provision Cognito user.";

    return redirectToAdmin(request, {
      error: "invite-failed",
      detail: message,
      email: personEmail,
    });
  }
}
