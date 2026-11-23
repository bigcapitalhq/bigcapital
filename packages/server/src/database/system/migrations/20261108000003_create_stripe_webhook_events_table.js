/**
 * Stores processed Stripe webhook events for idempotent handling.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('stripe_webhook_events', (table) => {
    table.increments('id');
    table.string('stripe_event_id').notNullable().unique();
    table.string('type').nullable();
    table.json('payload').nullable();
    table.string('error', 2000).nullable();
    table.dateTime('processed_at').nullable();
    table.timestamps();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('stripe_webhook_events');
};
