
exports.up = function (knex) {
  return knex.schema.createTable('items_metadata', (table) => {
    table.increments();
    table.string('key');
    table.string('value');
    table.integer('item_id').unsigned();
  });
};

exports.down = (knex) => knex.schema.dropTableIfExists('items_metadata');
