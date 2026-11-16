/**
 * Adds the item SKU (stock keeping unit).
 * SKUs are optional but must be unique per organization when provided.
 * Empty values are stored as NULL so multiple items can omit the SKU.
 */
exports.up = function (knex) {
  return knex.schema.alterTable('items', (table) => {
    table.string('sku', 255).nullable().unique().after('code');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('items', (table) => {
    table.dropColumn('sku');
  });
};
