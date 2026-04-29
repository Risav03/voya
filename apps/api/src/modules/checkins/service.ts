import { checkInRequestSchema } from '@voya/types';
import { parseInput } from '../../lib/validation';
import { coreRepository } from '../../services/repository';

export class CheckinsService {
  create(userId: string, body: unknown) {
    const input = parseInput(checkInRequestSchema, body);
    return coreRepository.createCheckin({ userId, tripId: input.tripId, placeId: input.placeId, coordinates: input.coordinates, note: input.note, mediaAssetIds: input.mediaAssetIds, checkedInAt: new Date(input.checkedInAt) });
  }
  listForTrip(userId: string, tripId: string) { return coreRepository.listCheckinsForTrip(userId, tripId); }
}
export const checkinsService = new CheckinsService();
