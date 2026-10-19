/**
 * Adds the accounting basis flag to the GL entries.
 * The nullable enum holds `cash` or `accrual`; NULL (empty) means general,
 * which is included in both the cash and accrual basis reports.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table('accounts_transactions', (table) => {
    table
      .enum('basis', ['cash', 'accrual'])
      .nullable()
      .defaultTo(null)
      .index()
      .after('note');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table('accounts_transactions', (table) => {
    table.dropColumn('basis');
  });
};
