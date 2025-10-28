
exports.up = function(knex) {
  return knex.schema.createTable('currencies', table => {
    table.increments();
    table.string('currency_name').index();
    table.string('currency_code', 4).index();
    table.string('currency_sign').index();
    table.timestamps();
  }).raw('ALTER TABLE `CURRENCIES` AUTO_INCREMENT = 1000');
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('currencies');
};
