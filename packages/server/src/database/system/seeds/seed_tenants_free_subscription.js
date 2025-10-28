exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('subscription_plan_subscriptions')
    .then(async () => {
      const tenants = await knex('tenants');

      for (const tenant of tenants) {
        const existingSubscription = await knex('subscription_plan_subscriptions')
          .where('tenantId', tenant.id)
          .first();

        if (!existingSubscription) {
          const freePlan = await knex('subscription_plans').where('slug', 'free').first();

          await knex('subscription_plan_subscriptions').insert({
            tenantId: tenant.id,
            planId: freePlan.id,
            slug: 'main',
            startsAt: knex.fn.now(),
            endsAt: null,
            createdAt: knex.fn.now(),
          });
        }
      }
    });
};
