
exports.up = (knex) => knex.schema.createTable('roles', (table) => {
  table.increments();
  table.string('name');
  table.string('description');
  table.boolean('predefined').default(false);
  table.timestamps();
});

exports.down = (knex) => knex.schema.dropTable('roles');
