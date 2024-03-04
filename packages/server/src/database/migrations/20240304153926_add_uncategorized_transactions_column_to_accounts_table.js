exports.up = function (knex) {
  return knex.schema.table('accounts', (table) => {
    table.integer('uncategorized_transactions').defaultTo(0);
  });
};

exports.down = function (knex) {};
