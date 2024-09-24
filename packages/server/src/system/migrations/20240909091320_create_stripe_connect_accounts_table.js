/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('stripe_accounts', (table) => {
    table.increments('id').primary();
    table.string('stripe_account_id').notNullable();
    table.string('tenant_id').notNullable();
    table.timestamps(true, true); // Adds created_at and updated_at columns
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('stripe_accounts');
};
