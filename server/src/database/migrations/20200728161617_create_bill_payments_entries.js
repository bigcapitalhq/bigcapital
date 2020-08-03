
exports.up = function(knex) {
  return knex.schema.createTable('bills_payments_entries', table => {
    table.increments();
    
    table.integer('bill_payment_id').unsigned();
    table.integer('bill_id').unsigned();
    table.decimal('payment_amount', 13, 3).unsigned();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('bills_payments_entries');
};
