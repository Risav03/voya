import { z } from 'zod';
import { createCollectionRequestSchema } from '@voya/types';
import { AppError } from '../../lib/errors';
import { parseInput } from '../../lib/validation';
import { coreRepository } from '../../services/repository';

const patchCollectionSchema = createCollectionRequestSchema.partial();

export class CollectionsService {
  list(userId: string) { return coreRepository.listCollections(userId); }
  async create(userId: string, body: unknown) { return (await coreRepository.createCollection({ userId, ...parseInput(createCollectionRequestSchema, body) }))[0]; }
  async get(userId: string, id: string) {
    const [collection] = await coreRepository.getCollection(userId, id);
    if (!collection) throw new AppError('not_found', 'Collection not found', 404);
    const items = await coreRepository.listSavedItems(userId, id);
    return { ...collection, items };
  }
  async update(userId: string, id: string, body: unknown) {
    const patch = parseInput(patchCollectionSchema, body);
    const [collection] = await coreRepository.updateCollection(userId, id, patch);
    if (!collection) throw new AppError('not_found', 'Collection not found', 404);
    return collection;
  }
  async delete(userId: string, id: string) {
    const [collection] = await coreRepository.softDeleteCollection(userId, id);
    if (!collection) throw new AppError('not_found', 'Collection not found', 404);
    return { id, deleted: true };
  }
  savedItems(userId: string, collectionId?: string) { z.string().optional().parse(collectionId); return coreRepository.listSavedItems(userId, collectionId); }
}
export const collectionsService = new CollectionsService();
