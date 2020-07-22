
exports.up = function(knex) {
  return knex.schema.createTable('sales_estimates', (table) => {
    table.increments();
    table.integer('customer_id').unsigned();
    table.date('estimate_date');
    table.date('expiration_date');
    table.string('reference');
    table.string('estimate_number');
    table.text('note');
    table.text('terms_conditions');
    table.timestamps();
  });  
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('sales_estimates');
};
