
exports.up = function(knex) {
  return knex.schema.createTable('sales_receipts', table => {
    table.increments();
    table.decimal('amount', 13, 3);
    table.integer('deposit_account_id').unsigned().index().references('id').inTable('accounts');
    table.integer('customer_id').unsigned().index().references('id').inTable('contacts');
    table.date('receipt_date').index();
    table.string('reference_no');
    table.string('email_send_to');
    table.text('receipt_message');
    table.text('statement');
    table.timestamps();
  })  
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('sales_receipts');
};
