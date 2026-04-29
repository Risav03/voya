import { Worker } from 'bullmq';
import { CoreRepository, database } from '@voya/db';
import { createAiRouter } from '@voya/ai';
import { createTripOptimizer } from '@voya/geo';
import { itineraryGenerationOutputSchema, itineraryJobPayloadSchema } from '@voya/types';
import { connection } from '../queues';
import { oncePerAttempt } from '../idempotency';

const optimizer = createTripOptimizer();
const ai = createAiRouter();
const repo = new CoreRepository(database.db);

export function createItineraryWorker(concurrency: number) {
  return new Worker('itinerary', async (job) => oncePerAttempt(job, async () => {
    const payload = itineraryJobPayloadSchema.parse(job.data);
    const aiPlan = itineraryGenerationOutputSchema.parse(await ai.run(payload.reason === 'initial' ? 'itinerary_generation' : 'itinerary_replanning', { tripId: payload.tripId, reason: payload.reason }));
    const optimized = await optimizer.plan({ tripId: payload.tripId, reason: payload.reason, stops: [] });
    const days = aiPlan.days.length ? aiPlan.days.map((day) => ({
      dayNumber: day.dayNumber,
      date: day.date,
      summary: day.summary,
      stops: day.stops.map((stop, index: number) => ({ placeId: stop.placeId, title: stop.title, block: stop.block, order: index, status: stop.status, rationale: stop.rationale, backupPlaceIds: stop.backupPlaceIds })),
    })) : optimized.days;

    await repo.replaceTripPlan({ tripId: payload.tripId, days });
    const itinerary = await repo.createItineraryVersion({ tripId: payload.tripId, generatedBy: 'hybrid', status: 'active', payload: { aiPlan, optimized }, qualityScore: String(aiPlan.qualityScore || optimized.qualityScore) });
    await repo.createEvent({ name: payload.reason === 'initial' ? 'itinerary.generated' : 'itinerary.replanned', actorUserId: payload.userId, entityType: 'itinerary_version', entityId: itinerary.id, traceId: itinerary.id, payload: { tripId: payload.tripId, reason: payload.reason } });
    return { itineraryVersionId: itinerary.id, tripId: payload.tripId };
  }), { connection, concurrency });
}
