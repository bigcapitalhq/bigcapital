exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('subscription_plans')
    .del()
    .then(() => {
      // Inserts seed entries
      return knex('subscription_plans').insert([
        {
          name: 'Free',
          slug: 'free',
          price: 0,
          active: true,
          currency: 'USD',
        },
        {
          name: 'Early Adaptor',
          slug: 'early-adaptor',
          price: 29,
          active: true,
          currency: 'USD',
          invoice_period: 12,
          invoice_interval: 'month',
        },
      ]);
    });
};
