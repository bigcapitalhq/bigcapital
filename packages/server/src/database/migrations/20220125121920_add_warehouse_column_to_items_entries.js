exports.up = (knex) => {
  return knex.schema.table('items_entries', (table) => {
    table
      .integer('warehouse_id')
      .unsigned()
      .references('id')
      .inTable('warehouses');
  });
};

exports.down = (knex) => {
  return knex.schema.table('items_entries', (table) => {
    table.dropColumn('warehouse_id');
  });
};
