/**
 * Index that maps a Square `merchant_id` (per environment) to the tenant
 * + connection row that owns it. Necessary because the app-level webhook
 * URL has no tenant context: the receiver reads `merchant_id` from the
 * payload, looks up the tenant via this index, sets the CLS organization
 * id, and only then opens the tenant DB to find the connection.
 *
 * Written by the OAuth callback every time a connection is inserted or
 * updated, so the index is authoritative.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('square_merchant_index', (table) => {
    table.increments('id');
    table.string('merchant_id', 64).notNullable();
    table.string('environment', 16).notNullable();
    // tenant.organization_id (string, e.g. '35i5f1mo1phc5w'), not the
    // numeric tenants.id, because the CLS organizationId is the string form.
    table.string('organization_id', 64).notNullable();
    // The connection's id within the tenant DB. Useful for audit; the
    // webhook handler still re-resolves the row by merchant_id within
    // the tenant in case the connection was deleted and replaced.
    table.integer('connection_id').unsigned().nullable();
    table.timestamps();

    table.unique(['merchant_id', 'environment']);
    table.index(['organization_id']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('square_merchant_index');
};
