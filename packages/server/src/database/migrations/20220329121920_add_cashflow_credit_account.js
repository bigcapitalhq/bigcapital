exports.up = (knex) => {
  return knex.schema.table('cashflow_transactions', (table) => {
    table
      .integer('cashflow_account_id')
      .unsigned()
      .references('id')
      .inTable('accounts');
    table
      .integer('credit_account_id')
      .unsigned()
      .references('id')
      .inTable('accounts');
  });
};

exports.down = (knex) => {
  return knex.schema.table('cashflow_transactions', () => {});
};
