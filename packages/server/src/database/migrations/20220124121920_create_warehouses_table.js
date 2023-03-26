exports.up = (knex) => {
  return knex.schema
    .createTable('warehouses', (table) => {
      table.increments();
      table.string('name');
      table.string('code');

      table.string('address');
      table.string('city');
      table.string('country');

      table.string('phone_number');
      table.string('email');
      table.string('website');

      table.boolean('primary');

      table.timestamps();
    })
    .createTable('warehouses_transfers', (table) => {
      table.increments();
      table.date('date');
      table
        .integer('to_warehouse_id')
        .unsigned()
        .references('id')
        .inTable('warehouses');
      table
        .integer('from_warehouse_id')
        .unsigned()
        .references('id')
        .inTable('warehouses');
      table.string('transaction_number');

      table.date('transfer_initiated_at');
      table.date('transfer_delivered_at');

      table.timestamps();
    })
    .createTable('warehouses_transfers_entries', (table) => {
      table.increments();
      table.integer('index');
      table
        .integer('warehouse_transfer_id')
        .unsigned()
        .references('id')
        .inTable('warehouses_transfers');
      table.integer('item_id').unsigned().references('id').inTable('items');
      table.string('description');
      table.integer('quantity');
      table.decimal('cost');
    });
};

exports.down = (knex) => {
  return knex.schema
    .dropTableIfExists('vendor_credit_applied_bill')
    .dropTableIfExists('credit_note_applied_invoice');
};
