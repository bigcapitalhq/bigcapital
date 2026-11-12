const DEFAULT_TRIAL_DAYS = 15;
const TRIAL_PLAN_SLUG = 'go-monthly';
const FALLBACK_PLAN_SLUG = 'free';

/**
 * Reads the configured trial length, falling back to 15 days.
 */
const getTrialDays = () => {
  const days = parseInt(
    process.env.FREE_TRIAL_DAYS ?? `${DEFAULT_TRIAL_DAYS}`,
    10,
  );
  return Number.isFinite(days) && days > 0 ? days : DEFAULT_TRIAL_DAYS;
};

/**
 * Stripe Billing credentials mark a Cloud deployment.
 */
const isCloudBillingConfigured = () =>
  Boolean(
    process.env.STRIPE_BILLING_SECRET_KEY?.trim() &&
      process.env.STRIPE_BILLING_WEBHOOK_SECRET?.trim(),
  );

/**
 * Grants a fresh full-access trial to existing Cloud organizations that never
 * started a paid subscription.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  if (!isCloudBillingConfigured()) return;

  const trialPlan =
    (await knex('subscription_plans')
      .where('slug', TRIAL_PLAN_SLUG)
      .where('active', true)
      .first()) ||
    (await knex('subscription_plans')
      .where('slug', FALLBACK_PLAN_SLUG)
      .first());

  if (!trialPlan) return;

  const freePlan = await knex('subscription_plans')
    .where('slug', FALLBACK_PLAN_SLUG)
    .first();

  const startsAt = new Date();
  const trialEndsAt = new Date(
    startsAt.getTime() + getTrialDays() * 24 * 60 * 60 * 1000,
  );

  const tenants = await knex('tenants').select('id');

  for (const tenant of tenants) {
    const subscription = await knex('subscription_plan_subscriptions')
      .where('tenant_id', tenant.id)
      .where('slug', 'main')
      .first();

    if (!subscription) {
      await knex('subscription_plan_subscriptions').insert({
        tenant_id: tenant.id,
        plan_id: trialPlan.id,
        slug: 'main',
        starts_at: startsAt,
        ends_at: trialEndsAt,
        trial_ends_at: trialEndsAt,
        created_at: startsAt,
        updated_at: startsAt,
      });
      continue;
    }

    const isFreePlan =
      !!freePlan && Number(subscription.planId) === Number(freePlan.id);
    const hasBillingProvider = !!(
      subscription.stripeSubscriptionId || subscription.lemonSubscriptionId
    );

    // Convert legacy Cloud free-plan subscriptions (without a billing
    // provider and without a previous trial) into a fresh trial.
    if (isFreePlan && !hasBillingProvider && !subscription.trialEndsAt) {
      await knex('subscription_plan_subscriptions')
        .where('id', subscription.id)
        .update({
          plan_id: trialPlan.id,
          starts_at: startsAt,
          ends_at: trialEndsAt,
          trial_ends_at: trialEndsAt,
          canceled_at: null,
          updated_at: startsAt,
        });
    }
  }
};

/**
 * The backfill is intentionally irreversible: removing trial access from
 * existing organizations would be destructive.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function () {};
