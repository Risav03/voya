import { and, ilike, sql } from 'drizzle-orm';
import type { Database } from '../client';
import { geoSql, places } from '../schema';

export class PlacesRepository {
  constructor(private readonly db: Database) {}

  searchByName(query: string, limit = 20) {
    return this.db
      .select()
      .from(places)
      .where(ilike(places.name, `%${query}%`))
      .limit(limit);
  }

  searchNearby(input: { longitude: number; latitude: number; radiusMeters: number; limit?: number }) {
    return this.db
      .select({
        place: places,
        distanceMeters: sql<number>`ST_Distance(${places.location}::geography, ${geoSql.fromLngLat(input.longitude, input.latitude)}::geography)`,
      })
      .from(places)
      .where(
        and(
          geoSql.withinMeters(places.location, input.longitude, input.latitude, input.radiusMeters),
        ),
      )
      .limit(input.limit ?? 50);
  }
}
