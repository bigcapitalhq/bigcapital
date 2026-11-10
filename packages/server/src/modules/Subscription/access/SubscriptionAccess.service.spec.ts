import { SubscriptionAccessService } from './SubscriptionAccess.service';
import { ERRORS } from '../types';

interface ServiceOptions {
  hostedOnCloud?: boolean;
  tenant?: Record<string, unknown> | null;
  subscription?: Record<string, unknown> | null;
}

function createService({
  hostedOnCloud = true,
  tenant = { id: 1 },
  subscription = null,
}: ServiceOptions = {}) {
  const configService = {
    get: jest.fn((key: string) =>
      key === 'cloud.hostedOnCloud' ? hostedOnCloud : undefined,
    ),
  };
  const tenancyContext = {
    getTenant: jest.fn().mockResolvedValue(tenant),
  };
  const planSubscriptionQuery = {
    findOne: jest.fn().mockResolvedValue(subscription),
  };
  const planSubscriptionModel = {
    query: jest.fn(() => planSubscriptionQuery),
  };

  const service = new SubscriptionAccessService(
    configService as never,
    tenancyContext as never,
    planSubscriptionModel as never,
  );

  return { service };
}

const buildSubscription = (overrides: Record<string, unknown> = {}) => ({
  active: () => true,
  onTrial: () => false,
  trialExpired: () => false,
  stripeSubscriptionId: null,
  lemonSubscriptionId: null,
  ...overrides,
});

describe('SubscriptionAccessService', () => {
  it('allows writes on self-hosted installations', async () => {
    const { service } = createService({ hostedOnCloud: false });

    await expect(service.assertCanWrite()).resolves.toBeUndefined();
  });

  it('allows writes when no tenant is resolved', async () => {
    const { service } = createService({ tenant: null });

    await expect(service.assertCanWrite()).resolves.toBeUndefined();
  });

  it('allows writes for an active local trial', async () => {
    const { service } = createService({
      subscription: buildSubscription({
        active: () => true,
        onTrial: () => true,
      }),
    });

    await expect(service.assertCanWrite()).resolves.toBeUndefined();
  });

  it('allows writes for an active provider-backed subscription', async () => {
    const { service } = createService({
      subscription: buildSubscription({
        stripeSubscriptionId: 'sub_123',
      }),
    });

    await expect(service.assertCanWrite()).resolves.toBeUndefined();
  });

  it('blocks writes when the provider-less trial has expired', async () => {
    const { service } = createService({
      subscription: buildSubscription({
        active: () => false,
        trialExpired: () => true,
      }),
    });

    await expect(service.assertCanWrite()).rejects.toMatchObject({
      response: {
        errors: [{ type: ERRORS.TRIAL_EXPIRED }],
      },
    });
  });

  it('blocks writes when the Cloud organization has no subscription', async () => {
    const { service } = createService({ subscription: null });

    await expect(service.assertCanWrite()).rejects.toMatchObject({
      response: {
        errors: [{ type: ERRORS.SUBSCRIPTION_INACTIVE }],
      },
    });
  });

  it('blocks writes for a canceled provider subscription', async () => {
    const { service } = createService({
      subscription: buildSubscription({
        active: () => false,
        stripeSubscriptionId: 'sub_123',
      }),
    });

    await expect(service.assertCanWrite()).rejects.toMatchObject({
      response: {
        errors: [{ type: ERRORS.SUBSCRIPTION_INACTIVE }],
      },
    });
  });
});
