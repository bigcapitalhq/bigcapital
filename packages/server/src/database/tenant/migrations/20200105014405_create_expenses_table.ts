exports.up = function (knex) {
  return knex.schema
    .createTable('expenses_transactions', (table) => {
      table.increments();
      table.string('currency_code', 3);
      table.text('description');
      table
        .integer('payment_account_id')
        .unsigned()
        .references('id')
        .inTable('accounts');
      table.integer('payee_id').unsigned().references('id').inTable('contacts');
      table.string('reference_no');

      table.decimal('total_amount', 13, 3);
      table.decimal('landed_cost_amount', 13, 3).defaultTo(0);
      table.decimal('allocated_cost_amount', 13, 3).defaultTo(0);

      table.date('published_at').index();
      table.integer('user_id').unsigned().index();
      table.date('payment_date').index();
      table.timestamps();
    })
    .raw('ALTER TABLE `EXPENSES_TRANSACTIONS` AUTO_INCREMENT = 1000');
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('expenses');
};
