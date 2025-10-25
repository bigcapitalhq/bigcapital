exports.up = (knex) => {
  return knex.schema
    .table('inventory_transactions', (table) => {
      table
        .integer('warehouse_id')
        .unsigned()
        .references('id')
        .inTable('warehouses');
      table
        .integer('branch_id')
        .unsigned()
        .references('id')
        .inTable('branches');
    })
    .table('inventory_cost_lot_tracker', (table) => {
      table
        .integer('warehouse_id')
        .unsigned()
        .references('id')
        .inTable('warehouses');

      table
        .integer('branch_id')
        .unsigned()
        .references('id')
        .inTable('branches');
    });
};

exports.down = (knex) => {
  return knex.schema
    .table('inventory_transactions', (table) => {
      table.dropColumn('warehouse_id');
      table.dropColumn('branch_id');
    })
    .table('inventory_cost_lot_tracker', (table) => {
      table.dropColumn('warehouse_id');
      table.dropColumn('branch_id');
    });
};
