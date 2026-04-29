import type { Coordinates, PlaceCandidate } from '@voya/types';

export interface ExternalPlaceResult {
  name: string;
  googlePlaceId?: string;
  coordinates?: Coordinates;
  address?: Record<string, unknown>;
  confidence: number;
  raw: Record<string, unknown>;
}

export interface PlacesProvider {
  resolve(candidate: PlaceCandidate): Promise<ExternalPlaceResult | null>;
}

export class MockPlacesProvider implements PlacesProvider {
  async resolve(candidate: PlaceCandidate) {
    return {
      name: candidate.name,
      coordinates: candidate.coordinates,
      confidence: candidate.confidence,
      raw: candidate.evidence,
    };
  }
}

export class GooglePlacesProvider implements PlacesProvider {
  constructor(private readonly apiKey: string) {}

  async resolve(candidate: PlaceCandidate) {
    const query = encodeURIComponent(candidate.name);
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${this.apiKey}`);
    if (!response.ok) throw new Error(`Google Places request failed: ${response.status}`);
    const payload = await response.json() as { results?: Array<{ name: string; place_id?: string; formatted_address?: string; geometry?: { location?: { lat: number; lng: number } } }> };
    const first = payload.results?.[0];
    if (!first) return null;
    return {
      name: first.name,
      googlePlaceId: first.place_id,
      coordinates: first.geometry?.location ? { latitude: first.geometry.location.lat, longitude: first.geometry.location.lng } : candidate.coordinates,
      address: { formatted: first.formatted_address },
      confidence: Math.max(candidate.confidence, 0.75),
      raw: first as Record<string, unknown>,
    };
  }
}

export function createPlacesProvider(apiKey = process.env.GOOGLE_MAPS_API_KEY): PlacesProvider {
  return apiKey ? new GooglePlacesProvider(apiKey) : new MockPlacesProvider();
}
