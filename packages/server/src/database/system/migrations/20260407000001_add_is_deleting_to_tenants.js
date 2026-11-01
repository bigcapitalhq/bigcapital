
exports.up = function(knex) {
  return knex.schema.table('tenants', (table) => {
    table.boolean('is_deleting').defaultTo(false).nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('tenants', (table) => {
    table.dropColumn('is_deleting');
  });
};
