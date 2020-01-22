
exports.up = function(knex) {
  return knex.schema.createTable('accounts_transactions', (table) => {
    table.increments();
    table.decimal('credit');
    table.decimal('debit');
    table.string('transaction_type');
    table.string('reference_type');
    table.integer('reference_id');
    table.integer('account_id').unsigned().references('id').inTable('accounts');
    table.string('note');
    table.integer('user_id').unsigned().references('id').inTable('users');
    table.date('date');
    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('accounts_transactions');
};
