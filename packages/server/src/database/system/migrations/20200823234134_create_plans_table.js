
exports.up = function(knex) {
  return knex.schema.createTable('subscription_plans', table => {
    table.increments();
    table.string('slug');
    table.string('name');
    table.string('desc');
    table.boolean('active');

    table.decimal('price').unsigned();
    table.string('currency', 3);

    table.decimal('trial_period').nullable();
    table.string('trial_interval').nullable();

    table.decimal('invoice_period').nullable();
    table.string('invoice_interval').nullable();

    table.integer('index').unsigned();
    table.timestamps();
  }).then(() => {
    return knex.seed.run({
      specific: 'seed_subscriptions_plans.js',
    });
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('subscription_plans')
};
