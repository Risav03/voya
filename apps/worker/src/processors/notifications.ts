import { Worker } from 'bullmq';
import { notificationJobPayloadSchema } from '@voya/types';
import { connection } from '../queues';
import { oncePerAttempt } from '../idempotency';

export function createNotificationsWorker(concurrency: number) {
  return new Worker('notifications', async (job) => oncePerAttempt(job, async () => {
    const payload = notificationJobPayloadSchema.parse(job.data);
    return { delivered: payload.channels, notificationId: payload.notificationId };
  }), { connection, concurrency });
}
