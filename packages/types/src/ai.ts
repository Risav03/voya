import { z } from 'zod';
import { idSchema } from './common';
import { placeCandidateSchema, tripDaySchema } from './domain';

export const aiProviderSchema = z.enum(['claude', 'whisper', 'vision', 'mock']);

export const reelUnderstandingOutputSchema = z.object({
  summary: z.string(),
  language: z.string().optional(),
  visualSignals: z.array(z.string()).default([]),
  transcriptSignals: z.array(z.string()).default([]),
  placeCandidates: z.array(placeCandidateSchema),
  confidence: z.number().min(0).max(1),
});

export const placeDisambiguationOutputSchema = z.object({
  candidateName: z.string(),
  resolvedPlaceId: idSchema.optional(),
  shouldCreatePlace: z.boolean(),
  confidence: z.number().min(0).max(1),
  rationale: z.string(),
});

export const itineraryGenerationOutputSchema = z.object({
  tripId: idSchema,
  days: z.array(tripDaySchema),
  experiencePrinciples: z.array(z.string()).default([]),
  riskNotes: z.array(z.string()).default([]),
  qualityScore: z.number().min(0).max(1),
});

export const dailyTravelSummaryOutputSchema = z.object({
  title: z.string(),
  narrative: z.string(),
  highlights: z.array(z.string()),
  nextBestActions: z.array(z.string()).default([]),
});

export type ReelUnderstandingOutput = z.infer<typeof reelUnderstandingOutputSchema>;
export type PlaceDisambiguationOutput = z.infer<typeof placeDisambiguationOutputSchema>;
export type ItineraryGenerationOutput = z.infer<typeof itineraryGenerationOutputSchema>;
export type DailyTravelSummaryOutput = z.infer<typeof dailyTravelSummaryOutputSchema>;
