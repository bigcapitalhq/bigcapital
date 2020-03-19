
exports.up = function(knex) {
  return knex.schema.createTable('resource_custom_fields_metadata', (table) => {
    table.increments();
    table.integer('resource_id').unsigned();
    table.integer('resource_item_id').unsigned();
    table.string('key');
    table.string('value');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('resource_custom_fields_metadata');
};
