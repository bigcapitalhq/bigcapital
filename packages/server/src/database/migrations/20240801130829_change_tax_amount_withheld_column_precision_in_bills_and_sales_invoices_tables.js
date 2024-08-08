// This migration changes the precision of the tax_amount_withheld column in the bills and sales_invoices tables from 8, 2 to 13, 2.
// This migration is necessary to allow tax_amount_withheld filed to store values bigger than 999,999.99.

exports.up = function(knex) {
  return knex.schema.alterTable('bills', function (table) {
    table.decimal('tax_amount_withheld', 13, 2).alter();
  }).alterTable('sales_invoices', function (table) {
    table.decimal('tax_amount_withheld', 13, 2).alter();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('bills', function (table) {
    table.decimal('tax_amount_withheld', 8, 2).alter();
  }).alterTable('sales_invoices', function (table) {
    table.decimal('tax_amount_withheld', 8, 2).alter();
  });
};