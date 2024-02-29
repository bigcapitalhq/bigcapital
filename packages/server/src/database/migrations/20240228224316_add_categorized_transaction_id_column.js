exports.up = function (knex) {
  return knex.schema.table('expenses_transactions', (table) => {
    table
      .integer('categorized_transaction_id')
      .unsigned()
      .references('id')
      .inTable('uncategorized_cashflow_transactions');
  });
};

exports.down = function (knex) {};
