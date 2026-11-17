/**
 * Allows transaction line items to be created without a selected item.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table('items_entries', (table) => {
    table.integer('item_id').unsigned().nullable().alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table('items_entries', (table) => {
    table.integer('item_id').unsigned().notNullable().alter();
  });
};
