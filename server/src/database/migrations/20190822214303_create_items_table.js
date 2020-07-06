
exports.up = function (knex) {
  return knex.schema.createTable('items', (table) => {
    table.increments();
    table.string('name');
    table.string('type');
    table.string('sku');
    table.decimal('cost_price', 13, 3).unsigned();
    table.decimal('sell_price', 13, 3).unsigned();
    table.string('currency_code', 3);
    table.string('picture_uri');
    table.integer('cost_account_id').unsigned();
    table.integer('sell_account_id').unsigned();
    table.integer('inventory_account_id').unsigned();
    table.text('note').nullable();
    table.integer('category_id').unsigned();
    table.integer('user_id').unsigned();
    table.timestamps();
  }).raw('ALTER TABLE `ITEMS` AUTO_INCREMENT = 1000');;
};

exports.down = (knex) => knex.schema.dropTableIfExists('items');
