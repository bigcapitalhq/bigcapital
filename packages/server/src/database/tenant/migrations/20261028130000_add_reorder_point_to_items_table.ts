/**
 * Adds the item reorder point and the internal low-stock notification state.
 */
exports.up = function (knex) {
  return knex.schema.alterTable('items', (table) => {
    table.decimal('reorder_point', 13, 3).nullable().after('quantity_on_hand');
    table.boolean('reorder_point_notified').notNullable().defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('items', (table) => {
    table.dropColumn('reorder_point_notified');
    table.dropColumn('reorder_point');
  });
};
