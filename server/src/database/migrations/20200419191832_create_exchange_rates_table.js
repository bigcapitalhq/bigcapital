
exports.up = function(knex) {
  return knex.schema.createTable('exchange_rates', table => {
    table.increments();
    table.string('currency_code', 4);
    table.decimal('exchange_rate');
    table.date('date');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('exchange_rates');
};
