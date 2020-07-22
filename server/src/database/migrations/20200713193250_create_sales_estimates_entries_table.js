
exports.up = function(knex) {
  return knex.schema.createTable('sales_estimate_entries', table => {
    table.increments();
    table.integer('estimate_id').unsigned();
    table.integer('item_id').unsigned();
    table.text('description');
    table.integer('discount').unsigned();
    table.integer('quantity').unsigned();
    table.integer('rate').unsigned();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('sales_estimate_entries');
};
