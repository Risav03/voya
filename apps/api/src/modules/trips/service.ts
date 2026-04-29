import { createTripRequestSchema } from '@voya/types';
import { AppError } from '../../lib/errors';
import { parseInput } from '../../lib/validation';
import { itineraryQueue } from '../../services/queues';
import { coreRepository } from '../../services/repository';

export class TripsService {
  list(userId: string) { return coreRepository.listTrips(userId); }
  async create(userId: string, body: unknown) {
    const input = parseInput(createTripRequestSchema, body);
    return coreRepository.createTrip({ userId, title: input.title, destinationPlaceId: input.destinationPlaceId, startDate: input.startDate, endDate: input.endDate, preferences: input.preferences });
  }
  async get(userId: string, id: string) {
    const [trip] = await coreRepository.getTrip(userId, id);
    if (!trip) throw new AppError('not_found', 'Trip not found', 404);
    const [itinerary] = await coreRepository.getLatestItinerary(id);
    return { ...trip, itinerary };
  }
  async update(userId: string, id: string, body: unknown) {
    const [trip] = await coreRepository.updateTrip(userId, id, body as Record<string, unknown>);
    if (!trip) throw new AppError('not_found', 'Trip not found', 404);
    return trip;
  }
  async start(userId: string, id: string) {
    const [trip] = await coreRepository.updateTrip(userId, id, { status: 'live' });
    if (!trip) throw new AppError('not_found', 'Trip not found', 404);
    return trip;
  }
  async end(userId: string, id: string) {
    const [trip] = await coreRepository.updateTrip(userId, id, { status: 'completed' });
    if (!trip) throw new AppError('not_found', 'Trip not found', 404);
    return trip;
  }
  async generateItinerary(userId: string, tripId: string, reason: 'initial' | 'regenerate' | 'skip_stop' | 'running_late' | 'live_disruption' = 'initial') {
    const [trip] = await coreRepository.getTrip(userId, tripId);
    if (!trip) throw new AppError('not_found', 'Trip not found', 404);
    const itinerary = await coreRepository.createItineraryVersion({ tripId, generatedBy: 'ai', status: 'draft', payload: { reason } });
    await itineraryQueue.add('itinerary.generate', { tripId, userId, reason }, { jobId: `${tripId}:${itinerary.version}:${reason}` });
    return { itinerary, queued: true };
  }
  async getItinerary(userId: string, tripId: string) {
    const [trip] = await coreRepository.getTrip(userId, tripId);
    if (!trip) throw new AppError('not_found', 'Trip not found', 404);
    const [itinerary] = await coreRepository.getLatestItinerary(tripId);
    return itinerary ?? null;
  }
}
export const tripsService = new TripsService();
