import { Worker } from 'bullmq';
import { aiJobPayloadSchema } from '@voya/types';
import { createAiRouter } from '@voya/ai';
import { connection } from '../queues';
import { oncePerAttempt } from '../idempotency';

const ai = createAiRouter();

export function createAiWorker(concurrency: number) {
  return new Worker('ai', async (job) => oncePerAttempt(job, async () => {
    const payload = aiJobPayloadSchema.parse(job.data);
    return ai.run(payload.task, payload.input);
  }), { connection, concurrency });
}
