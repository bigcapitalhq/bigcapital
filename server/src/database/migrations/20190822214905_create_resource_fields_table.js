
exports.up = function (knex) {
  return knex.schema.createTable('resource_fields', (table) => {
    table.increments();
    table.string('label_name');
    table.string('data_type');
    table.string('help_text');
    table.string('default');
    table.boolean('active');
    table.boolean('predefined');
    table.json('options');
    table.integer('resource_id').unsigned().references('id').inTable('resources');
  });
};

exports.down = (knex) => knex.schema.dropTableIfExists('resource_fields');
