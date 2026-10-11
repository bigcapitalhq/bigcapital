/**
 * Replaces the plaintext API keys with SHA-256 hashes plus a displayable prefix.
 * Existing keys keep working: `key_hash` is backfilled from the plaintext column
 * using `SHA2(key, 256)` which produces the same digest the server computes in Node.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable('api_keys', (table) => {
    table.string('key_hash', 64).nullable();
    table.string('key_prefix', 16).nullable();
  });

  // Backfill the hashes from the existing plaintext keys.
  await knex.raw(
    'UPDATE API_KEYS SET KEY_HASH = LOWER(SHA2(`KEY`, 256)), KEY_PREFIX = LEFT(`KEY`, 8) WHERE `KEY` IS NOT NULL',
  );

  // Enforce the new constraints and drop the plaintext keys. Dropping the
  // column also drops the indexes that reference it.
  await knex.raw(
    'ALTER TABLE API_KEYS MODIFY KEY_HASH VARCHAR(64) NOT NULL, MODIFY KEY_PREFIX VARCHAR(16) NOT NULL, ADD UNIQUE INDEX API_KEYS_KEY_HASH_UNIQUE (KEY_HASH), DROP COLUMN `KEY`',
  );
};

/**
 * Restores the plaintext key column and drops the hash columns.
 * Plain keys cannot be restored from their hashes, so previously issued keys
 * become unusable and have to be regenerated after a rollback.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable('api_keys', (table) => {
    table.string('key').nullable().unique().index();
    table.dropColumn('key_hash');
    table.dropColumn('key_prefix');
  });
};
