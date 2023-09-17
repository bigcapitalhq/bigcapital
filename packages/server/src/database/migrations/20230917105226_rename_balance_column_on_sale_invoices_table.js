exports.up = function (knex) {
  return knex.table('sales_invoices', (table) => {
    table.renameColumn('balance', 'amount');
  });
};

exports.down = function (knex) {};
