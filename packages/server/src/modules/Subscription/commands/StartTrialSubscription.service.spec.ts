import { StartTrialSubscriptionService } from './StartTrialSubscription.service';

interface ServiceOptions {
  hostedOnCloud?: boolean;
  trialDays?: number | undefined;
  existingSubscription?: Record<string, unknown> | null;
  goPlan?: Record<string, unknown> | null;
  freePlan?: Record<string, unknown> | null;
}

function createService({
  hostedOnCloud = true,
  trialDays = 15,
  existingSubscription = null,
  goPlan = { id: 10, slug: 'go-monthly' },
  freePlan = { id: 1, slug: 'free' },
}: ServiceOptions = {}) {
  const configService = {
    get: jest.fn((key: string) => {
      if (key === 'cloud.hostedOnCloud') return hostedOnCloud;
      if (key === 'cloud.freeTrialDays') return trialDays;
      return undefined;
    }),
  };
  const subscriptionRepository = {
    newSubscription: jest.fn().mockResolvedValue({}),
  };

  const planQuery = {
    findOne: jest
      .fn()
      .mockImplementation(({ slug }: { slug: string }) =>
        Promise.resolve(
          slug === 'go-monthly' ? goPlan : slug === 'free' ? freePlan : null,
        ),
      ),
  };
  const planModel = {
    query: jest.fn(() => planQuery),
  };

  const subscriptionQuery = {
    findOne: jest.fn().mockResolvedValue(existingSubscription),
  };
  const planSubscriptionModel = {
    query: jest.fn(() => subscriptionQuery),
  };

  const service = new StartTrialSubscriptionService(
    configService as never,
    subscriptionRepository as never,
    planModel as never,
    planSubscriptionModel as never,
  );

  return { service, subscriptionRepository, planModel };
}

describe('StartTrialSubscriptionService', () => {
  it('does nothing on self-hosted installations', async () => {
    const { service, subscriptionRepository } = createService({
      hostedOnCloud: false,
    });

    await service.execute(1);

    expect(subscriptionRepository.newSubscription).not.toHaveBeenCalled();
  });

  it('creates a Go trial for a new Cloud tenant', async () => {
    const { service, subscriptionRepository } = createService({
      trialDays: 15,
    });

    await service.execute(7);

    expect(subscriptionRepository.newSubscription).toHaveBeenCalledTimes(1);

    const [tenantId, planId, interval, period, slug, payload] =
      subscriptionRepository.newSubscription.mock.calls[0];

    expect(tenantId).toBe(7);
    expect(planId).toBe(10);
    expect(interval).toBe('month');
    expect(period).toBe(1);
    expect(slug).toBe('main');

    expect(payload.trialEndsAt.getTime()).toBe(payload.endsAt.getTime());

    const days = Math.round(
      (payload.trialEndsAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000),
    );
    expect(days).toBe(15);
  });

  it('is idempotent when the tenant already has a main subscription', async () => {
    const { service, subscriptionRepository } = createService({
      existingSubscription: { id: 1, slug: 'main' },
    });

    await service.execute(1);

    expect(subscriptionRepository.newSubscription).not.toHaveBeenCalled();
  });

  it('falls back to the free plan when Go is missing', async () => {
    const { service, subscriptionRepository } = createService({
      goPlan: null,
      freePlan: { id: 1, slug: 'free' },
    });

    await service.execute(2);

    expect(subscriptionRepository.newSubscription).toHaveBeenCalledWith(
      2,
      1,
      'month',
      1,
      'main',
      expect.objectContaining({ trialEndsAt: expect.any(Date) }),
    );
  });
});
