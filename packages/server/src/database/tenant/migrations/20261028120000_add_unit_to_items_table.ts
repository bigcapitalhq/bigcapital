exports.up = function (knex) {
  return knex.schema.alterTable('items', (table) => {
    table.string('unit', 20).notNullable().defaultTo('piece').after('code');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('items', (table) => {
    table.dropColumn('unit');
  });
};
