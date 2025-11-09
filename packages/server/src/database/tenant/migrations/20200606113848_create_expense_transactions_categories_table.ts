exports.up = function (knex) {
  return knex.schema
    .createTable('expense_transaction_categories', (table) => {
      table.increments();
      table
        .integer('expense_account_id')
        .unsigned()
        .index()
        .references('id')
        .inTable('accounts');
      table.integer('index').unsigned();
      table.text('description');
      table.decimal('amount', 13, 3);
      table.decimal('allocated_cost_amount', 13, 3).defaultTo(0);
      table.boolean('landed_cost').defaultTo(false);
      table
        .integer('expense_id')
        .unsigned()
        .index()
        .references('id')
        .inTable('expenses_transactions');
      table.timestamps();
    })
    .raw('ALTER TABLE `EXPENSE_TRANSACTION_CATEGORIES` AUTO_INCREMENT = 1000');
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('expense_transaction_categories');
};
