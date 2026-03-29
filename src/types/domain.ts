import type { AppRole } from "./rbac";

export type EntityId = string;

export const CHAPTER_STATUSES = ["draft", "active", "archived"] as const;
export type ChapterStatus = (typeof CHAPTER_STATUSES)[number];

export const USER_STATUSES = ["pending", "active", "disabled"] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const CERTIFICATION_LEVELS = ["CALC", "PALC", "SALC", "MALC"] as const;
export type CertificationLevel = (typeof CERTIFICATION_LEVELS)[number];

export const COACH_APPROVAL_STATUSES = [
  "pending",
  "approved",
  "denied",
] as const;
export type CoachApprovalStatus = (typeof COACH_APPROVAL_STATUSES)[number];

export const PAGE_STATUSES = ["draft", "published", "archived"] as const;
export type PageStatus = (typeof PAGE_STATUSES)[number];

export interface Chapter {
  id: EntityId;
  name: string;
  slug: string;
  country: string;
  primaryLanguage: string;
  contactEmail: string;
  logoUrl: string | null;
  themeVariant: string | null;
  status: ChapterStatus;
}

export interface AppUser {
  id: EntityId;
  fullName: string;
  email: string;
  cognitoSub: string | null;
  status: UserStatus;
}

export interface UserRoleRecord {
  id: EntityId;
  userId: EntityId;
  role: AppRole;
  chapterId: EntityId | null;
}

export interface CoachProfile {
  id: EntityId;
  userId: EntityId | null;
  chapterId: EntityId;
  submittedByUserId: EntityId | null;
  reviewedByUserId: EntityId | null;
  name: string;
  certificationLevel: CertificationLevel;
  languages: string[];
  bio: string | null;
  location: string | null;
  contactEmail: string | null;
  imageUrl: string | null;
  isPublished: boolean;
  approvalStatus: CoachApprovalStatus;
  reviewNotes: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
}

export interface ChapterEvent {
  id: EntityId;
  chapterId: EntityId;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  location: string | null;
  isGlobalVisible: boolean;
}

export interface ManagedPage {
  id: EntityId;
  chapterId: EntityId | null;
  pageKey: string;
  locale: string;
  title: string;
  contentJson: Record<string, unknown>;
  status: PageStatus;
}
