exports.up = function (knex) {
  return knex.schema.table('bills_payments', (table) => {
    table.decimal('applied_amount', 13, 3).defaultTo(0);
    table
      .integer('prepard_expenses_account_id')
      .unsigned()
      .references('id')
      .inTable('accounts');
  });
};

exports.down = function (knex) {
  return knex.schema.table('bills_payments', (table) => {
    table.dropColumn('applied_amount');
    table.dropColumn('prepard_expenses_account_id');
  });
};
