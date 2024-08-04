exports.up = function (knex) {
  return knex.schema.table('plaid_items', (table) => {
    table.datetime('paused_at');
  });
};

exports.down = function (knex) {
  return knex.schema.table('plaid_items', (table) => {
    table.dropColumn('paused_at');
  });
};
