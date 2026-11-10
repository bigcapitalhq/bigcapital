import { SubscriptionAccessService } from './SubscriptionAccess.service';
import { ERRORS } from '../types';
import { SubscriptionFeature } from '../SubscriptionFeatures';

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
    findOne: jest.fn().mockReturnThis(),
    withGraphFetched: jest.fn().mockResolvedValue(subscription),
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
  plan: {
    slug: 'go-monthly',
    familySlug: 'go',
    price: 10,
  },
  ...overrides,
});

const buildLegacySubscription = (
  familySlug: string,
  overrides: Record<string, unknown> = {},
) =>
  buildSubscription({
    plan: {
      slug: `${familySlug}-monthly`,
      familySlug,
      price: 10,
    },
    ...overrides,
  });

describe('SubscriptionAccessService', () => {
  describe('assertCanWrite', () => {
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

  describe('assertFeatureAccess', () => {
    it('allows self-hosted installations by default', async () => {
      const { service } = createService({ hostedOnCloud: false });

      await expect(
        service.assertFeatureAccess(SubscriptionFeature.SaleInvoices),
      ).resolves.toBeUndefined();
    });

    it('allows contexts without a tenant', async () => {
      const { service } = createService({ tenant: null });

      await expect(
        service.assertFeatureAccess(SubscriptionFeature.SaleInvoices),
      ).resolves.toBeUndefined();
    });

    it('allows every feature for the Go plan', async () => {
      const { service } = createService({
        subscription: buildSubscription(),
      });

      await expect(
        service.assertFeatureAccess(SubscriptionFeature.Warehouses),
      ).resolves.toBeUndefined();
    });

    it('allows every feature during a trial by default', async () => {
      const { service } = createService({
        subscription: buildSubscription({
          onTrial: () => true,
        }),
      });

      await expect(
        service.assertFeatureAccess(SubscriptionFeature.Warehouses),
      ).resolves.toBeUndefined();
    });

    it('rejects trials when allowTrial is disabled', async () => {
      const { service } = createService({
        subscription: buildSubscription({
          onTrial: () => true,
        }),
      });

      await expect(
        service.assertFeatureAccess(SubscriptionFeature.Warehouses, {
          allowTrial: false,
        }),
      ).rejects.toMatchObject({
        response: {
          errors: [{ type: ERRORS.FEATURE_NOT_AVAILABLE }],
        },
      });
    });

    it('checks legacy plan feature sets', async () => {
      const { service } = createService({
        subscription: buildLegacySubscription('capital-basic'),
      });

      await expect(
        service.assertFeatureAccess(SubscriptionFeature.SaleInvoices),
      ).resolves.toBeUndefined();

      await expect(
        service.assertFeatureAccess(SubscriptionFeature.Bills),
      ).rejects.toMatchObject({
        response: {
          errors: [{ type: ERRORS.FEATURE_NOT_AVAILABLE }],
        },
      });
    });

    it('grants the features included in the legacy essential plan', async () => {
      const { service } = createService({
        subscription: buildLegacySubscription('capital-essential'),
      });

      await expect(
        service.assertFeatureAccess(SubscriptionFeature.Bills),
      ).resolves.toBeUndefined();
    });

    it('does not restrict unknown plan families', async () => {
      const { service } = createService({
        subscription: buildLegacySubscription('grandfathered-plan'),
      });

      await expect(
        service.assertFeatureAccess(SubscriptionFeature.Warehouses),
      ).resolves.toBeUndefined();
    });

    it('keeps reads available when the subscription is inactive', async () => {
      const { service } = createService({
        subscription: buildSubscription({
          active: () => false,
          trialExpired: () => true,
        }),
      });

      await expect(
        service.assertFeatureAccess(
          SubscriptionFeature.SaleInvoices,
          {},
          false,
        ),
      ).resolves.toBeUndefined();
    });

    it('blocks writes when the subscription is inactive', async () => {
      const { service } = createService({
        subscription: buildSubscription({
          active: () => false,
          trialExpired: () => true,
        }),
      });

      await expect(
        service.assertFeatureAccess(SubscriptionFeature.SaleInvoices, {}, true),
      ).rejects.toMatchObject({
        response: {
          errors: [{ type: ERRORS.TRIAL_EXPIRED }],
        },
      });
    });

    it('allows inactive access when explicitly requested', async () => {
      const { service } = createService({
        subscription: buildSubscription({
          active: () => false,
        }),
      });

      await expect(
        service.assertFeatureAccess(SubscriptionFeature.SaleInvoices, {
          allowInactive: true,
        }),
      ).resolves.toBeUndefined();
    });

    it('allows explicitly listed plans', async () => {
      const { service } = createService({
        subscription: buildLegacySubscription('capital-basic'),
      });

      await expect(
        service.assertFeatureAccess(SubscriptionFeature.Bills, {
          allowPlans: ['capital-basic-monthly'],
        }),
      ).resolves.toBeUndefined();
    });

    it('rejects Go plan access when the Go bypass is disabled', async () => {
      const { service } = createService({
        subscription: buildSubscription(),
      });

      await expect(
        service.assertFeatureAccess(SubscriptionFeature.Warehouses, {
          allowGoPlan: false,
        }),
      ).rejects.toMatchObject({
        response: {
          errors: [{ type: ERRORS.FEATURE_NOT_AVAILABLE }],
        },
      });
    });

    it('uses the custom error type and message', async () => {
      const { service } = createService({
        subscription: buildLegacySubscription('capital-basic'),
      });

      await expect(
        service.assertFeatureAccess(SubscriptionFeature.Bills, {
          errorType: 'CUSTOM.FEATURE.ERROR',
          errorMessage: 'Upgrade to use bills.',
        }),
      ).rejects.toMatchObject({
        response: {
          message: 'Upgrade to use bills.',
          errors: [
            {
              type: 'CUSTOM.FEATURE.ERROR',
              payload: { feature: SubscriptionFeature.Bills },
            },
          ],
        },
      });
    });
  });
});
