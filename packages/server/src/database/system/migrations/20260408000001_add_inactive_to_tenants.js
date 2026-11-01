exports.up = function(knex) {
  return knex.schema.table('tenants', (table) => {
    table.boolean('is_inactive').defaultTo(false).nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('tenants', (table) => {
    table.dropColumn('is_inactive');
  });
};
