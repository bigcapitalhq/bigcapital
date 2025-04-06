exports.up = function (knex) {
  return knex.schema.table('cashflow_transactions', (table) => {
    table
      .integer('uncategorized_transaction_id')
      .unsigned()
      .references('id')
      .inTable('uncategorized_cashflow_transactions');
  });
};

exports.down = function (knex) {
  return knex.schema.table('cashflow_transactions', (table) => {
    table.dropColumn('uncategorized_transaction_id');
  });
};
