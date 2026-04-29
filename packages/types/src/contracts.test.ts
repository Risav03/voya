import { describe, expect, test } from 'bun:test';
import { ingestReelRequestSchema, tripPreferenceSchema } from './index';

describe('shared contracts', () => {
  test('validates ingest reel input', () => {
    const parsed = ingestReelRequestSchema.parse({ sourceUrl: 'https://example.com/reel/1' });
    expect(parsed.sourcePlatform).toBe('other');
  });

  test('applies trip preference defaults', () => {
    expect(tripPreferenceSchema.parse({}).pace).toBe('balanced');
  });
});
