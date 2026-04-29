import { Elysia } from 'elysia';
import { sessionPlugin } from '../../auth/plugin';
import { ingestionService } from './service';

export const ingestionRoutes = new Elysia({ prefix: '/ingest' })
  .use(sessionPlugin)
  .post('/reel', ({ body, domainUser }) => ingestionService.createReelJob(domainUser.id, body, crypto.randomUUID()), { requireAuth: true })
  .post('/share', ({ body, domainUser }) => ingestionService.createReelJob(domainUser.id, body, crypto.randomUUID()), { requireAuth: true })
  .get('/jobs/:id', ({ params, domainUser }) => ingestionService.getJob(domainUser.id, params.id), { requireAuth: true })
  .post('/jobs/:id/reprocess', ({ params, domainUser }) => ingestionService.reprocess(domainUser.id, params.id), { requireAuth: true });
