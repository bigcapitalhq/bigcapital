exports.up = function (knex) {
  return knex.schema.table('plaid_items', (table) => {
    table.json('disconnected_plaid_account_ids').nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table('plaid_items', (table) => {
    table.dropColumn('disconnected_plaid_account_ids');
  });
};
