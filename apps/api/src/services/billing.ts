export interface BillingProvider {
  createCheckoutSession(userId: string): Promise<{ checkoutUrl: string }>;
  verifyWebhook(signature: string | null, payload: string): Promise<{ eventType: string; data: unknown }>;
  getStatus(userId: string): Promise<{ tier: 'free' | 'premium' | 'admin'; status: string }>;
}

export class MockBillingProvider implements BillingProvider {
  async createCheckoutSession(userId: string) {
    return { checkoutUrl: `https://billing.mock/checkout?user=${userId}` };
  }

  async verifyWebhook(signature: string | null, payload: string) {
    if (!signature) throw new Error('Missing billing webhook signature');
    return { eventType: 'mock.webhook', data: JSON.parse(payload || '{}') as unknown };
  }

  async getStatus(_userId: string) {
    return { tier: 'free' as const, status: 'active' };
  }
}

export const billingProvider = new MockBillingProvider();
