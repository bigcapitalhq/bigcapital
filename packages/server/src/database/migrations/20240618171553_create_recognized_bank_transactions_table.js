exports.up = function (knex) {
  return knex.schema.createTable('recognized_bank_transactions', (table) => {
    table.increments('id');
    table.integer('cashflow_transaction_id').unsigned();
    table.inteegr('bank_rule_id').unsigned();

    table.string('assigned_category');
    table.integer('assigned_account_id').unsigned();
    table.string('assigned_payee');
    table.string('assigned_memo');

    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('recognized_bank_transactions');
};
