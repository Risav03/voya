import { describe, expect, test } from 'bun:test';
import { createAiRouter } from './index';

describe('ai router', () => {
  test('returns structured reel understanding output', async () => {
    const result = await createAiRouter().run('reel_understanding', { sourceUrl: 'https://example.com' });
    expect('placeCandidates' in result).toBe(true);
  });
});
