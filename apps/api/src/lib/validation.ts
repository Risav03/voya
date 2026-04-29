import type { z } from 'zod';
import { AppError } from './errors';

export function parseInput<TSchema extends z.ZodTypeAny>(schema: TSchema, value: unknown): z.infer<TSchema> {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new AppError('validation_failed', 'Request validation failed', 422, result.error.flatten());
  }
  return result.data;
}
