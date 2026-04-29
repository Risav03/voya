import { loadRootEnv } from '@voya/db';
import { z } from 'zod';

loadRootEnv();

export const env = z.object({
  REDIS_URL: z.string().min(1).default('redis://localhost:6379'),
  DATABASE_URL: z.string().min(1),
  WORKER_CONCURRENCY: z.coerce.number().int().positive().default(5),
}).parse(process.env);
