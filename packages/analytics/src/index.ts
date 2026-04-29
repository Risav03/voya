import type { AppEvent, AppEventName } from '@voya/types';

export interface AnalyticsClient {
  track(event: AppEvent): Promise<void>;
}

export class ConsoleAnalyticsClient implements AnalyticsClient {
  async track(event: AppEvent) {
    console.info('[analytics]', event.name, event.entityType, event.entityId);
  }
}

export function createEvent(input: Omit<AppEvent, 'id' | 'occurredAt'> & { occurredAt?: string }): AppEvent {
  return {
    ...input,
    id: crypto.randomUUID(),
    occurredAt: input.occurredAt ?? new Date().toISOString(),
  };
}

export const premiumGateEvents: AppEventName[] = [
  'itinerary.generated',
  'itinerary.replanned',
  'achievement.unlocked',
  'subscription.changed',
];
