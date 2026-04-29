import { describe, expect, test } from 'bun:test';
import { schema } from './index';

describe('db schema', () => {
  test('exports core tables', () => {
    expect(schema.users).toBeDefined();
    expect(schema.places).toBeDefined();
    expect(schema.ingestionJobs).toBeDefined();
    expect(schema.trips).toBeDefined();
  });
});
