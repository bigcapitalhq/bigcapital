/**
 * Compatibility placeholder.
 *
 * An earlier experimental custom-fields branch created a migration with this
 * name. Some development tenant databases recorded it but no longer have the
 * tables. The canonical schema is created by
 * `20261107120000_create_custom_fields_tables.ts`.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function () {};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function () {};
