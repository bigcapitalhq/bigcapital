import * as moment from 'moment';
import { PlanSubscription } from './PlanSubscription';

const buildSubscription = (
  overrides: Record<string, unknown> = {},
): PlanSubscription =>
  PlanSubscription.fromJson({
    id: 1,
    slug: 'main',
    tenantId: 1,
    planId: 1,
    startsAt: moment().subtract(1, 'day').toDate(),
    endsAt: null,
    trialEndsAt: null,
    canceledAt: null,
    stripeStatus: null,
    stripeSubscriptionId: null,
    lemonSubscriptionId: null,
    ...overrides,
  }) as PlanSubscription;

describe('PlanSubscription trial semantics', () => {
  it('is active while a provider-less trial is running', () => {
    const subscription = buildSubscription({
      trialEndsAt: moment().add(2, 'days').toDate(),
      endsAt: moment().add(2, 'days').toDate(),
    });

    expect(subscription.onTrial()).toBe(true);
    expect(subscription.trialExpired()).toBe(false);
    expect(subscription.active()).toBe(true);
    expect(subscription.status()).toBe('on_trial');
  });

  it('is inactive after a provider-less trial ends, even with a future period end', () => {
    const subscription = buildSubscription({
      trialEndsAt: moment().subtract(1, 'day').toDate(),
      endsAt: moment().add(20, 'days').toDate(),
    });

    expect(subscription.onTrial()).toBe(false);
    expect(subscription.trialExpired()).toBe(true);
    expect(subscription.active()).toBe(false);
    expect(subscription.status()).toBe('inactive');
  });

  it('keeps self-hosted subscriptions active without a trial', () => {
    const subscription = buildSubscription();

    expect(subscription.trialExpired()).toBe(false);
    expect(subscription.active()).toBe(true);
    expect(subscription.status()).toBe('active');
  });

  it('treats a provider-backed subscription as active regardless of trial dates', () => {
    const subscription = buildSubscription({
      stripeStatus: 'active',
      stripeSubscriptionId: 'sub_123',
      trialEndsAt: moment().subtract(1, 'day').toDate(),
    });

    expect(subscription.trialExpired()).toBe(false);
    expect(subscription.active()).toBe(true);
    expect(subscription.status()).toBe('active');
  });
});
