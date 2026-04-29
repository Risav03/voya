import { Elysia } from 'elysia';
import { sessionPlugin } from '../../auth/plugin';
import { coreRepository } from '../../services/repository';

export const graphRoutes = new Elysia()
  .use(sessionPlugin)
  .get('/users/me/travel-graph', async ({ domainUser }) => ({ userId: domainUser.id, edges: await coreRepository.graph(domainUser.id), nodes: [] }), { requireAuth: true })
  .get('/users/me/map-summary', async ({ domainUser }) => ({ userId: domainUser.id, edges: (await coreRepository.graph(domainUser.id)).length }), { requireAuth: true })
  .get('/users/me/timeline', ({ domainUser }) => coreRepository.feed(domainUser.id), { requireAuth: true });
