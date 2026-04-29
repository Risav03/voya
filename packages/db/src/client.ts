import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { loadRootEnv } from './load-env';
import * as schema from './schema';

loadRootEnv();

export type Database = ReturnType<typeof createDatabase>['db'];

export function createDatabase(databaseUrl = process.env.DATABASE_URL) {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required');
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle(pool, { schema });

  return { db, pool };
}

export const database = createDatabase();
