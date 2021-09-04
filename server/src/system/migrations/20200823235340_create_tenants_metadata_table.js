exports.up = function (knex) {
  return knex.schema.createTable('tenants_metadata', (table) => {
    table.bigIncrements();
    table.integer('tenant_id').unsigned();

    table.string('organization_name');
    table.string('industry');

    table.string('base_currency');

    table.string('timezone');
    table.string('date_format');

    table.string('fiscal_year');
    table.string('financial_start_date');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('tenants_metadata');
};
