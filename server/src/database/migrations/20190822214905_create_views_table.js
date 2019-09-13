
exports.up = function (knex) {
  return knex.schema.createTable('views', (table) => {
    table.increments();
    table.string('name');
    table.boolean('predefined');
    table.integer('resource_id').unsigned().references('id').inTable('resources');
  });
};

exports.down = (knex) => knex.schema.dropTableIfExists('views');
