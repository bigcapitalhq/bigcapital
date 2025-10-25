exports.up = function (knex) {
  return knex.schema.createTable('inventory_cost_lot_tracker', (table) => {
    table.increments();
    table.date('date').index();
    table.string('direction').index();

    table.integer('item_id').unsigned().index();
    table.integer('quantity').unsigned().index();
    table.decimal('rate', 13, 3);
    table.integer('remaining');
    table.decimal('cost', 13, 3);

    table.string('transaction_type').index();
    table.integer('transaction_id').unsigned().index();

    table.integer('entry_id').unsigned().index();
    table.integer('cost_account_id').unsigned();
    table.integer('inventory_transaction_id').unsigned().index();

    table.datetime('created_at').index();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('inventory_cost_lot_tracker');
};
