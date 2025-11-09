exports.up = function (knex) {
  return knex.schema
    .createTable('view_roles', (table) => {
      table.increments();
      table.integer('index');
      table.string('field_key').index();
      table.string('comparator');
      table.string('value');
      table
        .integer('view_id')
        .unsigned()
        .index()
        .references('id')
        .inTable('views');
    })
    .raw('ALTER TABLE `VIEW_ROLES` AUTO_INCREMENT = 1000');
};

exports.down = (knex) => knex.schema.dropTableIfExists('view_roles');
