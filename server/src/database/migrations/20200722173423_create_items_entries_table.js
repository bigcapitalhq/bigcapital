
exports.up = function(knex) {
  return knex.schema.createTable('items_entries', (table) => {
    table.increments();
    table.string('reference_type');
    table.string('reference_id');

    table.integer('index').unsigned();
    table.integer('item_id');
    table.text('description');
    table.integer('discount').unsigned();
    table.integer('quantity').unsigned();
    table.integer('rate').unsigned();
    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('items_entries');
};
