exports.up = function (knex) {
  return knex.schema.createTable('sales_invoices', (table) => {
    table.increments();
    table
      .integer('customer_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('contacts');

    table.date('invoice_date').index();
    table.date('due_date');
    table.string('invoice_no').index();
    table.string('reference_no');

    table.text('invoice_message');
    table.text('terms_conditions');

    table.decimal('balance', 13, 3);
    table.decimal('payment_amount', 13, 3);
    table.string('currency_code', 3);
    table.decimal('credited_amount', 13, 3).defaultTo(0);

    table.string('inv_lot_number').index();

    table.date('delivered_at').index();
    table.integer('user_id').unsigned();
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('sales_invoices');
};
