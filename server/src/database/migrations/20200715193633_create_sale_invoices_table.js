
exports.up = function(knex) {
  return knex.schema.createTable('sales_invoices', table => {
    table.increments();
    table.integer('customer_id');
    table.date('invoice_date');
    table.date('due_date');
    table.string('invoice_no');
    table.string('reference_no');
    table.string('status');

    table.text('invoice_message');
    table.text('terms_conditions');

    table.decimal('balance', 13, 3);
    table.timestamps();
  });  
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('sales_invoices');
};
