
exports.up = function(knex) {
  return knex.schema.createTable('oauth_clients', (table) => {
    table.increments();
    table.integer('client_id').unsigned();
    table.string('client_secret');
    table.string('redirect_uri');
  });
};

exports.down = (knex) => knex.schema.dropTableIfExists('oauth_clients');
