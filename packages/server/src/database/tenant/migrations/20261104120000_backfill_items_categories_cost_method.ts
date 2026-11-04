/**
 * Backfills the item categories cost method and sets the default value.
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
exports.up = async function (knex) {
  await knex('items_categories')
    .whereNull('cost_method')
    .orWhere('cost_method', '')
    .update({ cost_method: 'AVG' });

  await knex.schema.alterTable('items_categories', (table) => {
    table.string('cost_method').defaultTo('AVG').alter();
  });
};

/**
 * Reverts the item categories cost method default value.
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
exports.down = async function (knex) {
  await knex.schema.alterTable('items_categories', (table) => {
    table.string('cost_method').defaultTo(null).alter();
  });
};
