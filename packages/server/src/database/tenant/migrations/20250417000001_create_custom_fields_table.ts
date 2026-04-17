
exports.up = function(knex) {
  return knex.schema.createTable('custom_fields', table => {
    table.increments();

    table.string('resource_name').notNullable();
    table.string('field_name').notNullable();
    table.string('label').notNullable();
    table.string('field_type').notNullable();
    table.json('options').nullable();
    table.boolean('required').defaultTo(false);
    table.integer('order').defaultTo(0);
    table.boolean('active').defaultTo(true);
    table.string('default_value').nullable();

    table.timestamps();

    table.index(['resource_name']);
    table.index(['resource_name', 'active']);
    table.unique(['resource_name', 'field_name']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('custom_fields');
};
