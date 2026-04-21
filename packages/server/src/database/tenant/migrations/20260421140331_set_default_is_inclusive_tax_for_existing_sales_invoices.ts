exports.up = function(knex) {
  return knex('sales_invoices')
    .whereNull('is_inclusive_tax')
    .update({ is_inclusive_tax: false });
};

exports.down = function(knex) {
  // Can't easily undo this without knowing the original values
  return Promise.resolve();
};
