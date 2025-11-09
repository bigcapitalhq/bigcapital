exports.up = (knex) => {
  return knex.schema.table('sales_invoices', (table) => {
    table.decimal('writtenoff_amount', 13, 3);
    table.date('writtenoff_at').index();
  });
};

exports.down = (knex) => {
  return knex.schema.table('sales_invoices', (table) => {
    table.dropColumn('writtenoff_amount');
    table.dropColumn('writtenoff_at');
  });
};
