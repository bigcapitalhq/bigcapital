exports.up = (knex) => {
  return knex.schema.createTable('credit_notes', (table) => {
    table.increments();
    table
      .integer('customer_id')
      .unsigned()
      .references('id')
      .inTable('contacts');
    table.date('credit_note_date');
    table.string('credit_note_number');
    table.string('reference_no');
    table.decimal('amount', 13, 3);

    table.decimal('refunded_amount', 13, 3).defaultTo(0);
    table.decimal('invoices_amount', 13, 3).defaultTo(0);

    table.string('currency_code', 3);
    table.text('note');
    table.text('terms_conditions');
    table.date('opened_at').index();
    table.integer('user_id').unsigned().references('id').inTable('users');
    table.timestamps();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('credit_notescredit_notes');
};
