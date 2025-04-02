exports.up = (knex) => {
  return knex.schema
    .table('sales_invoices', (table) => {
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
    .table('sales_estimates', (table) => {
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
    .table('sales_receipts', (table) => {
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
    .table('payment_receives', (table) => {
      table
        .integer('branch_id')
        .unsigned()
        .references('id')
        .inTable('branches');
    })
    .table('credit_notes', (table) => {
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
    .table('sales_invoices', (table) => {
      table.dropColumn('warehouse_id');
      table.dropColumn('branch_id');
    })
    .table('sales_estimates', (table) => {
      table.dropColumn('warehouse_id');
      table.dropColumn('branch_id');
    })
    .table('sales_receipts', (table) => {
      table.dropColumn('warehouse_id');
      table.dropColumn('branch_id');
    })
    .table('payment_receives', (table) => {
      table.dropColumn('branch_id');
    })
    .table('credit_notes', (table) => {
      table.dropColumn('warehouse_id');
      table.dropColumn('branch_id');
    });
};
