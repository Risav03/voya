import { Elysia } from 'elysia';
import { sessionPlugin } from '../../auth/plugin';
import { checkinsService } from './service';

export const checkinsRoutes = new Elysia()
  .use(sessionPlugin)
  .post('/checkins', ({ body, domainUser }) => checkinsService.create(domainUser.id, body), { requireAuth: true })
  .get('/trips/:id/checkins', ({ params, domainUser }) => checkinsService.listForTrip(domainUser.id, params.id), { requireAuth: true });
