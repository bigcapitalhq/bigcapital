import { describe, expect, it } from 'vitest';
import { createExtensionTestHarness } from '../testing';

describe('bridge registry API', () => {
  it('records registered bridge providers', () => {
    const harness = createExtensionTestHarness({
      id: 'acme.reports',
      name: 'Acme Reports',
      version: '1.0.0',
      trust: 'partner',
    });

    harness.context.bridges.payments.register({
      key: 'acme',
      createPaymentLink: async () => ({
        reference: 'ref',
        url: 'https://example.com/pay',
        providerKey: 'acme',
      }),
      handleWebhook: async () => ({
        handled: true,
        providerKey: 'acme',
      }),
      refund: async () => ({
        reference: 'ref',
        status: 'refunded',
      }),
      getStatus: async () => ({
        reference: 'ref',
        status: 'succeeded',
      }),
    });

    harness.context.bridges.reports.register({
      key: 'acme',
      list: () => [],
      run: async () => ({ columns: [], rows: [] }),
    });

    harness.context.bridges.approvals.register({
      key: 'acme',
      evaluate: async () => ({ type: 'allow' }),
    });

    harness.context.bridges.tax.register({
      key: 'acme',
      calculate: async () => ({ lines: [], totalTaxAmount: 0 }),
      validateConfiguration: async () => {},
    });

    expect(harness.bridges.payments).toHaveLength(1);
    expect(harness.bridges.reports).toHaveLength(1);
    expect(harness.bridges.approvals).toHaveLength(1);
    expect(harness.bridges.tax).toHaveLength(1);
  });
});
