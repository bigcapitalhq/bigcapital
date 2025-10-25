exports.up = function (knex) {
  return knex.schema.alterTable('items_entries', (table) => {
    table.decimal('rate', 15, 5).alter();
  });
};

exports.down = function (knex) {
  return knex.table('items_entries', (table) => {});
};
