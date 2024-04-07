exports.up = (knex) =>
  knex.schema.createTable('media', (table) => {
    table.increments();
    table.string('attachment_file');
    table.timestamps();
  });

exports.down = (knex) => knex.schema.dropTableIfExists('media');
