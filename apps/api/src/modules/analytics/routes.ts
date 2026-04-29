import { Elysia } from 'elysia';
import { sessionPlugin } from '../../auth/plugin';
class AnalyticsService { track(userId: string, body: unknown) { return { userId, accepted: true, body }; } }
const service = new AnalyticsService();
export const analyticsRoutes = new Elysia({ prefix: '/analytics' })
  .use(sessionPlugin)
  .post('/events', ({ body, user }) => service.track(user.id, body), { requireAuth: true });
