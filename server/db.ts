import pg from "pg";
import type { PoolClient, QueryResultRow } from "pg";

const { Pool } = pg;

let pool: pg.Pool | null = null;

export function getPool() {
  if (!process.env.DATABASE_URL) return null;

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.DATABASE_SSL === "false"
          ? false
          : { rejectUnauthorized: false },
      max: Number(process.env.DB_POOL_MAX || 10),
    });
  }

  return pool;
}

export async function dbQuery<T extends QueryResultRow = QueryResultRow>(
  text: string,
  values: unknown[] = []
) {
  const p = getPool();

  if (!p) {
    throw new Error("DATABASE_URL is not configured");
  }

  return p.query<T>(text, values);
}

export async function dbTransaction<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const p = getPool();

  if (!p) {
    throw new Error("DATABASE_URL is not configured");
  }

  const client = await p.connect();

  try {
    await client.query("BEGIN");

    try {
      const result = await fn(client);

      await client.query("COMMIT");

      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  } finally {
    client.release();
  }
}

export async function closeDb() {
  if (pool) {
    await pool.end();
  }

  pool = null;
}
