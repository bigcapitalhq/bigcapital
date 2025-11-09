exports.up = (knex) => {
  return knex.schema
    .createTable('roles', (table) => {
      table.increments('id');
      table.string('name', 255).notNullable();
      table.string('slug');
      table.text('description');
      table.boolean('predefined');
    })
    .createTable('role_permissions', (table) => {
      table.increments('id');
      table.integer('role_id').unsigned().references('id').inTable('roles');
      table.string('subject');
      table.string('ability');
      table.boolean('value');
    });
};

exports.down = (knex) => {
  return knex.schema.dropTable('roles').dropTable('role_permissions');
};
