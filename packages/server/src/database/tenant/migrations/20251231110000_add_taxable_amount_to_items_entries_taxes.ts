exports.up = function (knex) {
  return knex.schema.table('items_entries_taxes', (table) => {
    table.decimal('taxable_amount', 15, 5).after('tax_amount');
  });
};

exports.down = function (knex) {
  return knex.schema.table('items_entries_taxes', (table) => {
    table.dropColumn('taxable_amount');
  });
};
