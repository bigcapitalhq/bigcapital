exports.up = function (knex) {
  return knex.schema
    .table('sales_estimates', (table) => {
      table.boolean('is_inclusive_tax').defaultTo(false);
      table.decimal('tax_amount_withheld', 15, 5);
    })
    .table('sales_receipts', (table) => {
      table.boolean('is_inclusive_tax').defaultTo(false);
      table.decimal('tax_amount_withheld', 15, 5);
    });
};

exports.down = function (knex) {
  return knex.schema
    .table('sales_estimates', (table) => {
      table.dropColumn('is_inclusive_tax');
      table.dropColumn('tax_amount_withheld');
    })
    .table('sales_receipts', (table) => {
      table.dropColumn('is_inclusive_tax');
      table.dropColumn('tax_amount_withheld');
    });
};
