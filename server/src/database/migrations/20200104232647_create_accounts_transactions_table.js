exports.up = function (knex) {
  return knex.schema
    .createTable('accounts_transactions', (table) => {
      table.increments();
      table.decimal('credit', 13, 3);
      table.decimal('debit', 13, 3);
      table.string('transaction_type').index();
      table.string('reference_type').index();
      table.integer('reference_id').index();
      table
        .integer('account_id')
        .unsigned()
        .index()
        .references('id')
        .inTable('accounts');
      table.string('contact_type').nullable().index();
      table.integer('contact_id').unsigned().nullable().index();
      table.string('transaction_number').nullable().index();
      table.string('reference_number').nullable().index();
      table.integer('item_id').unsigned().nullable().index();
      table.integer('item_quantity').unsigned().nullable().index(),
        table.string('note');
      table.integer('user_id').unsigned().index();

      table.integer('index_group').unsigned().index();
      table.integer('index').unsigned().index();

      table.date('date').index();
      table.datetime('created_at').index();
    })
    .raw('ALTER TABLE `ACCOUNTS_TRANSACTIONS` AUTO_INCREMENT = 1000');
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('accounts_transactions');
};
