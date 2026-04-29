import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CheckInRequest, CreateCollectionRequest, CreateTripRequest, IngestReelRequest } from '@voya/types';
import { apiClient } from '../../lib/api-client';

export function useMe() {
  return useQuery({ queryKey: ['me'], queryFn: () => apiClient.get<{ user: unknown }>('/users/me'), retry: false });
}

export function useCollections() {
  return useQuery({ queryKey: ['collections'], queryFn: () => apiClient.get<unknown[]>('/collections') });
}

export function useCreateCollection() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (body: CreateCollectionRequest) => apiClient.post('/collections', body), onSuccess: () => qc.invalidateQueries({ queryKey: ['collections'] }) });
}

export function useIngestReel() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (body: IngestReelRequest) => apiClient.post<{ job: { id: string } }>('/ingest/reel', body), onSuccess: () => qc.invalidateQueries({ queryKey: ['collections'] }) });
}

export function useIngestionJob(id?: string) {
  return useQuery({ queryKey: ['ingestion-job', id], queryFn: () => apiClient.get(`/ingest/jobs/${id}`), enabled: Boolean(id), refetchInterval: 3000 });
}

export function useTrips() {
  return useQuery({ queryKey: ['trips'], queryFn: () => apiClient.get<unknown[]>('/trips') });
}

export function useCreateTrip() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (body: CreateTripRequest) => apiClient.post<{ id: string }>('/trips', body), onSuccess: () => qc.invalidateQueries({ queryKey: ['trips'] }) });
}

export function useTrip(id?: string) {
  return useQuery({ queryKey: ['trip', id], queryFn: () => apiClient.get(`/trips/${id}`), enabled: Boolean(id) });
}

export function useGenerateItinerary(tripId: string) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: () => apiClient.post(`/trips/${tripId}/itinerary/generate`), onSuccess: () => qc.invalidateQueries({ queryKey: ['trip', tripId] }) });
}

export function useCheckIn() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (body: CheckInRequest) => apiClient.post('/checkins', body), onSuccess: () => qc.invalidateQueries() });
}

export function useGraphSummary() {
  return useQuery({ queryKey: ['map-summary'], queryFn: () => apiClient.get('/users/me/map-summary') });
}
