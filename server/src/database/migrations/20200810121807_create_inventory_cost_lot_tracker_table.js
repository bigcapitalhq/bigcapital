
exports.up = function(knex) {
  return knex.schema.createTable('inventory_cost_lot_tracker', table => {
    table.increments();
    table.date('date');

    table.string('direction');

    table.integer('item_id').unsigned();
    table.integer('quantity').unsigned();
    table.decimal('rate', 13, 3);
    table.integer('remaining');
    table.integer('lot_number');

    table.string('transaction_type');
    table.integer('transaction_id');
  });  
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('inventory_cost_lot_tracker');
};
