import { describe, expect, test } from 'bun:test';
import { createEvent } from './index';

describe('analytics events', () => {
  test('creates timestamped event', () => {
    const event = createEvent({ name: 'trip.created', entityType: 'trip', entityId: crypto.randomUUID(), traceId: 'trace', payload: {} });
    expect(event.id.length).toBeGreaterThan(0);
  });
});
