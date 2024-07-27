exports.up = function (knex) {
  return knex.schema.table('subscription_plan_subscriptions', (table) => {
    table.string('lemon_subscription_id').nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table('subscription_plan_subscriptions', (table) => {
    table.dropColumn('lemon_subscription_id');
  });
};
