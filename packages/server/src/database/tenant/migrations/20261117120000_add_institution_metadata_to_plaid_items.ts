/**
 * Caches the Plaid institution display metadata on the linked item so the
 * bank accounts list can render the institution logo without calling the
 * Plaid API on read.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable('plaid_items', (table) => {
    table.string('plaid_institution_name').nullable();
    // A 152x152 PNG logo may exceed the 64KB `TEXT` limit once base64 encoded.
    table.text('plaid_institution_logo', 'mediumtext').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable('plaid_items', (table) => {
    table.dropColumn('plaid_institution_name');
    table.dropColumn('plaid_institution_logo');
  });
};
