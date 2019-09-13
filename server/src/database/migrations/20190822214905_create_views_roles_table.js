
exports.up = function (knex) {
  return knex.schema.createTable('view_roles', (table) => {
    table.increments();
    table.integer('index');
    table.integer('field_id').unsigned().references('id').inTable('resource_fields');
    table.string('comparator');
    table.string('value');
    table.integer('view_id').unsigned();
  });
};

exports.down = (knex) => knex.schema.dropTableIfExists('view_roles');
