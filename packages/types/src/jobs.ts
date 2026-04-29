import { z } from 'zod';
import { idSchema, urlSchema } from './common';

export const queueNameSchema = z.enum(['ingestion', 'ai', 'itinerary', 'notifications', 'maintenance']);
export const ingestionStageSchema = z.enum([
  'metadata.fetch',
  'media.frames.extract',
  'media.ocr',
  'audio.transcribe',
  'ai.extract',
  'places.resolve',
  'graph.persist',
  'fanout.emit',
]);

export const ingestionJobPayloadSchema = z.object({
  ingestionJobId: idSchema,
  userId: idSchema,
  sourceUrl: urlSchema,
  stage: ingestionStageSchema,
  attemptKey: z.string(),
});

export const aiJobPayloadSchema = z.object({
  task: z.enum([
    'reel_understanding',
    'place_disambiguation',
    'itinerary_generation',
    'itinerary_replanning',
    'trip_narrative',
    'achievement_recommendation',
    'daily_summary',
  ]),
  entityId: idSchema,
  userId: idSchema.optional(),
  input: z.record(z.string(), z.unknown()),
});

export const itineraryJobPayloadSchema = z.object({
  tripId: idSchema,
  userId: idSchema,
  reason: z.enum(['initial', 'regenerate', 'skip_stop', 'running_late', 'live_disruption']),
});

export const notificationJobPayloadSchema = z.object({
  userId: idSchema,
  notificationId: idSchema,
  channels: z.array(z.enum(['in_app', 'push', 'email'])).default(['in_app']),
});

export type QueueName = z.infer<typeof queueNameSchema>;
export type IngestionStage = z.infer<typeof ingestionStageSchema>;
export type IngestionJobPayload = z.infer<typeof ingestionJobPayloadSchema>;
export type AiJobPayload = z.infer<typeof aiJobPayloadSchema>;
export type ItineraryJobPayload = z.infer<typeof itineraryJobPayloadSchema>;
export type NotificationJobPayload = z.infer<typeof notificationJobPayloadSchema>;
