/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('api_keys', (table) => {
    table.increments('id').primary();

    table.bigInteger('tenant_id').unsigned().index().references('id').inTable('tenants');
    table.integer('user_id').unsigned().index().references('id').inTable('users');

    table.string('name');
    table.text('key');

    table.dateTime('expires_at').nullable();
    table.dateTime('revoked_at').nullable();
    table.timestamps();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('api_keys');
};
