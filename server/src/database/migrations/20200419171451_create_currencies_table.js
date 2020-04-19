
exports.up = function(knex) {
  return knex.schema.createTable('currencies', table => {
    table.increments();
    table.string('currency_name');
    table.string('currency_code', 4);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('currencies');
};
