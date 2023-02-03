exports.up = (knex) => {
  return knex.schema.createTable('vendor_credits', (table) => {
    table.increments();
    table.integer('vendor_id').unsigned().references('id').inTable('contacts');
    table.decimal('amount', 13, 3);
    table.string('currency_code', 3);
    table.date('vendor_credit_date');
    table.string('vendor_credit_number');
    table.string('reference_no');

    table.decimal('refunded_amount', 13, 3).defaultTo(0);
    table.decimal('invoiced_amount', 13, 3).defaultTo(0);

    table.text('note');
    table.date('opened_at').index();
    table.integer('user_id').unsigned().references('id').inTable('users');
    table.timestamps();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('vendor_credits');
};
