import { Elysia } from 'elysia';
import { sessionPlugin } from '../../auth/plugin';
import { coreRepository } from '../../services/repository';

export const notificationsRoutes = new Elysia({ prefix: '/notifications' })
  .use(sessionPlugin)
  .get('/', ({ domainUser }) => coreRepository.listNotifications(domainUser.id), { requireAuth: true })
  .post('/read', ({ body, domainUser }) => coreRepository.markNotificationsRead(domainUser.id, (body as { ids?: string[] })?.ids), { requireAuth: true });
