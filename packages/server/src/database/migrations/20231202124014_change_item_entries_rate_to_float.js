exports.up = (knex) =>
  knex.schema.alterTable('items_entries', (table) => {
    table.decimal('rate', 15, 5).alter();
  });

exports.down = (knex) => knex.table('items_entries', (table) => {});
