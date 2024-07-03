exports.up = function (knex) {
  return knex.schema.table('uncategorized_cashflow_transactions', (table) => {
    table.datetime('excluded_at');
  });
};

exports.down = function (knex) {
  return knex.schema.table('uncategorized_cashflow_transactions', (table) => {
    table.dropColumn('excluded_at');
  });
};
