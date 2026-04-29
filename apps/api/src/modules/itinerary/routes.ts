import { Elysia } from 'elysia';
import { sessionPlugin } from '../../auth/plugin';
import { tripsService } from '../trips/service';

export const itineraryRoutes = new Elysia()
  .use(sessionPlugin)
  .post('/trips/:id/itinerary/generate', ({ params, domainUser }) => tripsService.generateItinerary(domainUser.id, params.id, 'initial'), { requireAuth: true })
  .get('/trips/:id/itinerary', ({ params, domainUser }) => tripsService.getItinerary(domainUser.id, params.id), { requireAuth: true })
  .post('/trips/:id/itinerary/regenerate', ({ params, domainUser }) => tripsService.generateItinerary(domainUser.id, params.id, 'regenerate'), { requireAuth: true })
  .post('/trips/:id/itinerary/skip-stop', ({ params, domainUser }) => tripsService.generateItinerary(domainUser.id, params.id, 'skip_stop'), { requireAuth: true })
  .post('/trips/:id/itinerary/reschedule', ({ params, domainUser }) => tripsService.generateItinerary(domainUser.id, params.id, 'running_late'), { requireAuth: true });
