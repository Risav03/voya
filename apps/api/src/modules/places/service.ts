import { placeSearchRequestSchema } from '@voya/types';
import { AppError } from '../../lib/errors';
import { parseInput } from '../../lib/validation';
import { coreRepository } from '../../services/repository';
import { eventBus } from '../../services/events';

export class PlacesService {
  async search(query: unknown) {
    const parsed = parseInput(placeSearchRequestSchema, query);
    const items = await coreRepository.searchPlaces({ q: parsed.q, longitude: parsed.near?.longitude, latitude: parsed.near?.latitude, radiusMeters: parsed.radiusMeters, limit: parsed.limit });
    return { items, nextCursor: null };
  }
  async get(id: string) {
    const [place] = await coreRepository.getPlace(id);
    if (!place) throw new AppError('not_found', 'Place not found', 404);
    return place;
  }
  async confirm(userId: string, id: string, traceId: string) {
    const place = await this.get(id);
    await eventBus.publish({ name: 'place.corrected', actorUserId: userId, entityType: 'place', entityId: id, traceId, payload: { action: 'confirm' } });
    return { ...place, confirmed: true };
  }
  async merge(userId: string, id: string, body: unknown, traceId: string) {
    await eventBus.publish({ name: 'place.corrected', actorUserId: userId, entityType: 'place', entityId: id, traceId, payload: { action: 'merge', body } });
    return { id, queuedForReview: true };
  }
  async alias(userId: string, id: string, body: unknown, traceId: string) {
    const alias = String((body as { alias?: unknown })?.alias ?? '');
    if (!alias) throw new AppError('validation_failed', 'alias is required', 422);
    const [created] = await coreRepository.addPlaceAlias({ placeId: id, alias, source: 'user_correction', confidence: '0.900' });
    await eventBus.publish({ name: 'place.corrected', actorUserId: userId, entityType: 'place', entityId: id, traceId, payload: { action: 'alias', alias } });
    return created;
  }
}
export const placesService = new PlacesService();
