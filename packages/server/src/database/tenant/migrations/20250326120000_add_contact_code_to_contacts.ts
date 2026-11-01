exports.up = function (knex) {
  return knex.schema.alterTable('contacts', (table) => {
    table.string('code').nullable().unique();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('contacts', (table) => {
    table.dropColumn('code');
  });
};
