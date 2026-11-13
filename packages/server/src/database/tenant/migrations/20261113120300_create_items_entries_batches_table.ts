/**
 * Creates the join table that stores the batch allocations of an item entry.
 *
 * An item entry can consume/receive stock from multiple batches, so the sum of
 * the allocation quantities must match the entry quantity.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('items_entries_batches', (table) => {
    table.increments();

    table
      .integer('entry_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('items_entries')
      .onDelete('CASCADE');

    table
      .integer('batch_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('batches')
      .onDelete('CASCADE');

    table.decimal('quantity', 13, 3).notNullable().defaultTo(0);

    table.timestamps();

    table.unique(
      ['entry_id', 'batch_id'],
      'items_entries_batches_entry_batch_unique',
    );
    table.index(['batch_id'], 'items_entries_batches_batch_id_index');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('items_entries_batches');
};
