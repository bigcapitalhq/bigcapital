
exports.up = function(knex) {
  return knex.schema.createTable('sales_estimates', (table) => {
    table.increments();
    table.decimal('amount', 13, 3);
    table.integer('customer_id').unsigned();
    table.date('estimate_date');
    table.date('expiration_date');
    table.string('reference');
    table.string('estimate_number');
    table.text('note');
    table.text('terms_conditions');

    table.integer('user_id').unsigned();
    table.timestamps();
  });  
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('sales_estimates');
};
