
exports.up = function(knex) {
  return knex.schema.createTable('expense_transaction_categories', table => {
    table.increments();
    table.integer('expense_account_id').unsigned();
    table.integer('index').unsigned();
    table.text('description');
    table.decimal('amount');
    table.integer('expense_id').unsigned();
    table.timestamps();
  }).raw('ALTER TABLE `EXPENSE_TRANSACTION_CATEGORIES` AUTO_INCREMENT = 1000');;
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('expense_transaction_categories');
};
