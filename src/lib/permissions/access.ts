import type { AppRole, RoleAssignment } from "../../types/rbac";
import { isChapterScopedRole } from "../../types/rbac";

export function hasRole(assignments: RoleAssignment[], role: AppRole) {
  return assignments.some((assignment) => assignment.role === role);
}

export function canAccessChapter(
  assignments: RoleAssignment[],
  targetChapterId: string,
) {
  return assignments.some((assignment) => {
    if (assignment.role === "global_admin") {
      return true;
    }

    return isChapterScopedRole(assignment.role) && assignment.chapterId === targetChapterId;
  });
}

export function canManageChapterContent(
  assignments: RoleAssignment[],
  targetChapterId: string,
) {
  return assignments.some((assignment) => {
    if (assignment.role === "global_admin") {
      return true;
    }

    return (
      (assignment.role === "chapter_lead" || assignment.role === "content_creator") &&
      assignment.chapterId === targetChapterId
    );
  });
}

export function canEditOwnCoachProfile(
  assignments: RoleAssignment[],
  chapterId: string,
) {
  return assignments.some(
    (assignment) =>
      (assignment.role === "coach" && assignment.chapterId === chapterId) ||
      assignment.role === "global_admin",
  );
}

