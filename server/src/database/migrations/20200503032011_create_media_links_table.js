
exports.up = function(knex) {
  return knex.schema.createTable('media_links', table => {
    table.increments();
    table.string('model_name');
    table.integer('media_id').unsigned();
    table.integer('model_id').unsigned();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('media_links');
};
