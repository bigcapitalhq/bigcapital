exports.up = (knex) =>
  knex.schema.table('cashflow_transactions', (table) => {
    table.string('plaid_transaction_id');
  });

exports.down = (knex) => {};
