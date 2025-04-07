exports.up = function (knex) {
  return knex.schema.createTable('recognized_bank_transactions', (table) => {
    table.increments('id');
    table
      .integer('uncategorized_transaction_id')
      .unsigned()
      .references('id')
      .inTable('uncategorized_cashflow_transactions')
      .withKeyName('recognizedBankTransactionsUncategorizedTransIdForeign');
    table
      .integer('bank_rule_id')
      .unsigned()
      .references('id')
      .inTable('bank_rules');

    table.string('assigned_category');
    table
      .integer('assigned_account_id')
      .unsigned()
      .references('id')
      .inTable('accounts');
    table.string('assigned_payee');
    table.string('assigned_memo');

    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('recognized_bank_transactions');
};
