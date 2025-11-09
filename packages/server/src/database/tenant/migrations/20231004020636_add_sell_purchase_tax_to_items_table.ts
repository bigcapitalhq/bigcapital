exports.up = (knex) => {
  return knex.schema.table('items', (table) => {
    table
      .integer('sell_tax_rate_id')
      .unsigned()
      .references('id')
      .inTable('tax_rates');
    table
      .integer('purchase_tax_rate_id')
      .unsigned()
      .references('id')
      .inTable('tax_rates');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('tax_rates');
};
