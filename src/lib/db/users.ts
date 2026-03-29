import type { AppUser, UserStatus } from "../../types/domain";

import { getSingleRow, queryDb, withTransaction } from "./client";

interface UserRow {
  id: string;
  full_name: string;
  email: string;
  cognito_sub: string | null;
  status: string;
}

export interface UpsertUserInput {
  fullName: string | null;
  email: string;
  cognitoSub: string | null;
  status?: UserStatus;
}

function mapUser(row: UserRow): AppUser {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    cognitoSub: row.cognito_sub,
    status: row.status as UserStatus,
  };
}

export async function getUserById(userId: string) {
  const result = await queryDb<UserRow>(
    `
      select
        id,
        full_name,
        email,
        cognito_sub,
        status
      from users
      where id = $1
      limit 1
    `,
    [userId],
  );

  const row = getSingleRow(result);
  return row ? mapUser(row) : null;
}

export async function getUserByCognitoSub(cognitoSub: string) {
  const result = await queryDb<UserRow>(
    `
      select
        id,
        full_name,
        email,
        cognito_sub,
        status
      from users
      where cognito_sub = $1
      limit 1
    `,
    [cognitoSub],
  );

  const row = getSingleRow(result);
  return row ? mapUser(row) : null;
}

export async function getUserByEmail(email: string) {
  const result = await queryDb<UserRow>(
    `
      select
        id,
        full_name,
        email,
        cognito_sub,
        status
      from users
      where lower(email) = lower($1)
      limit 1
    `,
    [email],
  );

  const row = getSingleRow(result);
  return row ? mapUser(row) : null;
}

export async function upsertUser(input: UpsertUserInput) {
  return withTransaction(async (client) => {
    if (input.cognitoSub) {
      const bySub = await client.query<UserRow>(
        `
          select
            id,
            full_name,
            email,
            cognito_sub,
            status
          from users
          where cognito_sub = $1
          limit 1
        `,
        [input.cognitoSub],
      );

      if ((bySub.rowCount ?? 0) > 0) {
        const updated = await client.query<UserRow>(
          `
            update users
            set
              full_name = coalesce($2, full_name),
              email = lower($3),
              status = $4
            where cognito_sub = $1
            returning
              id,
              full_name,
              email,
              cognito_sub,
              status
          `,
          [
            input.cognitoSub,
            input.fullName,
            input.email,
            input.status ?? "active",
          ],
        );

        return mapUser(updated.rows[0]);
      }
    }

    const byEmail = await client.query<UserRow>(
      `
        select
          id,
          full_name,
          email,
          cognito_sub,
          status
        from users
        where lower(email) = lower($1)
        limit 1
      `,
      [input.email],
    );

    if ((byEmail.rowCount ?? 0) > 0) {
      const updated = await client.query<UserRow>(
        `
            update users
            set
            full_name = coalesce($2, full_name),
            cognito_sub = coalesce(cognito_sub, $3),
            status = $4
          where lower(email) = lower($1)
          returning
            id,
            full_name,
            email,
            cognito_sub,
            status
        `,
        [
          input.email,
          input.fullName,
          input.cognitoSub,
          input.status ?? "active",
        ],
      );

      return mapUser(updated.rows[0]);
    }

    const result = await client.query<UserRow>(
      `
        insert into users (
          full_name,
          email,
          cognito_sub,
          status
        )
        values ($1, lower($2), $3, $4)
        returning
          id,
          full_name,
          email,
          cognito_sub,
          status
      `,
      [
        input.fullName ?? input.email,
        input.email,
        input.cognitoSub,
        input.status ?? "active",
      ],
    );

    return mapUser(result.rows[0]);
  });
}

export async function createOrUpdatePendingUser(input: {
  fullName: string;
  email: string;
  status?: UserStatus;
}) {
  return withTransaction(async (client) => {
    const existing = await client.query<UserRow>(
      `
        select
          id,
          full_name,
          email,
          cognito_sub,
          status
        from users
        where lower(email) = lower($1)
        limit 1
      `,
      [input.email],
    );

    if ((existing.rowCount ?? 0) > 0) {
      const updated = await client.query<UserRow>(
        `
          update users
          set
            full_name = $2,
            status = $3
          where lower(email) = lower($1)
          returning
            id,
            full_name,
            email,
            cognito_sub,
            status
        `,
        [input.email, input.fullName, input.status ?? "pending"],
      );

      return mapUser(updated.rows[0]);
    }

    const inserted = await client.query<UserRow>(
      `
        insert into users (
          full_name,
          email,
          cognito_sub,
          status
        )
        values ($1, lower($2), null, $3)
        returning
          id,
          full_name,
          email,
          cognito_sub,
          status
      `,
      [input.fullName, input.email, input.status ?? "pending"],
    );

    return mapUser(inserted.rows[0]);
  });
}
