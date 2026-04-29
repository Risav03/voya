import { Elysia } from 'elysia';
import { sessionPlugin } from '../../auth/plugin';
export const usersRoutes = new Elysia({ prefix: '/users' })
  .use(sessionPlugin)
  .get('/me', ({ domainUser, session }) => ({ user: domainUser, session }), { requireAuth: true });
