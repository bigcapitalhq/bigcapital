exports.up = (knex) => {
  return knex.schema.table('bills', (table) => {
    table.boolean('is_inclusive_tax').defaultTo(false);
    table.decimal('tax_amount_withheld');
  });
};

exports.down = (knex) => {
  return knex.schema.table('bills', () => {});
};
