import { describe, expect, test } from 'bun:test';
import { distanceKm } from './index';

describe('geo utils', () => {
  test('calculates zero distance', () => {
    expect(distanceKm({ latitude: 1, longitude: 2 }, { latitude: 1, longitude: 2 })).toBe(0);
  });
});
