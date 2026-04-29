import { Elysia } from 'elysia';
import { sessionPlugin } from '../../auth/plugin';
class AdminService {
  ingestionJobs() { return { items: [], scope: 'admin' }; }
  placeMerges() { return { items: [], scope: 'admin' }; }
  tripErrors() { return { items: [], scope: 'admin' }; }
  supportActions() { return { items: [], scope: 'admin' }; }
  achievementRules() { return { items: [], scope: 'admin' }; }
  billing() { return { items: [], scope: 'admin' }; }
}
const service = new AdminService();
export const adminRoutes = new Elysia({ prefix: '/admin' })
  .use(sessionPlugin)
  .get('/ingestion-jobs', () => service.ingestionJobs(), { requireAuth: true })
  .use(sessionPlugin)
  .get('/place-merge-review', () => service.placeMerges(), { requireAuth: true })
  .use(sessionPlugin)
  .get('/trip-errors', () => service.tripErrors(), { requireAuth: true })
  .use(sessionPlugin)
  .get('/support-actions', () => service.supportActions(), { requireAuth: true })
  .use(sessionPlugin)
  .get('/achievement-rules', () => service.achievementRules(), { requireAuth: true })
  .use(sessionPlugin)
  .get('/billing', () => service.billing(), { requireAuth: true });
