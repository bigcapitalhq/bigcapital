
exports.up = function(knex) {
  return knex.schema.createTable('inventory_adjustments_entries', table => {
    table.increments();
    table.integer('adjustment_id').unsigned().index().references('id').inTable('inventory_adjustments');
    table.integer('index').unsigned();
    table.integer('item_id').unsigned().index().references('id').inTable('items');
    table.decimal('new_quantity').unsigned();
    table.decimal('new_cost').unsigned();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('inventory_adjustments_entries');
};
