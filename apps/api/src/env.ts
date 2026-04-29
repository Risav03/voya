import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().int().positive().default(4000),
  API_PUBLIC_URL: z.string().url().default('http://localhost:4000'),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1).default('redis://localhost:6379'),
  BETTER_AUTH_SECRET: z.string().min(16).default('development-secret-change-me'),
  BETTER_AUTH_URL: z.string().url().default('http://localhost:4000'),
  AWS_S3_BUCKET: z.string().default('reels-travel-dev'),
  AWS_REGION: z.string().default('us-east-1'),
});

export const env = envSchema.parse(process.env);
