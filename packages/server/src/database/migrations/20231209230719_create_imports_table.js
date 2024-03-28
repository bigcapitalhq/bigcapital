exports.up = function (knex) {
  return knex.schema.createTable('imports', (table) => {
    table.increments();
    table.string('filename');
    table.string('import_id');
    table.string('resource');
    table.json('columns');
    table.json('mapping');
    table.json('params');
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('imports');
};
