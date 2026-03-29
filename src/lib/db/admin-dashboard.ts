import { queryDb } from "./client";

export interface AdminDashboardStats {
  chapterCount: number;
  coachCount: number;
  eventCount: number;
}

export interface AdminDashboardChapter {
  id: string;
  name: string;
  slug: string;
  country: string;
  primaryLanguage: string;
  contactEmail: string;
  status: string;
  coachCount: number;
  eventCount: number;
}

export interface AdminDashboardCoach {
  id: string;
  name: string;
  chapterId: string;
  chapterName: string;
  certificationLevel: string;
  location: string | null;
  languages: string[];
  bio: string | null;
}

export interface AdminDashboardAccessRecord {
  id: string;
  fullName: string;
  email: string;
  status: string;
  role: string;
  chapterId: string;
  chapterName: string;
  chapterSlug: string;
}

export interface AdminDashboardPendingCoachApproval {
  id: string;
  name: string;
  chapterId: string;
  chapterName: string;
  chapterSlug: string;
  chapterCountry: string;
  certificationLevel: string;
  location: string | null;
  contactEmail: string | null;
  submittedByName: string | null;
  submittedAt: string | null;
}

export interface AdminDashboardData {
  stats: AdminDashboardStats;
  chapters: AdminDashboardChapter[];
  coaches: AdminDashboardCoach[];
  accessRecords: AdminDashboardAccessRecord[];
  pendingCoachApprovals: AdminDashboardPendingCoachApproval[];
}

interface StatsRow {
  chapter_count: string;
  coach_count: string;
  event_count: string;
}

interface ChapterRow {
  id: string;
  name: string;
  slug: string;
  country: string;
  primary_language: string;
  contact_email: string;
  status: string;
  coach_count: string;
  event_count: string;
}

interface CoachRow {
  id: string;
  name: string;
  chapter_id: string;
  chapter_name: string;
  certification_level: string;
  location: string | null;
  languages: string[];
  bio: string | null;
}

interface AccessRow {
  id: string;
  full_name: string;
  email: string;
  status: string;
  role: string;
  chapter_id: string;
  chapter_name: string;
  chapter_slug: string;
}

interface PendingCoachApprovalRow {
  id: string;
  name: string;
  chapter_id: string;
  chapter_name: string;
  chapter_slug: string;
  chapter_country: string;
  certification_level: string;
  location: string | null;
  contact_email: string | null;
  submitted_by_name: string | null;
  submitted_at: string | null;
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const [statsResult, chaptersResult, coachesResult, accessResult, pendingApprovalsResult] =
    await Promise.all([
    queryDb<StatsRow>(`
      select
        (select count(*) from chapters) as chapter_count,
        (select count(*) from coaches where is_published = true) as coach_count,
        (select count(*) from events) as event_count
    `),
    queryDb<ChapterRow>(`
      select
        c.id,
        c.name,
        c.slug,
        c.country,
        c.primary_language,
        c.contact_email,
        c.status,
        count(distinct co.id)::text as coach_count,
        count(distinct e.id)::text as event_count
      from chapters c
      left join coaches co on co.chapter_id = c.id and co.is_published = true
      left join events e on e.chapter_id = c.id
      group by c.id
      order by c.name asc
    `),
    queryDb<CoachRow>(`
      select
        co.id,
        co.name,
        co.chapter_id,
        c.name as chapter_name,
        co.certification_level,
        co.location,
        co.languages,
        co.bio
      from coaches co
      inner join chapters c on c.id = co.chapter_id
      where co.is_published = true
      order by c.name asc, co.name asc
    `),
    queryDb<AccessRow>(`
      select
        u.id,
        u.full_name,
        u.email,
        u.status,
        ur.role,
        c.id as chapter_id,
        c.name as chapter_name,
        c.slug as chapter_slug
      from user_roles ur
      inner join users u on u.id = ur.user_id
      inner join chapters c on c.id = ur.chapter_id
      where ur.role in ('chapter_lead', 'content_creator', 'coach')
      order by c.name asc, ur.role asc, u.full_name asc
    `),
    queryDb<PendingCoachApprovalRow>(`
      select
        coaches.id,
        coaches.name,
        coaches.chapter_id,
        chapters.name as chapter_name,
        chapters.slug as chapter_slug,
        chapters.country as chapter_country,
        coaches.certification_level,
        coaches.location,
        coaches.contact_email,
        users.full_name as submitted_by_name,
        coaches.submitted_at
      from coaches
      inner join chapters on chapters.id = coaches.chapter_id
      left join users on users.id = coaches.submitted_by_user_id
      where coaches.approval_status = 'pending'
      order by chapters.country asc, chapters.name asc, coaches.submitted_at asc
    `),
  ]);

  const statsRow = statsResult.rows[0];

  return {
    stats: {
      chapterCount: Number(statsRow?.chapter_count ?? 0),
      coachCount: Number(statsRow?.coach_count ?? 0),
      eventCount: Number(statsRow?.event_count ?? 0),
    },
    chapters: chaptersResult.rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      country: row.country,
      primaryLanguage: row.primary_language,
      contactEmail: row.contact_email,
      status: row.status,
      coachCount: Number(row.coach_count),
      eventCount: Number(row.event_count),
    })),
    coaches: coachesResult.rows.map((row) => ({
      id: row.id,
      name: row.name,
      chapterId: row.chapter_id,
      chapterName: row.chapter_name,
      certificationLevel: row.certification_level,
      location: row.location,
      languages: row.languages,
      bio: row.bio,
    })),
    accessRecords: accessResult.rows.map((row) => ({
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      status: row.status,
      role: row.role,
      chapterId: row.chapter_id,
      chapterName: row.chapter_name,
      chapterSlug: row.chapter_slug,
    })),
    pendingCoachApprovals: pendingApprovalsResult.rows.map((row) => ({
      id: row.id,
      name: row.name,
      chapterId: row.chapter_id,
      chapterName: row.chapter_name,
      chapterSlug: row.chapter_slug,
      chapterCountry: row.chapter_country,
      certificationLevel: row.certification_level,
      location: row.location,
      contactEmail: row.contact_email,
      submittedByName: row.submitted_by_name,
      submittedAt: row.submitted_at,
    })),
  };
}
