exports.up = function (knex) {
  return knex.schema
    .table('tax_rates', (table) => {
      // Change from DECIMAL to DECIMAL(8,4) to support rates like 9.975%
      table.decimal('rate', 8, 4).alter();
    })
    .table('items_entries', (table) => {
      table.decimal('tax_rate', 8, 4).unsigned().alter();
    })
    .table('accounts_transactions', (table) => {
      table.decimal('tax_rate', 8, 4).unsigned().alter();
    })
    .table('tax_rate_transactions', (table) => {
      table.decimal('rate', 8, 4).unsigned().alter();
    });
};

exports.down = function (knex) {
  return knex.schema
    .table('tax_rates', (table) => {
      table.decimal('rate').alter();
    })
    .table('items_entries', (table) => {
      table.decimal('tax_rate').unsigned().alter();
    })
    .table('accounts_transactions', (table) => {
      table.decimal('tax_rate').unsigned().alter();
    })
    .table('tax_rate_transactions', (table) => {
      table.decimal('rate').unsigned().alter();
    });
};
