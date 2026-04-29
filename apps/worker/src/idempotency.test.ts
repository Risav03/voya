import { describe, expect, test } from 'bun:test';

describe('worker smoke', () => {
  test('runs worker test environment', () => {
    expect(true).toBe(true);
  });
});
