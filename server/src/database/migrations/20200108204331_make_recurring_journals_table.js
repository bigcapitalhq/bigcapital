
exports.up = function(knex) {
  return knex.schema.createTable('recurring_journals', (table) => {
    table.increments();
    table.string('template_name');
    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('recurring_journals');
};
