/**
 * Links line items and inventory movements to their batch.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .table('items_entries', (table) => {
      table
        .integer('batch_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('batches')
        .onDelete('SET NULL');
    })
    .table('inventory_transactions', (table) => {
      table
        .integer('batch_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('batches')
        .onDelete('SET NULL');

      table.index(['batch_id'], 'inventory_transactions_batch_id_index');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .table('items_entries', (table) => {
      table.dropForeign('batch_id');
      table.dropColumn('batch_id');
    })
    .table('inventory_transactions', (table) => {
      table.dropForeign('batch_id');
      table.dropIndex(['batch_id'], 'inventory_transactions_batch_id_index');
      table.dropColumn('batch_id');
    });
};
