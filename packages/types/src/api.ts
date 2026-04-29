import { z } from 'zod';
import { coordinatesSchema, idSchema, paginationSchema, urlSchema } from './common';
import { checkInSchema, tripPreferenceSchema } from './domain';

export const errorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    traceId: z.string().optional(),
    details: z.unknown().optional(),
  }),
});

export const ingestReelRequestSchema = z.object({
  sourceUrl: urlSchema,
  sourcePlatform: z.enum(['instagram', 'tiktok', 'youtube', 'manual', 'other']).default('other'),
  collectionId: idSchema.optional(),
  rawSharePayload: z.record(z.string(), z.unknown()).default({}),
});

export const placeSearchRequestSchema = paginationSchema.extend({
  q: z.string().min(1).optional(),
  near: coordinatesSchema.optional(),
  radiusMeters: z.coerce.number().int().positive().max(100000).optional(),
});

export const createCollectionRequestSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const createTripRequestSchema = z.object({
  title: z.string().min(1),
  destinationPlaceId: idSchema.optional(),
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
  preferences: tripPreferenceSchema.optional(),
});

export const checkInRequestSchema = checkInSchema.omit({ id: true, createdAt: true, userId: true });

export const liveTripMessageSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('ping'), sentAt: z.string().datetime() }),
  z.object({ type: z.literal('location.update'), tripId: idSchema, coordinates: coordinatesSchema }),
  z.object({ type: z.literal('stop.status'), tripId: idSchema, stopId: idSchema, status: z.string() }),
]);

export type IngestReelRequest = z.infer<typeof ingestReelRequestSchema>;
export type PlaceSearchRequest = z.infer<typeof placeSearchRequestSchema>;
export type CreateCollectionRequest = z.infer<typeof createCollectionRequestSchema>;
export type CreateTripRequest = z.infer<typeof createTripRequestSchema>;
export type CheckInRequest = z.infer<typeof checkInRequestSchema>;
export type LiveTripMessage = z.infer<typeof liveTripMessageSchema>;
