// Widens every tax rate column from decimal(8, 2) to decimal(8, 4), so rates such
// as 9.975 % (Québec QST) are stored exactly instead of being rounded to 9.98 %.
// The four columns change together: the line's copy of the rate feeds the ledger,
// and the ledger and tax transactions keep their own copies of it.
//
// On MySQL `.alter()` replaces the whole column definition, so `unsigned` is
// restated wherever the original column had it.

exports.up = function (knex) {
  return knex.schema
    .alterTable('tax_rates', function (table) {
      table.decimal('rate', 8, 4).alter();
    })
    .alterTable('items_entries', function (table) {
      table.decimal('tax_rate', 8, 4).unsigned().alter();
    })
    .alterTable('tax_rate_transactions', function (table) {
      table.decimal('rate', 8, 4).unsigned().alter();
    })
    .alterTable('accounts_transactions', function (table) {
      table.decimal('tax_rate', 8, 4).unsigned().alter();
    });
};

exports.down = function (knex) {
  return knex.schema
    .alterTable('tax_rates', function (table) {
      table.decimal('rate', 8, 2).alter();
    })
    .alterTable('items_entries', function (table) {
      table.decimal('tax_rate', 8, 2).unsigned().alter();
    })
    .alterTable('tax_rate_transactions', function (table) {
      table.decimal('rate', 8, 2).unsigned().alter();
    })
    .alterTable('accounts_transactions', function (table) {
      table.decimal('tax_rate', 8, 2).unsigned().alter();
    });
};
