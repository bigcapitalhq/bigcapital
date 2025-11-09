/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('api_keys', (table) => {
    table.increments();
    table.string('key').notNullable().unique().index();
    table.string('name');
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .index()
      .references('id')
      .inTable('users');
    table
      .bigInteger('tenant_id')
      .unsigned()
      .notNullable()
      .index()
      .references('id')
      .inTable('tenants');
    table.dateTime('expires_at').nullable().index();
    table.dateTime('revoked_at').nullable().index();
    table.timestamps();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('api_keys');
};
