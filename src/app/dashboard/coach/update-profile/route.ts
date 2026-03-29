import { NextRequest, NextResponse } from "next/server";

import { refreshCoachSemanticSearchEmbedding } from "../../../../lib/ai/coach-directory-semantic-search";
import { getCurrentAppUser } from "../../../../lib/auth/current-user";
import {
  getCoachByUserId,
  updateCoachProfileByUser,
} from "../../../../lib/db/coaches";

function redirectToCoach(request: NextRequest, params: Record<string, string>) {
  const url = new URL("/dashboard/coach", request.url);

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
    (assignment) => assignment.role === "coach",
  );

  if (!isAllowed) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const coach = await getCoachByUserId(currentUser.user.id);

  if (!coach) {
    return redirectToCoach(request, {
      error: "missing-profile",
    });
  }

  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const contactEmail = String(formData.get("contactEmail") ?? "")
    .trim()
    .toLowerCase();
  const bio = String(formData.get("bio") ?? "").trim();
  const languages = String(formData.get("languages") ?? "")
    .split(",")
    .map((language) => language.trim())
    .filter(Boolean);

  if (!name || !contactEmail || languages.length === 0 || !bio) {
    return redirectToCoach(request, {
      error: "missing-fields",
    });
  }

  try {
    const updated = await updateCoachProfileByUser({
      userId: currentUser.user.id,
      name,
      location,
      contactEmail,
      bio,
      languages,
    });

    if (!updated) {
      return redirectToCoach(request, {
        error: "missing-profile",
      });
    }

    try {
      await refreshCoachSemanticSearchEmbedding(updated.id);
    } catch (error) {
      console.error("Failed to refresh coach embedding after profile update.", error);
    }

    return redirectToCoach(request, {
      saved: "1",
    });
  } catch {
    return redirectToCoach(request, {
      error: "save-failed",
    });
  }
}
