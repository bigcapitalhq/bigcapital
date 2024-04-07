exports.up = (knex) =>
  knex.schema.table('tenants_metadata', (table) => {
    table.string('tax_number');
  });

exports.down = (knex) =>
  knex.schema.table('tenants_metadata', (table) => {
    table.dropColumn('tax_number');
  });
