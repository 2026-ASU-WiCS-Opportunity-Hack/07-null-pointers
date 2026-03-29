import type { Chapter, ChapterStatus } from "../../types/domain";

import { getSingleRow, queryDb } from "./client";

interface ChapterRow {
  id: string;
  name: string;
  slug: string;
  country: string;
  primary_language: string;
  contact_email: string;
  logo_url: string | null;
  theme_variant: string | null;
  status: string;
}

interface GlobalChapterListingRow extends ChapterRow {
  coach_count: string;
  has_published_site: boolean;
}

function mapChapter(row: ChapterRow): Chapter {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    country: row.country,
    primaryLanguage: row.primary_language,
    contactEmail: row.contact_email,
    logoUrl: row.logo_url,
    themeVariant: row.theme_variant,
    status: row.status as ChapterStatus,
  };
}

export interface UpsertChapterInput {
  name: string;
  slug: string;
  country: string;
  primaryLanguage: string;
  contactEmail: string;
  themeVariant?: string | null;
  status?: ChapterStatus;
}

export interface GlobalChapterListing extends Chapter {
  coachCount: number;
  hasPublishedSite: boolean;
}

export async function getChapterById(chapterId: string) {
  const result = await queryDb<ChapterRow>(
    `
      select
        id,
        name,
        slug,
        country,
        primary_language,
        contact_email,
        logo_url,
        theme_variant,
        status
      from chapters
      where id = $1
      limit 1
    `,
    [chapterId],
  );

  const row = getSingleRow(result);
  return row ? mapChapter(row) : null;
}

export async function getChapterBySlug(slug: string) {
  const result = await queryDb<ChapterRow>(
    `
      select
        id,
        name,
        slug,
        country,
        primary_language,
        contact_email,
        logo_url,
        theme_variant,
        status
      from chapters
      where slug = $1
      limit 1
    `,
    [slug],
  );

  const row = getSingleRow(result);
  return row ? mapChapter(row) : null;
}

export async function listActiveChapters() {
  const result = await queryDb<ChapterRow>(
    `
      select
        id,
        name,
        slug,
        country,
        primary_language,
        contact_email,
        logo_url,
        theme_variant,
        status
      from chapters
      where status = 'active'
      order by name asc
    `,
  );

  return result.rows.map(mapChapter);
}

export async function listGlobalChapterListings() {
  const result = await queryDb<GlobalChapterListingRow>(
    `
      select
        c.id,
        c.name,
        c.slug,
        c.country,
        c.primary_language,
        c.contact_email,
        c.logo_url,
        c.theme_variant,
        c.status,
        count(distinct co.id)::text as coach_count,
        exists(
          select 1
          from pages p
          where p.chapter_id = c.id
            and p.page_key = 'chapter_home'
            and p.status = 'published'
        ) as has_published_site
      from chapters c
      left join coaches co
        on co.chapter_id = c.id
       and co.is_published = true
       and co.approval_status = 'approved'
      where c.status = 'active'
      group by c.id
      order by c.name asc
    `,
  );

  return result.rows.map((row) => ({
    ...mapChapter(row),
    coachCount: Number(row.coach_count),
    hasPublishedSite: row.has_published_site,
  }));
}

export async function upsertChapter(input: UpsertChapterInput) {
  const result = await queryDb<ChapterRow>(
    `
      insert into chapters (
        name,
        slug,
        country,
        primary_language,
        contact_email,
        theme_variant,
        status
      )
      values ($1, $2, $3, $4, $5, $6, $7)
      on conflict (slug)
      do update set
        name = excluded.name,
        country = excluded.country,
        primary_language = excluded.primary_language,
        contact_email = excluded.contact_email,
        theme_variant = excluded.theme_variant,
        status = excluded.status
      returning
        id,
        name,
        slug,
        country,
        primary_language,
        contact_email,
        logo_url,
        theme_variant,
        status
    `,
    [
      input.name,
      input.slug,
      input.country,
      input.primaryLanguage,
      input.contactEmail,
      input.themeVariant ?? null,
      input.status ?? "active",
    ],
  );

  return mapChapter(result.rows[0]);
}
