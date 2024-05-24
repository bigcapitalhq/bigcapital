exports.up = function (knex) {
  return knex.schema.createTable('document_links', (table) => {
    table.increments('id').primary();
    table.string('model_ref').notNullable();
    table.string('model_id').notNullable();
    table.integer('document_id').unsigned();
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('document_links');
};
