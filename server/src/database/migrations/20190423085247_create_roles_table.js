
exports.up = (knex) => knex.schema.createTable('roles', (table) => {
  table.increments();
  table.string('name');
  table.string('description');
  table.boolean('predefined').default(false);
  table.timestamps();
}).raw('ALTER TABLE `ROLES` AUTO_INCREMENT = 1000');



exports.down = (knex) => knex.schema.dropTable('roles');
