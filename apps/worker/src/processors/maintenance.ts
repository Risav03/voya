import { Worker } from 'bullmq';
import { connection } from '../queues';
import { oncePerAttempt } from '../idempotency';

export function createMaintenanceWorker(concurrency: number) {
  return new Worker('maintenance', async (job) => oncePerAttempt(job, async () => ({ ok: true, job: job.name })), {
    connection,
    concurrency,
  });
}
