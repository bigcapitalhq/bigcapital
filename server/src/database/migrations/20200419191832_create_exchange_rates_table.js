
exports.up = function(knex) {
  return knex.schema.createTable('exchange_rates', table => {
    table.increments();
    table.string('currency_code', 4).index();
    table.decimal('exchange_rate');
    table.date('date').index();
    table.timestamps();
  }).raw('ALTER TABLE `EXCHANGE_RATES` AUTO_INCREMENT = 1000');
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('exchange_rates');
};
