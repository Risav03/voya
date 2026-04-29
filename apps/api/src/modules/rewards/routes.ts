import { Elysia } from 'elysia';
import { sessionPlugin } from '../../auth/plugin';
class RewardsService { list() { return { items: [] }; } user(userId: string) { return { userId, items: [] }; } }
const service = new RewardsService();
export const rewardsRoutes = new Elysia()
  .use(sessionPlugin)
  .get('/achievements', () => service.list(), { requireAuth: true })
  .use(sessionPlugin)
  .get('/users/me/achievements', ({ user }) => service.user(user.id), { requireAuth: true });
