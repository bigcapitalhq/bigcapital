/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('payment_integrations', (table) => {
    table.increments('id');
    table.string('service');
    table.string('name'); 
    table.string('slug');
    table.boolean('payment_enabled').defaultTo(false);
    table.boolean('payout_enabled').defaultTo(false);
    table.string('account_id');
    table.json('options');
    table.timestamps();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('payment_integrations');
};
