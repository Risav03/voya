import { z } from 'zod';
import {
  addressSchema,
  coordinatesSchema,
  idSchema,
  isoDateSchema,
  lifecycleStatusSchema,
  provenanceSchema,
  subscriptionTierSchema,
  urlSchema,
  visibilitySchema,
} from './common';

export const userSchema = z.object({
  id: idSchema,
  email: z.string().email(),
  name: z.string().min(1),
  imageUrl: urlSchema.optional(),
  homeLocation: coordinatesSchema.optional(),
  subscriptionTier: subscriptionTierSchema.default('free'),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
});

export const placeKindSchema = z.enum([
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

export const placeSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  kind: placeKindSchema,
  address: addressSchema.default({}),
  coordinates: coordinatesSchema,
  countryCode: z.string().length(2).optional(),
  googlePlaceId: z.string().optional(),
  timezone: z.string().optional(),
  confidence: z.number().min(0).max(1).default(1),
  provenance: z.array(provenanceSchema).default([]),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
});

export const placeCandidateSchema = z.object({
  name: z.string().min(1),
  kind: placeKindSchema.default('unknown'),
  coordinates: coordinatesSchema.optional(),
  addressHint: z.string().optional(),
  sourceText: z.string().optional(),
  confidence: z.number().min(0).max(1),
  evidence: z.record(z.string(), z.unknown()).default({}),
});

export const mediaAssetSchema = z.object({
  id: idSchema,
  ownerId: idSchema,
  kind: z.enum(['reel', 'frame', 'image', 'audio', 'memory_photo', 'trip_cover']),
  storageKey: z.string(),
  mimeType: z.string(),
  byteSize: z.number().int().nonnegative().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  durationSeconds: z.number().nonnegative().optional(),
  sourceUrl: urlSchema.optional(),
  createdAt: isoDateSchema,
});

export const savedItemSchema = z.object({
  id: idSchema,
  userId: idSchema,
  placeId: idSchema.optional(),
  sourceUrl: urlSchema,
  sourcePlatform: z.enum(['instagram', 'tiktok', 'youtube', 'manual', 'other']),
  caption: z.string().optional(),
  rawPayload: z.record(z.string(), z.unknown()).default({}),
  status: z.enum(['queued', 'processing', 'resolved', 'needs_review', 'failed']),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
});

export const collectionSchema = z.object({
  id: idSchema,
  userId: idSchema,
  name: z.string().min(1),
  description: z.string().optional(),
  visibility: visibilitySchema.default('private'),
  coverAssetId: idSchema.optional(),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
});

export const tripPreferenceSchema = z.object({
  id: idSchema.optional(),
  tripId: idSchema.optional(),
  budgetLevel: z.enum(['low', 'medium', 'high', 'luxury']).default('medium'),
  pace: z.enum(['slow', 'balanced', 'packed']).default('balanced'),
  walkingToleranceKm: z.number().min(0).max(40).default(8),
  interests: z.array(placeKindSchema).default([]),
  foodPreferences: z.array(z.string()).default([]),
  indoorOutdoor: z.enum(['mostly_indoor', 'balanced', 'mostly_outdoor']).default('balanced'),
  groupType: z.enum(['solo', 'couple', 'friends', 'family', 'business']).default('solo'),
  accessibilityNeeds: z.array(z.string()).default([]),
  openHoursSensitivity: z.enum(['low', 'medium', 'high']).default('high'),
  mustSeeWeight: z.number().min(0).max(1).default(0.65),
  hiddenGemWeight: z.number().min(0).max(1).default(0.35),
});

export const tripSchema = z.object({
  id: idSchema,
  userId: idSchema,
  title: z.string().min(1),
  destinationPlaceId: idSchema.optional(),
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
  status: z.enum(['planning', 'ready', 'live', 'completed', 'cancelled']).default('planning'),
  source: z.enum(['manual', 'calendar_import', 'gps_detected']).default('manual'),
  preferences: tripPreferenceSchema.optional(),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
});

export const tripStopStatusSchema = z.enum(['planned', 'current', 'visited', 'skipped', 'missed', 'replanned']);

export const tripStopSchema = z.object({
  id: idSchema,
  tripDayId: idSchema,
  placeId: idSchema,
  title: z.string().min(1),
  block: z.enum(['morning', 'afternoon', 'evening', 'anytime']),
  order: z.number().int().nonnegative(),
  status: tripStopStatusSchema.default('planned'),
  estimatedStartAt: isoDateSchema.optional(),
  estimatedEndAt: isoDateSchema.optional(),
  travelMinutesFromPrevious: z.number().int().nonnegative().optional(),
  rationale: z.string().optional(),
  backupPlaceIds: z.array(idSchema).default([]),
});

export const tripDaySchema = z.object({
  id: idSchema,
  tripId: idSchema,
  dayNumber: z.number().int().positive(),
  date: z.string().date().optional(),
  summary: z.string().optional(),
  stops: z.array(tripStopSchema).default([]),
});

export const itinerarySchema = z.object({
  id: idSchema,
  tripId: idSchema,
  version: z.number().int().positive(),
  status: z.enum(['draft', 'active', 'superseded', 'failed']).default('draft'),
  days: z.array(tripDaySchema),
  qualityScore: z.number().min(0).max(1).optional(),
  generatedBy: z.enum(['ai', 'manual', 'hybrid']),
  createdAt: isoDateSchema,
});

export const checkInSchema = z.object({
  id: idSchema,
  userId: idSchema,
  tripId: idSchema.optional(),
  placeId: idSchema,
  coordinates: coordinatesSchema,
  note: z.string().optional(),
  mediaAssetIds: z.array(idSchema).default([]),
  checkedInAt: isoDateSchema,
  createdAt: isoDateSchema,
});

export const achievementSchema = z.object({
  id: idSchema,
  code: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  tier: subscriptionTierSchema,
  track: z.string(),
  rule: z.record(z.string(), z.unknown()),
  animated: z.boolean().default(false),
  createdAt: isoDateSchema,
});

export const travelGraphNodeSchema = z.object({
  id: idSchema,
  type: z.enum(['place', 'city', 'country', 'trip', 'collection', 'achievement']),
  label: z.string(),
  coordinates: coordinatesSchema.optional(),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export const travelGraphEdgeSchema = z.object({
  id: idSchema,
  userId: idSchema,
  fromNodeId: idSchema,
  toNodeId: idSchema,
  type: z.enum([
    'saved_from',
    'visited',
    'planned_for',
    'near',
    'part_of_city',
    'part_of_country',
    'inspired_by',
  ]),
  weight: z.number().default(1),
  metadata: z.record(z.string(), z.unknown()).default({}),
  createdAt: isoDateSchema,
});

export const reelIngestionJobSchema = z.object({
  id: idSchema,
  userId: idSchema,
  savedItemId: idSchema.optional(),
  sourceUrl: urlSchema,
  status: lifecycleStatusSchema,
  currentStage: z.string(),
  attempts: z.number().int().nonnegative().default(0),
  rawPayload: z.record(z.string(), z.unknown()).default({}),
  candidatePlaces: z.array(placeCandidateSchema).default([]),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
});

export const notificationSchema = z.object({
  id: idSchema,
  userId: idSchema,
  type: z.enum(['ingestion_complete', 'trip_update', 'achievement', 'billing', 'system']),
  title: z.string(),
  body: z.string(),
  readAt: isoDateSchema.nullable().default(null),
  metadata: z.record(z.string(), z.unknown()).default({}),
  createdAt: isoDateSchema,
});

export const subscriptionSchema = z.object({
  id: idSchema,
  userId: idSchema,
  tier: subscriptionTierSchema,
  status: z.enum(['trialing', 'active', 'past_due', 'cancelled', 'expired']),
  provider: z.enum(['stripe', 'app_store', 'play_store', 'manual']),
  providerCustomerId: z.string().optional(),
  currentPeriodEnd: isoDateSchema.optional(),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
});

export type User = z.infer<typeof userSchema>;
export type Place = z.infer<typeof placeSchema>;
export type PlaceCandidate = z.infer<typeof placeCandidateSchema>;
export type SavedItem = z.infer<typeof savedItemSchema>;
export type Collection = z.infer<typeof collectionSchema>;
export type Trip = z.infer<typeof tripSchema>;
export type TripPreference = z.infer<typeof tripPreferenceSchema>;
export type TripDay = z.infer<typeof tripDaySchema>;
export type TripStop = z.infer<typeof tripStopSchema>;
export type Itinerary = z.infer<typeof itinerarySchema>;
export type CheckIn = z.infer<typeof checkInSchema>;
export type Achievement = z.infer<typeof achievementSchema>;
export type TravelGraphNode = z.infer<typeof travelGraphNodeSchema>;
export type TravelGraphEdge = z.infer<typeof travelGraphEdgeSchema>;
export type ReelIngestionJob = z.infer<typeof reelIngestionJobSchema>;
export type MediaAsset = z.infer<typeof mediaAssetSchema>;
export type Notification = z.infer<typeof notificationSchema>;
export type Subscription = z.infer<typeof subscriptionSchema>;
