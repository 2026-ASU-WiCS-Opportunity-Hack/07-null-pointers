import { NextRequest, NextResponse } from "next/server";

import { getCurrentAppUser } from "../../../../lib/auth/current-user";
import { getChapterById } from "../../../../lib/db/chapters";
import {
  type ChapterPageKey,
  getManagedPageByChapterAndKey,
  upsertManagedPage,
} from "../../../../lib/db/pages";

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

const CONTENT_PAGE_TITLES: Record<ChapterPageKey, string> = {
  chapter_home: "Homepage",
  chapter_about: "About",
  chapter_contact: "Contact",
};

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentAppUser();

  if (!currentUser) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  const chapterScopedAssignment =
    currentUser.roleAssignments.find(
      (assignment) => assignment.role === "chapter_lead" && assignment.chapterId,
    ) ??
    currentUser.roleAssignments.find(
      (assignment) => assignment.role === "content_creator" && assignment.chapterId,
    );

  if (!chapterScopedAssignment?.chapterId) {
    return redirectToChapterDashboard(request, {
      error: "not-content-editor",
    });
  }

  const chapter = await getChapterById(chapterScopedAssignment.chapterId);

  if (!chapter) {
    return redirectToChapterDashboard(request, {
      error: "content-save-failed",
    });
  }

  const homepage = await getManagedPageByChapterAndKey(chapter.id, "chapter_home");

  if (!homepage) {
    return redirectToChapterDashboard(request, {
      error: "site-not-ready",
    });
  }

  const formData = await request.formData();
  const pageKey = String(formData.get("pageKey") ?? "chapter_home").trim() as ChapterPageKey;

  if (!["chapter_home", "chapter_about", "chapter_contact"].includes(pageKey)) {
    return redirectToChapterDashboard(request, {
      error: "content-save-failed",
    });
  }

  try {
    const existingPage =
      pageKey === "chapter_home"
        ? homepage
        : await getManagedPageByChapterAndKey(chapter.id, pageKey);

    const locale = existingPage?.locale || homepage.locale || chapter.primaryLanguage;
    const title =
      existingPage?.title ||
      (pageKey === "chapter_home"
        ? chapter.name
        : `${chapter.name} ${CONTENT_PAGE_TITLES[pageKey]}`);

    let contentJson: Record<string, unknown>;

    if (pageKey === "chapter_home") {
      const heroTitle = String(formData.get("heroTitle") ?? "").trim();
      const heroSubtitle = String(formData.get("heroSubtitle") ?? "").trim();
      const missionTitle = String(formData.get("missionTitle") ?? "").trim();
      const missionBody = String(formData.get("missionBody") ?? "").trim();
      const impactTitle = String(formData.get("impactTitle") ?? "").trim();
      const impactBody = String(formData.get("impactBody") ?? "").trim();
      const contactTitle = String(formData.get("contactTitle") ?? "").trim();
      const contactBody = String(formData.get("contactBody") ?? "").trim();
      const contactEmail = String(formData.get("contactEmail") ?? "").trim().toLowerCase();
      const focusAreas = parseFocusAreas(formData.get("focusAreas"));

      if (
        !heroTitle ||
        !heroSubtitle ||
        !missionTitle ||
        !missionBody ||
        !impactTitle ||
        !impactBody ||
        !contactTitle ||
        !contactBody ||
        !contactEmail ||
        focusAreas.length === 0
      ) {
        return redirectToChapterDashboard(request, {
          error: "missing-content-fields",
          editor: "home",
        });
      }

      contentJson = {
        ...(existingPage?.contentJson ?? {}),
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
      };
    } else if (pageKey === "chapter_about") {
      const heroTitle = String(formData.get("heroTitle") ?? "").trim();
      const heroSubtitle = String(formData.get("heroSubtitle") ?? "").trim();
      const missionTitle = String(formData.get("missionTitle") ?? "").trim();
      const missionBody = String(formData.get("missionBody") ?? "").trim();
      const impactTitle = String(formData.get("impactTitle") ?? "").trim();
      const impactBody = String(formData.get("impactBody") ?? "").trim();
      const ctaTitle = String(formData.get("ctaTitle") ?? "").trim();
      const ctaBody = String(formData.get("ctaBody") ?? "").trim();
      const focusAreas = parseFocusAreas(formData.get("focusAreas"));

      if (
        !heroTitle ||
        !heroSubtitle ||
        !missionTitle ||
        !missionBody ||
        !impactTitle ||
        !impactBody ||
        !ctaTitle ||
        !ctaBody ||
        focusAreas.length === 0
      ) {
        return redirectToChapterDashboard(request, {
          error: "missing-content-fields",
          editor: "about",
        });
      }

      contentJson = {
        ...(existingPage?.contentJson ?? {}),
        heroTitle,
        heroSubtitle,
        missionTitle,
        missionBody,
        impactTitle,
        impactBody,
        focusAreas,
        ctaTitle,
        ctaBody,
      };
    } else {
      const heroTitle = String(formData.get("heroTitle") ?? "").trim();
      const heroSubtitle = String(formData.get("heroSubtitle") ?? "").trim();
      const formTitle = String(formData.get("formTitle") ?? "").trim();
      const formBody = String(formData.get("formBody") ?? "").trim();
      const contactTitle = String(formData.get("contactTitle") ?? "").trim();
      const contactBody = String(formData.get("contactBody") ?? "").trim();
      const contactEmail = String(formData.get("contactEmail") ?? "").trim().toLowerCase();

      if (
        !heroTitle ||
        !heroSubtitle ||
        !formTitle ||
        !formBody ||
        !contactTitle ||
        !contactBody ||
        !contactEmail
      ) {
        return redirectToChapterDashboard(request, {
          error: "missing-content-fields",
          editor: "contact",
        });
      }

      contentJson = {
        ...(existingPage?.contentJson ?? {}),
        heroTitle,
        heroSubtitle,
        formTitle,
        formBody,
        contactTitle,
        contactBody,
        contactEmail,
      };
    }

    await upsertManagedPage({
      chapterId: chapter.id,
      pageKey,
      locale,
      title,
      contentJson,
      status: "published",
    });

    return redirectToChapterDashboard(request, {
      content: "updated",
      editor:
        pageKey === "chapter_home"
          ? "home"
          : pageKey === "chapter_about"
            ? "about"
            : "contact",
    });
  } catch {
    return redirectToChapterDashboard(request, {
      error: "content-save-failed",
      editor:
        pageKey === "chapter_home"
          ? "home"
          : pageKey === "chapter_about"
            ? "about"
            : "contact",
    });
  }
}
