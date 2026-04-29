import { Queue, type JobsOptions } from 'bullmq';
import IORedis from 'ioredis';
import type { AiJobPayload, IngestionJobPayload, ItineraryJobPayload, NotificationJobPayload } from '@voya/types';
import { env } from './env';

export const connection = new IORedis(env.REDIS_URL, { maxRetriesPerRequest: null });

export const defaultJobOptions: JobsOptions = {
  attempts: 5,
  backoff: { type: 'exponential', delay: 5_000 },
  removeOnComplete: { age: 60 * 60 * 24, count: 1_000 },
  removeOnFail: false,
};

export const ingestionQueue = new Queue<IngestionJobPayload>('ingestion', { connection, defaultJobOptions });
export const aiQueue = new Queue<AiJobPayload>('ai', { connection, defaultJobOptions });
export const itineraryQueue = new Queue<ItineraryJobPayload>('itinerary', { connection, defaultJobOptions });
export const notificationsQueue = new Queue<NotificationJobPayload>('notifications', { connection, defaultJobOptions });
export const maintenanceQueue = new Queue<Record<string, unknown>>('maintenance', { connection, defaultJobOptions });

export const queues = [ingestionQueue, aiQueue, itineraryQueue, notificationsQueue, maintenanceQueue];
