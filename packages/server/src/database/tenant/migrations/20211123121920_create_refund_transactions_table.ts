exports.up = (knex) => {
  return knex.schema
    .createTable('refund_credit_note_transactions', (table) => {
      table.increments();
      table.date('date');
      table
        .integer('credit_note_id')
        .unsigned()
        .references('id')
        .inTable('credit_notes');
      table.decimal('amount', 13, 3);
      table.string('currency_code', 3);
      table.string('reference_no');
      table
        .integer('from_account_id')
        .unsigned()
        .references('id')
        .inTable('accounts');
      table.text('description');
      table.timestamps();
    })
    .createTable('refund_vendor_credit_transactions', (table) => {
      table.increments();
      table.date('date');
      table
        .integer('vendor_credit_id')
        .unsigned()
        .references('id')
        .inTable('vendor_credits');
      table.decimal('amount', 13, 3);
      table.string('currency_code', 3);
      table.string('reference_no');
      table
        .integer('deposit_account_id')
        .unsigned()
        .references('id')
        .inTable('accounts');
      table.text('description');
      table.timestamps();
    });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('refund_transactions');
};
