exports.up = function (knex) {
  return knex.schema.table('accounts', (table) => {
    table.string('plaid_item_id').nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table('accounts', (table) => {
    table.dropColumn('plaid_item_id');
  });
};
