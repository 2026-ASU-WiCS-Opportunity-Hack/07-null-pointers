export const APP_ROLES = [
  "public_user",
  "coach",
  "chapter_lead",
  "content_creator",
  "global_admin",
] as const;

export type AppRole = (typeof APP_ROLES)[number];

export const CHAPTER_SCOPED_ROLES = [
  "coach",
  "chapter_lead",
  "content_creator",
] as const satisfies readonly AppRole[];

export type ChapterScopedRole = (typeof CHAPTER_SCOPED_ROLES)[number];

export type DashboardRoute = "/dashboard/admin" | "/dashboard/chapter" | "/dashboard/coach";

export const DASHBOARD_HOME_BY_ROLE: Record<
  Exclude<AppRole, "public_user">,
  DashboardRoute
> = {
  global_admin: "/dashboard/admin",
  chapter_lead: "/dashboard/chapter",
  content_creator: "/dashboard/chapter",
  coach: "/dashboard/coach",
};

export interface RoleAssignment {
  role: AppRole;
  chapterId: string | null;
}

export function isChapterScopedRole(role: AppRole): role is ChapterScopedRole {
  return CHAPTER_SCOPED_ROLES.includes(role as ChapterScopedRole);
}

export function isGlobalAdmin(role: AppRole) {
  return role === "global_admin";
}

