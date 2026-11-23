/**
 * Ensures the self-hosted free plan exists.
 *
 * This seed is intentionally idempotent: running `system:seed:latest` on an
 * existing installation must not delete the Cloud plan catalog or the
 * subscriptions that reference it.
 */
exports.seed = async (knex) => {
  const freePlan = await knex('subscription_plans')
    .where('slug', 'free')
    .first();

  if (freePlan) return;

  await knex('subscription_plans').insert({
    name: 'Free',
    slug: 'free',
    price: 0,
    active: true,
    currency: 'USD',
    index: 0,
  });
};
