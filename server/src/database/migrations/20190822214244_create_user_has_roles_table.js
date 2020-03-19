
exports.up = function (knex) {
  return knex.schema.createTable('user_has_roles', (table) => {
    table.increments();
    table.integer('user_id').unsigned();
    table.integer('role_id').unsigned();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('user_has_roles');
};
