exports.up = function (knex) {
  return knex.schema
    .table('accounts', (table) => {
      table
        .boolean('is_syncing_owner')
        .defaultTo(false)
        .after('is_feeds_active');
    })
    .then(() => {
      return knex('accounts')
        .whereNotNull('plaid_item_id')
        .orWhereNotNull('plaid_account_id')
        .update('is_syncing_owner', true);
    });
};

exports.down = function (knex) {
  table.dropColumn('is_syncing_owner');
};
