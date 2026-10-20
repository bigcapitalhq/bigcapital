exports.up = function (knex) {
  return knex.schema.table('cashflow_transactions', (table) => {
    table.integer('contact_id').unsigned().nullable().index();
  });
};

exports.down = function (knex) {
  return knex.schema.table('cashflow_transactions', (table) => {
    table.dropColumn('contact_id');
  });
};
