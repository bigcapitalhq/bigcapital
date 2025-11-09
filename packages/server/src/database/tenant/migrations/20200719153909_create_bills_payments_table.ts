
exports.up = function(knex) {
  return knex.schema.createTable('bills_payments', table => {
    table.increments();
    table.integer('vendor_id').unsigned().index().references('id').inTable('contacts');
    table.decimal('amount', 13, 3).defaultTo(0);
    table.string('currency_code');
    table.integer('payment_account_id').unsigned().references('id').inTable('accounts');
    table.string('payment_number').nullable().index();
    table.date('payment_date').index();
    table.string('payment_method');
    table.string('reference');
    table.integer('user_id').unsigned().index();
    table.text('statement');
    table.timestamps();
  }); 
};

exports.down = function(knex) {
  
};
