/**
 * Adds the mandatory flag to tracking categories.
 *
 * When a tracking category is mandatory, every manual journal entry line must
 * have an option from that category assigned before the journal can be saved.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable('tracking_categories', (table) => {
    table.boolean('mandatory').notNullable().defaultTo(false);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable('tracking_categories', (table) => {
    table.dropColumn('mandatory');
  });
};
