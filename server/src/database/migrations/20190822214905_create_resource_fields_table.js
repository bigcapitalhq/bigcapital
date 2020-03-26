
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
    table.json('options');
    table.integer('resource_id').unsigned();
  }).then(() => {
    return knex.seed.run({
      specific: 'seed_resources_fields.js',
    });
  });
};

exports.down = (knex) => knex.schema.dropTableIfExists('resource_fields');
