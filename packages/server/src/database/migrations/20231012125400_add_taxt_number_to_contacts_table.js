exports.up = (knex) => {
  return knex.schema.table('contacts', (table) => {
    table.string('tax_number')
  });
};

exports.down = (knex) => {
  return knex.schema.table('contacts', (table) => {
    table.dropColumn('tax_number')
  });
};
