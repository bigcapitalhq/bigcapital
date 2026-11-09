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
  subscription = { active: () => true, stripeSubscriptionId: 'sub_123' },
}: {
  cloud?: boolean;
  subscription?: {
    active: () => boolean;
    stripeSubscriptionId?: string;
    lemonSubscriptionId?: string;
  } | null;
} = {}) => {
  const configService = {
    get: jest.fn((key: string) =>
      key === 'cloud.hostedOnCloud' ? cloud : undefined,
    ),
  };
  const reflector = {
    getAllAndOverride: jest.fn().mockReturnValue(false),
  };
  const tenancyContext = {
    getTenant: jest.fn().mockResolvedValue({ id: 1 }),
  };
  const planSubscriptionModel = {
    query: () => ({
      findOne: jest.fn().mockResolvedValue(subscription),
    }),
  };

  const interceptor = new SubscriptionAccessInterceptor(
    configService as never,
    reflector as never,
    tenancyContext as never,
    planSubscriptionModel as never,
  );
  return { interceptor, configService, planSubscriptionModel };
};

describe('SubscriptionAccessInterceptor', () => {
  it('allows writes on self-hosted installations', async () => {
    const { interceptor, planSubscriptionModel } = buildInterceptor({
      cloud: false,
    });
    const next = { handle: jest.fn().mockReturnValue(of(null)) };

    await expect(
      interceptor.intercept(buildContext(), next as never),
    ).resolves.toBeTruthy();
    expect(planSubscriptionModel.query).toBeDefined();
  });

  it('rejects writes when the Cloud subscription is inactive', async () => {
    const { interceptor } = buildInterceptor({
      subscription: { active: () => false },
    });
    const next = { handle: jest.fn().mockReturnValue(of(null)) };

    await expect(
      interceptor.intercept(buildContext(), next as never),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('allows writes when the Cloud subscription is active', async () => {
    const { interceptor } = buildInterceptor();
    const next = { handle: jest.fn().mockReturnValue(of(null)) };

    await expect(
      interceptor.intercept(buildContext(), next as never),
    ).resolves.toBeTruthy();
    expect(next.handle).toHaveBeenCalled();
  });

  it('ignores the billing routes', async () => {
    const { interceptor } = buildInterceptor({
      subscription: { active: () => false },
    });
    const next = { handle: jest.fn().mockReturnValue(of(null)) };

    await expect(
      interceptor.intercept(
        buildContext('POST', '/api/subscription/stripe/checkout_session'),
        next as never,
      ),
    ).resolves.toBeTruthy();
  });
});
