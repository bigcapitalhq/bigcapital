
exports.up = function (knex) {
  return knex.schema.createTable('view_has_columns', (table) => {
    table.increments();
    table.integer('view_id').unsigned();
    table.integer('field_id').unsigned();
    table.integer('index').unsigned();
  });
};

exports.down = (knex) => knex.schema.dropTableIfExists('view_has_columns');
