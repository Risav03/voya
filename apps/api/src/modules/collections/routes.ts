import { Elysia } from 'elysia';
import { sessionPlugin } from '../../auth/plugin';
import { collectionsService } from './service';

export const collectionsRoutes = new Elysia({ prefix: '/collections' })
  .use(sessionPlugin)
  .get('/', ({ domainUser }) => collectionsService.list(domainUser.id), { requireAuth: true })
  .post('/', ({ body, domainUser }) => collectionsService.create(domainUser.id, body), { requireAuth: true })
  .get('/:id', ({ params, domainUser }) => collectionsService.get(domainUser.id, params.id), { requireAuth: true })
  .patch('/:id', ({ params, body, domainUser }) => collectionsService.update(domainUser.id, params.id, body), { requireAuth: true })
  .delete('/:id', ({ params, domainUser }) => collectionsService.delete(domainUser.id, params.id), { requireAuth: true });
