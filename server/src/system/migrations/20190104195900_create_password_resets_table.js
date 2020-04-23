
exports.up = (knex) => knex.schema.createTable('password_resets', (table) => {
  table.increments();
  table.string('email');
  table.string('token');
  table.timestamp('created_at');
});

exports.down = (knex) => knex.schema.dropTableIfExists('password_resets');