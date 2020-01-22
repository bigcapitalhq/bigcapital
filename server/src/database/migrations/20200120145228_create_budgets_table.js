
exports.up = function(knex) {
  return knex.schema.createTable('budgets', (table) => {
    table.increments();
    table.string('name');
    table.string('fiscal_year');
    table.string('period');
    table.string('account_types');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('budgets');
};
