import { ingestReelRequestSchema, type IngestionStage } from '@voya/types';
import { parseInput } from '../../lib/validation';
import { assertPublicHttpUrl } from '../../lib/security';
import { ingestionQueue } from '../../services/queues';
import { coreRepository } from '../../services/repository';
import { AppError } from '../../lib/errors';

const firstStage: IngestionStage = 'metadata.fetch';

export class IngestionService {
  async createReelJob(userId: string, input: unknown, traceId: string) {
    const body = parseInput(ingestReelRequestSchema, input);
    const sourceUrl = assertPublicHttpUrl(body.sourceUrl);
    const { savedItem, job } = await coreRepository.createSavedItemWithJob({
      userId,
      collectionId: body.collectionId,
      sourceUrl,
      sourcePlatform: body.sourcePlatform,
      rawPayload: body.rawSharePayload,
      traceId,
    });

    await ingestionQueue.add(firstStage, {
      ingestionJobId: job.id,
      userId,
      sourceUrl,
      stage: firstStage,
      attemptKey: `${job.id}:${firstStage}`,
    }, { jobId: `${job.id}:${firstStage}` });

    return { job, savedItem };
  }

  async getJob(userId: string, id: string) {
    const [job] = await coreRepository.getIngestionJobForUser(userId, id);
    if (!job) throw new AppError('not_found', 'Ingestion job not found', 404);
    return job;
  }

  async reprocess(userId: string, id: string) {
    const [job] = await coreRepository.getIngestionJobForUser(userId, id);
    if (!job) throw new AppError('not_found', 'Ingestion job not found', 404);
    const [updated] = await coreRepository.updateIngestionJob(id, { status: 'active', currentStage: firstStage, failureReason: null });
    await ingestionQueue.add(firstStage, { ingestionJobId: id, userId, sourceUrl: job.sourceUrl, stage: firstStage, attemptKey: `${id}:${firstStage}:${Date.now()}` });
    return updated;
  }
}
export const ingestionService = new IngestionService();
