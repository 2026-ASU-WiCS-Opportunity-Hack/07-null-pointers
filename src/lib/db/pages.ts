import type { ManagedPage, PageStatus } from "../../types/domain";

import { getSingleRow, queryDb, withTransaction } from "./client";

interface ManagedPageRow {
  id: string;
  chapter_id: string | null;
  page_key: string;
  locale: string;
  title: string;
  content_json: Record<string, unknown>;
  status: string;
}

export const CHAPTER_PAGE_KEYS = [
  "chapter_home",
  "chapter_about",
  "chapter_contact",
] as const;

export type ChapterPageKey = (typeof CHAPTER_PAGE_KEYS)[number];

export interface ChapterHomepageContent {
  heroTitle: string;
  heroSubtitle: string;
  missionTitle: string;
  missionBody: string;
  impactTitle: string;
  impactBody: string;
  focusAreas: string[];
  contactTitle: string;
  contactBody: string;
  contactEmail: string;
}

export interface ChapterAboutContent {
  heroTitle: string;
  heroSubtitle: string;
  missionTitle: string;
  missionBody: string;
  impactTitle: string;
  impactBody: string;
  focusAreas: string[];
  ctaTitle: string;
  ctaBody: string;
}

export interface ChapterContactContent {
  heroTitle: string;
  heroSubtitle: string;
  formTitle: string;
  formBody: string;
  contactTitle: string;
  contactBody: string;
  contactEmail: string;
}

export interface UpsertManagedPageInput {
  chapterId: string;
  pageKey: string;
  locale: string;
  title: string;
  contentJson: Record<string, unknown>;
  status?: PageStatus;
}

function mapManagedPage(row: ManagedPageRow): ManagedPage {
  return {
    id: row.id,
    chapterId: row.chapter_id,
    pageKey: row.page_key,
    locale: row.locale,
    title: row.title,
    contentJson: row.content_json,
    status: row.status as PageStatus,
  };
}

function getString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function getStringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length > 0 ? items : fallback;
}

export function getDefaultChapterHomepageContent(input: {
  chapterName: string;
  country: string;
  contactEmail: string;
}) {
  return {
    heroTitle: `${input.chapterName} Leadership in Action`,
    heroSubtitle: `A local WIAL chapter serving leaders, coaches, and organizations across ${input.country}.`,
    missionTitle: "About This Chapter",
    missionBody: `${input.chapterName} brings action learning into the local leadership community through practical programs, chapter events, and certified coach engagement.`,
    impactTitle: "What This Chapter Focuses On",
    impactBody: `This chapter creates local momentum while staying connected to the shared standards and global network of WIAL.`,
    focusAreas: [
      "Leadership development",
      "Action learning facilitation",
      "Chapter events",
    ],
    contactTitle: "Connect With This Chapter",
    contactBody: `Reach the ${input.chapterName} team for local events, partnerships, and chapter involvement.`,
    contactEmail: input.contactEmail,
  } satisfies ChapterHomepageContent;
}

export function getDefaultChapterAboutContent(input: {
  chapterName: string;
  country: string;
  contactEmail: string;
}) {
  return {
    heroTitle: `About ${input.chapterName}`,
    heroSubtitle: `${input.chapterName} brings action learning into ${input.country} through local leadership development, chapter events, and a globally connected coaching community.`,
    missionTitle: "Mission",
    missionBody: `${input.chapterName} helps leaders, teams, and organizations in ${input.country} solve meaningful problems while building stronger learning cultures.`,
    impactTitle: "Local Impact",
    impactBody: `This chapter translates the WIAL model into local practice, relationships, and programs that fit the needs of the ${input.country} community.`,
    focusAreas: [
      "Leadership development",
      "Action learning facilitation",
      "Chapter community building",
    ],
    ctaTitle: `Explore the people and events shaping ${input.country}`,
    ctaBody:
      "Move from chapter context into the local directory and upcoming events to see how this chapter is active on the ground.",
  } satisfies ChapterAboutContent;
}

export function getDefaultChapterContactContent(input: {
  chapterName: string;
  country: string;
  contactEmail: string;
}) {
  return {
    heroTitle: `Connect with the ${input.country} chapter`,
    heroSubtitle: `Reach ${input.chapterName} for questions about local chapter activity, coaching connections, events, and partnerships.`,
    formTitle: "Reach the local chapter team",
    formBody: `Use this page to contact ${input.chapterName} about local chapter membership, directory participation, events, and partnerships.`,
    contactTitle: `${input.chapterName} Contact Details`,
    contactBody: `You can reach the ${input.chapterName} team directly through the email below.`,
    contactEmail: input.contactEmail,
  } satisfies ChapterContactContent;
}

export function parseChapterHomepageContent(
  contentJson: Record<string, unknown> | null | undefined,
  fallback: ChapterHomepageContent,
) {
  const source = contentJson ?? {};

  return {
    heroTitle: getString(source.heroTitle, fallback.heroTitle),
    heroSubtitle: getString(source.heroSubtitle, fallback.heroSubtitle),
    missionTitle: getString(source.missionTitle, fallback.missionTitle),
    missionBody: getString(source.missionBody, fallback.missionBody),
    impactTitle: getString(source.impactTitle, fallback.impactTitle),
    impactBody: getString(source.impactBody, fallback.impactBody),
    focusAreas: getStringArray(source.focusAreas, fallback.focusAreas),
    contactTitle: getString(source.contactTitle, fallback.contactTitle),
    contactBody: getString(source.contactBody, fallback.contactBody),
    contactEmail: getString(source.contactEmail, fallback.contactEmail),
  } satisfies ChapterHomepageContent;
}

export function parseChapterAboutContent(
  contentJson: Record<string, unknown> | null | undefined,
  fallback: ChapterAboutContent,
) {
  const source = contentJson ?? {};

  return {
    heroTitle: getString(source.heroTitle, fallback.heroTitle),
    heroSubtitle: getString(source.heroSubtitle, fallback.heroSubtitle),
    missionTitle: getString(source.missionTitle, fallback.missionTitle),
    missionBody: getString(source.missionBody, fallback.missionBody),
    impactTitle: getString(source.impactTitle, fallback.impactTitle),
    impactBody: getString(source.impactBody, fallback.impactBody),
    focusAreas: getStringArray(source.focusAreas, fallback.focusAreas),
    ctaTitle: getString(source.ctaTitle, fallback.ctaTitle),
    ctaBody: getString(source.ctaBody, fallback.ctaBody),
  } satisfies ChapterAboutContent;
}

export function parseChapterContactContent(
  contentJson: Record<string, unknown> | null | undefined,
  fallback: ChapterContactContent,
) {
  const source = contentJson ?? {};

  return {
    heroTitle: getString(source.heroTitle, fallback.heroTitle),
    heroSubtitle: getString(source.heroSubtitle, fallback.heroSubtitle),
    formTitle: getString(source.formTitle, fallback.formTitle),
    formBody: getString(source.formBody, fallback.formBody),
    contactTitle: getString(source.contactTitle, fallback.contactTitle),
    contactBody: getString(source.contactBody, fallback.contactBody),
    contactEmail: getString(source.contactEmail, fallback.contactEmail),
  } satisfies ChapterContactContent;
}

export async function getManagedPageByChapterAndKey(chapterId: string, pageKey: string) {
  const result = await queryDb<ManagedPageRow>(
    `
      select
        id,
        chapter_id,
        page_key,
        locale,
        title,
        content_json,
        status
      from pages
      where chapter_id = $1
        and page_key = $2
      order by updated_at desc
      limit 1
    `,
    [chapterId, pageKey],
  );

  const row = getSingleRow(result);
  return row ? mapManagedPage(row) : null;
}

export async function getPublishedManagedPageByChapterAndKey(chapterId: string, pageKey: string) {
  const result = await queryDb<ManagedPageRow>(
    `
      select
        id,
        chapter_id,
        page_key,
        locale,
        title,
        content_json,
        status
      from pages
      where chapter_id = $1
        and page_key = $2
        and status = 'published'
      order by updated_at desc
      limit 1
    `,
    [chapterId, pageKey],
  );

  const row = getSingleRow(result);
  return row ? mapManagedPage(row) : null;
}

export async function upsertManagedPage(input: UpsertManagedPageInput) {
  return withTransaction(async (client) => {
    const updated = await client.query<ManagedPageRow>(
      `
        update pages
        set
          title = $4,
          content_json = $5::jsonb,
          status = $6
        where chapter_id = $1
          and page_key = $2
          and locale = $3
        returning
          id,
          chapter_id,
          page_key,
          locale,
          title,
          content_json,
          status
      `,
      [
        input.chapterId,
        input.pageKey,
        input.locale,
        input.title,
        JSON.stringify(input.contentJson),
        input.status ?? "published",
      ],
    );

    const updatedRow = getSingleRow(updated);

    if (updatedRow) {
      return mapManagedPage(updatedRow);
    }

    const inserted = await client.query<ManagedPageRow>(
      `
        insert into pages (
          chapter_id,
          page_key,
          locale,
          title,
          content_json,
          status
        )
        values ($1, $2, $3, $4, $5::jsonb, $6)
        returning
          id,
          chapter_id,
          page_key,
          locale,
          title,
          content_json,
          status
      `,
      [
        input.chapterId,
        input.pageKey,
        input.locale,
        input.title,
        JSON.stringify(input.contentJson),
        input.status ?? "published",
      ],
    );

    return mapManagedPage(inserted.rows[0]);
  });
}
