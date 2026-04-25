/**
 * App-level Square webhook subscription. One row per environment
 * (sandbox, production). Square's Subscriptions API authenticates with
 * the application's PAT, so subscriptions are app-scoped and shared
 * across all sellers connected to that app — we keep the bookkeeping
 * here in the system DB.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('square_application_webhooks', (table) => {
    table.increments('id');
    table.string('environment', 16).notNullable().unique();
    table.string('square_subscription_id', 128).nullable();
    // AES-256-GCM envelope, same TokenEncryption service as connection tokens.
    table.text('signature_key_encrypted').nullable();
    table.text('notification_url').nullable();
    table.json('event_types').nullable();
    table.dateTime('registered_at').nullable();
    table.text('last_error').nullable();
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('square_application_webhooks');
};
