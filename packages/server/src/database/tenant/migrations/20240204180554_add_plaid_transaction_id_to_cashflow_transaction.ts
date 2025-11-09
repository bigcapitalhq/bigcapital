exports.up = function (knex) {
  return knex.schema.table('cashflow_transactions', (table) => {
    table.string('plaid_transaction_id');
  });
};

exports.down = function (knex) {};
