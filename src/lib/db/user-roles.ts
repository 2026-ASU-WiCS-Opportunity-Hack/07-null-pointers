import type { RoleAssignment } from "../../types/rbac";

import { getSingleRow, queryDb } from "./client";

interface RoleAssignmentRow {
  role: RoleAssignment["role"];
  chapter_id: string | null;
  chapter_slug: string | null;
}

export interface UserRoleWithChapter extends RoleAssignment {
  chapterSlug: string | null;
}

export interface ChapterTeamMember {
  userId: string;
  fullName: string;
  email: string;
  status: string;
  role: RoleAssignment["role"];
  chapterId: string;
  chapterSlug: string;
}

export interface ChapterLeadContact {
  userId: string;
  fullName: string;
  email: string;
}

function mapRoleAssignment(row: RoleAssignmentRow): UserRoleWithChapter {
  return {
    role: row.role,
    chapterId: row.chapter_id,
    chapterSlug: row.chapter_slug,
  };
}

export async function listRoleAssignmentsForUser(userId: string) {
  const result = await queryDb<RoleAssignmentRow>(
    `
      select
        ur.role,
        ur.chapter_id,
        c.slug as chapter_slug
      from user_roles ur
      left join chapters c on c.id = ur.chapter_id
      where ur.user_id = $1
      order by
        case ur.role
          when 'global_admin' then 1
          when 'chapter_lead' then 2
          when 'content_creator' then 3
          when 'coach' then 4
          else 5
        end,
        c.name asc nulls last
    `,
    [userId],
  );

  return result.rows.map(mapRoleAssignment);
}

export async function getGlobalAdminAssignment(userId: string) {
  const result = await queryDb<RoleAssignmentRow>(
    `
      select
        ur.role,
        ur.chapter_id,
        c.slug as chapter_slug
      from user_roles ur
      left join chapters c on c.id = ur.chapter_id
      where ur.user_id = $1
        and ur.role = 'global_admin'
      limit 1
    `,
    [userId],
  );

  const row = getSingleRow(result);
  return row ? mapRoleAssignment(row) : null;
}

export async function getChapterScopedAssignments(userId: string) {
  const result = await queryDb<RoleAssignmentRow>(
    `
      select
        ur.role,
        ur.chapter_id,
        c.slug as chapter_slug
      from user_roles ur
      left join chapters c on c.id = ur.chapter_id
      where ur.user_id = $1
        and ur.chapter_id is not null
      order by c.name asc, ur.role asc
    `,
    [userId],
  );

  return result.rows.map(mapRoleAssignment);
}

export async function assignRoleToUser(input: {
  userId: string;
  role: RoleAssignment["role"];
  chapterId: string | null;
}) {
  const result = await queryDb<RoleAssignmentRow>(
    `
      insert into user_roles (
        user_id,
        role,
        chapter_id
      )
      values ($1, $2, $3)
      on conflict do nothing
      returning role, chapter_id, null::text as chapter_slug
    `,
    [input.userId, input.role, input.chapterId],
  );

  const inserted = getSingleRow(result);

  if (inserted) {
    return mapRoleAssignment(inserted);
  }

  const existing = await queryDb<RoleAssignmentRow>(
    `
      select
        ur.role,
        ur.chapter_id,
        c.slug as chapter_slug
      from user_roles ur
      left join chapters c on c.id = ur.chapter_id
      where ur.user_id = $1
        and ur.role = $2
        and (
          ($3::uuid is null and ur.chapter_id is null) or
          ur.chapter_id = $3::uuid
        )
      limit 1
    `,
    [input.userId, input.role, input.chapterId],
  );

  const row = getSingleRow(existing);
  return row ? mapRoleAssignment(row) : null;
}

export async function listChapterTeamMembers(chapterId: string) {
  const result = await queryDb<{
    user_id: string;
    full_name: string;
    email: string;
    status: string;
    role: RoleAssignment["role"];
    chapter_id: string;
    chapter_slug: string;
  }>(
    `
      select
        u.id as user_id,
        u.full_name,
        u.email,
        u.status,
        ur.role,
        c.id as chapter_id,
        c.slug as chapter_slug
      from user_roles ur
      inner join users u on u.id = ur.user_id
      inner join chapters c on c.id = ur.chapter_id
      where ur.chapter_id = $1
      order by
        case ur.role
          when 'chapter_lead' then 1
          when 'content_creator' then 2
          when 'coach' then 3
          else 4
        end,
        u.full_name asc
    `,
    [chapterId],
  );

  return result.rows.map((row) => ({
    userId: row.user_id,
    fullName: row.full_name,
    email: row.email,
    status: row.status,
    role: row.role,
    chapterId: row.chapter_id,
    chapterSlug: row.chapter_slug,
  })) satisfies ChapterTeamMember[];
}

export async function listChapterLeadContacts(chapterId: string) {
  const result = await queryDb<{
    user_id: string;
    full_name: string;
    email: string;
  }>(
    `
      select
        u.id as user_id,
        u.full_name,
        u.email
      from user_roles ur
      inner join users u on u.id = ur.user_id
      where ur.chapter_id = $1
        and ur.role = 'chapter_lead'
      order by u.full_name asc
    `,
    [chapterId],
  );

  return result.rows.map((row) => ({
    userId: row.user_id,
    fullName: row.full_name,
    email: row.email,
  })) satisfies ChapterLeadContact[];
}
