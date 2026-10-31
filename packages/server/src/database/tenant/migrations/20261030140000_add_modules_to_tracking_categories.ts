/**
 * Adds the modules list to tracking categories.
 *
 * Tracking categories can be limited to specific modules. Existing categories
 * are backfilled with all supported modules so their behavior doesn't change.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable('tracking_categories', (table) => {
    table.json('modules').nullable().after('description');
  });

  await knex('tracking_categories').update({
    modules: JSON.stringify([
      'manual_journals',
      'sale_invoices',
      'sale_estimates',
    ]),
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable('tracking_categories', (table) => {
    table.dropColumn('modules');
  });
};
