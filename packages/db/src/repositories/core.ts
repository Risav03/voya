import { and, desc, eq, isNull, sql } from 'drizzle-orm';
import type { Database } from '../client';
import {
  appEvents,
  auditLogs,
  checkins,
  feedItems,
  geoSql,
  ingestionJobs,
  itineraryRevisions,
  itineraryVersions,
  notifications,
  placeAliases,
  placeSources,
  places,
  savedCollections,
  savedItems,
  travelGraphEdges,
  tripDays,
  tripPreferences,
  trips,
  tripStops,
  userAchievements,
  userLocationSnapshots,
  users,
} from '../schema';

export interface CoordinatesInput { latitude: number; longitude: number }
export interface EventInput {
  name: string;
  actorUserId?: string;
  entityType: string;
  entityId: string;
  traceId: string;
  payload?: Record<string, unknown>;
}

export class CoreRepository {
  constructor(private readonly db: Database) {}

  async ensureUser(input: { id: string; email?: string | null; name?: string | null; imageUrl?: string | null }) {
    const existing = await this.db.select().from(users).where(eq(users.id, input.id)).limit(1);
    if (existing[0]) return existing[0];

    const inserted = await this.db.insert(users).values({
      id: input.id,
      email: input.email ?? `${input.id}@local.reelstravel`,
      name: input.name ?? 'Traveler',
      imageUrl: input.imageUrl ?? null,
    }).returning();
    return inserted[0]!;
  }

  createEvent(input: EventInput) {
    return this.db.insert(appEvents).values({
      name: input.name,
      actorUserId: input.actorUserId,
      entityType: input.entityType,
      entityId: input.entityId,
      traceId: input.traceId,
      payload: input.payload ?? {},
    }).returning();
  }

  createAudit(input: { actorUserId?: string; action: string; entityType: string; entityId?: string; before?: Record<string, unknown> | null; after?: Record<string, unknown> | null; traceId: string; ipAddress?: string; userAgent?: string }) {
    return this.db.insert(auditLogs).values(input).returning();
  }

  async createSavedItemWithJob(input: { userId: string; collectionId?: string; sourceUrl: string; sourcePlatform: string; caption?: string; rawPayload: Record<string, unknown>; traceId: string }) {
    return this.db.transaction(async (tx) => {
      const [savedItem] = await tx.insert(savedItems).values({
        userId: input.userId,
        collectionId: input.collectionId,
        sourceUrl: input.sourceUrl,
        sourcePlatform: input.sourcePlatform,
        caption: input.caption,
        rawPayload: input.rawPayload,
        status: 'queued',
      }).returning();

      const [job] = await tx.insert(ingestionJobs).values({
        userId: input.userId,
        savedItemId: savedItem!.id,
        sourceUrl: input.sourceUrl,
        status: 'active',
        currentStage: 'metadata.fetch',
        rawPayload: input.rawPayload,
      }).returning();

      await tx.insert(appEvents).values({
        name: 'reel.saved',
        actorUserId: input.userId,
        entityType: 'saved_item',
        entityId: savedItem!.id,
        traceId: input.traceId,
        payload: { ingestionJobId: job!.id, sourceUrl: input.sourceUrl },
      });

      return { savedItem: savedItem!, job: job! };
    });
  }

  getIngestionJobForUser(userId: string, id: string) {
    return this.db.select().from(ingestionJobs).where(and(eq(ingestionJobs.userId, userId), eq(ingestionJobs.id, id))).limit(1);
  }

  updateIngestionJob(id: string, values: Partial<typeof ingestionJobs.$inferInsert>) {
    return this.db.update(ingestionJobs).set({ ...values, updatedAt: new Date() }).where(eq(ingestionJobs.id, id)).returning();
  }

  updateSavedItem(id: string, values: Partial<typeof savedItems.$inferInsert>) {
    return this.db.update(savedItems).set({ ...values, updatedAt: new Date() }).where(eq(savedItems.id, id)).returning();
  }

  async resolveOrCreatePlace(input: { name: string; kind?: typeof places.$inferInsert.kind; coordinates?: CoordinatesInput; address?: Record<string, unknown>; sourceUrl?: string; sourceId?: string; rawPayload?: Record<string, unknown>; confidence?: string; resolvedBy: string }) {
    const existing = await this.db.select().from(places).where(eq(places.name, input.name)).limit(1);
    if (existing[0]) return existing[0];

    const fallback = input.coordinates ?? { latitude: 0, longitude: 0 };
    const [place] = await this.db.insert(places).values({
      name: input.name,
      kind: input.kind ?? 'unknown',
      address: input.address ?? {},
      location: { x: fallback.longitude, y: fallback.latitude },
      confidence: input.confidence ?? '0.650',
      provenance: [{ source: input.resolvedBy, sourceUrl: input.sourceUrl, confidence: Number(input.confidence ?? '0.65') }],
    }).returning();

    await this.db.insert(placeSources).values({
      placeId: place!.id,
      source: input.resolvedBy,
      sourceUrl: input.sourceUrl,
      sourceId: input.sourceId,
      rawPayload: input.rawPayload ?? {},
      confidence: input.confidence ?? '0.650',
      resolvedBy: input.resolvedBy,
    });

    await this.db.insert(placeAliases).values({
      placeId: place!.id,
      alias: input.name,
      source: input.resolvedBy,
      confidence: input.confidence ?? '0.650',
    });

    return place!;
  }

  listCollections(userId: string) {
    return this.db.select().from(savedCollections).where(and(eq(savedCollections.userId, userId), isNull(savedCollections.deletedAt))).orderBy(desc(savedCollections.createdAt));
  }

  createCollection(input: { userId: string; name: string; description?: string }) {
    return this.db.insert(savedCollections).values(input).returning();
  }

  getCollection(userId: string, id: string) {
    return this.db.select().from(savedCollections).where(and(eq(savedCollections.userId, userId), eq(savedCollections.id, id), isNull(savedCollections.deletedAt))).limit(1);
  }

  updateCollection(userId: string, id: string, values: Partial<typeof savedCollections.$inferInsert>) {
    return this.db.update(savedCollections).set({ ...values, updatedAt: new Date() }).where(and(eq(savedCollections.userId, userId), eq(savedCollections.id, id))).returning();
  }

  softDeleteCollection(userId: string, id: string) {
    return this.db.update(savedCollections).set({ deletedAt: new Date(), updatedAt: new Date() }).where(and(eq(savedCollections.userId, userId), eq(savedCollections.id, id))).returning();
  }

  listSavedItems(userId: string, collectionId?: string) {
    const predicates = [eq(savedItems.userId, userId), isNull(savedItems.deletedAt)];
    if (collectionId) predicates.push(eq(savedItems.collectionId, collectionId));
    return this.db.select().from(savedItems).where(and(...predicates)).orderBy(desc(savedItems.createdAt));
  }

  searchPlaces(input: { q?: string; longitude?: number; latitude?: number; radiusMeters?: number; limit?: number }) {
    if (input.longitude !== undefined && input.latitude !== undefined && input.radiusMeters) {
      return this.db.select({
        id: places.id,
        name: places.name,
        kind: places.kind,
        address: places.address,
        location: places.location,
        countryCode: places.countryCode,
        timezone: places.timezone,
        googlePlaceId: places.googlePlaceId,
        confidence: places.confidence,
        distanceMeters: sql<number>`ST_Distance(${places.location}::geography, ${geoSql.fromLngLat(input.longitude, input.latitude)}::geography)`,
      }).from(places).where(geoSql.withinMeters(places.location, input.longitude, input.latitude, input.radiusMeters)).limit(input.limit ?? 25);
    }

    return this.db.select().from(places).where(input.q ? sql`${places.name} ILIKE ${`%${input.q}%`}` : isNull(places.deletedAt)).limit(input.limit ?? 25);
  }

  getPlace(id: string) {
    return this.db.select().from(places).where(eq(places.id, id)).limit(1);
  }

  addPlaceAlias(input: { placeId: string; alias: string; source: string; confidence?: string }) {
    return this.db.insert(placeAliases).values(input).returning();
  }

  createTrip(input: { userId: string; title: string; destinationPlaceId?: string; startDate?: string; endDate?: string; preferences?: Record<string, unknown> }) {
    return this.db.transaction(async (tx) => {
      const [trip] = await tx.insert(trips).values({
        userId: input.userId,
        title: input.title,
        destinationPlaceId: input.destinationPlaceId,
        startDate: input.startDate,
        endDate: input.endDate,
        status: 'planning',
        source: 'manual',
      }).returning();

      if (input.preferences) {
        await tx.insert(tripPreferences).values({
          tripId: trip!.id,
          ...(input.preferences as Partial<typeof tripPreferences.$inferInsert>),
        });
      }

      await tx.insert(appEvents).values({ name: 'trip.created', actorUserId: input.userId, entityType: 'trip', entityId: trip!.id, traceId: trip!.id, payload: {} });
      return trip!;
    });
  }

  listTrips(userId: string) {
    return this.db.select().from(trips).where(and(eq(trips.userId, userId), isNull(trips.deletedAt))).orderBy(desc(trips.createdAt));
  }

  getTrip(userId: string, id: string) {
    return this.db.select().from(trips).where(and(eq(trips.userId, userId), eq(trips.id, id), isNull(trips.deletedAt))).limit(1);
  }

  updateTrip(userId: string, id: string, values: Partial<typeof trips.$inferInsert>) {
    return this.db.update(trips).set({ ...values, updatedAt: new Date() }).where(and(eq(trips.userId, userId), eq(trips.id, id))).returning();
  }

  async createItineraryVersion(input: { tripId: string; generatedBy: string; status?: string; payload?: Record<string, unknown>; qualityScore?: string }) {
    const rows = await this.db.select({ maxVersion: sql<number>`coalesce(max(${itineraryVersions.version}), 0)` }).from(itineraryVersions).where(eq(itineraryVersions.tripId, input.tripId));
    const version = Number(rows[0]?.maxVersion ?? 0) + 1;
    const [itinerary] = await this.db.insert(itineraryVersions).values({
      tripId: input.tripId,
      version,
      generatedBy: input.generatedBy,
      status: input.status ?? 'draft',
      payload: input.payload ?? {},
      qualityScore: input.qualityScore,
    }).returning();
    return itinerary!;
  }

  getLatestItinerary(tripId: string) {
    return this.db.select().from(itineraryVersions).where(eq(itineraryVersions.tripId, tripId)).orderBy(desc(itineraryVersions.version)).limit(1);
  }

  createItineraryRevision(input: { itineraryVersionId: string; reason: string; diff: Record<string, unknown>; createdByUserId?: string }) {
    return this.db.insert(itineraryRevisions).values(input).returning();
  }

  replaceTripPlan(input: { tripId: string; days: Array<{ dayNumber: number; date?: string; summary?: string; stops: Array<{ placeId: string; title: string; block: string; order: number; status?: string; rationale?: string; backupPlaceIds?: string[] }> }> }) {
    return this.db.transaction(async (tx) => {
      await tx.delete(tripStops).where(sql`${tripStops.tripDayId} in (select id from ${tripDays} where ${tripDays.tripId} = ${input.tripId})`);
      await tx.delete(tripDays).where(eq(tripDays.tripId, input.tripId));
      const createdDays = [];
      for (const day of input.days) {
        const [createdDay] = await tx.insert(tripDays).values({ tripId: input.tripId, dayNumber: day.dayNumber, date: day.date, summary: day.summary }).returning();
        createdDays.push(createdDay!);
        for (const stop of day.stops) {
          await tx.insert(tripStops).values({ tripDayId: createdDay!.id, ...stop, status: stop.status ?? 'planned', backupPlaceIds: stop.backupPlaceIds ?? [] });
        }
      }
      return createdDays;
    });
  }

  createCheckin(input: { userId: string; tripId?: string; placeId: string; coordinates: CoordinatesInput; note?: string; mediaAssetIds?: string[]; checkedInAt?: Date }) {
    return this.db.transaction(async (tx) => {
      const [checkin] = await tx.insert(checkins).values({
        userId: input.userId,
        tripId: input.tripId,
        placeId: input.placeId,
        location: { x: input.coordinates.longitude, y: input.coordinates.latitude },
        note: input.note,
        mediaAssetIds: input.mediaAssetIds ?? [],
        checkedInAt: input.checkedInAt ?? new Date(),
      }).returning();

      if (input.tripId) {
        await tx.insert(userLocationSnapshots).values({ userId: input.userId, tripId: input.tripId, location: { x: input.coordinates.longitude, y: input.coordinates.latitude }, capturedAt: new Date() });
      }

      await tx.insert(travelGraphEdges).values({ userId: input.userId, fromNodeType: 'user', fromNodeId: input.userId, toNodeType: 'place', toNodeId: input.placeId, type: 'visited', metadata: { tripId: input.tripId } });
      await tx.insert(appEvents).values({ name: 'checkin.created', actorUserId: input.userId, entityType: 'checkin', entityId: checkin!.id, traceId: checkin!.id, payload: { tripId: input.tripId, placeId: input.placeId } });
      return checkin!;
    });
  }

  listCheckinsForTrip(userId: string, tripId: string) {
    return this.db.select().from(checkins).where(and(eq(checkins.userId, userId), eq(checkins.tripId, tripId))).orderBy(desc(checkins.checkedInAt));
  }

  graph(userId: string) {
    return this.db.select().from(travelGraphEdges).where(eq(travelGraphEdges.userId, userId)).orderBy(desc(travelGraphEdges.createdAt));
  }

  createNotification(input: { userId: string; type: typeof notifications.$inferInsert.type; title: string; body: string; metadata?: Record<string, unknown> }) {
    return this.db.insert(notifications).values({ ...input, metadata: input.metadata ?? {} }).returning();
  }

  listNotifications(userId: string) {
    return this.db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
  }

  markNotificationsRead(userId: string, ids?: string[]) {
    return this.db.update(notifications).set({ readAt: new Date() }).where(ids?.length ? and(eq(notifications.userId, userId), sql`${notifications.id} = any(${ids})`) : eq(notifications.userId, userId)).returning();
  }

  achievements() {
    return this.db.select().from(userAchievements);
  }

  feed(userId: string) {
    return this.db.select().from(feedItems).where(eq(feedItems.userId, userId)).orderBy(desc(feedItems.createdAt));
  }
}
