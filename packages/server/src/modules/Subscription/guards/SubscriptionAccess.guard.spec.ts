import { SubscriptionAccessGuard } from './SubscriptionAccess.guard';
import { SubscriptionFeature } from '../SubscriptionFeatures';
import {
  REQUIRED_SUBSCRIPTION_FEATURE_KEY,
  RequiredSubscriptionFeatureMetadata,
} from '../decorators/RequireSubscriptionFeature.decorator';
import { SKIP_SUBSCRIPTION_CHECK_KEY } from '../decorators/SkipSubscriptionCheck.decorator';
import { IS_PUBLIC_ROUTE } from '@/modules/Auth/Auth.constants';
import { IS_TENANT_AGNOSTIC } from '@/modules/Tenancy/TenancyGlobal.guard';

const buildContext = (method = 'POST') =>
  ({
    getType: () => 'http',
    switchToHttp: () => ({
      getRequest: () => ({ method }),
    }),
    getHandler: () => undefined,
    getClass: () => undefined,
  }) as never;

const buildGuard = ({
  publicRoute = false,
  tenantAgnostic = false,
  skipped = false,
  metadata = null,
  assertCanWrite = jest.fn().mockResolvedValue(undefined),
  assertFeatureAccess = jest.fn().mockResolvedValue(undefined),
}: {
  publicRoute?: boolean;
  tenantAgnostic?: boolean;
  skipped?: boolean;
  metadata?: RequiredSubscriptionFeatureMetadata | null;
  assertCanWrite?: jest.Mock;
  assertFeatureAccess?: jest.Mock;
} = {}) => {
  const reflector = {
    getAllAndOverride: jest.fn().mockImplementation((key: string) => {
      if (key === SKIP_SUBSCRIPTION_CHECK_KEY) return skipped;
      if (key === IS_PUBLIC_ROUTE) return publicRoute;
      if (key === IS_TENANT_AGNOSTIC) return tenantAgnostic;
      if (key === REQUIRED_SUBSCRIPTION_FEATURE_KEY) return metadata;
      return undefined;
    }),
  };
  const subscriptionAccess = {
    assertCanWrite,
    assertFeatureAccess,
  };

  const guard = new SubscriptionAccessGuard(
    reflector as never,
    subscriptionAccess as never,
  );
  return { guard, subscriptionAccess };
};

describe('SubscriptionAccessGuard', () => {
  it('ignores non-http contexts', async () => {
    const { guard, subscriptionAccess } = buildGuard();
    const context = {
      ...(buildContext() as Record<string, unknown>),
      getType: () => 'ws',
    } as never;

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(subscriptionAccess.assertCanWrite).not.toHaveBeenCalled();
  });

  it('allows skipped routes', async () => {
    const { guard, subscriptionAccess } = buildGuard({ skipped: true });

    await expect(guard.canActivate(buildContext())).resolves.toBe(true);
    expect(subscriptionAccess.assertCanWrite).not.toHaveBeenCalled();
  });

  it('allows public routes', async () => {
    const { guard, subscriptionAccess } = buildGuard({ publicRoute: true });

    await expect(guard.canActivate(buildContext())).resolves.toBe(true);
    expect(subscriptionAccess.assertCanWrite).not.toHaveBeenCalled();
  });

  it('allows tenant-agnostic routes', async () => {
    const { guard, subscriptionAccess } = buildGuard({
      tenantAgnostic: true,
    });

    await expect(guard.canActivate(buildContext())).resolves.toBe(true);
    expect(subscriptionAccess.assertCanWrite).not.toHaveBeenCalled();
  });

  it('allows reads without checking the subscription', async () => {
    const { guard, subscriptionAccess } = buildGuard();

    await expect(guard.canActivate(buildContext('GET'))).resolves.toBe(true);
    expect(subscriptionAccess.assertCanWrite).not.toHaveBeenCalled();
  });

  it('checks the subscription for unannotated writes', async () => {
    const { guard, subscriptionAccess } = buildGuard();

    await expect(guard.canActivate(buildContext())).resolves.toBe(true);
    expect(subscriptionAccess.assertCanWrite).toHaveBeenCalledTimes(1);
  });

  it('checks the required feature for annotated writes', async () => {
    const { guard, subscriptionAccess } = buildGuard({
      metadata: {
        feature: SubscriptionFeature.SaleInvoices,
        options: { allowTrial: true },
      },
    });

    await expect(guard.canActivate(buildContext())).resolves.toBe(true);
    expect(subscriptionAccess.assertFeatureAccess).toHaveBeenCalledWith(
      SubscriptionFeature.SaleInvoices,
      { allowTrial: true },
      true,
    );
    expect(subscriptionAccess.assertCanWrite).not.toHaveBeenCalled();
  });

  it('checks the required feature for annotated reads', async () => {
    const { guard, subscriptionAccess } = buildGuard({
      metadata: {
        feature: SubscriptionFeature.SaleInvoices,
        options: {},
      },
    });

    await expect(guard.canActivate(buildContext('GET'))).resolves.toBe(true);
    expect(subscriptionAccess.assertFeatureAccess).toHaveBeenCalledWith(
      SubscriptionFeature.SaleInvoices,
      {},
      false,
    );
  });

  it('skips reads when the feature is write-only', async () => {
    const { guard, subscriptionAccess } = buildGuard({
      metadata: {
        feature: SubscriptionFeature.SaleInvoices,
        options: { writeOnly: true },
      },
    });

    await expect(guard.canActivate(buildContext('GET'))).resolves.toBe(true);
    expect(subscriptionAccess.assertFeatureAccess).not.toHaveBeenCalled();
  });

  it('only enforces the listed methods', async () => {
    const { guard, subscriptionAccess } = buildGuard({
      metadata: {
        feature: SubscriptionFeature.SaleInvoices,
        options: { methods: ['DELETE'] },
      },
    });

    await expect(guard.canActivate(buildContext('POST'))).resolves.toBe(true);
    expect(subscriptionAccess.assertFeatureAccess).not.toHaveBeenCalled();
  });

  it('propagates subscription errors', async () => {
    const error = new Error('inactive');
    const { guard } = buildGuard({
      assertCanWrite: jest.fn().mockRejectedValue(error),
    });

    await expect(guard.canActivate(buildContext())).rejects.toBe(error);
  });

  it('propagates feature errors', async () => {
    const error = new Error('feature unavailable');
    const { guard } = buildGuard({
      metadata: {
        feature: SubscriptionFeature.SaleInvoices,
        options: {},
      },
      assertFeatureAccess: jest.fn().mockRejectedValue(error),
    });

    await expect(guard.canActivate(buildContext())).rejects.toBe(error);
  });
});
