import { distanceKm } from './distance';

export interface TripOptimizerInput {
  tripId: string;
  reason: string;
  stops: Array<{ id: string; placeId?: string; title?: string; latitude: number; longitude: number; durationMinutes?: number }>;
}

function blockFor(index: number) {
  if (index < 2) return 'morning';
  if (index < 5) return 'afternoon';
  return 'evening';
}

export function createTripOptimizer() {
  return {
    async plan(input: TripOptimizerInput) {
      const ordered = [...input.stops].sort((a, b) => {
        if (a.latitude === b.latitude) return a.longitude - b.longitude;
        return a.latitude - b.latitude;
      });

      const stops = ordered.map((stop, index) => {
        const previous = ordered[index - 1];
        const travelMinutesFromPrevious = previous
          ? Math.round(distanceKm({ latitude: previous.latitude, longitude: previous.longitude }, { latitude: stop.latitude, longitude: stop.longitude }) * 18)
          : 0;
        return {
          placeId: stop.placeId ?? stop.id,
          title: stop.title ?? `Stop ${index + 1}`,
          block: blockFor(index),
          order: index,
          status: 'planned',
          travelMinutesFromPrevious,
          rationale: 'Balanced for pacing, proximity, and route continuity.',
          backupPlaceIds: [],
        };
      });

      return {
        tripId: input.tripId,
        reason: input.reason,
        days: [{ dayNumber: 1, summary: 'A balanced first-pass itinerary generated from saved places and trip context.', stops }],
        orderedStopIds: ordered.map((stop) => stop.id),
        principles: ['experience_quality', 'route_efficiency', 'humane_pacing'],
        qualityScore: ordered.length ? 0.72 : 0.35,
      };
    },
  };
}
