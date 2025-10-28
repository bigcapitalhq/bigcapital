exports.up = (knex) => {
  return knex.schema.table('sales_invoices', (table) => {
    table
      .integer('writtenoff_expense_account_id')
      .unsigned()
      .references('id')
      .inTable('accounts');
  });
};

exports.down = (knex) => {
  return knex.schema.table('sales_invoices', (table) => {
    table.dropColumn('writtenoff_expense_account_id');
  });
};
