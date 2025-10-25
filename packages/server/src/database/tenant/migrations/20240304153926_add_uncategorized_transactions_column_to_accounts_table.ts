exports.up = function (knex) {
  return knex.schema.table('accounts', (table) => {
    table.integer('uncategorized_transactions').defaultTo(0);
    table.boolean('is_system_account').defaultTo(true);
    table.boolean('is_feeds_active').defaultTo(false);
    table.datetime('last_feeds_updated_at').nullable();
  });
};

exports.down = function (knex) {};
