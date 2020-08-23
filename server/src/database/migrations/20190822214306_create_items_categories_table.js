
exports.up = function (knex) {
  return knex.schema.createTable('items_categories', (table) => {
    table.increments();
    table.string('name');
    table.integer('parent_category_id').unsigned();
    table.text('description');
    table.integer('user_id').unsigned();

    table.integer('cost_account_id').unsigned();
    table.integer('sell_account_id').unsigned();
    table.integer('inventory_account_id').unsigned();

    table.string('cost_method');
    table.timestamps();
  });
};

exports.down = (knex) => knex.schema.dropTableIfExists('items_categories');
