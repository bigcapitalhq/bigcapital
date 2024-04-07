exports.up = (knex) =>
  knex.schema.createTable('imports', (table) => {
    table.increments();
    table.string('filename');
    table.string('import_id');
    table.string('resource');
    table.json('columns');
    table.json('mapping');
    table.json('params');
    table.timestamps();
  });

exports.down = (knex) => knex.schema.dropTableIfExists('imports');
