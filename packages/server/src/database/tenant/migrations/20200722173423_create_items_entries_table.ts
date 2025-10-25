exports.up = function (knex) {
  return knex.schema.createTable('items_entries', (table) => {
    table.increments();
    table.string('reference_type').index();
    table.string('reference_id').index();

    table.integer('index').unsigned();
    table
      .integer('item_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('items');
    table.text('description');
    table.integer('discount').unsigned();
    table.integer('quantity').unsigned();
    table.integer('rate').unsigned();

    table
      .integer('sell_account_id')
      .unsigned()
      .references('id')
      .inTable('accounts');
    table
      .integer('cost_account_id')
      .unsigned()
      .references('id')
      .inTable('accounts');

    table.boolean('landed_cost').defaultTo(false);
    table.decimal('allocated_cost_amount', 13, 3).defaultTo(0);

    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('items_entries');
};
