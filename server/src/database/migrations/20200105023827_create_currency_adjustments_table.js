
exports.up = function(knex) {
  return knex.schema.createTable('currency_adjustments', (table) => {
    table.increments();
    table.date('date');
    table.string('currency_code');
    table.decimal('exchange_rate');
    table.string('note');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('currency_adjustments');
};
