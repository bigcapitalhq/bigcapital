import { BadRequestException } from '@nestjs/common';
import { of } from 'rxjs';
import { SubscriptionAccessInterceptor } from './SubscriptionAccess.interceptor';

const buildContext = (method = 'POST', path = '/api/items') =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({ method, path }),
    }),
    getHandler: () => undefined,
    getClass: () => undefined,
  }) as never;

const buildInterceptor = ({
  cloud = true,
  publicRoute = false,
  tenantAgnostic = false,
  assertCanWrite = jest.fn().mockResolvedValue(undefined),
}: {
  cloud?: boolean;
  publicRoute?: boolean;
  tenantAgnostic?: boolean;
  assertCanWrite?: jest.Mock;
} = {}) => {
  const configService = {
    get: jest.fn((key: string) =>
      key === 'cloud.hostedOnCloud' ? cloud : undefined,
    ),
  };
  const reflector = {
    getAllAndOverride: jest.fn().mockImplementation((key: string) => {
      if (key === 'isPublic') return publicRoute;
      if (key === 'IS_TENANT_AGNOSTIC') return tenantAgnostic;
      return false;
    }),
  };
  const subscriptionAccess = { assertCanWrite };

  const interceptor = new SubscriptionAccessInterceptor(
    configService as never,
    reflector as never,
    subscriptionAccess as never,
  );
  return { interceptor, subscriptionAccess };
};

describe('SubscriptionAccessInterceptor', () => {
  it('allows writes on self-hosted installations', async () => {
    const { interceptor, subscriptionAccess } = buildInterceptor({
      cloud: false,
    });
    const next = { handle: jest.fn().mockReturnValue(of(null)) };

    await expect(
      interceptor.intercept(buildContext(), next as never),
    ).resolves.toBeTruthy();
    expect(subscriptionAccess.assertCanWrite).not.toHaveBeenCalled();
  });

  it('allows reads without checking the subscription', async () => {
    const { interceptor, subscriptionAccess } = buildInterceptor();
    const next = { handle: jest.fn().mockReturnValue(of(null)) };

    await expect(
      interceptor.intercept(buildContext('GET', '/api/items'), next as never),
    ).resolves.toBeTruthy();
    expect(subscriptionAccess.assertCanWrite).not.toHaveBeenCalled();
  });

  it('ignores billing routes', async () => {
    const { interceptor, subscriptionAccess } = buildInterceptor();
    const next = { handle: jest.fn().mockReturnValue(of(null)) };

    await expect(
      interceptor.intercept(
        buildContext('POST', '/api/subscription/stripe/checkout_session'),
        next as never,
      ),
    ).resolves.toBeTruthy();
    expect(subscriptionAccess.assertCanWrite).not.toHaveBeenCalled();
  });

  it('ignores public routes', async () => {
    const { interceptor, subscriptionAccess } = buildInterceptor({
      publicRoute: true,
    });
    const next = { handle: jest.fn().mockReturnValue(of(null)) };

    await expect(
      interceptor.intercept(buildContext(), next as never),
    ).resolves.toBeTruthy();
    expect(subscriptionAccess.assertCanWrite).not.toHaveBeenCalled();
  });

  it('checks the subscription for Cloud writes', async () => {
    const { interceptor, subscriptionAccess } = buildInterceptor();
    const next = { handle: jest.fn().mockReturnValue(of(null)) };

    await expect(
      interceptor.intercept(buildContext(), next as never),
    ).resolves.toBeTruthy();
    expect(subscriptionAccess.assertCanWrite).toHaveBeenCalledTimes(1);
    expect(next.handle).toHaveBeenCalled();
  });

  it('propagates the read-only error', async () => {
    const error = new BadRequestException('read only');
    const { interceptor } = buildInterceptor({
      assertCanWrite: jest.fn().mockRejectedValue(error),
    });
    const next = { handle: jest.fn().mockReturnValue(of(null)) };

    await expect(
      interceptor.intercept(buildContext(), next as never),
    ).rejects.toBe(error);
    expect(next.handle).not.toHaveBeenCalled();
  });
});
