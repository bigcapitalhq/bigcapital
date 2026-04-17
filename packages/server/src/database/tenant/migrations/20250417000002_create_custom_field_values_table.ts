
exports.up = function(knex) {
  return knex.schema.createTable('custom_field_values', table => {
    table.increments();

    table.integer('custom_field_id').unsigned().notNullable();
    table.string('resource_type').notNullable();
    table.integer('resource_id').unsigned().notNullable();
    table.text('value').nullable();

    table.timestamps();

    table.index(['resource_type', 'resource_id'], 'cfv_resource_idx');
    table.index(['custom_field_id'], 'cfv_field_idx');
    table.unique(['custom_field_id', 'resource_type', 'resource_id'], 'cfv_unique_value');

    table.foreign('custom_field_id')
      .references('id')
      .inTable('custom_fields')
      .onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('custom_field_values');
};
