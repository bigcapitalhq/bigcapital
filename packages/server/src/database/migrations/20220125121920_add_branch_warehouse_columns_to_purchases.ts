exports.up = (knex) => {
  return knex.schema
    .table('bills', (table) => {
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
    .table('bills_payments', (table) => {
      table
        .integer('branch_id')
        .unsigned()
        .references('id')
        .inTable('branches');
    })
    .table('vendor_credits', (table) => {
      table
        .integer('branch_id')
        .unsigned()
        .references('id')
        .inTable('branches');
      table
        .integer('warehouse_id')
        .unsigned()
        .references('id')
        .inTable('warehouses');
    })
    .table('inventory_adjustments', (table) => {
      table
        .integer('branch_id')
        .unsigned()
        .references('id')
        .inTable('branches');
      table
        .integer('warehouse_id')
        .unsigned()
        .references('id')
        .inTable('warehouses');
    });
};

exports.down = (knex) => {
  return knex.schema
    .table('bills', (table) => {
      table.dropColumn('warehouse_id');
      table.dropColumn('branch_id');
    })
    .table('bills_payments', (table) => {
      table.dropColumn('branch_id');
    })
    .table('vendor_credits', (table) => {
      table.dropColumn('branch_id');
      table.dropColumn('warehouse_id');
    })
    .table('inventory_adjustments', (table) => {
      table.dropColumn('branch_id');
      table.dropColumn('warehouse_id');
    });
};
