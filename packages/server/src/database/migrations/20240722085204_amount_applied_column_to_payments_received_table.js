exports.up = function (knex) {
  return knex.schema.table('payment_receives', (table) => {
    table.decimal('applied_amount', 13, 3).defaultTo(0);
    table
      .integer('unearned_revenue_account_id')
      .unsigned()
      .references('id')
      .inTable('accounts');
  });
};

exports.down = function (knex) {
  return knex.schema.table('payment_receives', (table) => {
    table.dropColumn('applied_amount');
    table.dropColumn('unearned_revenue_account_id');
  });
};
