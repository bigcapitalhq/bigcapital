
exports.up = function(knex) {
  return knex.schema.createTable('expenses', (table) => {
    table.increments();
    table.decimal('amount');
    table.string('currency_code');
    table.decimal('exchange_rate');
    table.text('description');
    table.integer('expense_account_id').unsigned().references('id').inTable('accounts');
    table.integer('payment_account_id').unsigned().references('id').inTable('accounts');
    table.string('reference');
    table.boolean('published').defaultTo(false);
    table.integer('user_id').unsigned().references('id').inTable('users');
    table.date('date');
    // table.timestamps();
  })  
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('expenses');
};
