/**
 * Adds the accounting basis flag to the manual journals.
 * The nullable enum holds `cash` or `accrual`; NULL (empty) means general,
 * which is included in both the cash and accrual basis reports.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table('manual_journals', (table) => {
    table
      .enum('basis', ['cash', 'accrual'])
      .nullable()
      .defaultTo(null)
      .index()
      .after('journal_type');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table('manual_journals', (table) => {
    table.dropColumn('basis');
  });
};
