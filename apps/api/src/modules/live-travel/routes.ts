import { Elysia } from 'elysia';
import { liveTripMessageSchema } from '@voya/types';
import { auth } from '../../auth/auth';
import { coreRepository } from '../../services/repository';

class LiveTravelService { handleMessage(message: unknown) { return liveTripMessageSchema.safeParse(message); } }
const service = new LiveTravelService();
export const liveTravelRoutes = new Elysia()
  .ws('/live/trips/:id', {
    async beforeHandle({ status, request, params }) {
      const session = await auth.api.getSession({ headers: request.headers });
      if (!session) return status(401, { error: { code: 'unauthorized', message: 'Authentication required' } });
      const [trip] = await coreRepository.getTrip(session.user.id, params.id);
      if (!trip) return status(404, { error: { code: 'not_found', message: 'Trip not found' } });
    },
    message(ws, message) {
      const parsed = service.handleMessage(message);
      if (!parsed.success) return ws.send({ type: 'error', code: 'validation_failed' });
      ws.publish(`trip:${ws.data.params.id}`, { type: 'trip.sync', payload: parsed.data });
      ws.send({ type: 'ack', received: parsed.data.type });
    },
    open(ws) { ws.subscribe(`trip:${ws.data.params.id}`); },
    close(ws) { ws.unsubscribe(`trip:${ws.data.params.id}`); },
  });
