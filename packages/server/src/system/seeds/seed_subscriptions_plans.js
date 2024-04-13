
exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('subscription_plans').del()
    .then(() => {
      // Inserts seed entries
      return knex('subscription_plans').insert([
        {
          name: 'Essentials',
          slug: 'essentials-monthly',
          price: 100,
          active: true,
          currency: 'LYD',
          trial_period: 7,
          trial_interval: 'days',
        },
        {
          name: 'Essentials',
          slug: 'essentials-yearly',
          price: 1200,
          active: true,
          currency: 'LYD',
          trial_period: 12,
          trial_interval: 'months',
        },
        {
          name: 'Pro',
          slug: 'pro-monthly',
          price: 200,
          active: true,
          currency: 'LYD',
          trial_period: 1,
          trial_interval: 'months',
        },
        {
          name: 'Pro',
          slug: 'pro-yearly',
          price: 500,
          active: true,
          currency: 'LYD',
          invoice_period: 12,
          invoice_interval: 'month',
          index: 2,
        },
        {
          name: 'Plus',
          slug: 'plus-monthly',
          price: 200,
          active: true,
          currency: 'LYD',
          trial_period: 1,
          trial_interval: 'months',
        },
        {
          name: 'Plus',
          slug: 'plus-yearly',
          price: 500,
          active: true,
          currency: 'LYD',
          invoice_period: 12,
          invoice_interval: 'month',
          index: 2,
        },
      ]);
    });
};
