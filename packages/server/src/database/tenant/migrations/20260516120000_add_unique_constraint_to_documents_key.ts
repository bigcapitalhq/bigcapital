exports.up = function (knex) {
  return knex.schema.alterTable('documents', (table) => {
    table.unique('key');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('documents', (table) => {
    table.dropUnique('key');
  });
};
