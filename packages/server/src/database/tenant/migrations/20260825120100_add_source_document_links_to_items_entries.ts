/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('items_entries', (table) => {
    table.integer('source_invoice_id').unsigned().nullable();
    table.integer('source_invoice_entry_id').unsigned().nullable();
    table.integer('source_receipt_id').unsigned().nullable();
    table.integer('source_receipt_entry_id').unsigned().nullable();
    table.integer('source_bill_id').unsigned().nullable();
    table.integer('source_bill_entry_id').unsigned().nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('items_entries', (table) => {
    table.dropColumn('source_invoice_id');
    table.dropColumn('source_invoice_entry_id');
    table.dropColumn('source_receipt_id');
    table.dropColumn('source_receipt_entry_id');
    table.dropColumn('source_bill_id');
    table.dropColumn('source_bill_entry_id');
  });
};
