import { z } from 'zod';

export const idSchema = z.string().min(1);
export const uuidSchema = z.string().uuid();
export const isoDateSchema = z.string().datetime();
export const currencyCodeSchema = z.string().length(3).toUpperCase();
export const urlSchema = z.string().url();
export const nullableDateSchema = isoDateSchema.nullable();

export const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const addressSchema = z.object({
  line1: z.string().optional(),
  line2: z.string().optional(),
  locality: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
});

export const provenanceSchema = z.object({
  source: z.string(),
  sourceUrl: urlSchema.optional(),
  sourceId: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
  evidence: z.record(z.string(), z.unknown()).default({}),
});

export const paginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    items: z.array(item),
    nextCursor: z.string().nullable(),
  });

export const lifecycleStatusSchema = z.enum(['draft', 'active', 'paused', 'completed', 'failed', 'cancelled']);
export const visibilitySchema = z.enum(['private', 'shared', 'public']);
export const subscriptionTierSchema = z.enum(['free', 'premium', 'admin']);
export type Coordinates = z.infer<typeof coordinatesSchema>;
export type Provenance = z.infer<typeof provenanceSchema>;
