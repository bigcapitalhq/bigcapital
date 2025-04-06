exports.up = function (knex) {
  return knex.schema.table('uncategorized_cashflow_transactions', (table) => {
    table
      .integer('recognized_transaction_id')
      .unsigned()
      .references('id')
      .inTable('recognized_bank_transactions')
      .withKeyName('uncategorizedCashflowTransRecognizedTranIdForeign');
  });
};

exports.down = function (knex) {
  return knex.schema.table('uncategorized_cashflow_transactions', (table) => {
    table.dropColumn('recognized_transaction_id');
  });
};
