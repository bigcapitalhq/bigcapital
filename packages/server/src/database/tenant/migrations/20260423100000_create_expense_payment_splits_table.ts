exports.up = function (knex) {
  return knex.schema
    .createTable('expense_payment_splits', (table) => {
      table.increments();
      table
        .integer('expense_id')
        .unsigned()
        .index()
        .references('id')
        .inTable('expenses_transactions');
      table
        .integer('payment_account_id')
        .unsigned()
        .index()
        .references('id')
        .inTable('accounts');
      table.integer('index').unsigned();
      table.decimal('amount', 13, 3);
      table.timestamps();
    })
    .raw('ALTER TABLE `EXPENSE_PAYMENT_SPLITS` AUTO_INCREMENT = 1000');
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('expense_payment_splits');
};
