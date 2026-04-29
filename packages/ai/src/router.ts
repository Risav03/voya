import { MockClaudeProvider, MockVisionProvider, MockWhisperProvider, type ClaudeProvider, type VisionProvider, type WhisperProvider } from './providers';

export type AiTask =
  | 'reel_understanding'
  | 'place_disambiguation'
  | 'itinerary_generation'
  | 'itinerary_replanning'
  | 'trip_narrative'
  | 'achievement_recommendation'
  | 'daily_summary';

export interface AiRouterOptions {
  claude?: ClaudeProvider;
  whisper?: WhisperProvider;
  vision?: VisionProvider;
}

export function createAiRouter(options: AiRouterOptions = {}) {
  const claude = options.claude ?? new MockClaudeProvider();
  const whisper = options.whisper ?? new MockWhisperProvider();
  const vision = options.vision ?? new MockVisionProvider();

  return {
    claude,
    whisper,
    vision,
    async run(task: AiTask, input: Record<string, unknown>) {
      switch (task) {
        case 'reel_understanding': return claude.extractPlaces(input);
        case 'place_disambiguation': return claude.disambiguatePlace(input);
        case 'itinerary_generation':
        case 'itinerary_replanning': return claude.generateItinerary(input);
        case 'daily_summary':
        case 'trip_narrative': return claude.summarizeDay(input);
        case 'achievement_recommendation': return { recommendations: [] };
      }
    },
  };
}
