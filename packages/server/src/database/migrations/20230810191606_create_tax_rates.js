exports.up = (knex) => {
  return knex.schema
    .createTable('tax_rates', (table) => {
      table.increments();
      table.string('name');
      table.string('code');
      table.decimal('rate');
      table.string('description');
      table.boolean('is_non_recoverable').defaultTo(false);
      table.boolean('is_compound').defaultTo(false);
      table.boolean('active').defaultTo(false);
      table.date('deleted_at');
      table.timestamps();
    })
    .table('items_entries', (table) => {
      table.boolean('is_inclusive_tax').defaultTo(false);
      table
        .integer('tax_rate_id')
        .unsigned()
        .references('id')
        .inTable('tax_rates');
      table.decimal('tax_rate').unsigned();
    })
    .table('sales_invoices', (table) => {
      table.boolean('is_inclusive_tax').defaultTo(false);
      table.decimal('tax_amount_withheld');
    })
    .createTable('tax_rate_transactions', (table) => {
      table.increments('id');
      table
        .integer('tax_rate_id')
        .unsigned()
        .references('id')
        .inTable('tax_rates');
      table.string('reference_type');
      table.integer('reference_id');
      table.decimal('rate').unsigned();
      table.integer('tax_account_id').unsigned();
    })
    .table('accounts_transactions', (table) => {
      table
        .integer('tax_rate_id')
        .unsigned()
        .references('id')
        .inTable('tax_rates');
      table.decimal('tax_rate').unsigned();
    });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('tax_rates');
};
