
exports.up = function(knex) {
  return knex.schema.createTable('sales_invoices_entries', table => {
    table.increments();
    table.integer('sale_invoice_id').unsigned();
    table.integer('item_id').unsigned();
    table.integer('index').unsigned();
    table.text('description');
    table.integer('discount').unsigned();
    table.integer('quantity').unsigned();
    table.integer('rate').unsigned();
  });  
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('sales_invoices_entries');
};
