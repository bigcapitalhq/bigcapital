import { NotFoundException } from '@nestjs/common';
import type { PaymentProvider } from '@bigcapital/extension-sdk/bridges';
import { PaymentRegistry } from './payment.registry';

const buildProvider = (key: string): PaymentProvider => ({
  key,
  createPaymentLink: async () => ({
    reference: 'ref',
    url: 'https://example.com/pay',
    providerKey: key,
  }),
  handleWebhook: async () => ({ handled: true, providerKey: key }),
  refund: async () => ({ reference: 'ref', status: 'refunded' }),
  getStatus: async () => ({ reference: 'ref', status: 'succeeded' }),
});

describe('PaymentRegistry', () => {
  it('registers and retrieves namespaced providers', () => {
    const registry = new PaymentRegistry();
    const provider = buildProvider('stripe');

    registry.register('acme.payments', provider);

    expect(registry.getProvider('ext:acme.payments:stripe')).toBe(provider);
    expect(registry.getProviders()).toHaveLength(1);
  });

  it('throws when a provider is missing', () => {
    const registry = new PaymentRegistry();

    expect(() => registry.requireProvider('missing')).toThrow(
      NotFoundException,
    );
  });

  it('removes providers by owner', () => {
    const registry = new PaymentRegistry();

    registry.register('acme.payments', buildProvider('stripe'));
    registry.register('acme.other', buildProvider('paypal'));

    expect(registry.removeByOwner('acme.payments')).toBe(1);
    expect(registry.getProvider('ext:acme.other:paypal')).toBeTruthy();
  });
});
