import { Pool } from 'pg';
import { loadRootEnv } from './load-env';

const phase = process.argv[2] ?? 'post';
loadRootEnv();
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to run PostGIS migrations');
}

const pool = new Pool({ connectionString: databaseUrl });

const preSql = `
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
`;

const postSql = `
CREATE INDEX IF NOT EXISTS places_location_gix ON places USING GIST (location);
CREATE INDEX IF NOT EXISTS user_location_snapshots_location_gix ON user_location_snapshots USING GIST (location);
CREATE INDEX IF NOT EXISTS checkins_location_gix ON checkins USING GIST (location);
CREATE INDEX IF NOT EXISTS places_name_trgm_idx ON places USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS place_aliases_alias_trgm_idx ON place_aliases USING GIN (alias gin_trgm_ops);
`;

try {
  await pool.query(phase === 'pre' ? preSql : postSql);
} finally {
  await pool.end();
}
