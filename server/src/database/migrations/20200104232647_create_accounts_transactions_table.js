
exports.up = function(knex) {
  return knex.schema.createTable('accounts_transactions', (table) => {
    table.increments();
    table.decimal('credit', 13, 3);
    table.decimal('debit', 13, 3);
    table.string('transaction_type');
    table.string('reference_type');
    table.integer('reference_id');
    table.integer('account_id').unsigned();
    table.string('contact_type').nullable();
    table.integer('contact_id').unsigned().nullable();
    table.string('note');
    table.boolean('draft').defaultTo(false);
    table.integer('user_id').unsigned();
    table.date('date');
    table.timestamps();
  }).raw('ALTER TABLE `ACCOUNTS_TRANSACTIONS` AUTO_INCREMENT = 1000');
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('accounts_transactions');
};
