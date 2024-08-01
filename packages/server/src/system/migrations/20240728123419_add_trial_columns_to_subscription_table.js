exports.up = function (knex) {
  return knex.schema.table('subscription_plan_subscriptions', (table) => {
    table.dateTime('trial_ends_at').nullable();
    table.dropColumn('cancels_at');
  });
};

exports.down = function (knex) {
  return knex.schema.table('subscription_plan_subscriptions', (table) => {
    table.dropColumn('trial_ends_at').nullable();
    table.dateTime('cancels_at').nullable();
  });
};
