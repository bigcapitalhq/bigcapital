
exports.up = function(knex) {
  return knex.schema.createTable('payment_receives_entries', table => {
    table.increments();
    table.integer('payment_receive_id').unsigned();
    table.integer('invoice_id').unsigned();
    table.decimal('payment_amount').unsigned();
  })  
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('payment_receives_entries');
};
