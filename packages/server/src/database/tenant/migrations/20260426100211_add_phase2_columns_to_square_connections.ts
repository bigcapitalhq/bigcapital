/**
 * Phase-2 columns on square_connections.
 *
 * - default_sales_account_id: revenue account picked in the wizard.
 *   Used as the sell account on the auto-created "Square Sales" item,
 *   which is the fallback for unmapped Square line items.
 * - square_sales_item_id: the Bigcapital item id for that auto-created
 *   "Square Sales" item. Persisted on the connection so activation is
 *   idempotent and the payment handler does not have to look up by name.
 *
 * No "Square Tips" item is needed: Bigcapital validates that a sell
 * account is income-class, so tip dollars cannot route through an item
 * to a liability account. Tips are handled by a separate ManualJournal
 * post in HandleSquarePayment instead.
 */
exports.up = function (knex) {
  return knex.schema.alterTable('square_connections', (table) => {
    table.integer('default_sales_account_id').unsigned().nullable();
    table.integer('square_sales_item_id').unsigned().nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('square_connections', (table) => {
    table.dropColumn('default_sales_account_id');
    table.dropColumn('square_sales_item_id');
  });
};
