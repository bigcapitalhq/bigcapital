
exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('subscription_plans').del()
    .then(() => {
      // Inserts seed entries
      return knex('subscription_plans').insert([
        {
          id: 1,
          name: 'free',
          slug: 'free',
          price: 0,
          active: true,
          currency: 'LYD',

          trial_period: 15,
          trial_interval: 'days',

          invoice_period: 3,
          invoice_interval: 'month',

          index: 1,
        }
      ]);
    });
};
