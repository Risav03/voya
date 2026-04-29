import { Elysia } from 'elysia';
import { billingProvider } from '../../services/billing';
import { sessionPlugin } from '../../auth/plugin';
class PaymentsService {
  checkout(userId: string) { return billingProvider.createCheckoutSession(userId); }
  webhook(signature: string | null, body: unknown) { return billingProvider.verifyWebhook(signature, JSON.stringify(body ?? {})); }
  status(userId: string) { return billingProvider.getStatus(userId); }
}
const service = new PaymentsService();
export const paymentsRoutes = new Elysia({ prefix: '/billing' })
  .use(sessionPlugin)
  .post('/checkout', ({ user }) => service.checkout(user.id), { requireAuth: true })
  .use(sessionPlugin)
  .post('/webhook', ({ headers, body }) => service.webhook(headers['stripe-signature'] ?? null, body))
  .get('/status', ({ user }) => service.status(user.id), { requireAuth: true });
