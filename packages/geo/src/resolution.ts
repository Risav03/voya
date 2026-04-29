import type { Place, PlaceCandidate } from '@voya/types';
import { distanceKm } from './distance';

export interface PlaceResolutionResult {
  candidate: PlaceCandidate;
  matchedPlace?: Place;
  confidence: number;
  resolvedBy: 'exact_alias' | 'fuzzy_geo' | 'external_provider' | 'manual_review';
  rationale: string;
}

export function resolveCandidate(candidate: PlaceCandidate, knownPlaces: Place[]): PlaceResolutionResult {
  const exact = knownPlaces.find((place) => place.name.toLowerCase() === candidate.name.toLowerCase());
  if (exact) return { candidate, matchedPlace: exact, confidence: 0.98, resolvedBy: 'exact_alias', rationale: 'Exact normalized name match.' };

  if (candidate.coordinates) {
    const nearby = knownPlaces
      .map((place) => ({ place, km: distanceKm(candidate.coordinates!, place.coordinates) }))
      .sort((a, b) => a.km - b.km)[0];
    if (nearby && nearby.km < 0.25) return { candidate, matchedPlace: nearby.place, confidence: 0.8, resolvedBy: 'fuzzy_geo', rationale: 'Candidate is within 250 meters of a canonical place.' };
  }

  return { candidate, confidence: candidate.confidence, resolvedBy: 'manual_review', rationale: 'No high-confidence canonical match found.' };
}
