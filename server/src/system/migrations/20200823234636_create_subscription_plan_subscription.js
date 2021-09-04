
exports.up = function(knex) {
  return knex.schema.createTable('subscription_plan_subscriptions', table => {
    table.increments('id');
    table.string('slug');

    table.integer('plan_id').unsigned().index().references('id').inTable('subscription_plans');
    table.bigInteger('tenant_id').unsigned().index().references('id').inTable('tenants');

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
