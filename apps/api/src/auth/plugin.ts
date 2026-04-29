import { Elysia } from 'elysia';
import { auth } from './auth';
import { ensureDomainUser } from './user';

export const authHandlerPlugin = new Elysia({ name: 'auth-handler' }).mount('/auth', auth.handler);

export const sessionPlugin = new Elysia({ name: 'session-plugin' })
  .macro({
    requireAuth: {
      async resolve({ status, request }) {
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session) return status(401, { error: { code: 'unauthorized', message: 'Authentication required' } });
        const domainUser = await ensureDomainUser(session.user);
        return {
          domainUser,
          user: session.user,
          session: session.session,
        };
      },
    },
  });

export const authPlugin = new Elysia({ name: 'auth-plugin' })
  .use(authHandlerPlugin)
  .use(sessionPlugin);
