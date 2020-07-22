
exports.up = function(knex) {
  return knex.schema.createTable('bills_payments', table => {
    table.increments();
    table.integer('payment_account_id');
    table.string('payment_number');
    table.date('payment_date');
    table.string('payment_method');
    table.integer('user_id').unsigned();
    table.text('description');
    table.timestamps();
  }); 
};

exports.down = function(knex) {
  
};
