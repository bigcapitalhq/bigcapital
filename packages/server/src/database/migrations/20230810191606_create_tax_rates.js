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
      table.boolean('is_tax_exclusive');
      table.string('tax_code');
      table.decimal('tax_rate');
    })
    .table('sales_invoices', (table) => {
      table.boolean('is_tax_exclusive');
      table.decimal('tax_amount_withheld');
    })
    .createTable('tax_rate_transactions', (table) => {
      table.increments('id');

      table.string('tax_name');
      table.string('tax_code');

      table.string('reference_type');
      table.integer('reference_id');

      table.decimal('tax_amount');
      table.integer('tax_account_id').unsigned();
    });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('tax_rates');
};
