/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('contacts', (table) => {
    // Percentage (0-100) withheld by the payer from the tax-exclusive
    // amount (e.g. NZ schedular payments). Null means no withholding.
    table.decimal('withholding_tax_rate', 5, 2).nullable().after('code');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('contacts', (table) => {
    table.dropColumn('withholding_tax_rate');
  });
};
