
exports.up = function(knex) {
  return knex.schema.createTable('options', (table) => {
    table.increments();
    table.string('key');
    table.string('value');
    table.string('group');
    table.string('type');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('options');
};
