import { sql } from 'drizzle-orm';
import {
  boolean,
  date,
  geometry,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

const now = () => timestamp('created_at', { withTimezone: true }).defaultNow().notNull();
const updatedAt = () => timestamp('updated_at', { withTimezone: true }).defaultNow().notNull();
const deletedAt = () => timestamp('deleted_at', { withTimezone: true });
const metadata = (name = 'metadata') => jsonb(name).$type<Record<string, unknown>>().default({}).notNull();
const geoPoint = (name: string) => geometry(name, { type: 'point', mode: 'xy', srid: 4326 });

export const subscriptionTier = pgEnum('subscription_tier', ['free', 'premium', 'admin']);
export const placeKind = pgEnum('place_kind', [
  'landmark',
  'restaurant',
  'cafe',
  'museum',
  'hotel',
  'nature',
  'beach',
  'neighborhood',
  'city',
  'country',
  'experience',
  'unknown',
]);
export const tripStatus = pgEnum('trip_status', ['planning', 'ready', 'live', 'completed', 'cancelled']);
export const ingestionStatus = pgEnum('ingestion_status', [
  'draft',
  'active',
  'paused',
  'completed',
  'failed',
  'cancelled',
]);
export const graphEdgeType = pgEnum('graph_edge_type', [
  'saved_from',
  'visited',
  'planned_for',
  'near',
  'part_of_city',
  'part_of_country',
  'inspired_by',
]);
export const notificationType = pgEnum('notification_type', [
  'ingestion_complete',
  'trip_update',
  'achievement',
  'billing',
  'system',
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  name: text('name').notNull(),
  imageUrl: text('image_url'),
  homeLocation: geoPoint('home_location'),
  subscriptionTier: subscriptionTier('subscription_tier').default('free').notNull(),
  createdAt: now(),
  updatedAt: updatedAt(),
  deletedAt: deletedAt(),
}, (table) => ({
  emailIdx: uniqueIndex('users_email_uidx').on(table.email),
}));

export const authAccounts = pgTable('auth_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  providerId: text('provider_id').notNull(),
  accountId: text('account_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at', { withTimezone: true }),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { withTimezone: true }),
  scope: text('scope'),
  password: text('password'),
  createdAt: now(),
  updatedAt: updatedAt(),
}, (table) => ({
  providerAccountIdx: uniqueIndex('auth_accounts_provider_account_uidx').on(table.providerId, table.accountId),
  userIdx: index('auth_accounts_user_idx').on(table.userId),
}));

export const authSessions = pgTable('auth_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: now(),
  updatedAt: updatedAt(),
}, (table) => ({
  tokenIdx: uniqueIndex('auth_sessions_token_uidx').on(table.token),
  userIdx: index('auth_sessions_user_idx').on(table.userId),
}));

export const authVerifications = pgTable('auth_verifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: now(),
  updatedAt: updatedAt(),
});

export const places = pgTable('places', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  kind: placeKind('kind').default('unknown').notNull(),
  address: jsonb('address').$type<Record<string, unknown>>().default({}).notNull(),
  location: geoPoint('location').notNull(),
  countryCode: text('country_code'),
  timezone: text('timezone'),
  googlePlaceId: text('google_place_id'),
  confidence: numeric('confidence', { precision: 4, scale: 3 }).default('1').notNull(),
  provenance: jsonb('provenance').$type<Record<string, unknown>[]>().default([]).notNull(),
  canonicalPlaceId: uuid('canonical_place_id'),
  createdAt: now(),
  updatedAt: updatedAt(),
  deletedAt: deletedAt(),
}, (table) => ({
  nameIdx: index('places_name_idx').on(table.name),
  googleIdx: uniqueIndex('places_google_place_uidx').on(table.googlePlaceId),
}));

export const placeAliases = pgTable('place_aliases', {
  id: uuid('id').primaryKey().defaultRandom(),
  placeId: uuid('place_id').notNull().references(() => places.id, { onDelete: 'cascade' }),
  alias: text('alias').notNull(),
  locale: text('locale'),
  source: text('source').notNull(),
  confidence: numeric('confidence', { precision: 4, scale: 3 }).default('1').notNull(),
  createdAt: now(),
}, (table) => ({
  aliasIdx: index('place_aliases_alias_idx').on(table.alias),
  placeIdx: index('place_aliases_place_idx').on(table.placeId),
}));

export const placeSources = pgTable('place_sources', {
  id: uuid('id').primaryKey().defaultRandom(),
  placeId: uuid('place_id').notNull().references(() => places.id, { onDelete: 'cascade' }),
  source: text('source').notNull(),
  sourceUrl: text('source_url'),
  sourceId: text('source_id'),
  rawPayload: metadata('raw_payload'),
  confidence: numeric('confidence', { precision: 4, scale: 3 }).default('1').notNull(),
  resolvedBy: text('resolved_by').notNull(),
  createdAt: now(),
}, (table) => ({
  placeIdx: index('place_sources_place_idx').on(table.placeId),
}));

export const savedCollections = pgTable('saved_collections', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  visibility: text('visibility').default('private').notNull(),
  coverAssetId: uuid('cover_asset_id'),
  createdAt: now(),
  updatedAt: updatedAt(),
  deletedAt: deletedAt(),
}, (table) => ({
  userIdx: index('saved_collections_user_idx').on(table.userId),
}));

export const savedItems = pgTable('saved_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  collectionId: uuid('collection_id').references(() => savedCollections.id, { onDelete: 'set null' }),
  placeId: uuid('place_id').references(() => places.id, { onDelete: 'set null' }),
  sourceUrl: text('source_url').notNull(),
  sourcePlatform: text('source_platform').notNull(),
  caption: text('caption'),
  rawPayload: metadata('raw_payload'),
  status: text('status').default('queued').notNull(),
  createdAt: now(),
  updatedAt: updatedAt(),
  deletedAt: deletedAt(),
}, (table) => ({
  userIdx: index('saved_items_user_idx').on(table.userId),
  placeIdx: index('saved_items_place_idx').on(table.placeId),
}));

export const travelGraphEdges = pgTable('travel_graph_edges', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  fromNodeType: text('from_node_type').notNull(),
  fromNodeId: uuid('from_node_id').notNull(),
  toNodeType: text('to_node_type').notNull(),
  toNodeId: uuid('to_node_id').notNull(),
  type: graphEdgeType('type').notNull(),
  weight: numeric('weight', { precision: 8, scale: 3 }).default('1').notNull(),
  metadata: metadata(),
  createdAt: now(),
}, (table) => ({
  userTypeIdx: index('travel_graph_edges_user_type_idx').on(table.userId, table.type),
  fromIdx: index('travel_graph_edges_from_idx').on(table.fromNodeId),
  toIdx: index('travel_graph_edges_to_idx').on(table.toNodeId),
}));

export const trips = pgTable('trips', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  destinationPlaceId: uuid('destination_place_id').references(() => places.id, { onDelete: 'set null' }),
  startDate: date('start_date'),
  endDate: date('end_date'),
  status: tripStatus('status').default('planning').notNull(),
  source: text('source').default('manual').notNull(),
  createdAt: now(),
  updatedAt: updatedAt(),
  deletedAt: deletedAt(),
}, (table) => ({
  userIdx: index('trips_user_idx').on(table.userId),
  destinationIdx: index('trips_destination_idx').on(table.destinationPlaceId),
}));

export const tripPreferences = pgTable('trip_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  tripId: uuid('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  budgetLevel: text('budget_level').default('medium').notNull(),
  pace: text('pace').default('balanced').notNull(),
  walkingToleranceKm: numeric('walking_tolerance_km', { precision: 5, scale: 2 }).default('8').notNull(),
  interests: jsonb('interests').$type<string[]>().default([]).notNull(),
  foodPreferences: jsonb('food_preferences').$type<string[]>().default([]).notNull(),
  indoorOutdoor: text('indoor_outdoor').default('balanced').notNull(),
  groupType: text('group_type').default('solo').notNull(),
  accessibilityNeeds: jsonb('accessibility_needs').$type<string[]>().default([]).notNull(),
  openHoursSensitivity: text('open_hours_sensitivity').default('high').notNull(),
  mustSeeWeight: numeric('must_see_weight', { precision: 4, scale: 3 }).default('0.650').notNull(),
  hiddenGemWeight: numeric('hidden_gem_weight', { precision: 4, scale: 3 }).default('0.350').notNull(),
  createdAt: now(),
  updatedAt: updatedAt(),
}, (table) => ({
  tripIdx: uniqueIndex('trip_preferences_trip_uidx').on(table.tripId),
}));

export const tripDays = pgTable('trip_days', {
  id: uuid('id').primaryKey().defaultRandom(),
  tripId: uuid('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  dayNumber: integer('day_number').notNull(),
  date: date('date'),
  summary: text('summary'),
  createdAt: now(),
  updatedAt: updatedAt(),
}, (table) => ({
  tripDayIdx: uniqueIndex('trip_days_trip_day_uidx').on(table.tripId, table.dayNumber),
}));

export const tripStops = pgTable('trip_stops', {
  id: uuid('id').primaryKey().defaultRandom(),
  tripDayId: uuid('trip_day_id').notNull().references(() => tripDays.id, { onDelete: 'cascade' }),
  placeId: uuid('place_id').notNull().references(() => places.id, { onDelete: 'restrict' }),
  title: text('title').notNull(),
  block: text('block').notNull(),
  order: integer('stop_order').notNull(),
  status: text('status').default('planned').notNull(),
  estimatedStartAt: timestamp('estimated_start_at', { withTimezone: true }),
  estimatedEndAt: timestamp('estimated_end_at', { withTimezone: true }),
  travelMinutesFromPrevious: integer('travel_minutes_from_previous'),
  rationale: text('rationale'),
  backupPlaceIds: jsonb('backup_place_ids').$type<string[]>().default([]).notNull(),
  createdAt: now(),
  updatedAt: updatedAt(),
}, (table) => ({
  dayOrderIdx: uniqueIndex('trip_stops_day_order_uidx').on(table.tripDayId, table.order),
  placeIdx: index('trip_stops_place_idx').on(table.placeId),
}));

export const checkins = pgTable('checkins', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tripId: uuid('trip_id').references(() => trips.id, { onDelete: 'set null' }),
  placeId: uuid('place_id').notNull().references(() => places.id, { onDelete: 'restrict' }),
  location: geoPoint('location').notNull(),
  note: text('note'),
  mediaAssetIds: jsonb('media_asset_ids').$type<string[]>().default([]).notNull(),
  checkedInAt: timestamp('checked_in_at', { withTimezone: true }).notNull(),
  createdAt: now(),
}, (table) => ({
  userIdx: index('checkins_user_idx').on(table.userId),
  tripIdx: index('checkins_trip_idx').on(table.tripId),
  placeIdx: index('checkins_place_idx').on(table.placeId),
}));

export const userLocationSnapshots = pgTable('user_location_snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tripId: uuid('trip_id').references(() => trips.id, { onDelete: 'cascade' }),
  location: geoPoint('location').notNull(),
  accuracyMeters: numeric('accuracy_meters', { precision: 8, scale: 2 }),
  capturedAt: timestamp('captured_at', { withTimezone: true }).notNull(),
  createdAt: now(),
}, (table) => ({
  userCapturedIdx: index('user_location_snapshots_user_captured_idx').on(table.userId, table.capturedAt),
}));

export const achievements = pgTable('achievements', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  tier: subscriptionTier('tier').default('free').notNull(),
  track: text('track').notNull(),
  rule: metadata('rule'),
  animated: boolean('animated').default(false).notNull(),
  createdAt: now(),
  updatedAt: updatedAt(),
  deletedAt: deletedAt(),
}, (table) => ({
  codeIdx: uniqueIndex('achievements_code_uidx').on(table.code),
}));

export const userAchievements = pgTable('user_achievements', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  achievementId: uuid('achievement_id').notNull().references(() => achievements.id, { onDelete: 'cascade' }),
  progress: numeric('progress', { precision: 6, scale: 3 }).default('1').notNull(),
  unlockedAt: timestamp('unlocked_at', { withTimezone: true }),
  metadata: metadata(),
  createdAt: now(),
  updatedAt: updatedAt(),
}, (table) => ({
  userAchievementIdx: uniqueIndex('user_achievements_user_achievement_uidx').on(table.userId, table.achievementId),
}));

export const mediaAssets = pgTable('media_assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  kind: text('kind').notNull(),
  storageKey: text('storage_key').notNull(),
  mimeType: text('mime_type').notNull(),
  byteSize: integer('byte_size'),
  width: integer('width'),
  height: integer('height'),
  durationSeconds: numeric('duration_seconds', { precision: 8, scale: 2 }),
  sourceUrl: text('source_url'),
  createdAt: now(),
  deletedAt: deletedAt(),
}, (table) => ({
  ownerIdx: index('media_assets_owner_idx').on(table.ownerId),
  storageKeyIdx: uniqueIndex('media_assets_storage_key_uidx').on(table.storageKey),
}));

export const ingestionJobs = pgTable('ingestion_jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  savedItemId: uuid('saved_item_id').references(() => savedItems.id, { onDelete: 'set null' }),
  sourceUrl: text('source_url').notNull(),
  status: ingestionStatus('status').default('active').notNull(),
  currentStage: text('current_stage').notNull(),
  attempts: integer('attempts').default(0).notNull(),
  rawPayload: metadata('raw_payload'),
  extractedSignals: metadata('extracted_signals'),
  candidatePlaces: jsonb('candidate_places').$type<Record<string, unknown>[]>().default([]).notNull(),
  failureReason: text('failure_reason'),
  createdAt: now(),
  updatedAt: updatedAt(),
}, (table) => ({
  userIdx: index('ingestion_jobs_user_idx').on(table.userId),
  statusIdx: index('ingestion_jobs_status_idx').on(table.status),
}));

export const feedItems = pgTable('feed_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: uuid('entity_id').notNull(),
  metadata: metadata(),
  createdAt: now(),
  deletedAt: deletedAt(),
}, (table) => ({
  userIdx: index('feed_items_user_idx').on(table.userId, table.createdAt),
}));

export const itineraryVersions = pgTable('itinerary_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tripId: uuid('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  version: integer('version').notNull(),
  status: text('status').default('draft').notNull(),
  generatedBy: text('generated_by').notNull(),
  qualityScore: numeric('quality_score', { precision: 4, scale: 3 }),
  payload: metadata('payload'),
  createdAt: now(),
}, (table) => ({
  tripVersionIdx: uniqueIndex('itinerary_versions_trip_version_uidx').on(table.tripId, table.version),
}));

export const itineraryRevisions = pgTable('itinerary_revisions', {
  id: uuid('id').primaryKey().defaultRandom(),
  itineraryVersionId: uuid('itinerary_version_id').notNull().references(() => itineraryVersions.id, { onDelete: 'cascade' }),
  reason: text('reason').notNull(),
  diff: metadata('diff'),
  createdByUserId: uuid('created_by_user_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: now(),
});

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: notificationType('type').notNull(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  readAt: timestamp('read_at', { withTimezone: true }),
  metadata: metadata(),
  createdAt: now(),
}, (table) => ({
  userReadIdx: index('notifications_user_read_idx').on(table.userId, table.readAt),
}));

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tier: subscriptionTier('tier').default('free').notNull(),
  status: text('status').notNull(),
  provider: text('provider').notNull(),
  providerCustomerId: text('provider_customer_id'),
  providerSubscriptionId: text('provider_subscription_id'),
  currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),
  createdAt: now(),
  updatedAt: updatedAt(),
}, (table) => ({
  userIdx: index('subscriptions_user_idx').on(table.userId),
  providerIdx: index('subscriptions_provider_idx').on(table.provider, table.providerSubscriptionId),
}));

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  subscriptionId: uuid('subscription_id').references(() => subscriptions.id, { onDelete: 'set null' }),
  provider: text('provider').notNull(),
  providerPaymentId: text('provider_payment_id'),
  amountMinor: integer('amount_minor').notNull(),
  currency: text('currency').notNull(),
  status: text('status').notNull(),
  rawPayload: metadata('raw_payload'),
  createdAt: now(),
  updatedAt: updatedAt(),
}, (table) => ({
  userIdx: index('payments_user_idx').on(table.userId),
  providerIdx: index('payments_provider_idx').on(table.provider, table.providerPaymentId),
}));

export const appEvents = pgTable('app_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  actorUserId: uuid('actor_user_id').references(() => users.id, { onDelete: 'set null' }),
  entityType: text('entity_type').notNull(),
  entityId: uuid('entity_id').notNull(),
  traceId: text('trace_id').notNull(),
  payload: metadata('payload'),
  occurredAt: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  nameIdx: index('app_events_name_idx').on(table.name, table.occurredAt),
  actorIdx: index('app_events_actor_idx').on(table.actorUserId),
}));

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  actorUserId: uuid('actor_user_id').references(() => users.id, { onDelete: 'set null' }),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: uuid('entity_id'),
  before: jsonb('before').$type<Record<string, unknown> | null>(),
  after: jsonb('after').$type<Record<string, unknown> | null>(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  traceId: text('trace_id').notNull(),
  createdAt: now(),
}, (table) => ({
  entityIdx: index('audit_logs_entity_idx').on(table.entityType, table.entityId),
  actorIdx: index('audit_logs_actor_idx').on(table.actorUserId),
}));

export const geoSql = {
  fromLngLat: (longitude: number, latitude: number) =>
    sql`ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`,
  withinMeters: (column: unknown, longitude: number, latitude: number, meters: number) =>
    sql`ST_DWithin(${column}::geography, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography, ${meters})`,
};
