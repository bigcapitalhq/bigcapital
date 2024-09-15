/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('transactions_payment_methods', (table) => {
    table.increments('id');
    table.integer('reference_id').unsigned();
    table.string('reference_type');
    table.integer('integration_id');
    table.json('options');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('transactions_payment_methods');
};
