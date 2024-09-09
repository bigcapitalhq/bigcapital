/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table('sales_invoices', (table) => {
    table.string('stripe_plink_id').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table('sales_invoices', (table) => {
    table.dropColumn('stripe_plink_id');
  });
};
