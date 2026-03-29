import type { ChapterEvent } from "../../types/domain";

import { queryDb } from "./client";

interface ChapterEventRow {
  id: string;
  chapter_id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  location: string | null;
  is_global_visible: boolean;
  chapter_name?: string;
  chapter_slug?: string;
  chapter_country?: string;
}

export interface UpsertChapterEventInput {
  chapterId: string;
  title: string;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
  location?: string | null;
  isGlobalVisible?: boolean;
}

export interface PublicEventWithChapter extends ChapterEvent {
  chapterName: string;
  chapterSlug: string;
  chapterCountry: string;
}

function mapChapterEvent(row: ChapterEventRow): ChapterEvent {
  return {
    id: row.id,
    chapterId: row.chapter_id,
    title: row.title,
    description: row.description,
    startDate: row.start_date,
    endDate: row.end_date,
    location: row.location,
    isGlobalVisible: row.is_global_visible,
  };
}

function mapPublicEvent(row: ChapterEventRow): PublicEventWithChapter {
  return {
    ...mapChapterEvent(row),
    chapterName: row.chapter_name ?? "Unknown Chapter",
    chapterSlug: row.chapter_slug ?? "",
    chapterCountry: row.chapter_country ?? "Unknown Country",
  };
}

export async function listEventsByChapter(chapterId: string) {
  const result = await queryDb<ChapterEventRow>(
    `
      select
        id,
        chapter_id,
        title,
        description,
        start_date,
        end_date,
        location,
        is_global_visible
      from events
      where chapter_id = $1
      order by start_date asc
    `,
    [chapterId],
  );

  return result.rows.map(mapChapterEvent);
}

export async function createChapterEvent(input: UpsertChapterEventInput) {
  const result = await queryDb<ChapterEventRow>(
    `
      insert into events (
        chapter_id,
        title,
        description,
        start_date,
        end_date,
        location,
        is_global_visible
      )
      values ($1, $2, $3, $4, $5, $6, $7)
      returning
        id,
        chapter_id,
        title,
        description,
        start_date,
        end_date,
        location,
        is_global_visible
    `,
    [
      input.chapterId,
      input.title,
      input.description ?? null,
      input.startDate,
      input.endDate ?? null,
      input.location ?? null,
      input.isGlobalVisible ?? false,
    ],
  );

  return mapChapterEvent(result.rows[0]);
}

export async function listPublicEvents() {
  const result = await queryDb<ChapterEventRow>(
    `
      select
        events.id,
        events.chapter_id,
        events.title,
        events.description,
        events.start_date,
        events.end_date,
        events.location,
        events.is_global_visible,
        chapters.name as chapter_name,
        chapters.slug as chapter_slug,
        chapters.country as chapter_country
      from events
      inner join chapters on chapters.id = events.chapter_id
      order by events.start_date asc, chapters.name asc
    `,
  );

  return result.rows.map(mapPublicEvent);
}
