exports.up = (knex) =>
  knex.schema.alterTable('auth_two_factor_challenges', (table) => {
    table.string('saml_organization_id').nullable();
  });

exports.down = async (knex) => {
  await knex('auth_two_factor_challenges')
    .whereNotNull('saml_organization_id')
    .del();
  await knex.schema.alterTable('auth_two_factor_challenges', (table) => {
    table.dropColumn('saml_organization_id');
  });
};
