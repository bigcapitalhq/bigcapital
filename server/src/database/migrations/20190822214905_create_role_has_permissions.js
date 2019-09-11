
exports.up = function (knex) {
  return knex.schema.createTable('role_has_permissions', (table) => {
    table.increments();
    table.integer('role_id').unsigned().references('id').inTable('roles');
    table.integer('permission_id').unsigned().references('id').inTable('permissions');
    table.integer('resource_id').unsigned().references('id').inTable('resources');
  });
};

exports.down = (knex) => knex.schema.dropTableIfExists('role_has_permissions');
