import { z } from 'zod';
import { idSchema, isoDateSchema } from './common';

export const appEventNameSchema = z.enum([
  'user.created',
  'reel.saved',
  'ingestion.stage.completed',
  'ingestion.completed',
  'place.resolved',
  'place.corrected',
  'collection.created',
  'trip.created',
  'trip.started',
  'trip.completed',
  'itinerary.generated',
  'itinerary.replanned',
  'checkin.created',
  'achievement.unlocked',
  'subscription.changed',
  'notification.created',
]);

export const appEventSchema = z.object({
  id: idSchema,
  name: appEventNameSchema,
  actorUserId: idSchema.optional(),
  entityType: z.string(),
  entityId: idSchema,
  traceId: z.string(),
  payload: z.record(z.string(), z.unknown()).default({}),
  occurredAt: isoDateSchema,
});

export type AppEventName = z.infer<typeof appEventNameSchema>;
export type AppEvent = z.infer<typeof appEventSchema>;
