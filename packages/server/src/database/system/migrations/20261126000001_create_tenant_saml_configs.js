exports.up = function (knex) {
  return knex.schema.createTable('tenant_saml_configs', (table) => {
    table
      .bigInteger('tenant_id')
      .unsigned()
      .primary()
      .references('id')
      .inTable('tenants')
      .onDelete('CASCADE');
    table.boolean('enabled').notNullable().defaultTo(false);
    table.text('idp_entity_id').notNullable();
    table.text('idp_sso_url').notNullable();
    table.text('idp_certificate').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('tenant_saml_configs');
};
