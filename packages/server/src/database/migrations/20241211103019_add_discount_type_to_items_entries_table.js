/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('items_entries', (table) => {
    table.string('discount_type').defaultTo('percentage').after('discount');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('items_entries', (table) => {
    table.dropColumn('discount_type');
  });
};
