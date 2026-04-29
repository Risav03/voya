-- Drizzle tracks the schema, while this custom migration owns PostGIS-specific indexes.
CREATE INDEX IF NOT EXISTS places_location_gix ON places USING GIST (location);
CREATE INDEX IF NOT EXISTS user_location_snapshots_location_gix ON user_location_snapshots USING GIST (location);
CREATE INDEX IF NOT EXISTS checkins_location_gix ON checkins USING GIST (location);
CREATE INDEX IF NOT EXISTS places_name_trgm_idx ON places USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS place_aliases_alias_trgm_idx ON place_aliases USING GIN (alias gin_trgm_ops);
