exports.up = function (knex) {
  return knex.schema.table('tenants_metadata', (table) => {
    table.string('tax_number')
  });
};

exports.down = function (knex) {
  return knex.schema.table('tenants_metadata', (table) => {
    table.dropColumn('tax_number');
  });
};
