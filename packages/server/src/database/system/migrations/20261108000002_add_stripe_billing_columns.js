/**
 * Adds the Stripe Billing columns used by Bigcapital Cloud subscriptions.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .table('tenants', (table) => {
      table.string('stripe_customer_id').nullable().index();
    })
    .table('subscription_plans', (table) => {
      table.string('family_slug').nullable().index();
      table.json('features').nullable();
      table.boolean('is_featured').notNullable().defaultTo(false);
      table.string('stripe_product_id').nullable().index();
      table.string('stripe_price_id').nullable().index();
    })
    .table('subscription_plan_subscriptions', (table) => {
      table.string('stripe_subscription_id').nullable().index();
      table.string('stripe_status').nullable();
      table.boolean('cancel_at_period_end').notNullable().defaultTo(false);
      table.string('stripe_price_id').nullable().index();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .table('subscription_plan_subscriptions', (table) => {
      table.dropColumn('stripe_subscription_id');
      table.dropColumn('stripe_status');
      table.dropColumn('cancel_at_period_end');
      table.dropColumn('stripe_price_id');
    })
    .table('subscription_plans', (table) => {
      table.dropColumn('family_slug');
      table.dropColumn('features');
      table.dropColumn('is_featured');
      table.dropColumn('stripe_product_id');
      table.dropColumn('stripe_price_id');
    })
    .table('tenants', (table) => {
      table.dropColumn('stripe_customer_id');
    });
};
