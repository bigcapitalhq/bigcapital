
exports.up = function(knex) {
  return knex.schema.createTable('expenses_transactions', (table) => {
    table.increments();
    table.decimal('total_amount');
    table.string('currency_code');
    table.text('description');
    table.integer('payment_account_id').unsigned();
    table.integer('payee_id').unsigned();
    table.string('reference_no');
    table.boolean('published').defaultTo(false);
    table.integer('user_id').unsigned();
    table.date('payment_date');
    table.timestamps();
  }).raw('ALTER TABLE `EXPENSES_TRANSACTIONS` AUTO_INCREMENT = 1000');
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('expenses');
};
