exports.up = (knex) => {
  return knex.schema.createTable('items_warehouses_quantity', (table) => {
    table.integer('item_id').unsigned().references('id').inTable('items');
    table
      .integer('warehouse_id')
      .unsigned()
      .references('id')
      .inTable('warehouses');

    table.integer('quantity_on_hand');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('items_warehouses_quantity');
};
