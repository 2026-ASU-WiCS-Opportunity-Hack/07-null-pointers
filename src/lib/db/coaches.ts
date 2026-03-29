import type {
  CoachApprovalStatus,
  CertificationLevel,
  CoachProfile,
} from "../../types/domain";

import { queryDb } from "./client";

interface CoachRow {
  id: string;
  user_id: string | null;
  chapter_id: string;
  submitted_by_user_id: string | null;
  reviewed_by_user_id: string | null;
  name: string;
  certification_level: string;
  languages: string[];
  bio: string | null;
  location: string | null;
  contact_email: string | null;
  image_url: string | null;
  is_published: boolean;
  approval_status: string;
  review_notes: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  chapter_name?: string;
  chapter_slug?: string;
  chapter_country?: string;
  submitted_by_name?: string | null;
}

interface CoachSearchEmbeddingRow {
  coach_id: string;
  model: string;
  search_document: string;
  embedding_json: number[];
  updated_at: string;
}

export interface CoachWithChapter extends CoachProfile {
  chapterName: string;
  chapterSlug: string;
  chapterCountry?: string;
}

export interface CoachSearchEmbeddingRecord {
  coachId: string;
  model: string;
  searchDocument: string;
  embedding: number[];
  updatedAt: string;
}

export interface PendingCoachApproval extends CoachProfile {
  chapterName: string;
  chapterSlug: string;
  chapterCountry: string;
  submittedByName: string | null;
}

export interface UpsertCoachProfileInput {
  chapterId: string;
  submittedByUserId?: string | null;
  name: string;
  certificationLevel: CertificationLevel;
  languages: string[];
  bio?: string | null;
  location?: string | null;
  contactEmail: string;
  imageUrl?: string | null;
  approvalStatus?: CoachApprovalStatus;
  reviewNotes?: string | null;
  reviewedByUserId?: string | null;
  reviewedAt?: string | null;
  isPublished?: boolean;
}

function mapCoach(row: CoachRow): CoachProfile {
  return {
    id: row.id,
    userId: row.user_id,
    chapterId: row.chapter_id,
    submittedByUserId: row.submitted_by_user_id,
    reviewedByUserId: row.reviewed_by_user_id,
    name: row.name,
    certificationLevel: row.certification_level as CertificationLevel,
    languages: row.languages,
    bio: row.bio,
    location: row.location,
    contactEmail: row.contact_email,
    imageUrl: row.image_url,
    isPublished: row.is_published,
    approvalStatus: row.approval_status as CoachApprovalStatus,
    reviewNotes: row.review_notes,
    submittedAt: row.submitted_at,
    reviewedAt: row.reviewed_at,
  };
}

function mapCoachWithChapter(row: CoachRow): CoachWithChapter {
  return {
    ...mapCoach(row),
    chapterName: row.chapter_name ?? "Unknown Chapter",
    chapterSlug: row.chapter_slug ?? "",
    chapterCountry: row.chapter_country ?? undefined,
  };
}

function mapCoachSearchEmbedding(
  row: CoachSearchEmbeddingRow,
): CoachSearchEmbeddingRecord {
  return {
    coachId: row.coach_id,
    model: row.model,
    searchDocument: row.search_document,
    embedding: row.embedding_json,
    updatedAt: row.updated_at,
  };
}

export async function listPublishedCoachesByChapter(chapterId: string) {
  const result = await queryDb<CoachRow>(
    `
      select
        id,
        user_id,
        chapter_id,
        submitted_by_user_id,
        reviewed_by_user_id,
        name,
        certification_level,
        languages,
        bio,
        location,
        contact_email,
        image_url,
        is_published
        ,
        approval_status,
        review_notes,
        submitted_at,
        reviewed_at
      from coaches
      where chapter_id = $1
        and is_published = true
        and approval_status = 'approved'
      order by name asc
    `,
    [chapterId],
  );

  return result.rows.map(mapCoach);
}

export async function getCoachByUserId(userId: string) {
  const result = await queryDb<CoachRow>(
    `
      select
        coaches.id,
        coaches.user_id,
        coaches.chapter_id,
        coaches.submitted_by_user_id,
        coaches.reviewed_by_user_id,
        coaches.name,
        coaches.certification_level,
        coaches.languages,
        coaches.bio,
        coaches.location,
        coaches.contact_email,
        coaches.image_url,
        coaches.is_published,
        coaches.approval_status,
        coaches.review_notes,
        coaches.submitted_at,
        coaches.reviewed_at,
        chapters.name as chapter_name,
        chapters.slug as chapter_slug,
        chapters.country as chapter_country
      from coaches
      inner join chapters on chapters.id = coaches.chapter_id
      where coaches.user_id = $1
      limit 1
    `,
    [userId],
  );

  return result.rows[0] ? mapCoachWithChapter(result.rows[0]) : null;
}

export async function listCoachesByChapter(chapterId: string) {
  const result = await queryDb<CoachRow>(
    `
      select
        id,
        user_id,
        chapter_id,
        submitted_by_user_id,
        reviewed_by_user_id,
        name,
        certification_level,
        languages,
        bio,
        location,
        contact_email,
        image_url,
        is_published,
        approval_status,
        review_notes,
        submitted_at,
        reviewed_at
      from coaches
      where chapter_id = $1
      order by submitted_at desc nulls last, name asc
    `,
    [chapterId],
  );

  return result.rows.map(mapCoach);
}

export async function upsertCoachProfile(input: UpsertCoachProfileInput) {
  const normalizedEmail = input.contactEmail.trim().toLowerCase();

  const updated = await queryDb<CoachRow>(
    `
      update coaches
      set
        chapter_id = $1,
        submitted_by_user_id = coalesce($2, submitted_by_user_id),
        reviewed_by_user_id = $3,
        name = $4,
        certification_level = $5,
        languages = $6,
        bio = $7,
        location = $8,
        image_url = $9,
        is_published = $10,
        approval_status = $11,
        review_notes = $12,
        reviewed_at = $13
      where lower(contact_email) = lower($14)
      returning
        id,
        user_id,
        chapter_id,
        submitted_by_user_id,
        reviewed_by_user_id,
        name,
        certification_level,
        languages,
        bio,
        location,
        contact_email,
        image_url,
        is_published,
        approval_status,
        review_notes,
        submitted_at,
        reviewed_at
    `,
    [
      input.chapterId,
      input.submittedByUserId ?? null,
      input.reviewedByUserId ?? null,
      input.name,
      input.certificationLevel,
      input.languages,
      input.bio ?? null,
      input.location ?? null,
      input.imageUrl ?? null,
      input.isPublished ?? false,
      input.approvalStatus ?? "pending",
      input.reviewNotes ?? null,
      input.reviewedAt ?? null,
      normalizedEmail,
    ],
  );

  if (updated.rows[0]) {
    return mapCoach(updated.rows[0]);
  }

  const inserted = await queryDb<CoachRow>(
    `
      insert into coaches (
        chapter_id,
        submitted_by_user_id,
        reviewed_by_user_id,
        name,
        certification_level,
        languages,
        bio,
        location,
        contact_email,
        image_url,
        is_published,
        approval_status,
        review_notes,
        reviewed_at
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      returning
        id,
        user_id,
        chapter_id,
        submitted_by_user_id,
        reviewed_by_user_id,
        name,
        certification_level,
        languages,
        bio,
        location,
        contact_email,
        image_url,
        is_published,
        approval_status,
        review_notes,
        submitted_at,
        reviewed_at
    `,
    [
      input.chapterId,
      input.submittedByUserId ?? null,
      input.reviewedByUserId ?? null,
      input.name,
      input.certificationLevel,
      input.languages,
      input.bio ?? null,
      input.location ?? null,
      normalizedEmail,
      input.imageUrl ?? null,
      input.isPublished ?? false,
      input.approvalStatus ?? "pending",
      input.reviewNotes ?? null,
      input.reviewedAt ?? null,
    ],
  );

  return mapCoach(inserted.rows[0]);
}

export async function listPublishedCoachesForDirectory() {
  const result = await queryDb<CoachRow>(
    `
      select
        coaches.id,
        coaches.user_id,
        coaches.chapter_id,
        coaches.submitted_by_user_id,
        coaches.reviewed_by_user_id,
        coaches.name,
        coaches.certification_level,
        coaches.languages,
        coaches.bio,
        coaches.location,
        coaches.contact_email,
        coaches.image_url,
        coaches.is_published,
        coaches.approval_status,
        coaches.review_notes,
        coaches.submitted_at,
        coaches.reviewed_at,
        chapters.name as chapter_name,
        chapters.slug as chapter_slug,
        chapters.country as chapter_country
      from coaches
      inner join chapters on chapters.id = coaches.chapter_id
      where coaches.is_published = true
        and coaches.approval_status = 'approved'
      order by chapters.name asc, coaches.name asc
    `,
  );

  return result.rows.map(mapCoachWithChapter);
}

export async function getPublishedCoachForDirectoryById(coachId: string) {
  const result = await queryDb<CoachRow>(
    `
      select
        coaches.id,
        coaches.user_id,
        coaches.chapter_id,
        coaches.submitted_by_user_id,
        coaches.reviewed_by_user_id,
        coaches.name,
        coaches.certification_level,
        coaches.languages,
        coaches.bio,
        coaches.location,
        coaches.contact_email,
        coaches.image_url,
        coaches.is_published,
        coaches.approval_status,
        coaches.review_notes,
        coaches.submitted_at,
        coaches.reviewed_at,
        chapters.name as chapter_name,
        chapters.slug as chapter_slug,
        chapters.country as chapter_country
      from coaches
      inner join chapters on chapters.id = coaches.chapter_id
      where coaches.id = $1
        and coaches.is_published = true
        and coaches.approval_status = 'approved'
      limit 1
    `,
    [coachId],
  );

  return result.rows[0] ? mapCoachWithChapter(result.rows[0]) : null;
}

export async function listCoachSearchEmbeddingsForCoaches(coachIds: string[]) {
  if (coachIds.length === 0) {
    return [];
  }

  const result = await queryDb<CoachSearchEmbeddingRow>(
    `
      select coach_id, model, search_document, embedding_json, updated_at
      from coach_search_embeddings
      where coach_id = any($1::uuid[])
    `,
    [coachIds],
  );

  return result.rows.map(mapCoachSearchEmbedding);
}

export async function upsertCoachSearchEmbedding(input: {
  coachId: string;
  model: string;
  searchDocument: string;
  embedding: number[];
}) {
  const result = await queryDb<CoachSearchEmbeddingRow>(
    `
      insert into coach_search_embeddings (
        coach_id,
        model,
        search_document,
        embedding_json,
        updated_at
      )
      values ($1, $2, $3, $4::jsonb, now())
      on conflict (coach_id)
      do update set
        model = excluded.model,
        search_document = excluded.search_document,
        embedding_json = excluded.embedding_json,
        updated_at = now()
      returning coach_id, model, search_document, embedding_json, updated_at
    `,
    [
      input.coachId,
      input.model,
      input.searchDocument,
      JSON.stringify(input.embedding),
    ],
  );

  return mapCoachSearchEmbedding(result.rows[0]);
}

export async function listPendingCoachApprovals() {
  const result = await queryDb<CoachRow>(
    `
      select
        coaches.id,
        coaches.user_id,
        coaches.chapter_id,
        coaches.submitted_by_user_id,
        coaches.reviewed_by_user_id,
        coaches.name,
        coaches.certification_level,
        coaches.languages,
        coaches.bio,
        coaches.location,
        coaches.contact_email,
        coaches.image_url,
        coaches.is_published,
        coaches.approval_status,
        coaches.review_notes,
        coaches.submitted_at,
        coaches.reviewed_at,
        chapters.name as chapter_name,
        chapters.slug as chapter_slug,
        chapters.country as chapter_country,
        users.full_name as submitted_by_name
      from coaches
      inner join chapters on chapters.id = coaches.chapter_id
      left join users on users.id = coaches.submitted_by_user_id
      where coaches.approval_status = 'pending'
      order by chapters.country asc, chapters.name asc, coaches.submitted_at asc
    `,
  );

  return result.rows.map((row) => ({
    ...mapCoach(row),
    chapterName: row.chapter_name ?? "Unknown Chapter",
    chapterSlug: row.chapter_slug ?? "",
    chapterCountry: row.chapter_country ?? "Unknown Country",
    submittedByName: row.submitted_by_name ?? null,
  })) satisfies PendingCoachApproval[];
}

export async function reviewCoachProfile(input: {
  coachId: string;
  reviewedByUserId: string;
  approvalStatus: Extract<CoachApprovalStatus, "approved" | "denied">;
  reviewNotes?: string | null;
}) {
  const result = await queryDb<CoachRow>(
    `
      update coaches
      set
        reviewed_by_user_id = $2,
        approval_status = $3,
        review_notes = $4,
        reviewed_at = now(),
        is_published = case when $3 = 'approved' then true else false end
      where id = $1
      returning
        id,
        user_id,
        chapter_id,
        submitted_by_user_id,
        reviewed_by_user_id,
        name,
        certification_level,
        languages,
        bio,
        location,
        contact_email,
        image_url,
        is_published,
        approval_status,
        review_notes,
        submitted_at,
        reviewed_at
    `,
    [
      input.coachId,
      input.reviewedByUserId,
      input.approvalStatus,
      input.reviewNotes ?? null,
    ],
  );

  return result.rows[0] ? mapCoach(result.rows[0]) : null;
}

export async function getCoachById(coachId: string) {
  const result = await queryDb<CoachRow>(
    `
      select
        id,
        user_id,
        chapter_id,
        submitted_by_user_id,
        reviewed_by_user_id,
        name,
        certification_level,
        languages,
        bio,
        location,
        contact_email,
        image_url,
        is_published,
        approval_status,
        review_notes,
        submitted_at,
        reviewed_at
      from coaches
      where id = $1
      limit 1
    `,
    [coachId],
  );

  return result.rows[0] ? mapCoach(result.rows[0]) : null;
}

export async function attachCoachProfileToUser(input: {
  coachId: string;
  userId: string;
}) {
  const result = await queryDb<CoachRow>(
    `
      update coaches
      set user_id = $2
      where id = $1
      returning
        id,
        user_id,
        chapter_id,
        submitted_by_user_id,
        reviewed_by_user_id,
        name,
        certification_level,
        languages,
        bio,
        location,
        contact_email,
        image_url,
        is_published,
        approval_status,
        review_notes,
        submitted_at,
        reviewed_at
    `,
    [input.coachId, input.userId],
  );

  return result.rows[0] ? mapCoach(result.rows[0]) : null;
}

export async function updateCoachProfileByUser(input: {
  userId: string;
  name: string;
  languages: string[];
  bio: string;
  location?: string | null;
  contactEmail: string;
}) {
  const result = await queryDb<CoachRow>(
    `
      update coaches
      set
        name = $2,
        languages = $3,
        bio = $4,
        location = $5,
        contact_email = lower($6)
      from chapters
      where coaches.user_id = $1
        and chapters.id = coaches.chapter_id
      returning
        coaches.id,
        coaches.user_id,
        coaches.chapter_id,
        coaches.submitted_by_user_id,
        coaches.reviewed_by_user_id,
        coaches.name,
        coaches.certification_level,
        coaches.languages,
        coaches.bio,
        coaches.location,
        coaches.contact_email,
        coaches.image_url,
        coaches.is_published,
        coaches.approval_status,
        coaches.review_notes,
        coaches.submitted_at,
        coaches.reviewed_at,
        chapters.name as chapter_name,
        chapters.slug as chapter_slug,
        chapters.country as chapter_country
    `,
    [
      input.userId,
      input.name.trim(),
      input.languages,
      input.bio.trim(),
      input.location?.trim() ? input.location.trim() : null,
      input.contactEmail.trim().toLowerCase(),
    ],
  );

  return result.rows[0] ? mapCoachWithChapter(result.rows[0]) : null;
}
