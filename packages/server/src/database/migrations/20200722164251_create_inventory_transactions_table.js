exports.up = function (knex) {
  return knex.schema.createTable('inventory_transactions', (table) => {
    table.increments('id');
    table.date('date').index();
    table.string('direction').index();
    table
      .integer('item_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('items');
    table.integer('quantity').unsigned();
    table.decimal('rate', 13, 3).unsigned();

    table.string('transaction_type').index();
    table.integer('transaction_id').unsigned().index();

    table.integer('entry_id').unsigned().index();
    table.integer('cost_account_id').unsigned();
    table.timestamps();
  });
};

exports.down = function (knex) {};
