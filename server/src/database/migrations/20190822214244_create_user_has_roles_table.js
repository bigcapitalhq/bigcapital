
exports.up = function (knex) {
  return knex.schema.createTable('user_has_roles', (table) => {
    table.increments();
    table.integer('user_id').unsigned().references('id').inTable('users');
    table.integer('role_id').unsigned().references('id').inTable('roles');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('user_has_roles');
};
