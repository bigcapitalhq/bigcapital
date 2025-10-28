exports.up = function (knex) {
  return knex.schema.createTable('inventory_adjustments_entries', (table) => {
    table.increments();
    table
      .integer('adjustment_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('inventory_adjustments');
    table.integer('index').unsigned();
    table
      .integer('item_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('items');
    table.integer('quantity');
    table.decimal('cost', 13, 3).unsigned();
    table.decimal('value', 13, 3).unsigned();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('inventory_adjustments_entries');
};
