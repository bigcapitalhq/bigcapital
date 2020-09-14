
exports.up = function (knex) {
  return knex.schema.createTable('resource_fields', (table) => {
    table.increments();
    table.string('label_name');
    table.string('key');
    table.string('data_type');
    table.string('help_text');
    table.string('default');
    table.boolean('active');
    table.boolean('predefined');
    table.boolean('builtin').defaultTo(false);
    table.boolean('columnable');
    table.integer('index');
    table.string('data_resource');
    table.json('options');
    table.integer('resource_id').unsigned();
  }).raw('ALTER TABLE `RESOURCE_FIELDS` AUTO_INCREMENT = 1000');
};

exports.down = (knex) => knex.schema.dropTableIfExists('resource_fields');
