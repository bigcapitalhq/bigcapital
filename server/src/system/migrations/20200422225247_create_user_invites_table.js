
exports.up = function(knex) {
  return knex.schema.createTable('user_invites', (table) => {
    table.increments();
    table.string('email');
    table.string('token').unique();
    table.integer('tenant_id').unsigned();
    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('user_invites');
};
