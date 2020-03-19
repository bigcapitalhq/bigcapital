
exports.up = function(knex) {
  return knex.schema.createTable('oauth_tokens', (table) => {
    table.increments();
    table.string('access_token');
    table.date('access_token_expires_on');
    table.integer('client_id').unsigned();
    table.string('refresh_token');
    table.date('refresh_token_expires_on');
    table.integer('user_id').unsigned();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('oauth_tokens');
};
