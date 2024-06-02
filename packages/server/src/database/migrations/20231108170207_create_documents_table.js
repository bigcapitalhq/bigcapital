exports.up = function (knex) {
  return knex.schema.createTable('documents', (table) => {
    table.increments('id').primary();
    table.string('key').notNullable();
    table.string('mime_type').notNullable();
    table.integer('size').unsigned();
    table.string('origin_name');
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('documents');
};
