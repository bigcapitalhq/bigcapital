
exports.up = function (knex) {
  return knex.schema.createTable('items', (table) => {
    table.increments();
    table.string('name');
    table.string('type');
    table.decimal('cost_price').unsigned();
    table.decimal('sell_price').unsigned();
    table.string('currency_code', 3);
    table.string('picture_uri');
    table.integer('cost_account_id').unsigned();
    table.integer('sell_account_id').unsigned();
    table.text('note').nullable();
    table.integer('category_id').unsigned();
    table.integer('user_id').unsigned();
    table.timestamps();
  });
};

exports.down = (knex) => knex.schema.dropTableIfExists('items');
