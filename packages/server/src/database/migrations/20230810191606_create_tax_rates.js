exports.up = (knex) => {
  return knex.schema
    .createTable('tax_rates', (table) => {
      table.increments();
      table.string('name');
      table.string('code');
      table.decimal('rate');
      table.boolean('is_non_recoverable');
      table.boolean('is_compound');
      table.integer('status');
      table.timestamps();
    })
    .table('items_entries', (table) => {
      table.boolean(['is_tax_exclusive']);
      table.string('tax_code');
      table.decimal('tax_rate');
      table.decimal('tax_amount_withheld')
    })
    .table('sales_invoices', (table) => {
      table.boolean(['is_tax_exclusive']);
      table.decimal('tax_amount_withheld')
    });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('tax_rates');
};
