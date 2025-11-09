
exports.up = function(knex) {
  return knex.schema.createTable('media', (table) => {
    table.increments();
    table.string('attachment_file');
    table.timestamps();
  }); 
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('media');
};
