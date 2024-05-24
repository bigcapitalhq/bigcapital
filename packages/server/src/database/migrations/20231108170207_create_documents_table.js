exports.up = function (knex) {
  return knex.schema.createTable('documents', (table) => {
    table.increments('id').primary();
    table.string('key').notNullable();
    table.string('extension').notNullable();
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('documents');
};
