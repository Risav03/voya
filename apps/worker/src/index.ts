import { env } from './env';
import { logger } from './logger';
import { createAiWorker } from './processors/ai';
import { createIngestionWorker } from './processors/ingestion';
import { createItineraryWorker } from './processors/itinerary';
import { createMaintenanceWorker } from './processors/maintenance';
import { createNotificationsWorker } from './processors/notifications';

const workers = [
  createIngestionWorker(env.WORKER_CONCURRENCY),
  createAiWorker(Math.max(1, Math.floor(env.WORKER_CONCURRENCY / 2))),
  createItineraryWorker(Math.max(1, Math.floor(env.WORKER_CONCURRENCY / 2))),
  createNotificationsWorker(env.WORKER_CONCURRENCY),
  createMaintenanceWorker(1),
];

for (const worker of workers) {
  worker.on('completed', (job) => logger.info({ queue: worker.name, jobId: job.id }, 'job completed'));
  worker.on('failed', (job, error) => logger.error({ queue: worker.name, jobId: job?.id, error }, 'job failed'));
}

logger.info({ workers: workers.map((worker) => worker.name) }, 'workers started');
