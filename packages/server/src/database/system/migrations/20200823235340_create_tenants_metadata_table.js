exports.up = function (knex) {
  return knex.schema.createTable('tenants_metadata', (table) => {
    table.bigIncrements();
    table.integer('tenant_id').unsigned();

    table.string('name');
    table.string('industry');
    table.string('location');

    table.string('base_currency');
    table.string('language');

    table.string('timezone');
    table.string('date_format');

    table.string('fiscal_year');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('tenants_metadata');
};
