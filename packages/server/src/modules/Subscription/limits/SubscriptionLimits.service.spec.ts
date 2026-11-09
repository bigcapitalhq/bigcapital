import { SubscriptionLimitsService } from './SubscriptionLimits.service';
import { ERRORS } from '../types';

const FREE_LIMIT = 5;

interface ServiceOptions {
  hostedOnCloud?: boolean;
  invoices?: number;
  bills?: number;
  subscription?: Record<string, unknown> | null;
}

function createService({
  hostedOnCloud = true,
  invoices = 0,
  bills = 0,
  subscription = null,
}: ServiceOptions = {}) {
  const configService = {
    get: jest.fn((key: string) => {
      if (key === 'cloud.hostedOnCloud') return hostedOnCloud;
      if (key === 'cloud.freePlan.invoiceLimit') return FREE_LIMIT;
      if (key === 'cloud.freePlan.billLimit') return FREE_LIMIT;
      return undefined;
    }),
  };
  const tenancyContext = {
    getTenant: jest.fn().mockResolvedValue({ id: 1 }),
  };
  const planSubscriptionQuery = {
    findOne: jest.fn().mockReturnThis(),
    withGraphFetched: jest.fn().mockResolvedValue(subscription),
  };
  const planSubscriptionModel = {
    query: jest.fn(() => planSubscriptionQuery),
  };
  const saleInvoiceModel = jest.fn(() => ({
    query: () => ({ resultSize: () => Promise.resolve(invoices) }),
  }));
  const billModel = jest.fn(() => ({
    query: () => ({ resultSize: () => Promise.resolve(bills) }),
  }));

  const service = new SubscriptionLimitsService(
    configService as never,
    tenancyContext as never,
    planSubscriptionModel as never,
    saleInvoiceModel as never,
    billModel as never,
  );

  return { service };
}

const paidSubscription = {
  active: () => true,
  stripeSubscriptionId: 'sub_123',
  lemonSubscriptionId: null,
  plan: { price: 10 },
};

describe('SubscriptionLimitsService', () => {
  it('never limits self-hosted installations', async () => {
    const { service } = createService({
      hostedOnCloud: false,
      invoices: 10,
      bills: 10,
    });

    await expect(service.assertCanCreateInvoice()).resolves.toBeUndefined();
    await expect(service.assertCanCreateBill()).resolves.toBeUndefined();
    await expect(service.getUsage()).resolves.toMatchObject({
      plan: 'paid',
      invoices: { used: 10, limit: null },
      bills: { used: 10, limit: null },
    });
  });

  it('treats a Cloud organization without subscription as free', async () => {
    const { service } = createService({ invoices: 2, bills: 1 });

    await expect(service.isFreePlan()).resolves.toBe(true);
    await expect(service.getUsage()).resolves.toEqual({
      plan: 'free',
      invoices: { used: 2, limit: FREE_LIMIT },
      bills: { used: 1, limit: FREE_LIMIT },
    });
  });

  it('treats an active paid subscription as unlimited', async () => {
    const { service } = createService({
      invoices: 10,
      bills: 10,
      subscription: paidSubscription,
    });

    await expect(service.isFreePlan()).resolves.toBe(false);
    await expect(service.assertCanCreateInvoice()).resolves.toBeUndefined();
    await expect(service.assertCanCreateBill()).resolves.toBeUndefined();
  });

  it('allows creating the last free invoice', async () => {
    const { service } = createService({ invoices: FREE_LIMIT - 1 });

    await expect(service.assertCanCreateInvoice()).resolves.toBeUndefined();
  });

  it('blocks invoice creation at the free limit', async () => {
    const { service } = createService({ invoices: FREE_LIMIT });

    await expect(service.assertCanCreateInvoice()).rejects.toMatchObject({
      response: {
        errors: [
          {
            type: ERRORS.FREE_PLAN_LIMIT_REACHED,
            payload: {
              resource: 'invoice',
              used: FREE_LIMIT,
              limit: FREE_LIMIT,
            },
          },
        ],
      },
    });
  });

  it('blocks bill creation at the free limit independently', async () => {
    const { service } = createService({
      invoices: FREE_LIMIT,
      bills: FREE_LIMIT,
    });

    await expect(service.assertCanCreateBill()).rejects.toMatchObject({
      response: {
        errors: [
          {
            type: ERRORS.FREE_PLAN_LIMIT_REACHED,
            payload: {
              resource: 'bill',
              used: FREE_LIMIT,
              limit: FREE_LIMIT,
            },
          },
        ],
      },
    });
  });
});
