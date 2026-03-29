import { NextRequest, NextResponse } from "next/server";

import { getCurrentAppUser } from "../../../../lib/auth/current-user";
import { createChapterEvent } from "../../../../lib/db/events";

function redirectToChapterDashboard(request: NextRequest, params: Record<string, string>) {
  const url = new URL("/dashboard/chapter", request.url);

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

  const chapterLeadAssignment = currentUser.roleAssignments.find(
    (assignment) => assignment.role === "chapter_lead" && assignment.chapterId,
  );

  if (!chapterLeadAssignment?.chapterId) {
    return redirectToChapterDashboard(request, {
      error: "not-chapter-lead",
    });
  }

  const formData = await request.formData();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const startDate = String(formData.get("startDate") ?? "").trim();
  const endDate = String(formData.get("endDate") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const isGlobalVisible = String(formData.get("isGlobalVisible") ?? "") === "on";

  if (!title || !startDate) {
    return redirectToChapterDashboard(request, {
      error: "missing-event-fields",
    });
  }

  try {
    await createChapterEvent({
      chapterId: chapterLeadAssignment.chapterId,
      title,
      description: description || null,
      startDate,
      endDate: endDate || null,
      location: location || null,
      isGlobalVisible,
    });

    return redirectToChapterDashboard(request, {
      event: "created",
    });
  } catch {
    return redirectToChapterDashboard(request, {
      error: "event-save-failed",
    });
  }
}
