exports.up = function (knex) {
  return knex.schema.createTable('sales_estimates', (table) => {
    table.increments();
    table.decimal('amount', 13, 3);
    table.string('currency_code', 3);
    table
      .integer('customer_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('contacts');
    table.date('estimate_date').index();
    table.date('expiration_date').index();
    table.string('reference');
    table.string('estimate_number').index();
    table.text('note');
    table.text('terms_conditions');
    table.text('send_to_email');

    table.date('delivered_at').index();
    table.date('approved_at').index();
    table.date('rejected_at').index();

    table.integer('user_id').unsigned().index();

    table.integer('converted_to_invoice_id').unsigned();
    table.date('converted_to_invoice_at');

    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('sales_estimates');
};
