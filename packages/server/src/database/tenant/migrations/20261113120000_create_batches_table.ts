/**
 * Creates the item batches table used by the batch tracking feature.
 *
 * A batch groups a quantity of a single item that shares the same
 * manufacturing/expiry information. The `quantity` column stores the quantity
 * entered when the batch was created and acts as the opening quantity when no
 * inventory transactions are linked to the batch yet.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('batches', (table) => {
    table.increments();

    table
      .integer('item_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('items')
      .onDelete('CASCADE');

    table.string('batch_number', 191).notNullable();
    table.string('batch_ref', 191).nullable();

    table.date('manufactured_date').nullable();
    table.date('expiry_date').nullable();

    table.decimal('quantity', 13, 3).notNullable().defaultTo(0);

    // The transaction that created the batch (Bill, or null when the batch
    // was created directly from the item details page).
    table.string('source_transaction_type', 50).nullable();
    table.integer('source_transaction_id').unsigned().nullable();

    table.timestamps();

    table.unique(['item_id', 'batch_number'], 'batches_item_number_unique');
    table.index(['item_id'], 'batches_item_id_index');
    table.index(['expiry_date'], 'batches_expiry_date_index');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('batches');
};
