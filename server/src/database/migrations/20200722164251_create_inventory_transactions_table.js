
exports.up = function(knex) {
  return knex.schema.createTable('inventory_transactions', table => {
    table.increments('id');
    table.date('date');
    table.string('direction');
    table.integer('item_id');
    table.integer('quantity');
    table.decimal('rate', 13, 3);
    table.integer('remaining');

    table.string('transaction_type');
    table.integer('transaction_id');

    table.integer('inventory_transaction_id');
    table.timestamps();
  });
};

exports.down = function(knex) {
  
};
