
exports.up = function(knex) {
  return knex.schema.createTable('payment_receives_entries', table => {
    table.increments();
    table.integer('payment_receive_id').unsigned().index().references('id').inTable('payment_receives');
    table.integer('invoice_id').unsigned().index().references('id').inTable('sales_invoices');
    table.decimal('payment_amount').unsigned();
  })  
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('payment_receives_entries');
};
