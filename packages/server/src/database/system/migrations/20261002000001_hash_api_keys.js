/**
 * Replaces the plaintext API key column with a SHA-256 hash and a
 * displayable prefix. Existing keys keep working because the hash is
 * computed from the currently stored value before the raw column is
 * dropped.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable('api_keys', (table) => {
    table.string('key_hash', 64).nullable().unique();
    table.string('key_prefix', 16).nullable();
  });

  await knex.raw(`
    UPDATE api_keys
    SET key_hash = SHA2(\`key\`, 256),
        key_prefix = LEFT(\`key\`, 8)
    WHERE \`key\` IS NOT NULL
  `);

  await knex.schema.alterTable('api_keys', (table) => {
    table.dropColumn('key');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable('api_keys', (table) => {
    table.string('key').nullable().unique().index();
  });

  await knex.raw('UPDATE api_keys SET key_hash = NULL, key_prefix = NULL');

  await knex.schema.alterTable('api_keys', (table) => {
    table.dropColumn('key_hash');
    table.dropColumn('key_prefix');
  });
};
