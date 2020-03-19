
exports.up = function (knex) {
  return knex.schema.createTable('role_has_accounts', (table) => {
    table.increments();
    table.integer('role_id').unsigned();
    table.integer('account_id').unsigned();
  });
};

exports.down = (knex) => knex.schema.dropTableIfExists('role_has_accounts');
