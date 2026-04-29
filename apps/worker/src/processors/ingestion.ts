import { Worker } from 'bullmq';
import { CoreRepository, database } from '@voya/db';
import { createAiRouter } from '@voya/ai';
import {
  ingestionJobPayloadSchema,
  reelUnderstandingOutputSchema,
  type IngestionJobPayload,
  type IngestionStage,
  type PlaceCandidate,
} from '@voya/types';
import { connection, ingestionQueue } from '../queues';
import { oncePerAttempt } from '../idempotency';
import { logger } from '../logger';

const repo = new CoreRepository(database.db);
const ai = createAiRouter();
const stages: IngestionStage[] = ['metadata.fetch', 'media.frames.extract', 'media.ocr', 'audio.transcribe', 'ai.extract', 'places.resolve', 'graph.persist', 'fanout.emit'];

function nextStage(stage: IngestionStage) {
  const index = stages.indexOf(stage);
  return stages[index + 1];
}

async function enqueueNext(payload: IngestionJobPayload) {
  const stage = nextStage(payload.stage);
  if (!stage) return;
  await ingestionQueue.add(stage, { ...payload, stage, attemptKey: `${payload.ingestionJobId}:${stage}` }, { jobId: `${payload.ingestionJobId}:${stage}` });
}

function fallbackCandidate(sourceUrl: string): PlaceCandidate {
  const hostname = new URL(sourceUrl).hostname.replace(/^www\./, '');
  return { name: `Saved inspiration from ${hostname}`, kind: 'unknown', confidence: 0.35, evidence: { sourceUrl } };
}

const stageHandlers: Record<IngestionStage, (payload: IngestionJobPayload) => Promise<Record<string, unknown>>> = {
  'metadata.fetch': async (payload) => {
    await repo.updateIngestionJob(payload.ingestionJobId, { currentStage: payload.stage, extractedSignals: { sourceUrl: payload.sourceUrl, fetchedAt: new Date().toISOString() } });
    await enqueueNext(payload);
    return { stage: payload.stage };
  },
  'media.frames.extract': async (payload) => {
    await repo.updateIngestionJob(payload.ingestionJobId, { currentStage: payload.stage, extractedSignals: { frameAssetIds: [] } });
    await enqueueNext(payload);
    return { stage: payload.stage, frameAssetIds: [] };
  },
  'media.ocr': async (payload) => {
    await repo.updateIngestionJob(payload.ingestionJobId, { currentStage: payload.stage, extractedSignals: { ocrText: [] } });
    await enqueueNext(payload);
    return { stage: payload.stage, ocrText: [] };
  },
  'audio.transcribe': async (payload) => {
    await repo.updateIngestionJob(payload.ingestionJobId, { currentStage: payload.stage, extractedSignals: { transcript: '' } });
    await enqueueNext(payload);
    return { stage: payload.stage, transcript: '' };
  },
  'ai.extract': async (payload) => {
    const result = reelUnderstandingOutputSchema.parse(await ai.run('reel_understanding', { sourceUrl: payload.sourceUrl }));
    const candidates = result.placeCandidates.length ? result.placeCandidates : [fallbackCandidate(payload.sourceUrl)];
    await repo.updateIngestionJob(payload.ingestionJobId, { currentStage: payload.stage, candidatePlaces: candidates, extractedSignals: { aiSummary: result.summary, confidence: result.confidence } });
    await enqueueNext(payload);
    return { stage: payload.stage, candidates };
  },
  'places.resolve': async (payload) => {
    const [job] = await repo.getIngestionJobForUser(payload.userId, payload.ingestionJobId);
    const candidate = (job?.candidatePlaces?.[0] as PlaceCandidate | undefined) ?? fallbackCandidate(payload.sourceUrl);
    const place = await repo.resolveOrCreatePlace({
      name: candidate.name,
      kind: candidate.kind,
      coordinates: candidate.coordinates,
      sourceUrl: payload.sourceUrl,
      rawPayload: candidate.evidence,
      confidence: String(Math.max(candidate.confidence, 0.35).toFixed(3)),
      resolvedBy: candidate.confidence >= 0.7 ? 'ai_extraction' : 'manual_review',
    });
    if (job?.savedItemId) await repo.updateSavedItem(job.savedItemId, { placeId: place.id, status: candidate.confidence >= 0.7 ? 'resolved' : 'needs_review' });
    await repo.updateIngestionJob(payload.ingestionJobId, { currentStage: payload.stage, extractedSignals: { resolvedPlaceId: place.id } });
    await enqueueNext(payload);
    return { stage: payload.stage, placeId: place.id };
  },
  'graph.persist': async (payload) => {
    await repo.updateIngestionJob(payload.ingestionJobId, { currentStage: payload.stage });
    await enqueueNext(payload);
    return { stage: payload.stage };
  },
  'fanout.emit': async (payload) => {
    const [job] = await repo.updateIngestionJob(payload.ingestionJobId, { currentStage: payload.stage, status: 'completed' });
    if (job?.savedItemId) await repo.updateSavedItem(job.savedItemId, { status: 'resolved' });
    await repo.createNotification({ userId: payload.userId, type: 'ingestion_complete', title: 'Place saved', body: 'Your travel inspiration was processed.', metadata: { ingestionJobId: payload.ingestionJobId } });
    return { stage: payload.stage, completed: true };
  },
};

export function createIngestionWorker(concurrency: number) {
  return new Worker('ingestion', async (job) => oncePerAttempt(job, async () => {
    const payload = ingestionJobPayloadSchema.parse(job.data);
    logger.info({ jobId: job.id, stage: payload.stage }, 'processing ingestion stage');
    try {
      return await stageHandlers[payload.stage](payload);
    } catch (error) {
      await repo.updateIngestionJob(payload.ingestionJobId, { status: 'failed', failureReason: error instanceof Error ? error.message : 'Unknown ingestion error' });
      throw error;
    }
  }), { connection, concurrency });
}
