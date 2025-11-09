exports.up = (knex) => {
  return knex.schema.createTable('cashflow_transaction_lines', (table) => {
    table.increments();
    table.integer('cashflow_transaction_id').unsigned();
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
    table.decimal('amount', 13, 3);
    table.integer('index').unsigned();
    table.timestamps();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('cashflow_transaction_lines');
};
