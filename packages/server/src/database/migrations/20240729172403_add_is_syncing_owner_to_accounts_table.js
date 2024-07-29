exports.up = function (knex) {
  return knex.schema.table('accounts', (table) => {
    table.boolean('is_syncing_owner').defaultTo(false).after('is_feeds_active');
  });
};

exports.down = function (knex) {
  table.dropColumn('is_syncing_owner');
};
