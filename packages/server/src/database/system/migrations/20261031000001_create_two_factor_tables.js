/**
 * TOTP two-factor authentication: per-user state, recovery codes, sign-in
 * challenges, and the organization setting that requires it for everyone.
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('users_two_factor', (table) => {
    table
      .integer('user_id')
      .unsigned()
      .primary()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.text('secret').nullable();
    table.dateTime('enabled_at').nullable();
    table.bigInteger('last_used_step').nullable();
    table.text('pending_secret').nullable();
    table.dateTime('pending_created_at').nullable();
    table.timestamps();
  });

  await knex.schema.createTable('users_two_factor_recovery_codes', (table) => {
    table.increments();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .index()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('code_hash', 64).notNullable();
    table.dateTime('used_at').nullable();
    table.dateTime('created_at');
    table.unique(['user_id', 'code_hash']);
  });

  await knex.schema.createTable('auth_two_factor_challenges', (table) => {
    table.increments();
    table.string('token_hash', 64).notNullable().unique();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .index()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('purpose', 16).notNullable();
    table.boolean('remember_me').notNullable().defaultTo(false);
    table.integer('attempts').unsigned().notNullable().defaultTo(0);
    table.dateTime('expires_at').notNullable().index();
    table.dateTime('consumed_at').nullable();
    table.dateTime('created_at').index();
  });

  await knex.schema.table('tenants_metadata', (table) => {
    table.boolean('require_two_factor').notNullable().defaultTo(false);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.table('tenants_metadata', (table) => {
    table.dropColumn('require_two_factor');
  });
  await knex.schema.dropTableIfExists('auth_two_factor_challenges');
  await knex.schema.dropTableIfExists('users_two_factor_recovery_codes');
  await knex.schema.dropTableIfExists('users_two_factor');
};
