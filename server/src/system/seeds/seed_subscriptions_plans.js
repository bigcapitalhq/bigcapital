
exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('subscription_plans').del()
    .then(() => {
      // Inserts seed entries
      return knex('subscription_plans').insert([
        {
          name: 'Free',
          slug: 'free',
          price: 0,
          active: true,
          currency: 'LYD',

          trial_period: 7,
          trial_interval: 'days',

          index: 1,
          voucher_required: true,
        },
        {
          name: 'Starter',
          slug: 'starter',
          price: 500,
          active: true,
          currency: 'LYD',

          invoice_period: 12,
          invoice_interval: 'month',

          index: 2,
        },
        {
          name: 'Growth',
          slug: 'growth',
          price: 1000,
          active: true,
          currency: 'LYD',
        
          invoice_period: 12,
          invoice_interval: 'month',

          index: 3,
        },
      ]);
    });
};
