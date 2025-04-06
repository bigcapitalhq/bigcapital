exports.up = function (knex) {
  return knex.schema.table('uncategorized_cashflow_transactions', (table) => {
    table.boolean('pending').defaultTo(false);
    table.string('pending_plaid_transaction_id').nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table('uncategorized_cashflow_transactions', (table) => {
    table.dropColumn('pending');
    table.dropColumn('pending_plaid_transaction_id');
  });
};
