import { Elysia } from 'elysia';
import { sessionPlugin } from '../../auth/plugin';
import { placesService } from './service';

export const placesRoutes = new Elysia({ prefix: '/places' })
  .use(sessionPlugin)
  .get('/search', ({ query }) => placesService.search(query), { requireAuth: true })
  .get('/:id', ({ params }) => placesService.get(params.id), { requireAuth: true })
  .post('/:id/confirm', ({ params, domainUser }) => placesService.confirm(domainUser.id, params.id, crypto.randomUUID()), { requireAuth: true })
  .post('/:id/merge', ({ params, body, domainUser }) => placesService.merge(domainUser.id, params.id, body, crypto.randomUUID()), { requireAuth: true })
  .post('/:id/alias', ({ params, body, domainUser }) => placesService.alias(domainUser.id, params.id, body, crypto.randomUUID()), { requireAuth: true });
