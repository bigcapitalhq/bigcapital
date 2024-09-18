/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('transactions_payment_methods', (table) => {
    table.increments('id');
    table.integer('reference_id').unsigned();
    table.string('reference_type');
    table
      .integer('payment_integration_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('payment_integrations');
    table.boolean('enable').defaultTo(false);
    table.json('options').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('transactions_payment_methods');
};
