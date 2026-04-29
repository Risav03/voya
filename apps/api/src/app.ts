import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import { nanoid } from 'nanoid';
import { AppError } from './lib/errors';
import { logger } from './lib/logger';
import { authPlugin } from './auth/plugin';
import {
  adminRoutes,
  analyticsRoutes,
  checkinsRoutes,
  collectionsRoutes,
  graphRoutes,
  ingestionRoutes,
  itineraryRoutes,
  liveTravelRoutes,
  notificationsRoutes,
  paymentsRoutes,
  placesRoutes,
  rewardsRoutes,
  tripsRoutes,
  usersRoutes,
} from './modules';

export const app = new Elysia()
  .use(cors())
  .use(swagger({ documentation: { info: { title: 'Reels To Real Travel API', version: '0.1.0' } } }))
  .use(authPlugin)
  .derive(({ request }) => ({
    traceId: request.headers.get('x-request-id') ?? nanoid(),
  }))
  .onError(({ error, set, traceId }) => {
    if (error instanceof AppError) {
      set.status = error.status;
      return { error: { code: error.code, message: error.message, traceId, details: error.details } };
    }
    logger.error({ error, traceId }, 'unhandled request error');
    set.status = 500;
    return { error: { code: 'internal_error', message: 'Internal server error', traceId } };
  })
  .get('/health', ({ traceId }) => ({ ok: true, service: 'api', traceId }))
  .use(usersRoutes)
  .use(ingestionRoutes)
  .use(placesRoutes)
  .use(collectionsRoutes)
  .use(tripsRoutes)
  .use(itineraryRoutes)
  .use(checkinsRoutes)
  .use(rewardsRoutes)
  .use(graphRoutes)
  .use(notificationsRoutes)
  .use(paymentsRoutes)
  .use(analyticsRoutes)
  .use(adminRoutes)
  .use(liveTravelRoutes);

export type App = typeof app;
