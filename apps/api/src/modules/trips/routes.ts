import { Elysia } from 'elysia';
import { sessionPlugin } from '../../auth/plugin';
import { tripsService } from './service';

export const tripsRoutes = new Elysia({ prefix: '/trips' })
  .use(sessionPlugin)
  .get('/', ({ domainUser }) => tripsService.list(domainUser.id), { requireAuth: true })
  .post('/', ({ body, domainUser }) => tripsService.create(domainUser.id, body), { requireAuth: true })
  .get('/:id', ({ params, domainUser }) => tripsService.get(domainUser.id, params.id), { requireAuth: true })
  .patch('/:id', ({ params, body, domainUser }) => tripsService.update(domainUser.id, params.id, body), { requireAuth: true })
  .post('/:id/start', ({ params, domainUser }) => tripsService.start(domainUser.id, params.id), { requireAuth: true })
  .post('/:id/end', ({ params, domainUser }) => tripsService.end(domainUser.id, params.id), { requireAuth: true });
