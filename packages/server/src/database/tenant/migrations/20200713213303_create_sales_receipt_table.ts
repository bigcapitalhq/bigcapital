
exports.up = function(knex) {
  return knex.schema.createTable('sales_receipts', table => {
    table.increments();
    table.decimal('amount', 13, 3);
    table.string('currency_code', 3);
    table.integer('deposit_account_id').unsigned().index().references('id').inTable('accounts');
    table.integer('customer_id').unsigned().index().references('id').inTable('contacts');
    table.date('receipt_date').index();
    table.string('receipt_number').index();
    table.string('reference_no').index();
    table.string('send_to_email');
    table.text('receipt_message');
    table.text('statement');
    table.date('closed_at').index();
    table.timestamps();
  })  
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('sales_receipts');
};
