/**
 * Backfills the accounting basis of the existing sale invoice write-off
 * entries. The write-off credits the account receivable and debits the bad
 * debt expense without any cash movement, hence it is an accrual basis entry
 * and it must be excluded from the cash basis reports.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex('accounts_transactions')
    .where('reference_type', 'InvoiceWriteOff')
    .whereNull('basis')
    .update({ basis: 'accrual' });
};

/**
 * Cannot safely reverse a backfill.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (_knex) {
  return Promise.resolve();
};
