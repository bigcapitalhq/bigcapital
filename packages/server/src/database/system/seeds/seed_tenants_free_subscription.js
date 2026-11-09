exports.seed = async (knex) => {
  // Cloud organizations subscribe through Stripe; never grant them the
  // self-hosted free plan.
  if (process.env.HOSTED_ON_BIGCAPITAL_CLOUD === 'true') return;

  const tenants = await knex('tenants');
  const freePlan = await knex('subscription_plans')
    .where('slug', 'free')
    .first();

  if (!freePlan) return;

  for (const tenant of tenants) {
    const existingSubscription = await knex('subscription_plan_subscriptions')
      .where('tenant_id', tenant.id)
      .first();

    if (!existingSubscription) {
      await knex('subscription_plan_subscriptions').insert({
        tenant_id: tenant.id,
        plan_id: freePlan.id,
        slug: 'main',
        starts_at: knex.fn.now(),
        ends_at: null,
        created_at: knex.fn.now(),
      });
    }
  }
};
