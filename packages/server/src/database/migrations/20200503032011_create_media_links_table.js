exports.up = (knex) =>
  knex.schema.createTable('media_links', (table) => {
    table.increments();
    table.string('model_name').index();
    table.integer('media_id').unsigned().references('id').inTable('media');
    table.integer('model_id').unsigned().index();
  });

exports.down = (knex) => knex.schema.dropTableIfExists('media_links');
