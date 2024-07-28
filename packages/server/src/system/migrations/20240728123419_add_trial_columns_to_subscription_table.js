exports.up = function (knex) {
  return knex.schema.table('subscription_plan_subscriptions', (table) => {
    table.dateTime('trial_starts_at').nullable();
    table.dateTime('trial_ends_at').nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table('subscription_plan_subscriptions', (table) => {
    table.dropColumn('trial_starts_at').nullable();
    table.dropColumn('trial_ends_at').nullable();
  });
};
