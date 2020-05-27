
exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('subscriptions_plans').del()
    .then(() => {
      // Inserts seed entries
      return knex('subscriptions_plans').insert([
        {
          id: 1,
          name: 'basic',
          price: 80,
          signup_fee: 0,
          currency: 'LYD',
          trial_period: 0,
          trial_interval: '',

          invoice_period: 1,
          invoice_interval: 'month',
        }
      ]);
    });
};
