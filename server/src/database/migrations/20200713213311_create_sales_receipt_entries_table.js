
exports.up = function(knex) {
  return knex.schema.createTable('sales_receipt_entries', table => {
    table.increments();
    table.integer('sale_receipt_id').unsigned();
    table.integer('index').unsigned();
    table.integer('item_id');
    table.text('description');
    table.integer('discount').unsigned();
    table.integer('quantity').unsigned();
    table.integer('rate').unsigned();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('sales_receipt_entries') ;
};
