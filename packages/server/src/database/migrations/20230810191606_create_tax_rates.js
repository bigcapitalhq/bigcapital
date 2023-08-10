exports.up = (knex) => {
  return knex.schema.createTable('tax_rates', (table) => {
    table.increments();
    table.string('name');
    table.decimal('rate');
    table.boolean('is_non_recoverable');
    table.boolean('is_compound');
    table.timestamps();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('tax_rates');
};
