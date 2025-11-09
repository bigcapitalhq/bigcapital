exports.up = (knex) => {
  return knex.schema
    .createTable('credit_note_applied_invoice', (table) => {
      table.increments();
      table.decimal('amount', 13, 3);
      table
        .integer('credit_note_id')
        .unsigned()
        .references('id')
        .inTable('credit_notes');
      table
        .integer('invoice_id')
        .unsigned()
        .references('id')
        .inTable('sales_invoices');
      table.timestamps();
    })
    .createTable('vendor_credit_applied_bill', (table) => {
      table.increments();
      table.decimal('amount', 13, 3);
      table
        .integer('vendor_credit_id')
        .unsigned()
        .references('id')
        .inTable('vendor_credits');
      table.integer('bill_id').unsigned().references('id').inTable('bills');
      table.timestamps();
    });
};

exports.down = (knex) => {
  return knex.schema
    .dropTableIfExists('vendor_credit_applied_bill')
    .dropTableIfExists('credit_note_applied_invoice');
};
