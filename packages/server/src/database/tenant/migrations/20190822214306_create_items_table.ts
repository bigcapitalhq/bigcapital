
exports.up = function (knex) {
  return knex.schema.createTable('items', (table) => {
    table.increments();
    table.string('name').index();
    table.string('type').index();
    table.string('code');
    table.boolean('sellable').index();
    table.boolean('purchasable').index();
    table.decimal('sell_price', 13, 3).unsigned();
    table.decimal('cost_price', 13, 3).unsigned();
    table.string('currency_code', 3);
    table.string('picture_uri');
    table.integer('cost_account_id').nullable().unsigned().references('id').inTable('accounts');
    table.integer('sell_account_id').nullable().unsigned().references('id').inTable('accounts');
    table.integer('inventory_account_id').unsigned().references('id').inTable('accounts');
    table.text('sell_description').nullable();
    table.text('purchase_description').nullable();
    table.integer('quantity_on_hand');
    table.boolean('landed_cost').nullable();

    table.text('note').nullable();
    table.boolean('active');
    table.integer('category_id').unsigned().index().references('id').inTable('items_categories');
    table.integer('user_id').unsigned().index();
    table.timestamps();
  }).raw('ALTER TABLE `ITEMS` AUTO_INCREMENT = 1000');
};

exports.down = (knex) => knex.schema.dropTableIfExists('items');
