exports.up = function (knex) {
  return knex.seed.run({
    specific: 'seed_tenants_free_subscription.js',
  });
};

exports.down = function (knex) {};
