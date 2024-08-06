exports.up = function(knex) {
  return knex.schema.alterTable('items_entries', (table) => {
    table.decimal('quantity', 17, 7).alter();
  });
};

exports.down = function(knex) {
  return knex.table('items_entries', (table) => { });
};
