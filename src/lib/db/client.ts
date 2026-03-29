import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from "pg";

import { getDatabaseUrl } from "./config";

declare global {
  var __wialDbPool: Pool | undefined;
}

function createPool() {
  return new Pool({
    connectionString: getDatabaseUrl(),
    ssl: {
      rejectUnauthorized: false,
    },
    max: 10,
  });
}

export function getDbPool() {
  if (!global.__wialDbPool) {
    global.__wialDbPool = createPool();
  }

  return global.__wialDbPool;
}

export async function queryDb<T extends QueryResultRow>(
  text: string,
  params: unknown[] = [],
) {
  return getDbPool().query<T>(text, params);
}

export async function withDbClient<T>(
  callback: (client: PoolClient) => Promise<T>,
) {
  const client = await getDbPool().connect();

  try {
    return await callback(client);
  } finally {
    client.release();
  }
}

export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>,
) {
  return withDbClient(async (client) => {
    await client.query("BEGIN");

    try {
      const result = await callback(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  });
}

export function getSingleRow<T extends QueryResultRow>(
  result: QueryResult<T>,
) {
  return result.rows[0] ?? null;
}

