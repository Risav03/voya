import {
  dailyTravelSummaryOutputSchema,
  itineraryGenerationOutputSchema,
  placeDisambiguationOutputSchema,
  reelUnderstandingOutputSchema,
  type DailyTravelSummaryOutput,
  type ItineraryGenerationOutput,
  type PlaceDisambiguationOutput,
  type ReelUnderstandingOutput,
} from '@voya/types';

export interface ClaudeProvider {
  extractPlaces(input: Record<string, unknown>): Promise<ReelUnderstandingOutput>;
  disambiguatePlace(input: Record<string, unknown>): Promise<PlaceDisambiguationOutput>;
  generateItinerary(input: Record<string, unknown>): Promise<ItineraryGenerationOutput>;
  summarizeDay(input: Record<string, unknown>): Promise<DailyTravelSummaryOutput>;
}

export interface WhisperProvider {
  transcribe(input: { mediaAssetId: string; storageKey: string }): Promise<{ transcript: string; language?: string }>;
}

export interface VisionProvider {
  inspectFrames(input: { frameAssetIds: string[] }): Promise<{ labels: string[]; ocrText: string[]; landmarks: string[] }>;
}

export class MockClaudeProvider implements ClaudeProvider {
  async extractPlaces(input: Record<string, unknown>) {
    return reelUnderstandingOutputSchema.parse({
      summary: 'Mock reel understanding pending provider credentials.',
      visualSignals: [],
      transcriptSignals: [],
      placeCandidates: [],
      confidence: 0,
      input,
    });
  }

  async disambiguatePlace(input: Record<string, unknown>) {
    return placeDisambiguationOutputSchema.parse({
      candidateName: String(input['name'] ?? 'unknown'),
      shouldCreatePlace: true,
      confidence: 0,
      rationale: 'Mock provider requires external geocoding and Claude credentials.',
    });
  }

  async generateItinerary(input: Record<string, unknown>) {
    return itineraryGenerationOutputSchema.parse({
      tripId: String(input['tripId'] ?? crypto.randomUUID()),
      days: [],
      experiencePrinciples: ['quality over place count', 'route efficiency', 'paced exploration'],
      riskNotes: [],
      qualityScore: 0,
    });
  }

  async summarizeDay() {
    return dailyTravelSummaryOutputSchema.parse({
      title: 'Travel day summary',
      narrative: 'Mock summary pending provider configuration.',
      highlights: [],
    });
  }
}

export class MockWhisperProvider implements WhisperProvider {
  async transcribe() { return { transcript: '', language: undefined }; }
}

export class MockVisionProvider implements VisionProvider {
  async inspectFrames() { return { labels: [], ocrText: [], landmarks: [] }; }
}
