
exports.up = function(knex) {
  return knex.schema.createTable('subscription_plan_subscriptions', table => {
    table.increments('id');
    table.string('slug');

    table.integer('plan_id').unsigned();
    table.integer('tenant_id').unsigned();

    table.dateTime('trial_started_at').nullable();
    table.dateTime('trial_ends_at').nullable();

    table.dateTime('starts_at').nullable();
    table.dateTime('ends_at').nullable();

    table.dateTime('cancels_at').nullable();
    table.dateTime('canceled_at').nullable();

    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('subscription_plan_subscriptions');
};
