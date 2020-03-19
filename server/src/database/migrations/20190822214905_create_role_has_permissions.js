
exports.up = function (knex) {
  return knex.schema.createTable('role_has_permissions', (table) => {
    table.increments();
    table.integer('role_id').unsigned();
    table.integer('permission_id').unsigned();
    table.integer('resource_id').unsigned();
  });
};

exports.down = (knex) => knex.schema.dropTableIfExists('role_has_permissions');
