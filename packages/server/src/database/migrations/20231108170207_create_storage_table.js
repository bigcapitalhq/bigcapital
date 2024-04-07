exports.up = (knex) =>
  knex.schema.createTable('storage', (table) => {
    table.increments('id').primary();
    table.string('key').notNullable();
    table.string('path').notNullable();
    table.string('extension').notNullable();
    table.integer('expire_in');
    table.timestamps();
  });

exports.down = (knex) => knex.schema.dropTableIfExists('storage');
