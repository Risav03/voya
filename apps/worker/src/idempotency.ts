import type { Job } from 'bullmq';

const completed = new Set<string>();

export async function oncePerAttempt<T>(job: Job, handler: () => Promise<T>): Promise<T | { skipped: true }> {
  const key = `${job.queueName}:${job.id}:${job.attemptsMade}`;
  if (completed.has(key)) return { skipped: true };
  const result = await handler();
  completed.add(key);
  return result;
}
