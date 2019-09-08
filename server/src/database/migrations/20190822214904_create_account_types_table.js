
exports.up = function (knex) {
  return knex.schema.createTable('account_types', (table) => {
    table.increments();
    table.string('name');
  });
};

exports.down = (knex) => knex.schema.dropTableIfExists('account_types');
