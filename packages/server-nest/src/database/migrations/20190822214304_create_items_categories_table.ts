
exports.up = function (knex) {
  return knex.schema.createTable('items_categories', (table) => {
    table.increments();
    table.string('name').index();
   
    table.text('description');
    table.integer('user_id').unsigned().index();

    table.integer('cost_account_id').unsigned().references('id').inTable('accounts');
    table.integer('sell_account_id').unsigned().references('id').inTable('accounts');
    table.integer('inventory_account_id').unsigned().references('id').inTable('accounts');

    table.string('cost_method');
    table.timestamps();
  });
};

exports.down = (knex) => knex.schema.dropTableIfExists('items_categories');
