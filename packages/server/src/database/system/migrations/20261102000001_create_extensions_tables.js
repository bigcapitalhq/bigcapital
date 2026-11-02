/**
 * Extension registry.
 *
 * `extensions` stores the catalog of installed extensions (system-wide).
 * `extension_tenants` stores per-organization enablement, version, settings,
 * and migration status.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('extensions', (table) => {
      table.bigIncrements('id');
      table
        .string('extension_id', 128)
        .notNullable()
        .unique('uq_extensions_extension_id');
      table.string('name', 255).notNullable();
      table.string('version', 32).notNullable();
      table.json('manifest').notNullable();
      table.string('trust', 32).notNullable();
      table.string('status', 32).notNullable().defaultTo('installed');
      table.string('checksum', 64).nullable();
      table.dateTime('installed_at').nullable();
      table.dateTime('updated_at').nullable();
      table.index(['status'], 'idx_extensions_status');
    })
    .createTable('extension_tenants', (table) => {
      table.bigIncrements('id');
      table
        .string('extension_id', 128)
        .notNullable()
        .references('extension_id')
        .inTable('extensions')
        .onDelete('CASCADE');
      table.string('organization_id', 64).notNullable();
      table.string('version', 32).notNullable();
      table.string('status', 32).notNullable().defaultTo('disabled');
      table.json('settings').nullable();
      table.text('last_error').nullable();
      table.dateTime('enabled_at').nullable();
      table.dateTime('disabled_at').nullable();
      table.timestamps();
      table.unique(['extension_id', 'organization_id'], 'uq_extension_tenant');
      table.index(['organization_id'], 'idx_extension_tenants_org');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('extension_tenants')
    .dropTableIfExists('extensions');
};
