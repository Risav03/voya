import type { AppEventName } from '@voya/types';
import { coreRepository } from './repository';

export interface DomainEventInput {
  name: AppEventName;
  actorUserId?: string;
  entityType: string;
  entityId: string;
  traceId: string;
  payload?: Record<string, unknown>;
}

export class EventBus {
  async publish(event: DomainEventInput) {
    await coreRepository.createEvent(event);
  }
}

export const eventBus = new EventBus();
