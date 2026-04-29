import { describe, expect, test } from 'bun:test';
import { theme } from './theme';

describe('ui theme', () => {
  test('has premium colors', () => {
    expect(theme.colors.ink).toBe('#10233f');
  });
});
