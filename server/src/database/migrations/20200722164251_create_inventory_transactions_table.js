
exports.up = function(knex) {
  return knex.schema.createTable('inventory_transactions', table => {
    table.increments('id');
    table.date('date');

    table.string('direction');

    table.integer('item_id').unsigned();
    table.integer('quantity').unsigned();
    table.decimal('rate', 13, 3).unsigned();

    table.integer('lot_number');
 
    table.string('transaction_type');
    table.integer('transaction_id');

    table.timestamps();
  });
};

exports.down = function(knex) {
  
};
