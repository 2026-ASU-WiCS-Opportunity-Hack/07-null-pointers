import { NextRequest, NextResponse } from "next/server";

import { refreshCoachSemanticSearchEmbedding } from "../../../../lib/ai/coach-directory-semantic-search";
import { provisionCognitoUser } from "../../../../lib/auth/cognito-admin";
import { getCurrentAppUser } from "../../../../lib/auth/current-user";
import {
  attachCoachProfileToUser,
  getCoachById,
  reviewCoachProfile,
} from "../../../../lib/db/coaches";
import { assignRoleToUser } from "../../../../lib/db/user-roles";
import { createOrUpdatePendingUser, getUserByEmail } from "../../../../lib/db/users";

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
  const coachId = String(formData.get("coachId") ?? "").trim();
  const decision = String(formData.get("decision") ?? "").trim();
  const reviewNotes = String(formData.get("reviewNotes") ?? "").trim();

  if (!coachId || !["approved", "denied"].includes(decision)) {
    return redirectToAdmin(request, {
      review: "invalid",
    });
  }

  const existingCoach = await getCoachById(coachId);

  if (!existingCoach) {
    return redirectToAdmin(request, {
      review: "missing",
    });
  }

  try {
    const reviewed = await reviewCoachProfile({
      coachId,
      reviewedByUserId: currentUser.user.id,
      approvalStatus: decision as "approved" | "denied",
      reviewNotes: reviewNotes || null,
    });

    if (!reviewed) {
      return redirectToAdmin(request, {
        review: "missing",
      });
    }

    if (decision === "denied") {
      return redirectToAdmin(request, {
        review: decision,
        coach: reviewed.name,
      });
    }

    try {
      await refreshCoachSemanticSearchEmbedding(reviewed.id);
    } catch (error) {
      console.error("Failed to refresh coach embedding after approval.", error);
    }

    try {
      const coachEmail = reviewed.contactEmail?.trim().toLowerCase();

      if (!coachEmail) {
        throw new Error("Coach contact email is required before approval.");
      }

      let user = await getUserByEmail(coachEmail);

      if (!user) {
        user = await createOrUpdatePendingUser({
          fullName: reviewed.name,
          email: coachEmail,
          status: "pending",
        });
      }

      await assignRoleToUser({
        userId: user.id,
        role: "coach",
        chapterId: reviewed.chapterId,
      });

      await attachCoachProfileToUser({
        coachId: reviewed.id,
        userId: user.id,
      });

      const cognitoResult = await provisionCognitoUser({
        email: coachEmail,
        fullName: reviewed.name,
      });

      return redirectToAdmin(request, {
        review: decision,
        invite: cognitoResult.status,
        coach: reviewed.name,
      });
    } catch {
      return redirectToAdmin(request, {
        review: decision,
        invite: "failed",
        coach: reviewed.name,
      });
    }
  } catch {
    return redirectToAdmin(request, {
      review: "failed",
    });
  }
}
