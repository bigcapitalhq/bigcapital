/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table('subscription_plan_subscriptions', (table) => {
    table.string('payment_status');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table('subscription_plan_subscriptions', (table) => {
    table.dropColumn('payment_status');
  });
};
