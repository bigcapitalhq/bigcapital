
exports.up = function (knex) {
  return knex.schema.createTable('views', (table) => {
    table.increments();
    table.string('name');
    table.boolean('predefined');
    table.integer('resource_id').unsigned().references('id').inTable('resources');
    table.boolean('favourite');
    table.string('roles_logic_expression');
  });
};

exports.down = (knex) => knex.schema.dropTableIfExists('views');
